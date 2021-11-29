<template>
  <div>
    <div class="main-content">
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
                  v-model="searchForm.keyWord"
                  placeholder="用户昵称"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitSearchForm('searchForm')"
                >
                  搜索
                </el-button>
              </el-form-item>
            </el-form>
          </div>
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
              prop="front_user_id"
              align="center"
              width="120px"
            />
            <el-table-column label="用户昵称" prop="nick_name" align="center" />
            <el-table-column label="性别" prop="sex" align="center">
              <template slot-scope="scope">
                {{ scope.row.sex === 1 ? '男' : '女' }}
              </template>
            </el-table-column>
            <el-table-column label="年龄" prop="age" align="center" />
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
      <!-- <el-dialog
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
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listLoading: false,
      list: [],
      searchForm: {
        keyWord: '',
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$api
        .getFrontUserList({
          keyWord: '',
        })
        .then((res) => {
          console.log(res)
          this.list = res.data.list
        })
    },
    submitSearchForm(formName) {
      console.log('searchForm', this.searchForm)
      this.pagination.page = 1
      this.getList()
    },
    handleCurrentChange(page) {
      this.pagination.page = page

      this.getList()
    },

    handleSizeChange(size) {
      this.pagination.limit = size

      this.getList()
    },
  },
}
</script>
<style lang="less" scoped>
</style>