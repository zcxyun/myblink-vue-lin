<template>
  <div class="container">
    <div class="title">新建句子</div>
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
                :value="initData"
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
          { min: 1, max: 30, message: '标题长度是1 - 30个字符', trigger: 'blur'}, // eslint-disable-line
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
      initData: [],
    }
  },
  methods: {
    async submitForm(formName) {
      try {
        const imgData = await this.$refs.uploadEle.getValue()
        if (!imgData) {
          this.$message.error('获取图像数据失败')
          return
        }
        const data = Object.assign(this.form, { img_id: imgData[0].imgId })
        const res = await episode.addEpisode(data)
        if (res.error_code === 0) {
          this.$message.success(`${res.msg}`)
          this.resetForm(formName)
          this.$router.push('/episode/list')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
