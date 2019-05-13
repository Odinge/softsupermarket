<template>
  <div class='detail'>
      <i class="el-icon-back return"  @click="goBack" title="返回上一页">返回</i>
    <div class="title">团队基本信息</div>
    <div>
      <span>团队名：</span>
      <span>{{detail_info.teamName}}</span>
    </div>
    <div>
      <span>团队简介：</span>
      <span>{{detail_info.description}}</span>
    </div>
    <div>
      <span>团队方向：</span>
      <span>{{detail_info.direction}}</span>
    </div>
    <el-collapse >
      <el-collapse-item title="团队成员信息" name="1">
        <div class="menDetail">
          <div class="info" >
            <div>队长：<span class="content">{{this.detail_info.captainInformation[0].name|formData}}</span> </div>
            <div>方向：<span class="content">{{this.detail_info.captainInformation[0].direction|formData}}</span> </div>
            <div>专业：<span class="content">{{this.detail_info.captainInformation[0].major|formData}}</span> </div>
            <div>学院：<span class="content">{{this.detail_info.captainInformation[0].department|formData}}</span> </div>
            <div>年级：<span class="content">{{this.detail_info.captainInformation[0].grade|formData}}</span> </div>
            <div>性别：<span class="content">{{this.detail_info.captainInformation[0].sex|formData}}</span> </div>
            <div>简介：<span class="content shortinfor" :title="this.detail_info.captainInformation[0].description">{{this.detail_info.captainInformation[0].description|formData}}</span> </div>
          </div>
          <div class="info" v-for="(data,key) in detail_info.memberInformation" :key="key">
            <div>队员：<span class="content">{{data.name}}</span> </div>
            <div>方向：<span class="content">{{data.direction|formData}}</span> </div>
            <div>专业：<span class="content">{{data.major|formData}}</span> </div>
            <div>学院：<span class="content">{{data.department|formData}}</span> </div>
            <div>年级：<span class="content">{{data.grade|formData}}</span> </div>
            <div>性别：<span class="content">{{data.sex|formData}}</span> </div>
            <div><span class="short">简介：</span><span class="content shortinfor" :title="data.description">{{data.description|formData}}</span> </div>
          </div>
          <div style="clear:both"></div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-collapse>
      <el-collapse-item title="团队作品" name="1">
        <div>作品1</div>
        <div>作品2</div>
      </el-collapse-item>

    </el-collapse>
    <div>
      <span>团队分数：</span>
      <span>{{this.detail_info.teamScore}}</span>
    </div>
    <div>
      <span>创建时间：</span>
      <span>{{this.detail_info.createTime}}</span>
    </div>
    <div>
      <span>队员数量：</span>
      <span>{{this.detail_info.number}}</span>
    </div>
  </div>
</template>
<script>
  import {  getTeam } from "@/api/team";
  export default {
    data() {
      return {
        detail_info: {}
      }
    },
    filters: {
      formData(value) {
        return value === '' ? '~' : value;
      }
    },
    methods: {
      getData() {
        let that=this;
        getTeam(this.teamId).then(function (res) {
          if (res.status === 0) {
            that.detail_info = res.data[0];
          }
          else{
            this.fail('获取数据失败!')
          }
        }).catch((err)=>{
          that.fail('获取数据失败!')
        })
      },
      success(msg) {
        this.$message({
          message: msg,
          type: 'success'
        });
      },
      fail(msg) {
        this.$message.error(msg);
      },
      goBack(){
        this.$router.go(-1);
      }
    },
    computed: {
      teamId() {
        return this.$route.params.id;
      }
    },
    created() {
      this.getData();
    }
  }
</script>
<style scoped>
  .detail{
    overflow: auto;
    width: 100%;
    background-color : white;
    padding-bottom: 20px;
    box-sizing: border-box;
  }
  .detail div {
    margin: 10px 0;
    padding-left: 20px;
    font-weight: bold;
  }
  .return {
    margin-left: 30px;
    font-size: 20px;
    cursor: pointer;
    color:white;
    margin-top: 5px;
    border: 1px solid white;
    background-color: #777;
    padding: 5px;
    border-radius: 5px;
  }
  .title {
    text-align: left;;
    line-height: 30px;
    background-color: #eee;
    border: 1px solid #ccc;
    font-weight: bold;
    margin: 0;
  }
  .menDetail{
    min-height:10px;
    background-color: #ccc;
  }
 .content {
   padding-left: 10px;
   white-space: nowrap;
   text-overflow: ellipsis;
   width: calc(100% - 80px);
   overflow-y: auto;
   overflow-x: hidden;
 }
 .short {
   font-weight: bold;
 }
  .detail .info {
    margin: 50px 20px;
    padding-right: 10px;
    float: left;
    max-width: 400px;
    min-width: 250px;
    box-shadow: 5px 5px 5px;
    background-color: white;
  }
  .shortinfor {
    display: inline-block;
    max-width: 200px;
    vertical-align: middle;
  }
</style>
