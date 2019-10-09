/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Episode {
  async getEpisode(id) {
    const res = await get(`cms/episode/${id}`)
    return res
  }

  async getEpisodes(page = 0, count = 1, q = null) {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    const res = await get('cms/episode', info)
    return res
  }

  async addEpisode(info) {
    const res = await post('cms/episode', info)
    return res
  }

  async editEpisode(id, info) {
    const res = await put(`cms/episode/${id}`, info)
    return res
  }

  async deleteEpisode(id) {
    const res = await _delete(`cms/episode/${id}`)
    return res
  }
}

export default new Episode()
