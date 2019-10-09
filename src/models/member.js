/* eslint-disable class-methods-use-this */
import {
  get,
} from '@/lin/plugins/axios'

class Member {
  async getMember(id) {
    const res = await get(`cms/member/${id}`)
    return res
  }

  async getMembers() {
    const res = await get('cms/member')
    return res
  }
}

export default new Member()
