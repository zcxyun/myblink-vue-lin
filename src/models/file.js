/* eslint-disable class-methods-use-this */
import {
  post,
} from '@/lin/plugins/axios'

class File {
  async upload(info) {
    const res = await post('cms/file/', info)
    return res
  }
}

export default new File()
