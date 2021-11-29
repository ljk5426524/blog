<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" @command="handleCommand">
        <div class="avatar-wrapper">
          <img
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            class="user-avatar"
          >
          <i class="el-icon-caret-bottom" />
          <span class="user-name">{{ userName || '未知用户' }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item command="modifyPwd">
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      title="修改密码"
      width="30%"
      append-to-body
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @closed="resetForm('pwdModifyForm')"
    >
      <el-form
        ref="pwdModifyForm"
        :model="pwdModifyForm"
        :rules="pwdModifyFormRules"
      >
        <!-- <el-form-item
          label="原密码"
          :label-width="formLabelWidth"
          prop="originPwd"
        >
          <el-input
            v-model="pwdModifyForm.originPwd"
            placeholder="请输入原密码"
            auto-complete="off"
            type="password"
          />
        </el-form-item> -->
        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
          prop="newPwd"
        >
          <el-input
            v-model="pwdModifyForm.newPwd"
            placeholder="请输入新密码"
            auto-complete="off"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="确认新密码"
          :label-width="formLabelWidth"
          prop="newPwd2"
        >
          <el-input
            v-model="pwdModifyForm.newPwd2"
            placeholder="请再次输入新密码"
            auto-complete="off"
            type="password"
          />
        </el-form-item>
        <div class="tips">备注：密码必须是由6-16位的数字和字母组成</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submitForm('pwdModifyForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { MessageBox, Message } from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getCookie, getCookieJSON, getStorageJSON } from '@/utils/cookie'

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      dialogFormVisible: false,
      submitLoading: false,
      pwdModifyForm: {
        originPwd: '',
        newPwd: '',
        newPwd2: '',
      },
      formLabelWidth: '100px',
      pwdModifyFormRules: {
        originPwd: [
          {
            required: true,
            message: '请输入原密码',
          },
        ],
        newPwd: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur',
          },
        ],
        newPwd2: [
          {
            required: true,
            message: '请确认新密码',
            trigger: 'blur',
          },
        ],
      },
    }
  },

  computed: {
    ...mapGetters(['sidebar']),
    avatar() {
      return getCookie('avatar')
    },
    userName() {
      return getCookie('username')
    },
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    async logout() {
      await this.$store.dispatch('user/resetToken')

      this.$router.push(`/login`)
    },

    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'modifyPwd':
          this.dialogFormVisible = true
          break
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { user_id } = getStorageJSON('userInfo')
          const { newPwd, newPwd2 } = this[formName]
          let errorMsg = ''

          if (newPwd !== newPwd2) {
            errorMsg = '两次密码不一致'
          }

          if (errorMsg) {
            return Message({
              message: errorMsg,
              type: 'error',
              duration: 3 * 1000,
            })
          }

          this.submitLoading = true

          this.$api
            .changePassword({
              user_id,
              password: newPwd,
            })
            .then(response => {
              this.dialogFormVisible = false
              this.submitLoading = false

              this.$message({
                message: `修改成功！`,
                type: 'success',
                onClose: () => {
                  this.logout()
                },
              })
            })
            .catch(error => {
              this.submitLoading = false
              // console.log(error)
            })
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

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.tips {
  color: #999;
  font-size: 14px;
  margin-left: 100px;
}
</style>
