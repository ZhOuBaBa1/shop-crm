import mockRequest from '@/utils/mockRequest'
const state = {
  list: {}
}
const mutations = {
  GETDATA(state, list) {
    state.list = list
  }
}
const actions = {
  async getData({ commit }) {
    let result = await mockRequest.get('/home/list')
    if (result.code == 20000) {
      commit('GETDATA', result.data)
    }
  }
}
const getters = {
  nameList() {
    return state.list.saleRank.online.name
  },
  valueList1() {
    return state.list.saleRank.online.value
  },
  valueList2() {
    return state.list.saleRank.shop.value
  }
}
export default { state, mutations, actions, getters }
