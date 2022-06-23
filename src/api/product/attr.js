import request from '@/utils/request'

// GET /admin/product/getCategory1
export const reqCategory1List = () =>
  request({ url: `/admin/product/getCategory1`, method: 'get' })
// GET /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) =>
  request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })
// GET /admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id) =>
  request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

//查询接口 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })

//添加属性与属性值 /admin/product/saveAttrInfo post 带参
/*
{
  "attrName": "string", 属性名
  "attrValueList": [  属性数组
    {
      "attrId": 0,
      "valueName": "string" 属性值
    }
  ],
  "categoryId": 0,
  "categoryLevel": 0,
}*/
export const reqAddAttr = (data) =>
  request({ url: '/admin/product/saveAttrInfo', method: 'post', data })
