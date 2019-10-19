<template>
  <div class="container" v-loading="loading">
    <div class="title">
      <span>{{title}}</span>
      <span class="back" @click="back" v-if="action==='edit'">
        <i class="iconfont icon-fanhui"></i> 返回
      </span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col
          :lg="16"
          :md="20"
          :sm="24"
          :xs="24">
          <el-form
            :model="form"
            :rules="rules"
            status-icon
            ref="form"
            label-width="100px"
            @submit.native.prevent>
            <el-form-item label="标题" prop="title">
              <el-input
                size="medium"
                v-model="form.title"
                placeholder="请填写音乐标题"
                maxlength="30"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="主图">
              <upload-imgs
                ref="imgUpload"
                :value="imgInitData"
                :rules="imgRules"
                :max-num="1"
              />
            </el-form-item>
            <el-form-item label="音乐">
              <el-upload
                ref="voiceUpload"
                :action="voiceUploadUrl"
                :headers="voiceHeaders"
                :before-remove="beforeVoiceRemove"
                :on-remove="VoiceRemove"
                :before-upload="beforeVoiceUpload"
                :on-success="voiceUploadSuccess"
                :on-error="voiceUploadError"
                :on-preview="voicePreview"
                :multiple="false"
                :limit="1"
                :on-exceed="voiceExceed"
                :file-list="voiceList"
              >
                <el-button type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传一个mp3文件，且不超过10MB</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <el-input
                size="medium"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 3}"
                placeholder="请填写音乐摘要"
                maxlength="50"
                show-word-limit
                v-model="form.summary">
              </el-input>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import music from '@/models/music.js'
import UploadImgs from '@/components/base/upload-imgs'
import User from '@/lin/models/user.js'
import { getToken } from '@/lin/utils/token.js'
import Config from '@/config'

export default {
  props: {
    editMusicId: Number,
    action: {
      type: String,
      default: 'edit',
    },
  },
  components: {
    UploadImgs,
  },
  computed: {
    title() {
      return this.action === 'edit' ? '编辑音乐' : '添加音乐'
    },
  },
  data() {
    return {
      loading: false,
      // 编辑页面时从服务器请求的指定ID的原始数据
      originInfo: null,
      // 表单相关
      form: {
        title: '',
        summary: '',
      },
      rules: {
        title: [
          { required: true, message: '请输入音乐标题', trigger: 'blur' }, // eslint-disable-line
          { min: 1, max: 30, message: '标题长度是1 - 30个字符', trigger: 'blur' },  // eslint-disable-line
        ],
        summary: [
          { required: true, message: '请输入音乐摘要', trigger: 'blur' }, // eslint-disable-line
          { min: 1, max: 50, message: '摘要长度是1 - 50个字符', trigger: 'blur' },  // eslint-disable-line
        ],
      },
      // 主图上传相关
      imgRules: {
        minWidth: 100,
        minHeight: 100,
      },
      imgInitData: [],
      // 音乐上传相关
      voiceUploadUrl: `${Config.baseUrl}cms/file/`,
      voiceHeaders: {
        Authorization: getToken('access_token'),
      },
      // 要上传的音频文件id(从后台获取)
      voiceId: 0,
      // 已上传的音频文件列表
      voiceList: [],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      if (this.action === 'edit' && this.editMusicId) {
        this.loading = true
        try {
          this.originInfo = await music.getMusic(this.editMusicId)
          this.setFormInfo()
          this.setImgInfo()
          this.setVoiceInfo()
        } catch (err) {
          console.log(err)
        }
        this.loading = false
      }
    },
    setFormInfo() {
      const origin = this.originInfo  // eslint-disable-line
      this.form.title = origin.title || ''
      this.form.summary = origin.summary || ''
    },
    setImgInfo() {
      const origin = this.originInfo  // eslint-disable-line
      if (origin.img_id && origin.img_url) {
        this.imgInitData.splice(0) // 重置时先清空, 要不然会越来越多~_~
        this.imgInitData.push({
          id: origin.img_id,
          imgId: origin.img_id,
          display: origin.img_url,
        })
      }
    },
    setVoiceInfo() {
      const origin = this.originInfo  // eslint-disable-line
      if (origin.title && origin.voice_url && origin.voice_id) {
        this.voiceList.splice(0) // 重置时先清空, 要不然会越来越多~_~
        this.voiceList.push({
          name: origin.title,
          url: origin.voice_url,
        })
        this.voiceId = origin.voice_id
      }
    },

    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return
        }
        try {
          const imgData = await this.$refs.imgUpload.getValue()
          const noImgData = (Array.isArray(imgData) && imgData.length === 0) || !imgData
          if (noImgData) {
            this.$message.error('还没有上传主图文件或图片不符合规则')
            return
          }
          if (!this.voiceId) {
            this.$message.error('还没有上传音频文件')
            return
          }
          const data = Object.assign(
            this.form,
            { img_id: imgData[0].imgId },
            { voice_id: this.voiceId },
          )
          let res = null
          if (this.editMusicId) {
            res = await music.editMusic(this.editMusicId, data)
          } else {
            res = await music.addMusic(data)
          }
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`)
            this.resetForm(formName)
            this.$emit('edit-save')
          }
        } catch (error) {
          console.log(error)
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      // 编辑状态时重置 = 恢复原数据
      if (this.action === 'edit') {
        this.setFormInfo()
        this.setImgInfo()
        this.setVoiceInfo()
      } else {
        // 其他状态时清空时(如添加) = 清除表单数据
        this.$refs[formName].resetFields()
        this.imgInitData.splice(0)
        this.voiceList.splice(0)
        /**
         * 音频列表清空时 voiceId 置为0 是因为上传之后不提交而重置会使数据清空的同时 voiceId != 0
         * 而voiceId != 0 会使第二次提交表单数据时不上传音频文件也可以提交数据,不过提交的是上次重置
         * 表单时清空的音频文件voiceId
         */
        this.voiceId = 0
        // 不知道为什么不起作用(下面)
        // this.$refs.imgUpload.clear()
        // this.$refs.voiceUpload.clearFiles()
      }
    },
    back() {
      this.$emit('edit-back')
    },
    voiceExceed() {
      this.$message.error('只能上传一个音乐文件, 请删除后再上传')
    },
    beforeVoiceRemove(file, fileList) { // eslint-disable-line
    },
    VoiceRemove(file, fileList) {// eslint-disable-line
      this.voiceId = 0
    },
    beforeVoiceUpload(file) {
      const isAudio = file.type === 'audio/mp3'
      const isLt10M = file.size / 1024 / 1024 <= 10
      if (!isAudio) {
        this.$message.error('上传音频文件只能是 MP3 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传音频文件大小不能超过 10MB!')
      }
      return isAudio && isLt10M
    },
    voiceUploadSuccess(response, file, fileList) {// eslint-disable-line
      this.$message.success('文件上传成功')
      this.voiceId = response[0].id
    },
    async voiceUploadError(err, file, fileList) {// eslint-disable-line
      await User.getRefreshToken()
      this.voiceHeaders = { Authorization: getToken('access_token') }
      this.$message.error('上传失败, 请再试一次')
    },
    voicePreview(file) {
      const { url } = file
      window.open(url)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }


  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
