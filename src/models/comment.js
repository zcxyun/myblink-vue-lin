/* eslint-disable class-methods-use-this */
import {
  // put,
  // post,
  get,
  // _delete,
} from '@/lin/plugins/axios'

class Classic {
  // async getClassic(id) {
  //   const res = await get(`cms/classic/${id}`)
  //   return res
  // }

  async getComments(page = 1, count = 5, q = null, type = 400) {
    const info = { page, count, type }
    if (q) {
      info.q = q
    }
    const res = await get('cms/comment', info)
    return res
  }
}

export default new Classic()
