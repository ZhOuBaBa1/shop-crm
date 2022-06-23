import request from '@/utils/request'

// GET /admin/product/{page}/{limit}   第三个参数category3Id
export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
  })

// ---品牌的数据需要发请求的   get          http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
export const reqTradeMartList = () =>
  request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
  })

// ---获取平台中全部的销售属性（3个） get   http://localhost:9529/dev-api/admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () =>
  request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// ---获取某一个SPU信息     get             http://localhost:9529/dev-api/admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) =>
  request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// --获取SPU图片       get                  http://localhost:9529/dev-api/admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) =>
  request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// POST /admin/product/saveSpuInfo 需要携带的参数
/*
{
  "category3Id": 0,
  "description": "string",
  "id": 0,
  "spuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "spuId": 0
    }
  ],
  "spuName": "string",
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "id": 0,
      "saleAttrName": "string",
      "spuId": 0,
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "id": 0,
          "isChecked": "string",
          "saleAttrName": "string",
          "saleAttrValueName": "string",
          "spuId": 0
        }
      ]
    }
  ],
  "tmId": 0
}
*/

// POST /admin/product/saveSpuInfo  POST /admin/product/updateSpuInfo
//修改||添加spu 判断参数是否带id

export const reqAddOrUpdateSpu = (spuInfo) => {
  //携带的参数带有id----修改spu
  if (spuInfo.id) {
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  } else {
    //携带的参数不带id---添加SPU
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}
// /admin/product/deleteSpu/{spuId}  delete
export const reqDeleteSpu = (spuId) =>
  request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// GET /admin/product/spuSaleAttrList/{spuId}   getSpuSaleAttrList
export const reqSpuSaleAttrList = (spuId) =>
  request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

//添加SKU
///admin/product/saveSkuInfo  post
export const reqAddSku = (skuInfo) =>
  request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

//SKU列表展示 get /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) =>
  request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
