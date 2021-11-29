<template>
  <div>
    <div class="main-content">
      <div class="table-data">
        <div class="table-data-header">
          <div class="form-wrapper">
            <el-form
              :inline="true"
              :model="searchForm"
              @keyup.enter.native="submitSearchForm('searchForm')"
            >
              <el-form-item label="">
                <el-input
                  v-model="searchForm.keyWord"
                  placeholder="请输入用户昵称"
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
            <el-table-column label="状态" prop="state" align="center">
              <template slot-scope="scope">
                {{ scope.row.state === 1 ? '已启用' : '已禁用' }}
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              prop="create_time"
              align="center"
            />
            <el-table-column
              label="修改时间"
              prop="update_time"
              align="center"
            />
            <el-table-column
              label="操作"
              prop="operation"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="changeState(scope.row)">
                  {{ scope.row.state === 1 ? '禁用' : '启用' }}
                </el-button>
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
          keyWord: this.searchForm.keyWord,
        })
        .then((res) => {
          this.list = res.data.list
          this.pagination.total = res.data.total
        })
    },
    submitSearchForm(formName) {
      console.log('searchForm', this.searchForm)
      this.pagination.page = 1
      this.getUserList()
    },
    handleCurrentChange(page) {
      this.pagination.page = page

      this.getUserList()
    },

    handleSizeChange(size) {
      this.pagination.limit = size

      this.getUserList()
    },
    changeState(rowData) {
      const { state, front_user_id } = rowData
      this.$confirm(`是否确认${state === 1 ? '禁用' : '启用'}该用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$api
            .updateFrontUser({
              userId: front_user_id,
              state: state === 1 ? 2 : 1,
            })
            .then(() => {
              this.$message({
                type: 'success',
                message: '操作成功!',
              })
              this.getUserList()
            })
        })
        .catch(() => {})
    },
  },
}
</script>
<style lang="less" scoped>
</style>