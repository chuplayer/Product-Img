# product-img

第三方模块Puppeteer,mkdirp,request,images,gm</br>

外贸站懒人必备，批量下载1688产品图片(轮播大图+详情图)。</br>
文件命名为[类别+ID+序号]，避免文件名重复的尴尬。</br>
可控制批量缩放图片。

# 使用步骤
1.直接npm i (Tips: puppeteer的安装可能需要cnpm)</br>
2.修改data.json里面的id,逐行增加.(https://m.1688.com/offer/588836518552.html 取 588836518552 )<br/>根据需要开启是否进行缩放图片(resize字段).其中swipe是正方形同高同宽需要修改width和height，content为同宽不同高只需要修改width</br>
3.执行node index.js

下载后的图片会在product文件夹里面.
