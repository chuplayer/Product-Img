# product-img

第三方模块Puppeteer,mkdirp,request,images,gm</br>

描述：外贸站懒人必备，批量下载1688，速卖通产品图片(轮播大图+详情图)。</br></br>
更新：文件命名为[类别+ID+序号]，避免文件名重复的尴尬。</br>
更新：可配置批量控制缩放图片(分轮播图和详情图)。</br>
更新：增加速卖通通道，批量下载速卖通产品图。</br>

# 使用步骤
1.直接npm i (Tips: puppeteer的安装可能需要cnpm)。</br>
2.修改data.json里面的id和type,逐行增加.(ID：https://m.1688.com/offer/588836518552.html 取 588836518552，TYPE：1是1688，2是速卖通 )<br/>根据需要开启是否进行缩放图片(resize字段).其中swipe是正方形同高同宽需要修改width和height，content为同宽不同高只需要修改width。</br>
3.执行node index.js或者直接双击go.bat。

下载后的图片会在product文件夹里面.

# 短期计划
1.界面化：加入前端做成桌面化程序。
2.增加亚马逊通道。

# 长期计划
1.shopify店铺/商品采集。
2.facebook广告素材采集。
