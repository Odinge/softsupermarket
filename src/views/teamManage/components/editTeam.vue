<template>
  <div>
    <div class="form" ref="form">
      <div class="warm" ref="warm">
        <div class="leftLine"></div>
        <div class="rightLine"></div>
        <div class="warm_msg" ref="warm_msg">{{warm_msg}}</div>
      </div>
      <div class="new">Edit team information</div>
      <div class="title">团队名</div>
      <el-input  placeholder="请输入团队姓名"
                 clearable
                 v-model="add_info.teamName"
                 @blur="check('teamName')"
                 ref="teamName"
                 :title="err.teamName"
      ></el-input>
      <div class="title" >方向</div>
      <el-row class="demo-autocomplete">
        <el-col :span="12">
          <el-autocomplete
            clearable
            class="inline-input extend"
            v-model="add_info.direction"
            ref="direction"
            :title="err.direction"
            @blur="check('direction')"
            min="500"
            :fetch-suggestions="querySearch2"
            placeholder="请选择团队开发方向"
          ></el-autocomplete>
        </el-col>
      </el-row>
      <div class="title">简介(可选)</div>
      <el-input  placeholder="请输入团队简介"
                 type="textarea"
                 v-model="add_info.description"
                 @blur="check('description')"
                 resize="none"
                 :title="err.description"
                 ref="description"
                 :rows="2"></el-input>
      <div class="buttons">
        <span class="submit button" @click="submit">提交</span>
        <span class="cancel button" @click="cancel">取消</span>
      </div>
    </div>
    <div class="full_shadow"></div>

  </div>
</template>
<script>
  import { getAllTeamDirection } from "@/api/team";
  import { modifyApplicaiton } from "@/api/team";
  export default {
    props:{teamId:{require:true},editInformation:{default:{}}},
    data(){
      return{
        // check_data:{name:'', direction:'', sex:true, telephone:'',studentId:'',department:'', major:'', description:true},
        // add_info:{name:'', direction:'', sex:'男', telephone:'',studentId:'',department:'', major:'', description:''},
        // err:{name:'', direction:'', sex:'',telephone:'',studentId:'',department:'', major:'',  description:''},
        check_data:{teamName:'', direction:'',description:true},
        add_info:{teamName:'', direction:'',description:''},
        err:{teamName:'', direction:'',description:''},
        isClick:false,/*记录是否点击，防止重复提交*/
        warm_msg:'',
        compareData:{},
        teamDirection:[],
        new_data:{},
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

        ]
      }
    },
    methods:{
      getDirection(){
        let that=this;
        getAllTeamDirection().then((res)=>{ //获取团队方向
          console.log(res)
          if(res.status===0){
            let data=res.data;
            for(let i=0;i<data.length;i++){
              let temp={};
              temp["value"]=data[i].directionName;
              this.teamDirection.push(data[i].directionName);
              this.direction.push(temp); /*产生团队方向对象*/
            }
            this.add_info.direction=this.editInformation[0].direction||'暂无';
            this.compareData=JSON.parse(JSON.stringify(that.add_info)); //原数据，用于数据对比，看是否更改
            let name=['teamName', 'direction','description'];
            for(let i=0;i<name.length;i++){
              this.check(name[i])
            }
          }
          else{
            this.fail('糟糕,获取团队方向列表失败！')
          }
        });
      },
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
          let place=[];
          let content={};
          let origin={};
          console.log( 2222)
          if(Object.keys(this.new_data).length===0){
            this.fail('请修改数据后再提交！');
            that.isClick=false;
            return false;
          };
          for(let key in this.new_data){
            let temKey=key;
            let temp='team_'+temKey;
            place.push(temp);
            origin[temp]=this.compareData[key];
            content[temp]=this.new_data[key];
          }

          origin=JSON.stringify(origin);
          content=JSON.stringify(content);
          // console.log(place)
          // console.log(content)
          modifyApplicaiton(this.teamId,'update',place,content,origin).then((res)=>{
            console.log('修改团队资料的返回值：');
            console.log(res);
            if (res.status === 0 && res.msg === '成功') {
              that.$emit('success','你的修改申请已提交，请耐心等待！');/*发生操作成功事件，显示操作成功*/
              that.cancel();
            }
            else {
              that.isClick=false;
              that.fail('提交修改成员申请失败，请稍后重试！');
            }
          }).catch((err) => {
            that.isClick=false;
            that.fail('提交修改成员申请失败，请稍后重试！');
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
        let that=this;
        if (name === 'teamName') {
          if (this.add_info.teamName === '') {
            this.$refs.teamName.$el.classList.add('color');
            this.err.teamName = '名字不能为空!';
            this.check_data[name]=false;
          }
          else {
            if (this.add_info.teamName.length > 15) {
              this.$refs.teamName.$el.classList.add('color');
              this.err.teamName = '团队名字长度应小于15！';
              this.check_data[name]=false;
            }
            else {
              this.$refs.teamName.$el.classList.remove('color');
              this.err.teamName = '';
              this.check_data[name]=true;
              if(that.add_info[name]!==that.compareData[name]){
                that.new_data[name]=that.add_info[name];
              }
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
                if(that.check_data[name]===true){
                  if(that.add_info[name]!==that.compareData[name]){
                    that.new_data[name]=that.add_info[name];
                  }
                }
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
                  that.check_data[name]=false;
                }
              }
            }
          },500);

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
            if(that.check_data[name]===true){
              if(that.add_info[name]!==that.compareData[name]){
                that.new_data[name]=that.add_info[name];
              }
            }
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
      this.getDirection();
      this.add_info.teamName=this.editInformation[0].teamName;
      this.add_info.description=this.editInformation[0].description;
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
