<template>
  <div>
    <div class="form" ref="form">
      <div class="new">Add Member</div>
        <div class="title">名字</div>
        <el-input  placeholder="请输入队员姓名"></el-input>
      <div class="title">方向</div>
      <el-row class="demo-autocomplete">
        <el-col :span="12">
          <el-autocomplete
            class="inline-input extend"
            v-model="xx"
            min="500"
            :fetch-suggestions="querySearch2"
            placeholder="请选择开发方向"
            @select="handleSelect"
          ></el-autocomplete>
        </el-col>
      </el-row>
     <div class="sex_box">
       <span class="sex">性别</span>
       <el-radio  label="1">男</el-radio>
       <el-radio label="2">女</el-radio>
     </div>
      <div class="title">学院</div>

      <el-row class="demo-autocomplete" >
        <el-col :span="12" >
          <el-autocomplete
            class="inline-input extend"
            v-model="xx"
            min="500"
            :fetch-suggestions="querySearch1"
            placeholder="请输入学院"
            @select="handleSelect"
          ></el-autocomplete>
        </el-col>
      </el-row>

      <div class="title">专业</div>
      <el-input  placeholder="请输入队员专业"  clearable></el-input>
      <div class="title">入学年份</div>
      <el-input  placeholder="请输入队员入学年份"  clearable></el-input>
      <div class="title">简介</div>
      <el-input  placeholder="请输入队员简介"
                 type="textarea"
                 resize="none"
                 :rows="2"></el-input>
      <div class="buttons">
        <span class="submit button">提交</span>
        <span class="cancel button" @click="cancel">取消</span>
      </div>
    </div>
    <div class="full_shadow"></div>

  </div>
</template>
<script>
  export default {
    data(){
      return{
        add_info:{},
        xueYuan:[
          {"value": "理学院"},
          {"value": "生命科学学院"},
          {"value": "机电学院"},
          {"value": "食品学院"},
          {"value": "信息工程学院"},
          {"value": "水利水电学院"},
          {"value": "人文学院"},
          {"value": "体育学院"},
          {"value": "法学院"},
          {"value": "艺术与传媒学院"},
          {"value": "农学院"},
          {"value": "动物科技学院"},
          {"value": "动物医学院"},
          {"value": "林学院"},
          {"value": "园艺学院"},
          {"value": "资源学院"},
          {"value": "环境学院"},
          {"value": "经济学院"},
          {"value": "管理学院"},
          {"value": "风景园林学院"},
          {"value": "土木工程学院"},
          {"value": "旅游学院"},
          {"value": "商学院"},

        ],
        direction:[
          {"value": "java"},
          {"value": "php"},
          {"value": "前端"},
          {"value": "python"},
          {"value": "c"},
          {"value": "c++"},
          {"value": "C#"},
          {"value": "其他"},
        ]
      }
    },
    methods:{
      querySearch1(queryString, cb) {
        var xueYuan = this.xueYuan;
        var results = queryString ? xueYuan.filter(this.createFilter(queryString)) : xueYuan;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      querySearch2(queryString, cb) {
        var  direction = this.direction;
        var results = queryString ?  direction.filter(this.createFilter(queryString)) :  direction;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      cancel(){
        this.add_info={};
        this.$emit('hidden')
      }
    },
    mounted() {
      this.$refs.form.style.top='50%';
    }
  }
</script>
<style>
  .extend{
    width: 520px;
  }
  .form {
    width: 520px;
    height: 580px;
    background-color: white;
    box-shadow: 4px 4px 4px grey;
    z-index: 110;
    border-radius: 20px;
    position: fixed;
    left: 50%;
    top:-20%;
    transition: all 0.5s;
    transform: translate(-50%,-50%);
    padding: 30px;
  }
  .full_shadow {
    position: fixed;
    left:0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 109;
    background-color: rgba(1,1,1,0.3);
  }
  .title {
    margin-bottom: 5px;
    margin-left: 10px;
    margin-top: 15px;
  }
  .new {
    font-size: 25px;
    font-weight: bold;
    color:#555;
    text-align: center;
  }
  .new:hover {
    color:#222;
  }
  .buttons {
    position: absolute;
    width: 500px;
    text-align: center;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%);
  }
  .sex_box {
    margin: 20px 0;
  }
  .sex {
    margin:0 10px;
  }
  .button {
    display: inline-block;
    width: 100px;
    height: 30px;
    background-color: #aaa;
    color:white;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
  }
  .button:hover {
    background-color: #777;
  }
  .submit {
    margin-right: 30px;
  }
  .cancel {
    margin-left: 30px;
  }
</style>
