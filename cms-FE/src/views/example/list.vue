<template>
  <div class="main-content">
    <div class="table-data">
      <div class="table-data-header">
        <div class="form-wrapper">
          <el-form
            :inline="true"
            :model="searchForm"
            @keyup.enter.native="submitSearchForm('searchForm')"
          >
            <el-form-item label="姓名">
              <el-input v-model="searchForm.keyword" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="角色类型">
              <el-select
                placeholder="请选择角色类型"
                v-model="searchForm.roleId"
              >
                <el-option label="全部" value></el-option>
                <el-option label="管理员" :value="1"></el-option>
                <el-option label="超级管理员" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSearchForm('searchForm')"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="button-group">
          <el-button type="primary" @click="addTableRowData">新增</el-button>
        </div>
      </div>
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
          <el-table-column label="id" prop="id" />
          <el-table-column label="用户姓名" prop="userName" />
          <el-table-column label="手机号" prop="phone" />
          <el-table-column
            label="角色类型"
            prop="roleId"
            :formatter="formatterRoleId"
          />
          <el-table-column
            label="使用状态"
            prop="useState"
            :formatter="formatterUseState"
          />
          <el-table-column label="操作" prop="operation" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleTableRow(scope.row, 'update')"
                >更新</el-button
              >
              <el-button
                type="text"
                @click="handleTableRow(scope.row, 'delete')"
                >删除</el-button
              >
              <el-button
                type="text"
                @click="handleTableRow(scope.row, 'use')"
                >{{ scope.row.useState === 1 ? '禁用' : '启用' }}</el-button
              >
            </template>
          </el-table-column>
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

    <!-- 新增与更新弹框 -->
    <el-dialog
      width="500px"
      :title="addDataDialog.title"
      :visible.sync="addDataDialog.visible"
      :close-on-click-modal="false"
      append-to-body
      @closed="resetForm('addDataForm')"
    >
      <el-form
        :model="addDataForm"
        ref="addDataForm"
        :rules="addDataFormRules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="userName">
          <el-input
            type="text"
            placeholder="请输入姓名"
            v-model="addDataForm.userName"
            auto-complete="off"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            type="text"
            placeholder="请输入手机号"
            v-model="addDataForm.phone"
            auto-complete="off"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色类型" prop="roleId">
          <el-select placeholder="请选择角色类型" v-model="addDataForm.roleId">
            <el-option label="管理员" :value="1"></el-option>
            <el-option label="超级管理员" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            type="textarea"
            placeholder="请输入描述"
            maxlength="150"
            :rows="3"
            v-model="addDataForm.desc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDataDialog.visible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submitAddDataForm('addDataForm')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'List',

  components: {},

  filters: {},

  props: {},

  data() {
    return {
      searchForm: {
        keyword: '',
        roleId: '',
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

      addDataDialog: {
        visible: false,
        title: '新增',
      },
      addDataForm: {
        userName: '',
        phone: '',
        roleId: '',
        desc: '',
      },
      addDataFormRules: {
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        roleId: [
          { required: true, message: '请选择角色类型', trigger: 'blur' },
        ],
      },
      submitLoading: false,
    }
  },

  computed: {},

  watch: {},

  created() {
    this.getAdminList()
  },

  methods: {
    getAdminList() {
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

    formatterUseState(row, column, cellValue, index) {
      const maps = {
        1: '使用中',
        2: '已禁用',
      }

      return maps[cellValue]
    },

    // 新增
    addAdmin() {
      this.$api
        .addAdmin({
          ...this.addDataForm,
        })
        .then(response => {
          this.addDataDialog.visible = false

          this.$message({
            message: '新增成功',
            type: 'success',
            onClose: () => {
              this.getAdminList()
            },
          })
        })
        .catch(error => {
          console.log('addAdmin error: ', error)
        })
    },

    // 更新
    updateAdmin() {
      this.submitLoading = true

      this.$api
        .updateAdmin({
          ...this.addDataForm,
        })
        .then(response => {
          this.addDataDialog.visible = false
          this.submitLoading = false

          this.$message({
            message: '更新成功',
            type: 'success',
            onClose: () => {
              this.getAdminList()
            },
          })
        })
        .catch(error => {
          this.submitLoading = false
          console.log('updateAdmin error: ', error)
        })
    },

    // 删除
    deleteAdmin(id) {
      this.$api
        .deleteAdmin({
          id,
        })
        .then(response => {
          this.addDataDialog.visible = false

          this.$message({
            message: '删除成功',
            type: 'success',
            onClose: () => {
              this.getAdminList()
            },
          })
        })
        .catch(error => {
          this.submitLoading = false
          console.log('deleteAdmin error: ', error)
        })
    },

    handleCurrentChange(page) {
      this.pagination.page = page

      this.getAdminList()
    },

    handleTableRow(data, handleType, index) {
      if (handleType === 'update') {
        this.updateTableRowData(data)
      } else if (handleType === 'delete') {
        this.deleteTableRowData(data)
      } else if (handleType === 'use') {
        this.changeUseStateTableRowData(data)
      }
    },

    addTableRowData() {
      this.addDataDialog.visible = true
      this.addDataDialog.title = '数据新增'
      this.addDataDialog.type = 'add'

      delete this.addDataForm.id
    },

    updateTableRowData(data) {
      this.addDataDialog.visible = true
      this.addDataDialog.title = '数据修改'
      this.addDataDialog.type = 'update'

      this.addDataForm.id = data.id
      this.addDataForm.userName = data.userName
      this.addDataForm.phone = data.phone
      this.addDataForm.roleId = data.roleId
      this.addDataForm.desc = data.desc
    },

    deleteTableRowData(data) {
      this.$confirm(`确定要删除该条数据吗？`, '提示', {
        type: 'warning',
      })
        .then(() => {
          this.deleteAdmin(data.id)
        })
        .catch(() => {})
    },

    changeUseStateTableRowData(data) {
      let message = ''

      if (data.useState === 1) {
        message = '禁用操作'
      } else if (data.useState === 2) {
        message = '启用操作'
      }

      this.$message({
        message,
        type: 'warning',
      })
    },

    submitSearchForm(formName) {
      console.log('searchForm', this.searchForm)
      this.getAdminList()
    },

    submitAddDataForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addDataDialog.type === 'add') {
            this.addAdmin()
          } else if (this.addDataDialog.type === 'update') {
            this.updateAdmin()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields()
      // details: https://github.com/ElemeFE/element/issues/1534#issuecomment-285940974
      Object.assign(this[formName], this.$options.data()[formName])
    },
  },
}
</script>

<style lang="scss"></style>
