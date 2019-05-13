<template>
  <div class="allNotice">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发布时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容简介">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="detail(scope.row)"
          >查看</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>
  </div>
</template>
<script>
  import { publish, getStudenId ,noticeList,getUserId,dustbin} from "@/api/notice";
  export default {
    data(){
      return{
        total:0,
        currentPage:1,
        pageSize:10,
        loading: false,
        tableData:[]
      }
    },
    methods:{
      handleSizeChange(val){
        this.pageSize=val;
        this.getData()
      },
      handleCurrentChange(val){
        this.currentPage=val;
        this.getData()
      },
      detail(val){
        this.$router.push({name:'noticeDetail',params:{announcementId:val.announcementId}});
      },
      getData(){
        dustbin().then((res)=>{
          if(res.status===0){
            this.tableData=res.data;
            for(let i=0;i<this.tableData.length;i++){
              this.tableData[i].content=this.tableData[i].content.replace(/<[^>]+>/g,"").replace(/&nbsp;/g,'').slice(0,28);
              if( this.tableData[i].content.length>27){
                this.tableData[i].content=this.tableData[i].content+'......';
              }
            }
          }
        })
      },
    },
    created(){
      this.getData()
    }
  }
</script>
<style>
  .allNotice{
    width: 100%;
  }
  .page{
    float:right;
    margin-top: 20px;
    margin-right: 20px;
  }
</style>
