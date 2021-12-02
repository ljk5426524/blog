<template>
  <div>
    <div class="form-wrapper">
      <el-form
        :inline="true"
        :model="searchForm"
        @keyup.enter.native="submitSearchForm('searchForm')"
      >
        <el-form-item label="">
          <el-input
            v-model="searchForm.keyWord"
            placeholder="关键字"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="">
          <el-date-picker
            v-model="searchForm.create_time"
            type="date"
            placeholder="创建日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitSearchForm('searchForm')">
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data-body">
      <el-table
        :data="commentList"
        element-loading-text="Loading"
        empty-text="暂无数据"
        border
        highlight-current-row
        row-key="id"
      >
        <el-table-column label="id" prop="id" align="center" width="120px" />
        <el-table-column label="文章标题" prop="title" align="center" />
        <el-table-column label="内容" prop="content" align="center" />
        <el-table-column label="创建时间" prop="create_time" align="center" />
        <el-table-column label="状态" align="center" width="100px">
          <template slot-scope="scope">
            {{ scope.row.state | fomartState }}
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          prop="operation"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.state !== 1"
              type="text"
              @click="handleTableRow(scope.row, 'top')"
            >
              {{ scope.row.state === 0 ? '置顶' : '取消置顶' }}
            </el-button>

            <el-button
              :disabled="scope.row.state === 1"
              type="text"
              @click="handleTableRow(scope.row, 'delete')"
            >
              删除
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
</template>
<script>
export default {
  filters: {
    fomartState(val) {
      const map = {
        0: '默认',
        1: '已删除',
        2: '已置顶',
      }
      return map[val]
    },
  },
  data() {
    return {
      searchForm: {
        keyWord: '',
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
      commentList: [],
    }
  },
  mounted() {
    this.getCommentList()
    this.$api.getFrontNoteList({ page: 1, limit: 10 }).then((res) => {})
  },
  methods: {
    // 搜索
    submitSearchForm() {
      this.pagination.page = 1
      this.getCommentList()
    },
    // 列表
    getCommentList() {
      this.$api
        .getCommentList({
          keyWord: this.searchForm.keyWord,
          page: this.pagination.page,
          limit: this.pagination.limit,
        })
        .then((res) => {
          this.commentList = res.data.list
        })
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination.page = page

      this.getCommentList()
    },

    handleSizeChange(size) {
      this.pagination.limit = size

      this.getCommentList()
    },

    // 表格操作
    handleTableRow(data, handleType, index) {
      if (handleType === 'top') {
        this.topRowData(data)
      } else if (handleType === 'delete') {
        this.deleteRowData(data)
      }
    },
    // 置顶
    topRowData(data) {
      const { state } = data
      this.$api
        .updateComment({
          id: data.id,
          state: state === 0 ? 2 : 0,
        })
        .then((res) => {
          this.$message.success('操作成功')
          this.getCommentList()
        })
    },
    // 删除
    deleteRowData(data) {
      this.$confirm('是否确认删除该评论?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$api
            .updateComment({
              id: data.id,
              state: 1,
            })
            .then((res) => {
              this.$message.success('删除成功')
              this.getCommentList()
            })
        })
        .catch(() => {})
    },
  },
}
</script>
<style lang="less" scoped>
</style>
