const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");
const fetch = require('node-fetch')
const { default: Axios } = require('axios');
const { JSDOM } = require('jsdom')
const qs = require("qs")

const baseUrl = 'https://www.happymod.com/'

async function artiMimpi(mimpi) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.primbon.com/tafsir_mimpi.php?mimpi=${mimpi}&submit=+Submit+`
      )
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const cek = $("#body > font > i").text();
        const adaga = /Tidak ditemukan/g.test(cek) ? false : true;
        if (adaga) {
          const isi = $("#body")
            .text()
            .split(`Hasil pencarian untuk kata kunci: ${mimpi}`)[1]
            .replace(/\n\n\n\n\n\n\n\n\n/gi, "\n");
          const result = {
            result: isi.replace(/\n/gi, "").replace("       ", "").replace("\"        ", "")
          };
          resolve(result);
        } else {
          const result = {
            result: `Arti mimpi ${mimpi} tidak di temukan`
          };
          resolve(result);
        }
      })
      .catch(reject);
  });
};

async function artiNama(nama) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.primbon.com/arti_nama.php?nama1=${nama}&proses=+Submit%21+`
      )
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const isi = $("#body").text().split("Nama:")[0];
        const result = {
          result: isi.replace(/\n/gi, "").replace("ARTI NAMA", "").replace("                                ", "")
        };
        resolve(result);
      })
      .catch(reject);
  });
};

async function ramalJodoh(nama1, nama2) {
  return new Promise((resolve, reject) => {
    axios
    .get(`https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit%21+`)
    .then(({ data }) => {
     const $ = cheerio.load(data);
     const thumbnail = 'https://www.primbon.com/'+$('#body > img').attr('src');
     const res = $('#body').text().split(nama2)[1].replace('< Hitung Kembali','').split('\n')[0];
     const positif = res.split('Sisi Negatif Anda: ')[0].replace('Sisi Positif Anda: ','')
     const negatif = res.split('Sisi Negatif Anda: ')[1]
     const result = {
          namaKamu: nama1,
          namaPasangan: nama2,
          thumbnail: thumbnail,
          positif: positif,
          negatif: negatif
     }
     resolve(result);
    })
    .catch(reject);
  });
};

async function nomorHoki(nomor) {
  return new Promise((resolve, reject) => {
    var options = { method: 'POST',
      url: 'https://primbon.com/no_hoki_bagua_shuzi.php',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      form: { nomer: nomor, submit: ' Submit! ' } };

      request(options, function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body);
      const result = $('#body').text().split('POTENSI HOKI')[1].replace('\n\n\n\n  \n    \nMasukkan Nomor HP Anda\n    \n  \n  \n    \n\n    \n    \n\n    \n  \n\n\n\n\nMeningkatkan Keberuntungan Melalui Nomor Handphone (HP)\nNomor HP adalah gabungan kombinasi angka-angka yang sebenarnya memiliki arti, ada yang membawa pengaruh baik (hoki), biasa, atau bahkan dianggap kurang baik. Sebuah nomor HP bisa saja dianggap cantik, dijual sampai jutaan, bahkan puluhan juta rupiah, namun nomor tersebut belum tentu hoki. Aplikasi ini dibuat untuk mengecek seberapa jauh pengaruh energi suatu deret nomor HP berdasarkan algoritma Bagua Shuzi, yaitu metode China kuno yang sudah berusia ribuan tahun yang bertujuan untuk mengejar keberuntungan melalui pemilihan angka.\n\nBagua Shuzi menjelaskan pengaruh kombinasi angka yang berupa energi Kekayaan (Sheng Qi), Kesehatan (Tian Yi), Cinta/Relasi (Yan Nian), dan Kelancaran/Kestabilan (Fu Wei), sebagai energi positif. Sedangkan energi Perselisihan (Huo Hai), Kehilangan (Liu Sha), Malapetaka (Wu Gui), dan Kehancuran (Jue Ming), sebagai energi negatif. Sebuah nomor dikatakan baik atau hoki jika persentase energi positifnya lebih banyak dibanding energi negatifnya. Karena metode Bagua Shuzi menggunakan algoritma perhitungan yang cukup kompleks, maka tidak heran jika nomor hoki jumlahnya lebih terbatas dibanding nomor cantik.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n    \n    ', '')
      resolve({
        result: 'POTENSI HOKI'+result
      });
    });

  })
}

