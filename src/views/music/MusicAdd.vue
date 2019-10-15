<template>
  <div class="container">
    <div class="title">新建音乐</div>
    <div class="wrap">
      <el-row>
        <el-col
          :lg="16"
          :md="20"
          :sm="24"
          :xs="24">
          <el-form
            :model="form"
            :rules="formRules"
            status-icon
            ref="form"
            label-width="100px"
            @submit.native.prevent>
            <el-form-item label="标题" prop="title">
              <el-input
                size="medium"
                v-model="form.title"
                placeholder="请填写标题"
                maxlength="30"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="主图">
              <upload-imgs
                ref="uploadImg"
                :value="initImgData"
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
              >
                <el-button type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传一个mp3文件，且不超过10MB</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="简介" prop="summary">
              <el-input
                size="medium"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 3}"
                placeholder="请输入简介"
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
import Config from '@/config'
import User from '@/lin/models/user.js'
import { getToken } from '@/lin/utils/token.js'

export default {
  components: {
    UploadImgs,
  },
  data() {
    return {
      // 表单相关
      form: {
        title: '',
        summary: '',
      },
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }, // eslint-disable-line
          { min: 1, max: 30, message: '标题长度是1 - 30个字符', trigger: 'blur'}, // eslint-disable-line
        ],
        summary: [
          { required: true, message: '请输入摘要', trigger: 'blur' }, // eslint-disable-line
          { min: 1, max: 50, message: '摘要长度是1 - 50个字符', trigger: 'blur' },  // eslint-disable-line
        ],
      },
      // 图片上传相关
      imgRules: {
        minWidth: 100,
        minHeight: 100,
      },
      initImgData: [],
      // 音乐上传相关
      voiceUploadUrl: `${Config.baseUrl}cms/file/`,
      voiceHeaders: {
        Authorization: getToken('access_token'),
      },
      voiceId: 0,
    }
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return
        }
        try {
          const imgData = await this.$refs.uploadImg.getValue()
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
          const res = await music.addMusic(data)
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`)
            this.resetForm(formName)
            this.$router.push('/music/list')
          }
        } catch (error) {
          console.log(error)
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    voiceExceed() {
      this.$message.error('只能上传一个音乐文件, 请删除后再上传')
    },
    beforeVoiceRemove(file, fileList) {// eslint-disable-line
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
      const { url } = file.response[0]
      window.open(url)
    },
    // async voiceUpload(e) {
    //   console.log(e)
    //   const res = await file.upload({file: e.file})
    //   console.log(res)
    //   console.log(e.onSuccess())
    // },
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
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
