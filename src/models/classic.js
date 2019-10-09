/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Classic {
  async addClassic(info) {
    const res = await post('cms/classic/', info)
    return res
  }

  async getClassic(id) {
    const res = await get(`cms/classic/${id}`)
    return res
  }

  async editClassic(id, info) {
    const res = await put(`cms/classic/${id}`, info)
    return res
  }

  async deleteClassic(id) {
    const res = await _delete(`cms/classic/${id}`)
    return res
  }

  async getClassics() {
    const res = await get('cms/classic/')
    return res
  }
}

export default new Classic()
