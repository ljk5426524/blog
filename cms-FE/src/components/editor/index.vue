<template>
  <div class="editor-container" v-if="editorOption.modules.toolbar">
    <quill-editor
      class="ql-editor"
      v-model="newContent"
      :ref="ele"
      :options="editorOption"
      @ready="onEditReady($event)"
      @focus="onEditFocus($event)"
    >
      <div :id="id" slot="toolbar" style="display:flex;margin-bottom:-19px">
        <button class="ql-bold">Bold</button>
        <button class="ql-italic">Italic</button>
        <button class="ql-underline">underline</button>
        <button class="ql-strike">strike</button>
        <!-- <button class="ql-header" value="1">header</button>
        <button class="ql-header" value="2">header</button>-->

        <div class="upload">
          <el-upload
            with-credentials
            class="upload-demo"
            accept="image/png, image/jpeg"
            :action="uploadUrl"
            :before-upload="beforeRichTxtPicUpload"
            :on-progress="richTextUploadProgress"
            :on-error="richTextUploadError"
            :on-success="richTextUploadSuccess"
          >
            <el-button size="small" type="primary">{{editorOption.uploadImgText}}</el-button>
          </el-upload>
        </div>
      </div>
    </quill-editor>
  </div>
</template>
<script>
import uuidv1 from 'uuid/v1'

import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'

export default {
  name: 'Editor',

  model: {
    prop: 'content',
    event: 'changeContent',
  },

  components: {
    quillEditor,
  },

  props: {
    placeholder: {
      type: String,
      default: '内容',
    },
    content: {
      type: String,
    },
  },

  data() {
    return {
      uploadUrl: env.api + 'test/uploadFile',

      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: '',
        },
        placeholder: '请输入题干',
        readOnly: false,
        uploadImgText: '',
      },
      ele: '',
      id: '',
      newContent: this.content,
    }
  },

  watch: {
    content() {
      this.newContent = this.content
    },

    newContent() {
      this.$emit('changeContent', this.newContent)
    },
  },

  mounted() {
    this.ele = `ele-${uuidv1()}`
    this.id = `toolbar-${uuidv1()}`
    this.editorOption.modules.toolbar = `#${this.id}`
    this.editorOption.placeholder = `请输入${this.placeholder}`
  },

  updated() {},

  destroyed() {},

  methods: {
    getUEContent() {
      // 获取内容方法
      return this.editor.getContent()
    },

    onEditReady(event) {
      const ele = this.$refs[this.ele]
    },

    onEditFocus(event) {},

    beforeRichTxtPicUpload(file) {
      if (this.uploadUrl.includes('test')) {
        this.$message.error(`请替换上传文件地址`)

        return false
      }

      const isNotImg = !(
        file.type === 'image/jpeg' || file.type === 'image/png'
      )

      // MB
      const maxSize = 2
      const isExceedMaxSize = file.size / 1024 / 1024 > maxSize

      if (isNotImg) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      }

      if (isExceedMaxSize) {
        this.$message.error(`上传图片大小不能超过 ${maxSize}MB!`)
      }

      return !isNotImg || !isExceedMaxSize
    },

    richTextUploadProgress(res) {
      const ele = this.$refs[this.ele]

      ele.quill.focus()

      this.editorOption.uploadImgText = '上传中...'
    },

    richTextUploadError(res) {
      this.editorOption.uploadImgText = '上传中...'
    },

    richTextUploadSuccess(res) {
      const ele = this.$refs[this.ele]
      const range = ele.quill.getSelection()

      const { url, resourceName } = res.data

      if (url) {
        ele.quill.insertEmbed(range.index, 'image', url)
      }

      this.editorOption.uploadImgText = '上传图片'
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-container {
  .el-button {
    background: none;
  }

  /deep/ {
    .ql-editor {
      min-height: 40px;
      padding: 0;

      .ql-container {
        padding: 12px 15px;
      }

      .ql-toolbar {
        .upload {
          width: 28px;
          height: 24px;
          opacity: 0.8;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQLyYwAAAAE3RSTlMAEPAwkIDgv69AINDPn9+wcF9Q/t88bwAAAJJJREFUOMvN0UsOwyAMAFGwgQBJv3P/u1alpakQoC66yOyQ3gLb5hjZKPSLWsCFYUsBYAbB78AubHYGPB43BzeZAhsIef5JNbX74qZTZIHrDKyA5DHwdYUtyKk8lFe+BSrE5+E23mkDVuBkjKO22WZRPEViz32DRKe0A3vuAbEf4OgWKxj2N7AyLBSggUGi5hA9AMr9HU17VNLSAAAAAElFTkSuQmCC);
          background-position: center center;
          background-size: 16px 16px;
          background-repeat: no-repeat;
        }

        .el-upload-list {
          display: none;
        }
      }
    }
  }
}
</style>
