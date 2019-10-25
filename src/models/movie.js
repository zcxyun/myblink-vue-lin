/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Movie {
  async getMovie(id) {
    const res = await get(`cms/movie/${id}`)
    return res
  }

  async getMovies(page = 1, count = 1, q = null) {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    const res = await get('cms/movie', info)
    return res
  }

  async addMovie(info) {
    const res = await post('cms/movie', info)
    return res
  }

  async editMovie(id, info) {
    const res = await put(`cms/movie/${id}`, info)
    return res
  }

  async deleteMovie(id) {
    const res = await _delete(`cms/movie/${id}`)
    return res
  }
}

export default new Movie()
