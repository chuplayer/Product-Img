const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')

class Ut {
  /**
	 * 下载网络图片
	 * @param {object} opts 
	 */
  static downImg(opts = {}, path = '', dirpath = '') {
    return new Promise((resolve, reject) => {
      mkdirp(dirpath, function (err) {
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
              console.log('finish')
            })
            .on('close', () => {
              console.log('close')
              resolve('close')
            })
        }
      })
    })
  }
}

module.exports = Ut