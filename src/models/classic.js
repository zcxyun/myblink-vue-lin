/* eslint-disable class-methods-use-this */
import {
  // put,
  post,
  get,
  // _delete,
} from '@/lin/plugins/axios'

class Classic {
  // async getClassic(id) {
  //   const res = await get(`cms/classic/${id}`)
  //   return res
  // }

  async getClassics(page = 1, count = 5, q = null) {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    const res = await get('cms/classic', info)
    return res
  }

  async addClassic(info) {
    const res = await post('cms/classic', info)
    return res
  }

  // async editClassic(id, info) {
  //   const res = await put(`cms/classic/${id}`, info)
  //   return res
  // }

  async deleteClassic(info) {
    const res = await post('cms/classic/cancel', info)
    return res
  }
}

export default new Classic()
