<template>
  <div class="container">
    <div class="title">
      <span>修改句子</span>
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
            <el-form-item label="主图" prop="img_url">
              <upload-imgs
                ref="uploadEle"
                :value="imgInitData"
                :rules="imgRules"
                :max-num="1"
              />
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
import episode from '@/models/episode'
import UploadImgs from '@/components/base/upload-imgs'

export default {
  props: {
    editEpisodeId: Number,
  },
  components: {
    UploadImgs,
  },
  data() {
    return {
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
      imgRules: {
        minWidth: 100,
        minHeight: 100,
      },
      imgInitData: [],
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      const res = await episode.getEpisode(this.editEpisodeId)
      this.form = res
      this.imgInitData.push({
        id: res.img_id,
        imgId: res.img_id,
        display: res.img_url,
      })
    },
    async submitForm(formName) {
      try {
        const imgData = await this.$refs.uploadEle.getValue()
        if (!imgData) {
          this.$message.error('获取图像数据失败')
          return
        }
        const data = Object.assign(this.form, { img_id: imgData[0].imgId })
        const res = await episode.editEpisode(this.editEpisodeId, data)
        if (res.error_code === 0) {
          this.$message.success(`${res.msg}`)
          this.resetForm(formName)
          this.$emit('edit-save')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    back() {
      this.$emit('edit-back')
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
