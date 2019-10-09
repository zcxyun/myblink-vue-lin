/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Music {
  async addMusic(info) {
    const res = await post('cms/music/', info)
    return res
  }

  async getMusic(id) {
    const res = await get(`cms/music/${id}`)
    return res
  }

  async editMusic(id, info) {
    const res = await put(`cms/music/${id}`, info)
    return res
  }

  async deleteMusic(id) {
    const res = await _delete(`cms/music/${id}`)
    return res
  }

  async getMusics() {
    const res = await get('cms/music/')
    return res
  }
}

export default new Music()
