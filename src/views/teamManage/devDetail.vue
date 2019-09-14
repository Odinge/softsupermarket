<template>
<div>
    <div class='detail'>
      <i class="el-icon-back return"  @click="goBack" title="返回上一页">返回</i>
      <!--<el-button type="success" @click="save" class="save">保存</el-button>-->
      <div class="title">团队基本信息</div>
        <div class="center">
          <span>团队名：</span>
          <span>{{copyInfo[0].teamName}}</span>
          <span class="iconfont edit" @click="editTeam()">&#xe650;</span>
        </div>
        <div class="center">
          <span>团队简介：</span>
          <span>{{copyInfo[0].description}}</span>
        </div>
      <div class="center">
        <span>团队方向：</span>
        <span>{{teamDirection[copyInfo[0].direction]}}</span>
      </div>
      <div>
        <span class="center">团队成员信息：
          <i class="el-icon-caret-top up_down" v-if="up_down_show.member" @click="up('member')"></i>
        <i class="el-icon-caret-bottom up_down" v-if="!up_down_show.member" @click="down('member')"></i>
        </span>

        <div  class="member_info">
          <div class="menDetail"  ref="member_info">
            <div class="add">
              <span class="iconfont " title="新增成员" @click="add">&#xe61a;</span>
            </div>
            <div class="info">
              <span class="iconfont captainEdit" @click="editMember(-1)">&#xe650;</span>
              <div>队长：
                <span>{{copyInfo[0].captainInformation[0].name}}</span>
              </div>
              <div>方向: <span>{{copyInfo[0].captainInformation[0].direction}}</span> </div>
              <div>专业：  <span>{{copyInfo[0].captainInformation[0].major}}</span></div>
              <div>学号： <span>{{copyInfo[0].captainInformation[0].studentId}}</span> </div>
              <div>学院：  <span>{{copyInfo[0].captainInformation[0].department}}</span></div>
              <div>电话： <span>{{copyInfo[0].captainInformation[0].telNumber}}</span></div>
              <div>性别：  <span>{{copyInfo[0].captainInformation[0].sex}}</span></div>

              <div>简介： <textarea class="content shortinfor"
                                 v-model="copyInfo[0].captainInformation[0].description">
                        </textarea></div>
            </div>
            <div class="info" v-for="(data,key) in copyInfo[0].memberInformation" :key="key">
              <div>队员：
                <span>{{data.name}}</span>
                <span class="el-icon-close delete" @click="deleteMember(key)"> </span>
                <span class="iconfont edit" @click="editMember(key)">&#xe650;</span>
              </div>
              <div>方向: <span>{{data.direction}}</span> </div>
              <div>专业：  <span>{{data.major}}</span></div>
              <div>学号： <span>{{data.studentId}}</span> </div>
              <div>学院：  <span>{{data.department}}</span></div>
              <div>电话： <span>{{data.telNumber}}</span></div>
              <div>性别：  <span>{{data.sex}}</span></div>
              <div><span class="short">简介：</span><textarea class="content shortinfor"
                                                           :title="data.description"
                                                           v-model="data.description">{{data.description}}</textarea> </div>
            </div>
            <div style="clear:both"></div>
          </div>
        </div>
      </div>
      <el-collapse  @change="handleChange">
        <el-collapse-item title="作品" name="1">
          <div class="iconfont addProduct" title="新增作品" @click="addDialogVisible=true">&#xe61a;</div>
          <ul>
            <li v-for="(item,index) of works" class="work">
              <span class="el-icon-close delete" @click="deleteWork(item.id)"> </span>
              <div class="workTitle">{{item.title}}</div>
              <img :src="item.filename" alt="item.title">
              <p :title="item.represent">{{item.represent}}</p>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>

      <el-dialog
        title="上传图片"
        :visible.sync="imgDialogVisible"
        width="50%"
   >
        <div class="cropper-container">
          <VueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            @realTime="realTime"
          ></VueCropper>
        </div>
        <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>

  <div class="do">
         <el-button type="primary" plain @click="changeScale(1)">放大</el-button>
         <el-button type="success" plain @click="changeScale(-1)">缩小</el-button>
         <el-button type="success" plain @click="rotateLeft">左旋转</el-button>
         <el-button type="info" plain @click="rotateRight">右旋转</el-button>

       </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="imgCancel">取 消</el-button>
    <el-button type="primary" @click="imgDialogVisible = false">确 定</el-button>
    </span>
      </el-dialog>


      <el-dialog
        title="上传作品"
        :visible.sync="addDialogVisible"
        width="30%"
        class="dialog">
        <div>作品名称：</div>
        <el-input v-model="productName" placeholder="请输入作品名称"></el-input>
        <div> 作品描述：</div>
       <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入作品描述"
          v-model="productDescription">
        </el-input>
        <input type="file" @change="uploadImg($event)" class="file" ref="file">
        <span slot="footer" class="dialog-footer">
    <el-button @click="addCancel">取 消</el-button>
    <el-button type="primary" @click="uploadProduct" v-loading="saveLoading" element-loading-background="rgba(255, 255, 255, 0.3)"> 保存</el-button>
  </span>
      </el-dialog>

      <div class="center">
        <span>团队分数：</span>
        <span>{{this.copyInfo[0].teamScore|formData}}</span>
      </div>
      <div class="center">
        <span>创建时间：</span>
        <span>{{this.copyInfo[0].createTime|formData}}</span>
      </div>
      <div class="center">
        <span>队员数量：</span>
        <span>{{this.copyInfo[0].number|formData}}</span>
      </div>
