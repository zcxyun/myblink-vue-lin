<template>
  <div class="container">
    <div class="title">
      <span>编辑电影</span>
      <span class="back" @click="back">
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
                placeholder="请填写标题"
                maxlength="30"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="主图">
              <upload-imgs
                ref="uploadEle"
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
import User from '@/lin/models/user.js'
import { getToken } from '@/lin/utils/token.js'
import Config from '@/config'

export default {
  props: {
    editId: Number,
  },
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
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }, // eslint-disable-line
          { min: 1, max: 30, message: '标题长度是1 - 30个字符', trigger: 'blur' },  // eslint-disable-line
        ],
        summary: [
          { required: true, message: '请输入摘要', trigger: 'blur' }, // eslint-disable-line
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
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      const res = await music.getMusic(this.editId)
      this.form = res
      this.imgInitData.push({
        id: res.img_id,
        imgId: res.img_id,
        display: res.img_url,
      })
      this.voiceList.push({
        name: res.title,
        url: res.voice_url,
      })
      this.voiceId = res.voice_id
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return
        }
        try {
          const imgData = await this.$refs.uploadEle.getValue()
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
          const res = await music.editMusic(this.editId, data)
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
      this.$refs[formName].resetFields()
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