async function pinterest(querry) {
	let HASIL = []
	await axios.request(`https://id.pinterest.com/search/pins/?rs=typed&q=` + querry, {
			method: "GET",
			url: "https://id.pinterest.com/search/pins/?rs=typed&q="+ querry,
			headers: {
				"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
				"sec-ch-ua-mobile": "?0",
				"upgrade-insecure-requests": "1",
				"cookie": "csrftoken=ebe0be3a93cea6072be18633add953a2; _b=\"AVezvd6F4UtE24FUsA6INxipyZZDoSpyCc5vaJK4QDYXmExosVEc4h6WkiKhlVtQ430=\"; cm_sub=denied; fba=True; _ga=GA1.2.862909259.1620474446; g_state={\"i_l\":0}; _auth=1; _pinterest_sess=TWc9PSZ0VEZqZmdDSlJYaGU5REIvNklIcVlnMjE5b0ZraTE5REJVQ0JiMUwxTkZZaGFoVk1sRDVhOFlwQzhkQnQ0YkMwRlNyV0lIWUFlK0ZVTkVxYUhKNmlvZ0R1UXlQYTBRRVVhMU1yYkpmcXpHK3UyNjNhckRqUFFOYVJVa3RnVmJtVzd2MmRGaHFMZUpLNVhtaHptTDhWSnBSdXhZY0FhRnRTN3J1S0V4cGtsVTBxeE54NkF2blVNSFV3R0NTQTR1bVVNRURGVGdnYlN5UjdBbk9YcHVGbGI3a1kwd1dEZDgrZVM1SDc3V0pJMm00OWxKUDVNQjBLVlFocTB4Mjg1M1RnbGxBaFAxbS9MTnVzei91cEQvcjBtakp6N0ZnU2t1Y3NxWW1DRDV1Q3h0ankvQ3FEWGh3MXczcXBHNXJpYVNCMHB6dUoxMGF6ZzVxN2VqQVBoSElSd0tiQk41ZVRPQXlOaGNpNzVQMWJSeVZJbCtYYVMxQ1ZRUFUwalU3eGVzMGRySlNzdWo1NG5uaXNFM3ZpT0o0TkZHR1daUXlwaXFQclMwa04raW9xVnVaTTRSVGEzTE03TVlZcmZYVDd5UmVPd2lZaGw4aE9VMHJBd0tidEsrcHdPWk96RlFMekVLTzY3VU1PL0tIYUdwUE1IWVdJNnJXalBkU09Sb3dEaHlQVVR1T1RqNW5Sc2FRdmVkZmhkMk9HNHBCL0ZpZ3NMdmZvVW9ReVltTFBCTlNLWHpray9LNWJ2UTNvTlBzVm9aZjRvYWRvRFhla0dBNzdveWJVYXZmVFp2cnFFNU5DYUVwSHhxeDlIajNIVTlHaEVYdGptWm5mSGVSRmtIMmQwVVVVZlVCVEh6UHB3TnBtdWV0b2l6L3VTc3pXMXFGN3lHS3ZJM3BwL0NrWVJDMm1HY2tROGxuQVFRNS9OUW45R3dtSk8zeFJidVFSTG1qTG5PelAvKzd3T3lrN1NoKzBHVGNTY1pGSEY0bW8xcGVmc3NtclBhTWE2QUMxOXNpQWUwRmo4UHl0ZGpwUzhUQXVhbjYwT0ZJeHhHai8yOWFUVTA1Wkx2czN4VSttLzMvbkFVQ2svWnZvNC9xZ3E4VkhYSFZ5elo4TzhtU0o5c3ZDcEJyYjE3QVI1WHlmTTFhWThvWHQ1T0tSTWRsWnI3a1lpU245dEVLd1lZSXRremtkTUZmcVA2YUg0c1UrSk1JOWJVRzZpcWd3T0NVaFZkdUh3UUdURi9sbDBqT2pBZVV2ZnlTQzc5ZnBMYkFMQ1ZsWjdIYWcmaDc1Uk5kK2I4MjFMUXBaVUthci9rVHpCUWRvPQ==; _pinterest_cm=\"TWc9PSYxZnpkMS9XN29Rd2R0TnpBN0RzVktja1J4NUtINUJqRzNGODFXS0xES1pndWlNVm52a0d3V0JocmVIS3p5eDdnNXNZa0hGelNQNDBSTFRId3ZhTFFIQjRGOW1lNlJZMzFiVlg1MHhSOFpmMGhRZUoySUpJZDIyWlVYMjRXNHRaL1lodFl4eW1jWjNyTklpbytYbHZyd29nRm5DY0pQOGgyUWpDdk9zQ1craXR5VEZoNHV4ZzRnOXV4SUFFSStYZCsmT08zMFI1bktXa3pwSDFtK3NNRWpxWWNpQzNzPQ==\"; _routing_id=\"595f24cd-7f4c-4495-aa67-37212d099cd8\"; sessionFunnelEventLogged=1"
			}
		}).then(res => {
			const $ = cheerio.load(res.data)
			let hasil = []
			$('body > div > div > div > div > div > div > div > div > div > div > div').each(function (a, b) {
				$(b).find('div').each(function (c, d) {
					let Link = $(d).find('div > div > div > div > a').find('img').attr('src')
					hasil.push(Link)
				})
			})
			let Data = []
			hasil.map(V => {
				if (V === undefined) return 
				Data.push(V.replace('236x', 'originals'))
			})
			let FilterArray = new Set(Data)
			let unique = [...FilterArray]
			const result = {
				status: res.status,
				creator: "@Denz",
				result: unique
			}
			HASIL.push(result)
		})
		return HASIL[0]
}