</div>
  <addPeople @hidden="hidden"
             v-if="show_if"
             key="add"
             :teamId="teamId"
             :studentId="studentId"
             @success="addSuccess"
             @fail="fail('操作失败')"
  ></addPeople>
  <editMember  @hidden="hidden"
               key="edit"
             v-if="edit_show"
             :teamId="teamId"
             :studentId="studentId"
             :editInformation="editInformation"
             @success="addSuccess"
             @fail="fail('操作失败')"
  ></editMember >
  <editTeam @hidden="hidden"
               key="team"
               v-if="edit_team_show"
               :teamId="teamId"
               :editInformation="detail_info"
               @success="addSuccess"
               :teamDirection="teamDirection"
               @fail="fail('操作失败')"
  ></editTeam>

</div>
</template>
<script>
  import addPeople from '@/views/teamManage/components/addPeople.vue'
  import editMember from '@/views/teamManage/components/editMember.vue'
  import editTeam from '@/views/teamManage/components/editTeam.vue'
  import { getTeam,deleteTeamMate,getAllTeamDirection,getAllUserDirection,uploadProduct , getTeamWork,deleteTeamWork} from "@/api/team";
  import {VueCropper} from 'vue-cropper'
  export default {
    components:{
      addPeople,
      editMember,
      editTeam,
      VueCropper
    },
    props: ['detail_info', 'copyInfo'],
    data() {
      return {
        uploading:false,
        saveLoading:false,
        works:[],
        fileName:'',
        productName:'',
        productDescription:'',
        up_down_show: {member:false, products:false,},
        show_if:false,  /*新增成员组件显示与否*/
        edit_show:false,//编辑成员信息
        edit_team_show:false,//编辑团队资料
        studentId:[],  /*记录所有学生学号，验证数据防止重复添加人员*/
        teamDirection:[], //团队方向
        userDirection:[],  //用户方向
        editInformation:{},
        activeNames: ['1'],
        addDialogVisible:false,
        imgDialogVisible:false,
        headImg:'',
        //剪切图片上传
        crap: false,
        previews: {},
        option: {
          img: '',
          outputSize:1, //剪切后的图片质量（0.1-1）
          full: false,//输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 250,
          autoCropHeight: 250,
          fixedBox: true,
        },

      }
    },
    filters: {
      formData(value) {
        return value === '' ? '~' : value;
      }
    },
    methods: {
      deleteWork(id){
        let that=this;
        this.$confirm('是否确定删除该作品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteTeamWork(id).then(function (res) {
            if(res.status===0){
              that.success('删除作品成功!');
              that.handleGetWork(that.teamId);
            }
            else{
              console.log(res)
              that.$message.error('哦哦，删除作品失败');
            }
          }).catch(err=>{
            console.log(err)
            that.$message.error('糟糕，删除作品失败');
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      imgCancel(){
        this.imgDialogVisible = false;
        this.option.img='';
        this.$refs.file.value=''
      },
      addCancel(){
        this.addDialogVisible=false;
        this.fileName='';
        this.productName='';
        this.productDescription='';
        this.option.img='';
        this.$refs.file.value=''
      },
      uploadProduct(){
        if(this.uploading){
          return false
        }
        if(!this.productName){
          this.$message.error('作品名不能为空');
          return false;
        }
        if(!this.productDescription){
          this.$message.error('作品描述不能为空');
          return false;
        }
        let formData = new FormData();

        this.$refs.cropper.getCropBlob((data) => {
          if(!data){
            this.$message.error('上传图片不能为空');
            return false;
          }
          let file = new window.File([data], this.fileName);
          formData.append('teamId',this.teamId);
          formData.append('img',file);
          formData.append('imgFunction','团队展示');
          formData.append('represent',this.productDescription);
          formData.append('title',this.productName);
          this.uploading=true;
          this.saveLoading=true;
          uploadProduct(formData).then(res=>{
            if(res.status===0){
              this.$message.success('上传图片成功');
              this.handleGetWork(this.teamId);
              this.fileName='';
              this.productName='';
              this.productDescription='';
              this.option.img='';
              this.$refs.file.value='';
              this.addDialogVisible=false;
            }
            else{
              this.$message.error('上传失败'+res.msg);
            }
            this.uploading=false;
            this.saveLoading=false;
          }).catch(err=>{
            console.log(err);
            this.$message.error('糟糕,上传作品失败');
            this.uploading=false;
            this.saveLoading=false;
          });
        })

      },
      changeScale(num) {
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      //坐旋转
      rotateLeft() {
        this.$refs.cropper.rotateLeft();
      },
      //右旋转
      rotateRight() {
        this.$refs.cropper.rotateRight();
      },
      realTime(data) {
        this.previews = data
      },
      uploadImg(e) {
        var _this = this;
        //上传图片
        var file = e.target.files[0];
        _this.fileName = file.name;
        this.fileName=file.name;
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          this.$message.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
          this.$refs.value='';
          return false
        }
        if(file.size / 1024 / 1024>2){
          this.$message.error('图片不能大于2M');
          this.$refs.value='';
          return false
        }
        var reader = new FileReader();
        reader.onload =(e) => {
          let data;
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          }
          else {
            data = e.target.result
          }
          this.option.img = data;
          this.imgDialogVisible=true;
        }
        // 转化为blob
        reader.readAsArrayBuffer(file);

      },
      handleChange(val) {

      },
      editTeam(){
        this.editInformation['teamName']=this.detail_info[0].teamName;
        this.editInformation['direction']=this.detail_info[0].direction;
        this.editInformation['description']=this.detail_info[0].description;
        this.edit_team_show=true;
      },
      addSuccess(msg){
        this.success(msg);
        this.$emit('refresh'); /*添加成员成功后更新数据*/
      },
      goBack() {  /*返回上一级*/
        this.$emit('goBack')
      },
      hidden(){ /*新增成员,编辑陈成员组件显示与否*/
        this.show_if=false;
        this.edit_show=false;
        this.edit_team_show=false;
      },
      add(){   /*新增成员组件显示与否*/
        this.show_if=true;
      },
      editMember(index){
        this.edit_show=true;
        if(index===-1){
          this.editInformation=this.detail_info[0].captainInformation[0];
        }
        else{
          this.editInformation=this.detail_info[0].memberInformation[index];
        }

      },
      deleteMember(index){   /*删除成员*/
        let that=this;
        this.$confirm('是否确定删除该成员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteTeamMate(this.userId[index],this.teamId).then(function (res) {
            if(res.status===0&&res.msg==='成功'){
              that.success('操作成功!');
              that.$emit('refresh'); /*删除成功后更新数据*/
            }
            else{
              console.log(res)
              that.fail('发生错误,删除失败！');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      success(msg) {  /*成功操作提示*/
        this.$message({
          message: msg,
          type: 'success'
        });
      },
      fail(msg) {  /*失败操作提示*/
        this.$message.error(msg);
      },
      down(type) {
        if(type==='member'){
          this.$set(this.up_down_show,'member',true) ;
          this.$refs.member_info.style.display = 'block';
          // this.$refs.member_info.style.height = 'auto';
        }
        else{
          this.$set(this.up_down_show,'products',true) ;
          this.$refs.products_info.style.display = 'block';
        }

      },
      up(type) {
        if(type==='member'){
          this.$set(this.up_down_show,'member',false) ;
          this.$refs.member_info.style.display = 'none';
          // this.$refs.member_info.style.height = 0;
        }
        else{
          this.$set(this.up_down_show,'products',false) ;
          this.$refs.products_info.style.display = 'none';
        }
      },
      getDirection(){
        getAllTeamDirection().then((res)=>{ //获取团队方向
          if(res.status===0){
            let data=res.data;
            for(let i=0;i<data.length;i++){
              let temp={};
              temp.text= temp.value=data[i].directionName;
              this.teamDirection.push(data[i].directionName); /*产生团队方向对象*/
            }
          }
          else{
            this.fail('糟糕,获取个人方向列表失败！')
          }
        });
        getAllUserDirection().then((res)=>{ //获取用户个人方向
          if(res.status===0){
            let data=res.data;
            for(let i=0;i<data.length;i++){
              let temp={};
              temp.text= temp.value=data[i].directionName;
              this.userDirection.push(data[i].directionName); /*产生团队方向对象*/
            }
          }
          else{
            this.fail('糟糕,获取团队方向列表失败！')
          }
        });
      },
      refresh(){
        this.$emit('refresh');
      },
      getStudentId(){  /*获取所有人员学号，用于添加成员时验证数据防止重复添加*/
        let captainId=this.detail_info[0].captainInformation[0].studentId;
        this.studentId.push(captainId);
        let member=this.detail_info[0].memberInformation;
        for(let i=0;i<member.length;i++){
          let tempId=member[i].studentId;
          this.studentId.push(tempId);
        }
      },
      handleGetWork(teamId){
        getTeamWork(teamId).then(res=>{
          if(res.status===0){
            this.works=res.data;
            console.log(this.works)
          }
          else{
            this.$message.error('获取团队作品失败'+(res.msg||''));
          }
        }).catch(err=>{
          console.log(err);
          this.$message.error('糟糕,获取团队作品失败');
        })
      }
    },
    computed:{
      teamId(){ /*收集团队id*/
        return this.detail_info[0].teamId;
      },
      userId(){   /*收集用户id*/
        let idList=this.detail_info[0].memberInformation;
        let id=[];
        for(let i=0;i<idList.length;i++){
          let temp=idList[i].userId;
          id.push(temp);
        }
        return id;
  }
    },
  watch:{
      detail_info(){  /*监听团队详细信息，更新时更新学号列表*/
        this.getStudentId();
      }
    },
    created(){
      this.handleGetWork(this.teamId);
      },
    mounted(){ /*监听团队详细信息，更新时更新学号列表*/
      this.getStudentId();
    }
  }
</script>
<style scoped>
  .work{
    width:260px;
    overflow: auto;
    box-sizing: border-box;
    border: 1px solid #ddd;
    min-height: 200px;
    max-height: 600px;
    margin-right: 120px;
    margin-top: 20px;
    display: inline-block;
  }
  .work img{
    width: 250px;
    height: 250px;
    margin: 5px 0;
  }
  .workTitle{
    height: 20px;
    white-space: nowrap;
    text-align: center;
    margin: 0;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .work p{
    padding: 0 5px;
    min-height: 10px;
    max-height: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .show-preview{
    position: absolute;
    right: 100px;
    top: 10px;
  }
  .file{
    margin-left: 20px;
    margin-top: 50px;
  }
  .dialog >>>.el-input__inner{
    width: 300px!important;
  }
  .dialog >>>.el-textarea{
    width: 300px!important;
  }
  .do{
    position: absolute;
    bottom: 70px;
    width:420px;
    right: 0;
  }
  .cropper-container{
    width: 250px;
    height: 250px;
    margin: 0!important;
    padding: 0!important;
  }
  .addProduct{
    position: relative;
    left: 40%;
    font-size: 30px;
    color:green;
    cursor: pointer;
    user-select: none;
  }
 .info div{
   font-weight: bold;
 }
.strong {
  font-weight: bold;
}
.up_down{
  transition: all 0.5s;
  font-size: 28px;
  cursor: pointer;
  color:#666;
  user-select: none;
}
.edit,.captainEdit{
  margin-left: 40px;
  margin-right: 10px;
  font-size: 20px;
  cursor: pointer;
}
.captainEdit{
  position: absolute;
  right:10px;
  margin-right: 10px;
  top: 10px;
}
.return {
  margin-left: 30px;
  font-size: 20px;
  cursor: pointer;
  color:white;
  margin-top: 15px;
  border: 1px solid #eee;
  background-color: rgba(1,1,1,0.3);
  padding: 5px;
  border-radius: 5px;
}
/*.center {*/
  /*position: relative;*/
  /*left: 50%;*/
/*}*/
 .add {
  text-align: center;
}
.add span {
  font-size: 35px;
  color:green;
  cursor: pointer;
  user-select: none;
}

 .detail{
   background-color : white;
   padding-bottom: 20px;
 }
 .detail span {
   font-weight: bold;
 }
 .detail div {
   margin: 10px 0;
   padding-left: 20px;
 }
 .title {
   text-align: left;;
   line-height: 30px;
   background-color: #eee;
   border: 1px solid #ccc;
   font-weight: bold;
   margin: 0;
 }
 .member {
   width: 80px;
 }
 .delete {
   float: right;
   color:red;
   font-size: 25px;
   cursor: pointer;
 }

 .detail .member_info {
   margin-right: 20px;
   padding-left: 0;
 }
 .menDetail{
   /*overflow: hidden;*/
   /*transition: all 0.5s;*/
   display: none;
   min-height:10px;
   padding-top: 10px;
   background-color: #bbb;
 }
 .content {
   padding-left: 10px;
   white-space: nowrap;
   text-overflow: ellipsis;
   max-width: 400px;
   overflow: hidden;
 }
 .detail .info {
   position: relative;
   margin: 20px 20px;
   padding-right: 10px;
   float: left;
   max-width: 300px;
   box-shadow: 7px 5px 2px ;
   background-color: white;
 }
 .shortinfor {
   display: inline-block;
   max-width: 200px;
   height: 15px;
   vertical-align: middle;
   border: none;
 }
  .save {
    margin-left: 20px;
  }
</style>
