<template>
  <div v-if="isShow" class="api-select-box">
    <el-dialog
      title="切换API接口"
      :visible.sync="dialogVisible"
      top="50px"
      width="50%"
    >
      <div class="current-url">当前API：{{ currentUrl }}</div>
      <div class="table">
        <el-table
          :data="apiList"
          element-loading-text="Loading"
          empty-text="暂无数据"
          border
          row-key="userId"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="所属" prop="name" />
          <el-table-column label="接口" prop="url" />
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleTableRow(scope.row, 'select')"
              >切换</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >关 闭</el-button>
      </span> -->
    </el-dialog>
    <div class="api-select" @click="dialogVisible = true">
      <i class="el-icon-s-promotion el-icon" />
    </div>
  </div>
</template>
<script>

/*
 * @Author: gaochq
 * @Date: 2020-05-18 16:00:00
 * @Mark: 此文件用于动态切换Api，Api配置在src/config.js
 * 因需要对接不同的后端开发人员，并频繁更换配置文件繁琐并浪费时间，故开发此。
*/

/* eslint-disable no-undef */
import { baseUrlList } from '@/config'
import { getStorage, setStorage } from '@/utils/cookie'

export default {
  data() {
    return {
      isShow: false,
      dialogVisible: false,
      apiList: [],
      currentUrl: '',
    }
  },
  mounted() {
    this.isShow = env.showApiSelect
    const currentUrl = getStorage('apiUrl') || env.api
    this.currentUrl = currentUrl
    const newArr = []
    Object.keys(baseUrlList).forEach(key => {
      const _url = baseUrlList[key]
      let _name = key
      if (currentUrl === _url) {
        _name += '(正在使用)'
      }
      newArr.push({
        name: _name,
        url: _url,
      })
    })
    this.apiList = [...newArr]
  },
  methods: {
    handleTableRow(row, type) {
      if (type === 'select') {
        this.apiUrlChange(row.url)
      }
    },
    apiUrlChange(url) {
      console.log(url)
      if (!url) {
        return this.$message({
          message: '接口地址错误，无法切换',
          type: 'warning',
        })
      }
      this.$confirm('确定切换Api接口地址吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        setStorage('apiUrl', url)
        this.$message({
          message: `接口地址改为：${url} 刷新页面生效`,
          type: 'success',
          showClose: true,
          duration: 0,
        })
        // location.href = '' // 刷新页面
        this.$router.go() // 刷新当前页面
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.currentUrl === row.url) {
        return 'success-row'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.api-select-box {
  .api-select {
    .el-icon {
      font-size: 24px;
      color: #409eff;
    }
    cursor: pointer;
    position: fixed;
    right: 0;
    bottom: 10%;
    z-index:99999;
    background-color: #fff;
    border-radius: 99px 0 0 99px;
    padding: 4px 10px;
    border: 1px solid #dadada;
    border-right: 0;
    -moz-box-shadow: 0px 2px 12px #6b6b6b;
    -webkit-box-shadow: 0px 2px 12px #6b6b6b;
    box-shadow: 0px 2px 12px #6b6b6b;
  }
  .current-url {
    color: #409eff;
    margin-bottom: 10px;
  }
}
/deep/ .success-row {
  background: #f0f9eb;
}
</style>