async function igDownloader(Link) {
	const hasil = []
	const Form = {
		url: Link,
		submit: ""
	}
	await axios(`https://downloadgram.org/`, {
		method: "POST",
		data:  new URLSearchParams(Object.entries(Form)),
		headers: {
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"accept-language": "en-US,en;q=0.9,id;q=0.8",
			"cache-control": "max-age=0",
			"content-type": "application/x-www-form-urlencoded",
			"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
			"cookie": "_ga=GA1.2.1695343126.1621491858; _gid=GA1.2.28178724.1621491859; __gads=ID=8f9d3ef930e9a07b-2258e672bec80081:T=1621491859:RT=1621491859:S=ALNI_MbqLxhztDiYZttJFX2SkvYei6uGOw; __atuvc=3%7C20; __atuvs=60a6eb107a17dd75000; __atssc=google%3B2; _gat_gtag_UA_142480840_1=1"
		},
		referrerPolicy: "strict-origin-when-cross-origin",
	}).then(async res => {
		const $ = cheerio.load(res.data)
		let url = $('#downloadBox').find('a').attr('href');
		await axios(Link, {
			method: "GET",
			data: null,
			headers: {
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"accept-language": "en-US,en;q=0.9,id;q=0.8",
				"cache-control": "max-age=0",
				"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
				"cookie": "ig_did=08A3C465-7D43-4D8A-806A-88F98384E63B; ig_nrcb=1; mid=X_ipMwALAAFgQ7AftbrkhIDIdXJ8; fbm_124024574287414=base_domain=.instagram.com; shbid=17905; ds_user_id=14221286336; csrftoken=fXHAj5U3mcJihQEyVXfyCzcg46lHx7QD; sessionid=14221286336%3A5n4czHpQ0GRzlq%3A28; shbts=1621491639.7673564; rur=FTW"
			},
			referrerPolicy: "strict-origin-when-cross-origin"
		}).then(respon => {
			const ch = cheerio.load(respon.data)
			let title = ch('title').text().trim()
			const result = {
				status: true,
				result: {
					link: url,
					desc: title
				}
			}
			hasil.push(result)
		})
	})
	return hasil[0]
}

const lirikLagu = async (query) => {
const res = await axios.get(`https://www.musixmatch.com/search/${query}`)
const sup = cheerio.load(res.data)
const hasil = []
const b = sup('#site').find('div > div > div > div > ul > li:nth-child(1) > div > div > div')
let link = `https://www.musixmatch.com` + sup(b).find('h2 > a').attr('href')

const des = await axios.get(link)

const soup = cheerio.load(des.data)

const result = soup('#site').find('.mxm-lyrics__content > .lyrics__content__ok').text()

hasil.push({ result})
return hasil
}

