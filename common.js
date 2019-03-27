const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')
const gm = require('gm').subClass({ imageMagick: true })
const images = require("images")

class Ut {
  /**
	 * 下载网络图片
	 * @param {object} opts
   * @param {string} path
   * @param {string} dir_path
   * @param {string} type_folder
   * @param {object} size_data
   * @param {boolean} is_resize
   * @param {string} id
	 */
  static downImg(opts = {}, path = '', dir_path = '', type_folder, size_data, is_resize, id) {
    return new Promise((resolve, reject) => {
      mkdirp(dir_path, (err) => {
        if (err) {
          console.error(err)
          reject()
        }
        else {
          console.log('pow!')
          request
            .get(opts)
            .on('response', (response) => {
              console.log('img type:', response.headers['content-type'])
            })
            .pipe(fs.createWriteStream(path))
            .on('error', (e) => {
              console.log('pipe error', e)
              resolve('')
            })
            .on('finish', () => {
              if (is_resize) {
                resizeCurrentImg(path, type_folder, size_data[type_folder]).then(() => {
                  resolve('finish')
                  console.log(`ID为${id}的${type_folder}图片下载并缩放完成`)
                }).catch(err => {
                  reject(err)
                })
              } else {
                resolve('finish')
                console.log(`ID为${id}的${type_folder}图片下载完成`)
              }
            })
            .on('close', () => {
              console.log('close')
            })
        }
      })
    })
  }
}

// 缩放图片(swipe图片为正方形同高同宽，content为同宽不同高需要同比例缩放计算)
/**
 * 下载网络图片
 * @param {string} srcImg
 * @param {string} type_folder
 * @param {object} size_data
 */
let resizeCurrentImg = async (srcImg, type_folder, size_data) => {
  return new Promise(async (resolve, reject) => {
    let width = await images(srcImg).width()
    let height = await images(srcImg).height()
    if (type_folder === 'swipe') {
      width = size_data['width']
      height = size_data['height']
    } else if (type_folder === 'content') {
      height = (height/width) * size_data['width']
      width = size_data['width']
    }
    gm(srcImg).resize(width, height).write(srcImg, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = Ut