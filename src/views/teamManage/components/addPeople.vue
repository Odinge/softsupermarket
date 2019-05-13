<template>
  <div>
    <div class="form" ref="form">
      <div class="warm" ref="warm">
        <div class="leftLine"></div>
        <div class="rightLine"></div>
        <div class="warm_msg" ref="warm_msg">{{warm_msg}}</div>
      </div>
      <div class="new">Add Member</div>
        <div class="title">名字</div>
        <el-input  placeholder="请输入队员姓名"
                   clearable
                   v-model="add_info.name"
                   @blur="check('name')"
                   ref="name"
                   :title="err.name"
        ></el-input>

        <div class="title">学号</div>
        <el-input  placeholder="请输入学号"
                   clearable
                   @blur="check('studentId')"
                   v-model="add_info.studentId"
                   :title="err.studentId"
                   ref="studentId"></el-input>
      <div class="tip">
        <p>注意事项：</p>
        <p>新增的成员需已登录软件超市并录入个人信息</p>
        <p>请确保姓名和学号一致。</p>
      </div>
      <div class="buttons">
        <span class="submit button" @click="submit">提交</span>
        <span class="cancel button" @click="cancel">取消</span>
      </div>
    </div>
    <div class="full_shadow"></div>

  </div>
</template>
<script>
  import {  addTeamMate } from "@/api/team";
  export default {
    props:{teamId:{require:true},studentId:{default:[]}},
    data(){
      return{
        check_data:{name:'', studentId:''},
        add_info:{name:'',studentId:''},
        err:{name:'',studentId:''},
        isClick:false,/*记录是否点击，防止重复提交*/
        warm_msg:'',
        department:[
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
      submit(){
        let warm=false;  /*默认数据不合法*/
        let that=this;
        if(this.isClick){
          this.warm_msg='亲，提交过于频繁，请稍后再试哦';
          this.warm();
          return false;
        }
        that.isClick=true;
        let keys=Object.keys(this.check_data);
        for(let i=0;i<keys.length;i++){   /*将输入的数据再次检查，全部为true说明都是合法的*/
            if(!this.check_data[keys[i]]){
              this.$refs[keys[i]].$el.classList.add('color');
              warm=true;
            }
        }
        if(warm){   /*数据不合法，出现提示框*/
          this.warm_msg='请检查数据是否正确后再提交！';
          this.warm();
          that.isClick=false;
        }
        else {
          this.add_info.teamId=this.teamId;
          addTeamMate(this.add_info.teamId,this.add_info.name,this.add_info.studentId).then(function (res) {
            console.log(res)
            if (res.status === 0 && res.msg === '成功') {
              that.$emit('success','添加成员成功！');/*发生操作成功事件，显示操作成功*/
              that.cancel();
            }
            else {
              that.isClick=false;
              that.fail('提交失败,请查看注意事项！');
            }
          }).catch((err) => {
            that.isClick=false;
            that.fail('提交失败，请稍后重试！');
          })
          }},
      warm(){
        let that=this;
        this.$refs.warm.style.top=-50+'px';
        setTimeout(function () {
          that.$refs.warm.style.top=-350+'px';
        },2000)
      },
      check(name){
        if (name === 'name') {
          if (this.add_info.name === '') {
            this.$refs.name.$el.classList.add('color');
            this.err.name = '名字不能为空!';
            this.check_data[name]=false;
          }
          else {
            let pattern = /^[\u4e00-\u9fa5]+$/;
            if (pattern.test(this.add_info.name) === false || this.add_info.name.length > 10) {
              this.$refs.name.$el.classList.add('color');
              this.err.name = '名字中只能包含汉字且长度应小于10！';
              this.check_data[name]=false;
            }
            else {
              this.$refs.name.$el.classList.remove('color');
              this.err.name = '';
              this.check_data[name]=true;
            }
          }
        }
        else if(name==='direction'||name==='department'){
          let that=this;
          setTimeout(function () {
            for(let i=0;i<that[name].length;i++){
              if(that.add_info[name]===that[name][i].value){
                that.$refs[name].$el.classList.remove('color');
                that.err[name]='';
                that.check_data[name]=true;
                break
              }
              else{
                if(i===that[name].length-1){
                    that.$refs[name].$el.classList.add('color');
                    if(name==='direction'){
                      that.err[name]='请在已有方向中选择！';
                    }
                    else{
                      that.err[name]='请在已有学院中选择！';
                    }
                    this.check_data[name]=false;
                }

              }
            }
          },500)
        }
        else if(name==='telephone'){
          if(this.add_info.telephone===''){
            this.$refs.telephone.$el.classList.add('color');
            this.err.telephone='电话号码不能为空！';
            this.check_data[name]=false;
          }
          else {
            let numReg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!numReg.test(this.add_info.telephone)) {
              this.$refs.telephone.$el.classList.add('color');
              this.err.telephone = '请输入正确的11位电话号码！';
            }
            else {
              this.$refs.telephone.$el.classList.remove('color');
              this.check_data[name] = true;
            }
          }
        }
        else if(name==='major'){
          if(this.add_info.major===''){
            this.$refs.major.$el.classList.add('color');
            this.err.major='专业不能为空！';
            this.check_data[name]=false;
          }
          else{
            if(this.add_info.major.length>15){
              this.$refs.major.$el.classList.add('color');
              this.err.major='专业名长度应小于15！';
              this.check_data[name]=false;
            }
            else{
              this.$refs.major.$el.classList.remove('color');
              this.check_data[name]=true;
            }
          }
        }
        else if(name==='studentId'){
          if(this.add_info.studentId===''){
            this.$refs.studentId.$el.classList.add('color');
            this.err.studentId='学号不能为空！';
            this.check_data[name]=false;
          }
          else {
            let pattern=/^20\d{7}$/;
            let result=pattern.test(this.add_info.studentId);
            if(!result){
              this.$refs.studentId.$el.classList.add('color');
              this.err.studentId='请输入正确入学号,如2018xxxxx';
              this.check_data[name]=false;
            }
            else if(this.studentId.includes(this.add_info.studentId)){
              this.$refs.studentId.$el.classList.add('color');
              this.err.studentId='学号与已有队友重复，请检查后重新输入！';
              this.check_data[name]=false;
            }
            else{
              this.$refs.studentId.$el.classList.remove('color');
              this.check_data[name]=true;
            }
          }
        }
        else if(name==='description'){
          if(this.add_info.description.length>40){
            this.$refs.description.$el.classList.add('textarea_color');
            this.err.description='亲，描述不能大于40个字哦！';
            this.check_data[name]=false;
          }
          else{
            this.$refs.description.$el.classList.remove('textarea_color');
            this.check_data[name]=true;
          }
        }
      },
      querySearch1(queryString, cb) {
        var department = this.department;
        var results = queryString ? department.filter(this.createFilter(queryString)) : department;
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
      },
      fail(msg) {
        this.$message.error(msg);
      },
    },
    mounted() {
      let that=this;
      setTimeout(function () {
        that.$refs.form.style.top='45%';
      },50)
    }
  }
</script>
<style>
  .extend{
    width: 520px;
  }
  .color .el-input__inner{
    color:red!important;
    border: 1px solid red;
  }
  .textarea_color .el-textarea__inner{
    color:red!important;
    border: 1px solid red;
  }
  .form {
    width: 520px;
    height: 520px;
    background-color: white;
    box-shadow: 4px 4px 4px grey;
    z-index: 110;
    border-radius: 20px;
    position: fixed;
    left: 50%;
    top:-10%;
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
  .warm {
    position: absolute;
    top: -350px;
    left: 140px;
    z-index: 500;
    transition: all 0.6s;
  }
  .warm_msg{
    color:white;
    background-color: #92dbfc;
    border-radius: 5px;
    transition: all 0.6s;
    box-shadow: 4px 4px 4px rgba(1,1,1,0.6);
    line-height: 70px;
    text-align: center;
    font-size: 20px;
    width: 300px;
    height: 70px;
  }
  .leftLine{
    position: absolute;
    height: 350px;
    width: 10px;
    left: 20px;
    background-color: #d4cf9e;
    bottom: 70px;
  }
  .rightLine{
    position: absolute;
    height: 350px;
    width: 10px;
    right: 20px;
    background-color: #f5f1cc;
    bottom: 70px;
  }
  .tip{
    margin-top: 20px;
    line-height: 30px;
  }
  .tip p{
    font-weight: bold;
  }
</style>
