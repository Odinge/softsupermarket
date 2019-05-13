<template>
  <div class="notice">
    <div class="nav">
      <el-menu
        default-active="publish"
        class="el-menu-vertical-demo"
        background-color="white"
        @select="handleSelect"
      >
        <el-menu-item index="publish" >
          <i class="el-icon-edit-outline"></i>
          <span slot="title">发布公告</span>
        </el-menu-item>
        <el-menu-item index="allNotice">
          <i class="el-icon-document"></i>
          <span slot="title">所有公告</span>
        </el-menu-item>
        <el-menu-item index="dustbin">
          <i class="el-icon-delete"></i>
          <span slot="title">回收站</span>
        </el-menu-item>
      </el-menu>
    </div>
    <router-view class="view"></router-view>
  </div>
</template>
<script>


//  import publish from'@/views/notice/components/thePublish'
//  import allNotice from'@/views/notice/components/theAllNotice'
//  import dustbin from'@/views/notice/components/theDustbin'
  export default {
    // components:{publish,allNotice,dustbin},
    data() {
      return {
      }
    },
    methods: {
      handleSelect(key) {
        let path='/notice/'+key;
        this.$router.push({path:path})
      }
    },
    mounted() {

    },
  }
</script>
<style scoped>
  .notice {
    position: relative;
  }
  .nav {
    width: 200px;
    height:100%;
    background-color: white;
    position: absolute;
    left: 10px;
    top: 20px;
  }
  .view{
    width:80%;
    margin-left: 230px;
    margin-top: 20px;
  }
</style>
