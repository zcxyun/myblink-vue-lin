/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Movie {
  async addMovie(info) {
    const res = await post('cms/movie/', info)
    return res
  }

  async getMovie(id) {
    const res = await get(`cms/movie/${id}`)
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

  async getMovies() {
    const res = await get('cms/movie/')
    return res
  }
}

export default new Movie()
