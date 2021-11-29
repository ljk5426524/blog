<template>
  <div>
    <div v-show="!isRouterViewRun" class="main-content">
      <div class="table-data">
        <div class="table-data-header">
          <div class="form-wrapper">
            <el-form
              :inline="true"
              :model="searchForm"
              size="small"
              @keyup.enter.native="submitSearchForm('searchForm')"
            >
              <el-form-item label="">
                <el-input
                  v-model="searchForm.title"
                  placeholder="标题"
                  clearable
                />
              </el-form-item>
              <el-form-item label="">
                <el-date-picker
                  v-model="searchForm.create_time"
                  type="date"
                  placeholder="创建日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitSearchForm('searchForm')"
                  >搜索</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="button-group">
          <el-button type="primary" size="small" @click="addTableRowData"
            >新增</el-button
          >
        </div>
        <div class="table-data-body">
          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            empty-text="暂无数据"
            border
            highlight-current-row
            row-key="id"
          >
            <el-table-column
              label="id"
              prop="note_id"
              align="center"
              width="120px"
            />
            <el-table-column label="标题" prop="title" align="center" />
            <el-table-column label="内容" prop="note" align="center" />
            <el-table-column
              label="修改时间"
              prop="update_time"
              align="center"
              width="100px"
            />
            <el-table-column
              label="创建时间"
              prop="create_time"
              align="center"
              width="100px"
            />
            <el-table-column
              label="操作"
              prop="operation"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleTableRow(scope.row, 'update')"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="handleTableRow(scope.row, 'delete')"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-data-footer">
          <el-pagination
            background
            layout=" total,sizes,prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90]"
            :total="pagination.total"
            :current-page.sync="pagination.page"
            :page-size.sync="pagination.limit"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
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
          ref="addDataForm"
          :model="addDataForm"
          :rules="addDataFormRules"
          label-width="100px"
          size="small"
        >
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="addDataForm.title"
              type="text"
              placeholder="请输入标题"
              auto-complete="off"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item label="内容" prop="note">
            <el-input
              v-model="addDataForm.note"
              type="textarea"
              placeholder="请输入内容"
              maxlength="500"
              :rows="5"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="addDataDialog.visible = false"
            >取 消</el-button
          >
          <el-button
            type="primary"
            :loading="submitLoading"
            size="small"
            @click="submitAddDataForm('addDataForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <router-view ref="routerView" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRouterViewRun: false,

      searchForm: {
        title: '',
        create_time: '',
      },

      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
      listLoading: false,
      list: [],

      addDataDialog: {
        visible: false,
        title: '新增',
      },
      addDataForm: {
        title: '',
        note: '',
      },
      addDataFormRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        note: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      submitLoading: false,
    }
  },

  mounted() {
    this.isRouterViewRun = !!this.$refs['routerView'] // 如果是routerView就隐藏本页面的内容
    if (!this.isRouterViewRun) {
      this.getList()
    }
  },

  methods: {
    getList() {
      this.listLoading = true

      this.$api
        .getList({
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.searchForm,
        })
        .then((response) => {
          const {
            data: { list, total },
          } = response

          this.listLoading = false
          this.list = list
          this.pagination.total = total
        })
        .catch((error) => {
          console.log('getList error: ', error)
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
    addNote() {
      this.$api
        .addNote({
          ...this.addDataForm,
        })
        .then((response) => {
          this.addDataDialog.visible = false

          this.$message({
            message: '新增成功',
            type: 'success',
          })
          this.getList()
        })
        .catch((error) => {
          console.log('addNote error: ', error)
        })
    },

    // 更新
    updateNote() {
      this.submitLoading = true

      this.$api
        .updateNote({
          ...this.addDataForm,
        })
        .then((response) => {
          this.addDataDialog.visible = false
          this.submitLoading = false

          this.$message({
            message: '更新成功',
            type: 'success',
          })
          this.getList()
        })
        .catch((error) => {
          this.submitLoading = false
          console.log('updateNote error: ', error)
        })
    },

    // 删除
    delNote(note_id) {
      this.$api
        .delNote({
          note_id,
        })
        .then((response) => {
          this.addDataDialog.visible = false

          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.getList()
        })
        .catch((error) => {
          this.submitLoading = false
          console.log('delNote error: ', error)
        })
    },

    handleCurrentChange(page) {
      this.pagination.page = page

      this.getList()
    },

    handleSizeChange(size) {
      this.pagination.limit = size

      this.getList()
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

      this.addDataForm = { ...data }
    },

    deleteTableRowData(data) {
      this.$confirm(`确定要删除该条数据吗？`, '提示', {
        type: 'warning',
      })
        .then(() => {
          this.delNote(data.note_id)
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
      this.pagination.page = 1
      this.getList()
    },

    submitAddDataForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addDataDialog.type === 'add') {
            this.addNote()
          } else if (this.addDataDialog.type === 'update') {
            this.updateNote()
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
      this[formName] = Object.assign({}, this.$options.data()[formName])
    },
  },
}
</script>

<style lang="scss"></style>
