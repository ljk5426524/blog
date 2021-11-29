<template>
  <div class="main-content">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <div class="el-form-title">基本信息</div>
      <el-form-item label="文本" prop="text">
        <el-input v-model="form.text" placeholder="请输入名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="选择" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option label="类型一" :value="1" />
          <el-option label="类型二" :value="2" />
          <el-option label="类型三" :value="3" />
        </el-select>
      </el-form-item>

      <div class="el-form-title">数字</div>
      <el-form-item label="整数" prop="number.integer">
        <el-input
          v-model="form.number.integer"
          placeholder="请输入整数"
          @input.native="
            event =>
              handleNumber(
                {
                  form: 'form',
                  lv1Name: 'number',
                  lv2Name: 'integer',
                  hasNegative: true,
                },
                event
              )
          "
          @keyup.native="
            event =>
              handleNumber(
                {
                  form: 'form',
                  lv1Name: 'number',
                  lv2Name: 'integer',
                  hasNegative: true,
                },
                event
              )
          "
          @paste.native.capture.prevent="disablePaste"
        />
      </el-form-item>
      <el-form-item label="正整数" prop="number.positiveInteger">
        <el-input
          v-model="form.number.positiveInteger"
          placeholder="请输入正整数"
          @input.native="
            event =>
              handleNumber(
                { form: 'form', lv1Name: 'number', lv2Name: 'positiveInteger' },
                event
              )
          "
          @keyup.native="
            event =>
              handleNumber(
                { form: 'form', lv1Name: 'number', lv2Name: 'positiveInteger' },
                event
              )
          "
          @paste.native.capture.prevent="disablePaste"
        />
      </el-form-item>
      <el-form-item label="小数" prop="number.decimal">
        <el-input
          v-model="form.number.decimal"
          placeholder="请输入小数，保留两位小数"
          @input.native="
            event =>
              handleNumber(
                {
                  form: 'form',
                  lv1Name: 'number',
                  lv2Name: 'decimal',
                  max: 10,
                  hasPoint: true,
                },
                event
              )
          "
          @keyup.native="
            event =>
              handleNumber(
                {
                  form: 'form',
                  lv1Name: 'number',
                  lv2Name: 'decimal',
                  max: 10,
                  hasPoint: true,
                },
                event
              )
          "
          @paste.native.capture.prevent="disablePaste"
        />
      </el-form-item>
      <el-form-item label="最大数" prop="number.max">
        <el-input
          v-model="form.number.max"
          placeholder="请输入数字，最大10000"
          @input.native="
            event =>
              handleNumber(
                { form: 'form', lv1Name: 'number', lv2Name: 'max', max: 10000 },
                event
              )
          "
          @keyup.native="
            event =>
              handleNumber(
                { form: 'form', lv1Name: 'number', lv2Name: 'max', max: 10000 },
                event
              )
          "
          @paste.native.capture.prevent="disablePaste"
        />
      </el-form-item>

      <div class="el-form-title">富文本</div>
      <el-form-item label="富文本" prop="richText">
        <Editor v-model="form.richText" placeholder="请输入富文本" :content="form.richText" />
      </el-form-item>

      <div class="el-form-title">其他</div>
      <el-form-item label="详情缩略图" class="images-top" prop="descThumbnail">
        <el-upload
          class="upload-demo"
          :action="$api.uploadPicUrl"
          :show-file-list="false"
          :http-request="uploadImg"
          :data="{ field: 'descThumbnail' }"
          accept=".jpg,.png"
        >
          <el-button type="primary">上传</el-button>
          <div slot="tip" class="el-upload__tip">
            建议尺寸1125x696px，JPG、PNG格式，图片小于300k
          </div>
        </el-upload>
        <el-image
          v-if="form.descThumbnail"
          v-loading="descThumbnailLoading"
          :src="form.descThumbnail"
          fit="scale-down"
        />
        <el-image v-else :src="form.img" fit="scale-down" />
      </el-form-item>
      <el-form-item label="选择管理员" prop="adminId">
        <el-button type="primary" @click="addTableRowData">添加管理员</el-button>

        <el-table
          v-if="selectedAdminList.length"
          v-loading="selectedAdminListLoading"
          :data="selectedAdminList"
          element-loading-text="Loading"
          empty-text="暂无数据"
          border
          highlight-current-row
          row-key="id"
        >
          <el-table-column label="用户姓名" prop="userName" />
          <el-table-column label="手机号" prop="phone" />
          <el-table-column label="角色类型" prop="roleId" :formatter="formatterRoleId" />
          <el-table-column label="操作" prop="operation" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="handleTableRow(scope.row, 'delete')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择人员弹框 -->
    <el-dialog
      width="800px"
      :title="addInfoDialog.title"
      :visible.sync="addInfoDialog.visible"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="table-data">
        <!-- <div class="table-data-header"></div> -->
        <div class="table-data-body">
          <el-table
            v-loading="adminListLoading"
            :data="adminList"
            element-loading-text="Loading"
            empty-text="暂无数据"
            border
            highlight-current-row
            row-key="id"
          >
            <el-table-column label="操作" prop="selected" width="100">
              <template slot-scope="scope">
                <el-radio
                  v-model="form.adminId"
                  :label="scope.row.id"
                  @change.native="selectedCurrentRow(scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column label="用户姓名" prop="userName" />
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="角色类型" prop="roleId" :formatter="formatterRoleId" />
          </el-table>
        </div>
        <div class="table-data-footer">
          <el-pagination
            background
            layout="prev, pager, next, total, jumper"
            :total="pagination.total"
            :current-page.sync="pagination.page"
            :page-size.sync="pagination.limit"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addInfoDialog.visible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="confirmSelectAdmin">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Editor from '@/components/editor'

