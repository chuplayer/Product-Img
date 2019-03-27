const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']
const Ut = require('./common')
let data = require('./data.json')

//获取阿里巴巴图片url
let alibaba = async (url, num) => {
	return new Promise(async (resolve, reject) => {
		let descImgs = {
			swipe: [],
			content: []
		}

		// 返回解析为Promise的浏览器
		const browser = await puppeteer.launch()

		// 返回新的页面对象
		const page = await browser.newPage()
		await page.emulate(iPhone)

		// 页面对象访问对应的url地址
		await page.goto(url)

		// 加载详情图
		let preScrollHeight = 0
		let scrollHeight = -1
		while (preScrollHeight !== scrollHeight) {
			// 详情信息是根据滚动异步加载，所以需要让页面滚动到屏幕最下方，通过延迟等待的方式进行多次滚动
			let scrollH1 = await page.evaluate(async () => {
				let h1 = document.body.scrollHeight
				window.scrollTo(0, h1)
				return h1
			})
			await page.waitFor(500)
			let scrollH2 = await page.evaluate(async () => {
				return document.body.scrollHeight
			})
			let scrollResult = [scrollH1, scrollH2]
			preScrollHeight = scrollResult[0]
			scrollHeight = scrollResult[1]
		}

		//采集商品轮播图
		const swipeHandle = await page.$('#J_Detail_ImageSlides > .swipe-content')
		let swipe = await page.evaluate(descContainer => {
			let swipe = []
			descContainer.querySelectorAll('.swipe-pane > img').forEach(imgElement => {
				swipe.push(imgElement.getAttribute('swipe-lazy-src') !== null ? imgElement.getAttribute('swipe-lazy-src') : imgElement.getAttribute('src'))
			})
			return swipe
		}, swipeHandle)
		descImgs['swipe'] = swipe

		//采集商品详情图
		const contentHandle = await page.$('#J_WapDetailCommonDescription_Content')
		let content = await page.evaluate(descContainer => {
			let content = []
			descContainer.querySelectorAll('img').forEach(imgElement => {
				// 遍历保存所有的详情页图片
				content.push(imgElement.getAttribute('src') == '//cbu01.alicdn.com/cms/upload/other/lazyload.png' ? imgElement.getAttribute('data-lazyload-src') : `https:${imgElement.getAttribute('src')}`)
			})
			return content
		}, contentHandle)
		descImgs['content'] = content

		await dbFuc(descImgs, num)
		return resolve()
	})
}

// 下载图片到本地
let dbFuc = async (descImgs, num) => {
	let arr = Object.keys(descImgs)
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < descImgs[arr[i]].length; j++) {
			try {
				let url = descImgs[arr[i]][j]
				let opts = {
					url: url,
					headers: {
						'Referer': 'https://m.1688.com/',
					}
				}
				let path = `./product/${num}/${arr[i]}/${j}.jpg`
				let str = await Ut.downImg(opts, path, `./product/${num}/${arr[i]}`)
				console.log(str)
			}
			catch (e) {
				console.log(e)
			}
		}
	}
}

(async () => {
	let arr = data['id']
	for (let i = 0; i < arr.length; i++) {
		await alibaba(`https://m.1688.com/offer/${arr[i]}.html`, i)
		if (i + 1 === arr.length) {
			console.log('全部下载完成，请关闭控制台！')
		}
	}
})()