const mediafireDl = async (url) => {
const res = await axios.get(url) 
const $ = cheerio.load(res.data)
const hasil = []
const link = $('a#downloadButton').attr('href')
const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
const seplit = link.split('/')
const nama = seplit[5]
mime = nama.split('.')
mime = mime[1]
hasil.push({ nama, mime, size, link })
return hasil
}

const wikiSearch = async (query) => {
const res = await axios.get(`https://id.m.wikipedia.org/w/index.php?search=${query}`)
const $ = cheerio.load(res.data)
const hasil = []
let wiki = $('#mf-section-0').find('p').text()
let thumb = $('#mf-section-0').find('div > div > a > img').attr('src')
thumb = thumb ? thumb : '//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png'
thumb = 'https:' + thumb
let judul = $('h1#section_0').text()
hasil.push({ wiki, thumb, judul })
return hasil
}

function playstore(name){
	return new Promise((resolve, reject) => {
		axios.get('https://play.google.com/store/search?q='+ name +'&c=apps')
		.then(({ data }) => {
			const $ = cheerio.load(data)
			let ln = [];
			let nm = [];
			let dv = [];
			let lm = [];
			const result = [];
			$('div.wXUyZd > a').each(function(a,b){
				const link =  'https://play.google.com' + $(b).attr('href')
				ln.push(link);
			})
			$('div.b8cIId.ReQCgd.Q9MA7b > a > div').each(function(d,e){
				const name = $(e).text().trim()
				nm.push(name);
			})
			$('div.b8cIId.ReQCgd.KoLSrc > a > div').each(function(f,g){
				const dev = $(g).text().trim();
				dv.push(dev)
			})
			$('div.b8cIId.ReQCgd.KoLSrc > a').each(function(h,i){
				const limk = 'https://play.google.com' + $(i).attr('href');
				lm.push(limk);
			})			
		for (let i = 0; i < ln.length; i++){
			result.push({
				name: nm[i],
				link: ln[i],
				developer: dv[i],
				link_dev: lm[i]
			})
	}
		resolve(result)
		})
	.catch(reject)
	})
}

function linkwa(nama){
	return new Promise((resolve,reject) => {
		axios.get('http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search='+ nama +'&searchby=name')
		.then(({ data }) => {
			const $ = cheerio.load(data);
			const result = [];
			const lnk = [];
			const nm = [];
		$('div.wa-chat-title-container').each(function(a,b){
			const limk = $(b).find('a').attr('href');
			lnk.push(limk)
			})
		$('div.wa-chat-title-text').each(function(c,d) {
			const name = $(d).text();
			nm.push(name)
			})
		for( let i = 0; i < lnk.length; i++){
			result.push({
				nama: nm[i].split('. ')[1],
				link: lnk[i].split('?')[0]
			})
		}
		resolve(result)
		})
	.catch(reject)
	})
}

function happymodSearch(query) {
	return new Promise((resolve, reject) => {
		axios.get(baseUrl+'search.html?q='+query).then(async res => {
		var $ = cheerio.load(res.data)
		const hasil = []
		$("div.pdt-app-box").each(function(c, d) {
			var title = $(d).find("a").text().trim();
			var icon = $(d).find("img.lazy").attr('data-original');
			var rating = $(d).find("span").text();
			var link = baseUrl+$(d).find("a").attr('href');
			hasil.push({
				title,
				icon,
				link,
				rating
			})
	})
		resolve(hasil)
		console.log(hasil)
	}).catch(reject)
})
}

function jagokata(input) {
    return new Promise((resolve, reject) => {
        fetch('https://jagokata.com/kata-bijak/kata-' + input.replace(/\s/g, '_') + '.html?page=1')
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res)
                data = []
                $('div[id="main"]').find('ul[id="citatenrijen"] > li').each(function (index, element) {
                    x = $(this).find('div[class="citatenlijst-auteur"] > a').text().trim()
                    y = $(this).find('span[class="auteur-beschrijving"]').text().trim()
                    z = $(element).find('q[class="fbquote"]').text().trim()
                    data.push({ author: x, bio: y, quote: z })
                })
                data.splice(2, 1)
                if (data.length == 0) return resolve({ creator: 'stikerin', status: false })
                resolve({ creator: 'stikerin', status: true, data })
            }).catch(reject)
    })
}

