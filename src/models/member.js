/* eslint-disable class-methods-use-this */
import {
  get,
} from '@/lin/plugins/axios'

class Member {
  async getMember(id) {
    const res = await get(`cms/member/${id}`)
    return res
  }

  async getMembers(page = 1, count = 15, q = '') {
    const info = { page, count }
    if (q) {
      info.q = q
    }
    const res = await get('cms/member', info)
    return res
  }
}

export default new Member()
