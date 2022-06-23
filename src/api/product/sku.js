import request from '@/utils/request'

// admin/product/list/{page}/{limit}  get
export const reqSkuList = (page, limit) =>
  request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// /admin/product/onSale/{skuId}   get
export const reqSale = (skuId) =>
  request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// /admin/product/cancelSale/{skuId}   get
export const reqCancel = (skuId) =>
  request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// /admin/product/getSkuById/{skuId} GET
export const reqSkuById = (skuId) =>
  request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