function herodetails(name) {
             return new Promise((resolve, reject) => {
                  var splitStr = name.toLowerCase().split(' ');
                  for (var i = 0; i < splitStr.length; i++) {
                       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
                  }
                  const que = splitStr.join(' ')
                  Axios.get('https://mobile-legends.fandom.com/wiki/' + que)
                  .then(({ data }) => {
                       const $ = cheerio.load(data)
                       let mw = []
                       let attrib = []
                       let skill = []
                       const name = $('#mw-content-text > div > div > div > div > div > div > table > tbody > tr > td > table > tbody > tr > td > font > b').text() 
                       $('.mw-headline').get().map((res) => {
                            const mwna = $(res).text()
                            mw.push(mwna)
                       })
                       $('#mw-content-text > div > div > div > div > div > div > table > tbody > tr > td').get().map((rest) => {
                            const haz = $(rest).text().replace(/\n/g,'')
                            attrib.push(haz)
                       })
                       $('#mw-content-text > div > div > div > div > div > div > table > tbody > tr > td > div.progressbar-small.progressbar > div').get().map((rest) => {
                            skill.push($(rest).attr('style').replace('width:',''))
                       })
                       Axios.get('https://mobile-legends.fandom.com/wiki/' + que + '/Story')
                       .then(({ data }) => {
                            const $ = cheerio.load(data)
                            let pre = []
                            $('#mw-content-text > div > p').get().map((rest) => {
                                 pre.push($(rest).text())
                            })
                            const story = pre.slice(3).join('\n')
                            const items = []
                            const character = []
                            $('#mw-content-text > div > aside > section > div').get().map((rest) => {
                                 character.push($(rest).text().replace(/\n\t\n\t\t/g, '').replace(/\n\t\n\t/g,'').replace(/\n/g,''))
                            })
                            $('#mw-content-text > div > aside > div').get().map((rest) => {
                                 items.push($(rest).text().replace(/\n\t\n\t\t/g, '').replace(/\n\t\n\t/g,'').replace(/\n/g,''))
                            })
                            const img = $('#mw-content-text > div > aside > figure > a').attr('href')
                            const chara = character.slice(0,2)
                            const result = { 
                                 status: 200,
                                 hero_name: name + ` ( ${mw[0].replace('CV:',' CV:')} )`,
                                 entrance_quotes: attrib[2].replace('Entrance Quotes','').replace('\n',''),
                                 hero_feature: attrib[attrib.length - 1].replace('Hero Feature',''),
                                 image: img,
                                 items: items,
                                 character: {
                                      chara
                                 },
                                 attributes: {
                                      movement_speed: attrib[12].replace('● Movement Speed',''),
                                      physical_attack: attrib[13].replace('● Physical Attack',''),
                                      magic_power: attrib[14].replace('● Magic Power',''),
                                      attack_speed: attrib[15].replace('● Attack Speed',''),
                                      physical_defense: attrib[16].replace('● Physical Defense',''),
                                      magic_defense: attrib[17].replace('● Magic Defense',''),
                                      basic_atk_crit_rate: attrib[18].replace('● Basic ATK Crit Rate',''),
                                      hp: attrib[19].replace('● HP',''),
                                      mana: attrib[20].replace('● Mana',''),
                                      ability_crit_rate: attrib[21].replace('● Ability Crit Rate',''),
                                      hp_regen: attrib[22].replace('● HP Regen',''),
                                      mana_regen: attrib[23].replace('● Mana Regen','')
                                 },
                                 price: {
                                      battle_point: mw[1].split('|')[0].replace(/ /g,''),
                                      diamond: mw[1].split('|')[1].replace(/ /g,''),
                                      hero_fragment: mw[1].split('|')[2] ? mw[1].split('|')[2].replace(/ /g,'') : 'none'
                                 },
                                 role: mw[2],
                                 skill: {
                                      durability: skill[0],
                                      offense: skill[1],
                                      skill_effects: skill[2],
                                      difficulty: skill[3]
                                 },
                                 speciality: mw[3],
                                 laning_recommendation: mw[4],
                                 release_date: mw[5],
                                 background_story: story
                            }
                            resolve(result)
                       }).catch((e) => reject({ status: 404, message: e.message }))
                  }).catch((e) => reject({ status: 404, message: e.message }))
             })
        }
        
        function herolist(){
            return new Promise((resolve, reject) => {
                  Axios.get('https://mobile-legends.fandom.com/wiki/Mobile_Legends:_Bang_Bang_Wiki')
                  .then(({ data }) => {
                       const $ = cheerio.load(data)
                       let data_hero = []
                       let url = []
                       $('div > div > span > span > a').get().map((result) => {
                            const name = decodeURIComponent($(result).attr('href').replace('/wiki/',''))
                            const urln = 'https://mobile-legends.fandom.com' + $(result).attr('href')
                            data_hero.push(name)
                            url.push(urln)
                       })
                       resolve({ status: 200, hero: data_hero })
                  }).catch((e) => reject({ status: 404, message: e.message }))
             })
        }
        
        async function styleText(text) {
    let res = await fetch('http://qaz.wtf/u/convert.cgi?text=' + encodeURIComponent(text))
    let html = await res.text()
    let dom = new JSDOM(html)
    let table = dom.window.document.querySelector('table').children[0].children
    let obj = {}
    for (let tr of table) {
      let name = tr.querySelector('.aname').innerHTML
      let content = tr.children[1].textContent.replace(/^\n/, '').replace(/\n$/, '')
      obj[name + (obj[name] ? ' Reversed' : '')] = content
    }
    return obj
}

