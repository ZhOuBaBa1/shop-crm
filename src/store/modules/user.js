import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, resetRouter, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    roles: [],
    buttons: [],
    //对比项目中已有的异步路由，进行展示
    resultAsyncRoutes: [],
    resultAllRoutes: []
  }
}

const state = getDefaultState()

// 定义一个函数，对比当前用户需要展示的路由信息
const computedAsyncRoutes = (asyncRoutes, routes) => {
  //过滤出需要展示的路由
  console.log(asyncRoutes)
  return asyncRoutes.filter((item) => {
    if (routes.indexOf(item.name) != -1) {
      // if (item.children && item.children.length) {
      //   item.children = computedAsyncRoutes(item.children, routes)
      // }
      return true
    }
  })
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  //最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes
    //合并为最终路由
    state.resultAllRoutes = constantRoutes.concat(
      state.resultAsyncRoutes,
      anyRoutes
    )
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password })
    //注意：当前使用的是mock的虚拟数据
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
    //   return new Promise((resolve, reject) => {
    //     login({ username: username.trim(), password: password }).then(response => {
    //       const { data } = response
    //       commit('SET_TOKEN', data.token)
    //       setToken(data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
  },

  // get user info
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token)
    if (result.code == 20000) {
      const { data } = result
      console.log(data)
      commit('SET_USERINFO', data)
      commit(
        'SET_RESULTASYNCROUTES',
        computedAsyncRoutes(cloneDeep(asyncRoutes), data.routes)
      )
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }

    // return new Promise((resolve, reject) => {
    //   getInfo(state.token)
    //     .then((response) => {
    //       const { data } = response

    //       if (!data) {
    //         return reject('Verification failed, please Login again.')
    //       }

    //       const { name, avatar } = data

    //       commit('SET_NAME', name)
    //       commit('SET_AVATAR', avatar)
    //       resolve(data)
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  },

  // user logout
  async logout({ commit, state }) {
    let result = await logout(state.token)
    if (result.code == 20000) {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }

    // return new Promise((resolve, reject) => {
    //   logout(state.token)
    //     .then(() => {
    //       removeToken() // must remove  token  first
    //       resetRouter()
    //       commit('RESET_STATE')
    //       resolve()
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  },

  // remove token
  async resetToken({ commit }) {
    let result = await removeToken()
    if (result.code == 20000) {
      commit('RESET_STATE')
    }
    //   return new Promise((resolve) => {
    //     removeToken() // must remove  token  first
    //     commit('RESET_STATE')
    //     resolve()
    //   })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
