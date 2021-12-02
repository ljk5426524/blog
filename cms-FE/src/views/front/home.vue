<template>
  <div class="content">
    <el-header>
      <div class="header-content">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-left"
          mode="horizontal"
          @select="handleSelect"
        >
          <template v-for="(item, index) in menuData">
            <el-menu-item
              v-if="!item.children"
              :index="index + 'item'"
              :key="index"
            >
              {{ item.title }}
            </el-menu-item>
            <el-submenu v-else :index="index + 'item'" :key="index + 'child'">
              <template
                v-for="(childItem, childIndex) in item.children"
                :index="index"
              >
                <template slot="title">{{ item.title }}</template>
                <el-menu-item
                  :index="childIndex + 'childitem'"
                  :key="childIndex"
                >
                  {{ childItem.title }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-menu>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-right"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="2">
            <i class="el-icon-bell"></i>
          </el-menu-item>
          <el-menu-item index="3">登录</el-menu-item>
          <el-menu-item index="4">注册</el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-main>
      <el-row class="main-content" :gutter="30">
        <el-col :span="18" class="content-left">
          <el-card class="content-item" v-for="o in 4" :key="o" shadow="hover">
            <div class="text item">
              <h3>文章标题</h3>
              <p class="art-text">
                文章内容文章内容文章内容文章内容文章内容文章内容
              </p>
              <div class="art-info">
                <ul>
                  <li>
                    <img src="" alt="" />
                    <span>作者名</span>
                  </li>
                  <li><i class="el-icon-time"></i> <span>2021-12-2</span></li>
                  <li>
                    <i class="el-icon-chat-dot-square"></i>
                    <span>评论</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" class="content-right">
          <el-card
            class="content-item"
            v-for="o in 2"
            :key="o"
            shadow="hover"
            style="height: 200px"
          >
            <div v-for="o in 4" :key="o" class="text item">
              {{ '列表内容 ' + o }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <div class="footer-content">
        <div class="footer-copyright">
          <p>
            Copyright © 2021
            <a class="site-link" href="#" title="**的个人博客" rel="home"
              >***</a
            >

            <a href="#" rel="external nofollow" target="_blank"
              >皖ICP备19001116号-1</a
            >
          </p>
          <p>
            Designed by
            <a href="#" target="_blank">***.com</a>
          </p>
        </div>
        <div class="social-footer">
          <a class="i-weibo" href="#" target="_blank"> </a>
          <a class="i-mail" href="#" target="_blank">youxiang</a>
          <a class="i-weChat" href="#">weixin</a>
        </div>
        <el-backtop target=".footer-content" :bottom="100">
          <div
            style="
               {
                height: 100%;
                width: 100%;
                background-color: #f2f5f6;
                box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
                text-align: center;
                line-height: 40px;
                color: #1989fa;
              }
            "
          >
            UP
          </div>
        </el-backtop>
      </div>
    </el-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0', // 展开的菜单
      pagination: {},
      loading: false,
      // menu
      menuData: [
        {
          key: '1',
          title: 'Option 1',
        },
        {
          key: '2',
          title: 'Option 2',
          children: [
            {
              key: '2.1',
              title: 'Option 2-1',
              children: [{ key: '2.1.1', title: 'Option 2.1.1' }],
            },
          ],
        },
        {
          key: '3',
          title: 'Option 3',
          children: [
            {
              key: '3.1',
              title: 'Option 3-1',
              children: [{ key: '3.1.1', title: 'Option 3.1.1' }],
            },
          ],
        },
        {
          key: '4',
          title: 'Option 4',
        },
        {
          key: '5',
          title: 'Option 5',
        },
      ],
      current: ['mail'],
      openKeys: ['sub1'],
    }
  },
  watch: {},
  created() {},
  methods: {
    handleSelect() {},
    handleClick(e) {
      console.log('click', e)
    },
    titleClick(e) {
      console.log('titleClick', e)
    },
    handleSet() {
      let newArr = []
      this.fileList.filter((item) => {})
      console.log('fileList-----', this.fileList, '---fileList-set----', newArr)
    },
    showModal() {
      this.visible = true
    },
    handleOk() {
      console.log('ok')
    },
    handleCancel() {
      this.visible = false
    },
    // 表单提交
    submit() {
      this.form.validateFields((err) => {
        if (!err) {
          console.log('success')
        } else {
          console.log('err---', err)
        }
      })
    },
    handleDel(data) {
      console.log(data, '-----')
      this.$message.success(`delData:,${data.name}`)
    },
    handleEdit(data) {
      console.log('data---', data)
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  background-color: #f6f6f6;
  /deep/.el-header {
    background-color: #fff;
    display: flex;
    justify-content: center;
    border-bottom: solid 1px #e6e6e6;
    .header-content {
      display: flex;
      justify-content: space-between;
      width: 1170px;
      ul.el-menu--horizontal {
        border: none;
      }
      .el-menu--horizontal > .el-menu-item,
      .el-menu--horizontal > .el-submenu .el-submenu__title {
        color: #404040;
        font-size: 15px;
      }
      .el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
      .el-menu--horizontal > .el-submenu:hover {
        font-weight: bold;
      }
      .el-menu-right {
        .el-menu-item {
          padding-left: 0;
        }
        .el-menu-item:after {
          content: '|';
          padding-left: 10px;
          color: #e5e5e5;
        }
        .el-menu-item:last-child:after {
          content: '';
        }
      }
    }
  }
  .el-main {
    display: flex;
    justify-content: center;
    min-height: 757px;
    .main-content {
      width: 1170px;
      display: flex;
      justify-content: center;
      // border: 1px solid rgba(51, 51, 51, 0.199);
      .content-lfet {
        width: 70%;
      }
      .content-item {
        margin: 10px 0;
        .art-text {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 15px;
          color: #566573;
        }
        .art-info {
          ul {
            padding: 0;
            display: flex;
            li {
              font-size: 12px;
              letter-spacing: 0.2px;
              padding: 0;
              margin: 0 5px 0 0;
              color: #748594;
              position: relative;
              line-height: 1.5;
              display: inline-block;
            }
          }
        }
      }
    }
  }
  /deep/.el-footer {
    height: auto !important;
    position: relative;
    padding: 25px 0;
    background-color: #282828;
    color: #ababab;
    width: 100%;
    display: flex;
    justify-content: center;
    a {
      color: #ddd;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      width: 1170px;
      .social-footer {
        .i-weibo {
          background-image: url('../../assets/images/weibo.png');
          width: 20px;
          height: 20px;
        }
        .i-mail {
        }
        .i-weChat {
        }
      }
    }
  }
}
</style>