export default {
  name: 'Form',

  components: {
    Editor,
  },

  filters: {},

  props: {},

  data() {
    return {
      descThumbnailLoading: false,
      form: {
        text: '',
        type: '',
        number: {
          integer: '',
          positiveInteger: '',
          decimal: '',
          max: '',
        },
        richText:
          '<p><strong>粗体</strong> <em>斜体</em> <u>下划线</u> <s>中划线 </s></p>',
        adminId: '',
        descThumbnail: '',
        img: require('@/assets/uploadImgDefault.png'),
      },

      rules: {
        text: [
          {
            required: true,
            message: `请输入文本`,
            trigger: 'blur',
          },
        ],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        'number.positiveInteger': [
          { required: true, message: '请输入正整数', trigger: 'blur' },
        ],
        richText: [
          {
            required: true,
            message: `请输入富文本`,
            trigger: 'blur',
          },
        ],
        adminId: [{ required: true, message: '请选择人员', trigger: 'blur' }],
      },

      submitLoading: false,

      addInfoDialog: {
        visible: false,
        title: '选择人员',
      },

      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
      adminListLoading: false,
      adminList: [
        // {
        //   id: '540000201310262855',
        //   userName: '萧秀兰',
        //   phone: '13531544954',
        //   roleId: 0,
        //   useState: 0,
        //   desc: '描述',
        // },
      ],

      selectedAdminListLoading: false,
      selectedAdminList: [
        // {
        //   id: '540000201310262855',
        //   userName: '萧秀兰',
        //   phone: '13531544954',
        //   roleId: 0,
        //   useState: 0,
        //   desc: '描述',
        // },
      ],
    }
  },

  computed: {},

  watch: {},

  created() {
    this.getAdminList()
  },

  destroyed() {},

  methods: {
    getAdminList(callback) {
      this.adminListLoading = true

      this.$api
        .getAdminList({
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.searchForm,
        })
        .then(response => {
          const {
            data: { list, total },
          } = response

          this.adminListLoading = false
          this.adminList = list
          this.pagination.total = total
        })
        .catch(error => {
          console.log('getAdminList error: ', error)
        })
    },

    formatterRoleId(row, column, cellValue, index) {
      const maps = {
        1: '管理员',
        2: '超级管理员',
      }

      return maps[cellValue]
    },

    handleTableRow(data, handleType, index) {
      if (handleType === 'delete') {
        this.deleteTableRowData(data)
      }
    },

    addTableRowData() {
      this.addInfoDialog.visible = true
    },

    deleteTableRowData(data) {
      this.$confirm(`确定要删除该条数据吗？`, '提示', {
        type: 'warning',
      })
        .then(() => {
          this.selectedAdminList = []
          this.form.adminId = ''
        })
        .catch(() => {})
    },

    handleCurrentChange(page) {
      this.pagination.page = page
    },

    selectedCurrentRow(index) {
      console.log(this.form.adminId)
    },

    confirmSelectAdmin() {
      if (!this.form.adminId) {
        return this.$message.error('您未选择任何人员')
      }

      this.addInfoDialog.visible = false

      this.adminList.forEach((item, index) => {
        if (item.id === this.form.adminId) {
          this.selectedAdminList = [{ ...this.adminList[index] }]
        }
      })
    },

    handleNumber(field, event) {
      let value = event.target.value

      if (value.length === 1 && Number(value) === 0) {
        value = ''
      }

      if (field.max && value >= field.max) {
        value = field.max + ''
      }

      if (field.lv1Name) {
        if (field.lv2Name) {
          if (field.hasNegative) {
            value = value.replace(/[^\-?\d.]/g, '')
          } else {
            if (field.hasPoint) {
              value = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
            } else {
              value = value.replace(/[^0-9]/g, '')
            }
          }

          this[field.form][field.lv1Name][field.lv2Name] = value
        } else {
          if (field.hasNegative) {
            this[field.form][field.lv1Name] = value.replace(/\-|[^0-9]/g, '')
          } else {
            this[field.form][field.lv1Name] = value.replace(/[^0-9]/g, '')
          }
        }
      }
    },

    disablePaste() {},

    // 自定义图片上传方法
    uploadImg(obj) {
      const {
        file,
        // file: { size },
        data,
        data: { field },
      } = obj
      // if (size > 1024 * 300) {
      //   return this.$message.error('图片应小于300k')
      // }
      this[field + 'Loading'] = true
      this.$api
        .uploadPic(file, data)
        .then(res => {
          this[field + 'Loading'] = false
          const { data: imgUrl } = res
          this.form[field] = imgUrl
        })
        .catch(e => (this[field + 'Loading'] = false))
    },

    submitForm(formName) {
      console.log('form', this.form)

      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ {
    .el-radio__label {
      display: none;
    }
  }
}

.el-table {
  margin-top: 15px;
}
</style>
