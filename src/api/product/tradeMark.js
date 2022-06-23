import request from '@/utils/request'

// GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
// POST /admin/product/baseTrademark/save   "logoUrl": "string",  "tmName": "string"

// PUT /admin/product/baseTrademark/update   "id": 0,  "logoUrl": "string",  "tmName": "string"
export const reqUppdataTradeMarkList = (tradeMark) => {
  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: tradeMark
    })
  } else {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}
// DELETE /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) =>
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
