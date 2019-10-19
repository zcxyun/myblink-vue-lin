/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

class Book {
  async getBook(id) {
    const res = await get(`cms/book/${id}`)
    return res
  }

  async getBooks(page = 0, count = 1, q = null) {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    const res = await get('cms/book', info)
    return res
  }

  async addBook(info) {
    const res = await post('cms/book/', info)
    return res
  }

  async editBook(id, info) {
    const res = await put(`cms/book/${id}`, info)
    return res
  }

  async deleteBook(id) {
    const res = await _delete(`cms/book/${id}`)
    return res
  }
}

export default new Book()
