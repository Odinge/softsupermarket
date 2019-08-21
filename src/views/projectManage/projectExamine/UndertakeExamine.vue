<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-08-13 15:38:03
 * @LastEditors: Please set LastEditors
 -->
<template>
  <!-- 列表信息 -->
  <div class="project-list">
    <el-table v-loading="isLoading" :data="filterData" stripe max-height="500" class="project-table" :default-sort="{prop: 'projectTime', order: 'descending'}">
      <el-table-column type="expand">
        <template slot-scope="props">
          <project-detail :props="props.row"></project-detail>
          <el-table stripe :data="props.row.teamUndertakePOList" :default-sort="{prop: 'teamScore', order: 'descending'}" class="table-radius">
            <el-table-column prop="teamName" label="团队名称"></el-table-column>
            <el-table-column prop="direction" label="团队方向">
              <!-- <template slot-scope="scope">{{ teamDirection[scope.row.direction].directionName }}</template> -->
              <template slot-scope="scope">{{ scope.row.direction | filterTeamDirection }}</template>
            </el-table-column>
            <el-table-column prop="teamScore" sortable label="团队分数">
              <template slot-scope="scope">
                <!-- <rate :score="scope.row.teamScore" :base='20'></rate> -->
                <span style="color:#ff9900;font-size:18px">{{scope.row.teamScore}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="teamId" label="操作">
              <template slot-scope="scope">
                <el-button round type="success" size="small" icon="el-icon-edit-outline" @click="undertakeProject(scope.row, '2')" :loading="btnLoading">承接</el-button>
                <el-button round type="danger" size="small" icon="el-icon-delete" @click="undertakeProject(scope.row, '3')" :loading="btnLoading">拒绝</el-button>
                <div>
                  <el-button round type="text" size="small" @click="teamDetail(scope.row.teamId)">团队详细</el-button>
                  <el-button round type="text" size="small" @click="timeNodeDetail(scope.row)" :class="{'btn-select':scope.row.isSelect}">查看项目方案</el-button>
                  <el-button type="text" circle title="下载计划书" icon="el-icon-download" @click="downloadDocument(scope.row.projectId,scope.row.teamId)"></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" sortable></el-table-column>
      <el-table-column prop="projectRequirement" label="项目申请数">
        <template slot-scope="scope">{{ scope.row.teamUndertakePOList.length }} 个团队</template>
      </el-table-column>
      <el-table-column label="项目日期" sortable prop="projectTime">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.projectTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <!-- <template slot-scope="scope"> -->
        <template>
          <el-tag disable-transitions style="font-size:12px" type="danger">未审核</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <project-pagination :data="data" :filter-data.sync="filterData"></project-pagination>
    <project-timenode :timeNode="timeNode" :check.sync="check"></project-timenode>
  </div>
</template>
<script>
import ProjectTimenode from "../components/ProjectTimenode";
import Rate from "../components/Rate";
import ProjectPagination from "@/components/ProjectPagination";
import ProjectDetail from "../components/ProjectDetail";
import { getAllocation, examineAllocation, downloadProjectDocument } from "../../../api/project";
import { getAllTeamDirection } from "../../../api/team";
export default {
  components: { ProjectPagination, ProjectDetail, ProjectTimenode, Rate },
  data() {
    return {
      // dataSrc: { projects: [], teams: [] }, // 数据源
      dataSrc: [], // 数据源

      // data: [], // 真正的数据
      filterData: [], // 数据筛选
      isLoading: true, // 数据是否加载
      btnLoading: false, // 按钮操作加载
      teamDirection: [],
      projectData: [
      ],
      check: false,
      timeNode: "",
      select: {}
    };
  },
  computed: {
    data() {
      return this.dataSrc;
    }
  },
  mounted() {
    this.getLoadData();
  },
  methods: {
    // 获取加载的数据
    getLoadData() {
      getAllocation()
        .then(res => {
          if (res.status == 0) {
            let { data } = res;
            this.dataSrc = data || [];
            this.getMsgNum();
            this.dataSrc.forEach(item => {
              item.teamUndertakePOList.forEach(i => {
                i.projectId = item.projectId;
              });
            });

            this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.$message.error("数据获取失败");
          this.isLoading = false;
        });
    },
    // 选择承接的团队
    undertakeProject(Curobj, state) {
      const msgMap = ["", "", "选择", "拒绝"];
      this.$confirm(`是否 ${msgMap[state]} ${Curobj.teamName} 团队承接此项目?`, "提示", {
        type: "warning",
        center: true
      }).then(() => {
        this.btnLoading = true;
        // 审核项目承接
        examineAllocation(Curobj.undertakeId, state)
          .then(res => {
            if (res.status == 0) {
              this.getLoadData();
              this.$message({
                type: "success",
                message: res.msg
              });
              this.btnLoading = false;
            } else throw res.msg;
          })
          .catch(err => {
            this.btnLoading = false;
            this.$message({
              type: "error",
              message: "审核失败"
            });
          });
      }).catch(() => {
        this.$message.info("已取消");
      });
    },
    // 团队详情
    teamDetail(teamId) {
      this.$router.push({ name: "teamDetail", params: { id: teamId } });
      this.$route.meta.cache = true;
    },
    // 项目方案详情
    timeNodeDetail(Curobj) {
      this.selected(Curobj);
      this.timeNode = Curobj.timeNode;
      this.check = true;
    },
    // 下载项目计划书
    downloadDocument(projectId, teamId) {
      // projectId = 'f3f7712312312312311089b20c0d42f5';
      // teamId = 'c4ca4238a0b923820dcc509a6f75849b';
      downloadProjectDocument(projectId, teamId).then(res => {
        if (!res.status) {
          window.location.href = this.$baseUrl + "/v1/nonpub/supervise/downloadProjectDocument?projectId=" + projectId + "&teamId=" + teamId;
        } else throw res;
      }).catch(err => {
        this.$message.error(err.msg);
      });
    },
    // 记录当前选择的项目
    selected(Curobj) {
      this.select.isSelect = false;
      Curobj.isSelect = true;
      this.select = Curobj;
    }
  },

  // 数据缓存
  beforeRouteEnter(to, from, next) {
    //需要刷新的页面
    if (from.name !== "teamDetail") {
      to.meta.isRefresh = true;
    }
    next()
  },
  activated() {
    if (this.$route.meta.isRefresh) {
      // 先重置
      this.$route.meta.isRefresh = false;
      this.isLoading = true;
      this.getLoadData();
    }
  },
  watch: {}
};
</script>
<style scoped>
/* .i-b {
  display: inline-block;
}
.rate-color {
  color: #ff9900;
} */
.btn-select {
  color: rgb(231, 194, 73);
}
</style>