function joox(query) {
    return new Promise((resolve, reject) => {
        const time = Math.floor(new Date() / 1000)
        axios.get('http://api.joox.com/web-fcgi-bin//web_search?lang=id&country=id&type=0&search_input=' + query + '&pn=1&sin=0&ein=29&_=' + time)
            .then(({ data }) => {
                let result = []
                let hasil = []
                let promoses = []
                let ids = []
                data.itemlist.forEach(result => {
                    ids.push(result.songid)
                });
                for (let i = 0; i < data.itemlist.length; i++) {
                    const get = 'http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=' + ids[i]
                    promoses.push(
                        axios.get(get, {
                            headers: {
                                Cookie: 'wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;'
                            }
                        })
                            .then(({ data }) => {
                                const res = JSON.parse(data.replace('MusicInfoCallback(', '').replace('\n)', ''))
                                hasil.push({
                                    lagu: res.msong,
                                    album: res.malbum,
                                    penyanyi: res.msinger,
                                    publish: res.public_time,
                                    img: res.imgSrc,
                                    mp3: res.mp3Url
                                })
                                Promise.all(promoses).then(() => resolve({
                                    creator: "wabot", // Ganti terserah kalian 
                                    status: true,
                                    data: hasil,
                                }))
                            }).catch(reject)
                    )
                }
            }).catch(reject)
    })
}

const HentaiVid = async() => {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 1153)
        axios.get('https://sfmcompile.club/page/'+page)
        .then((data) => {
            const $ = cheerio.load(data.data)
            const hasil = []
            $('#primary > div > div > ul > li > article').each(function (a, b) {
                hasil.push({
                    title: $(b).find('header > h2').text(),
                    link: $(b).find('header > h2 > a').attr('href'),
                    category: $(b).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
                    share_count: $(b).find('header > div.entry-after-title > p > span.entry-shares').text(),
                    views_count: $(b).find('header > div.entry-after-title > p > span.entry-views').text(),
                    type: $(b).find('source').attr('type') || 'image/jpeg',
                    video_1: $(b).find('source').attr('src') || $(b).find('img').attr('data-src'),
                    video_2: $(b).find('video > a').attr('href') || ''
                })
            })
            const random = hasil[Math.floor(Math.random() * hasil.length)]
            resolve({
                status: data.status,
                creator: 'Rapa',
                hasil: random
            })
        })
    })
}

const dafontSearch = async (query) => {
const base = `https://www.dafont.com`
const res = await axios.get(`${base}/search.php?q=${query}`)
const $ = cheerio.load(res.data)
const hasil = []
const total = $('div.dffont2').text().replace(` fonts on DaFont for ${query}`, '') 
$('div').find('div.container > div > div.preview').each(function(a, b) {
$('div').find('div.container > div > div.lv1left.dfbg').each(function(c, d) { 
$('div').find('div.container > div > div.lv1right.dfbg').each(function(e, f) { 
let link = `${base}/` + $(b).find('a').attr('href')
let judul = $(d).text() 
let style = $(f).text() 
hasil.push({ judul, style, link, total}) 
}) 
}) 
}) 
return hasil
}

const dafontDown = async (link) => {
const des = await axios.get(link)
const sup = cheerio.load(des.data)
const result = []
let style = sup('div').find('div.container > div > div.lv1right.dfbg').text() 
let judul = sup('div').find('div.container > div > div.lv1left.dfbg').text() 
try {
isi = sup('div').find('div.container > div > span').text().split('.ttf')
output = sup('div').find('div.container > div > span').eq(0).text().replace('ttf' , 'zip')
} catch {
isi = sup('div').find('div.container > div > span').text().split('.otf')
output = sup('div').find('div.container > div > span').eq(0).text().replace('otf' , 'zip')
}

let down = 'http:' + sup('div').find('div.container > div > div.dlbox > a').attr('href')
result.push({ style, judul, isi, output, down})
return result
}

const apkmody = (query) => {
	return new Promise((resolve, reject) => {
		axios.get('https://apkmody.io/?s=' + query)
			.then(({
				data
			}) => {
				//console.log(data)
				const $ = cheerio.load(data)
				const nama = [];
				const link = [];
				const mod = [];
				const thumb = [];
				const format = [];
				$('#primary > section:nth-child(3) > div > div > div > article > a > div > div > div > h2').each(function(a, b) {
					nem = $(b).text();
					nama.push(nem)
				})
				$('#primary > section:nth-child(3) > div > div > div > article > a > div > div > p').each(function(c, d) {
					modd = $(d).text();
					mod.push(modd.split('\n')[1])
				})
				$('#primary > section:nth-child(3) > div > div > div > article > a > div > img').each(function(e, f) {
					thumb.push($(f).attr('src'))
				})
				$('#primary > section:nth-child(3) > div > div > div > article > a').each(function(g, h) {
					link.push($(h).attr('href'))
				})
				for (let i = 0; i < link.length; i++) {
					format.push({
						judul: nama[i],
						infomod: mod[i],
						thumb: thumb[i],
						link: link[i]
					})
				}
				const result = {
					creator: 'Hanya Orang Biasa',
					data: format
				}
				resolve(result)
			})
			.catch(reject)
	})
}

const apkmirror = async (query) => {
	return new Promise((resolve, reject) => {
		axios.get('https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=' + query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const nama = [];
				const developer = [];
				const lupdate = [];
				const size = [];
				const down = [];
				const version = [];
				const link = [];
				const format = [];
				$('#content > div > div > div.appRow > div > div > div > h5 > a').each(function(a, b) {
					nem = $(b).text();
					nama.push(nem)
				})
				$('#content > div > div > div.appRow > div > div > div > a').each(function(c, d) {
					dev = $(d).text();
					developer.push(dev)
				})
				$('#content > div > div > div.appRow > div > div > div > div.downloadIconPositioning > a').each(function(e, f) {
					link.push('https://www.apkmirror.com' + $(f).attr('href'))
				})
				$('#content > div > div > div.infoSlide > p > span.infoslide-value').each(function(g, h) {
					data = $(h).text();
					if (data.match('MB')) {
						size.push(data)
					} else if (data.match('UTC')) {
						lupdate.push(data)
					} else if (!isNaN(data) || data.match(',')) {
						down.push(data)
					} else {
						version.push(data)
					}
				})
				for (let i = 0; i < link.length; i++) {
					format.push({
						judul: nama[i],
						dev: developer[i],
						size: size[i],
						version: version[i],
						uploaded_on: lupdate[i],
						download_count: down[i],
						link: link[i]
					})
				}
				const result = {
					creator: 'Hanya Orang Biasa',
					data: format
				}
				resolve(result)
			})
			.catch(reject)
	})
}
module.exports = {
  artiNama,
  artiMimpi,
  ramalJodoh,
  nomorHoki,
  pinterest,
  igDownloader,
  lirikLagu,
  mediafireDl,
  wikiSearch,
  happymodSearch,
  playstore,
  linkwa,
  jagokata,
  herodetails,
  herolist,
  styleText,
  joox,
  HentaiVid,
  dafontSearch,
  dafontDown,
  apkmody,
  apkmirror
};