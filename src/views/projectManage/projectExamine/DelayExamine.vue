<template>
  <!-- 列表信息 -->
  <div class="project-list">
    <el-table
      v-loading="isLoading"
      :data="filterData"
      stripe
      max-height="500"
      class="project-table"
      :default-sort="{prop: 'state', order: 'ascending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <project-detail :projectId="props.row.projectId"></project-detail>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" sortable></el-table-column>
      <el-table-column prop="teamName" label="承接团队"></el-table-column>
      <el-table-column label="延期时间" sortable prop="delayTime">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.delayTime }} 天</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" sortable :filters="tags" :filter-method="filterTag">
        <template slot-scope="scope">
          <el-tag
            disable-transitions
            style="font-size:12px"
            :type="stateColor(scope.row.state)"
          >{{scope.row.state | filterState}}</el-tag>
          <el-button
            round
            size="small"
            type="text"
            @click="timeNodeDetail(scope.row.runId, scope.row)"
            :class="{'btn-select':scope.row.isSelectx}"
          >查看项目方案</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="操作">
        <template slot-scope="scope" v-if="scope.row.state === '1'">
          <el-button
            round
            size="small"
            type="success"
            icon="el-icon-check"
            @click="examine(scope.row, '2')"
            :loading="scope.row.isSelect"
          >同意</el-button>
          <el-button
            round
            size="small"
            icon="el-icon-close"
            type="danger"
            @click="examine(scope.row, '3')"
            :loading="scope.row.isSelect"
          >拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <project-pagination :data="data" :filter-data.sync="filterData"></project-pagination>
    <project-timenode :timeNode="timeNode" :check.sync="check" :active-node="active"></project-timenode>
  </div>
</template>
<script>
import ProjectTimenode from "../components/ProjectTimenode";
import ProjectPagination from "@/components/ProjectPagination";
import ProjectDetail from "../components/ProjectDetail";
import {
  examineDelay,
  getDelays,
  getDelayState,
  getProgress,
  getAllTimeNodes
} from "../../../api/project";
import { getAllTeamDirection, getTeam } from "../../../api/team";
// import { examineAllocation } from "api/project"
export default {
  components: { ProjectPagination, ProjectDetail, ProjectTimenode },
  data() {
    return {
      // dataSrc: { projects: [], teams: [] }, // 数据源
      dataSrc: [], // 数据源

      // data: [], // 真正的数据
      filterData: [], // 数据筛选
      isLoading: true, // 数据是否加载
      btnLoading: false, // 按钮操作加载
      check: false,
      timeNode: "",
      active: 0,
      select: {}
    };
  },
  computed: {
    data() {
      return this.dataSrc;
      // return this.dataSrc.projects;
    }
  },
  mounted() {
    // const data = [
    //   ...Array(1).fill(this.projectData[0]),
    //   ...Array(1).fill(this.projectData[1]),
    //   ...Array(1).fill(this.projectData[2])
    // ];
    // this.dataSrc = data;
    // this.isLoading = true;
    this.getLoadData();
  },
  methods: {
    // 获取加载的数据
    getLoadData() {
      getDelays()
        .then(res => {
          if (res.status == 0) {
            let { data } = res;
            // this.dataSrc = data.filter(item => item.state == 1);
            this.dataSrc = data;
            this.getMsgNum();

            this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "数据获取失败"
          });
          this.isLoading = false;
        });
    },
    // 审核延期
    examine(Curobj, state) {
      this.$set(Curobj, "isSelect", true);
      examineDelay(Curobj.delayId, state)
        .then(res => {
          if (res.status == 0) {
            this.getLoadData();
            this.$message({
              type: "success",
              message: res.msg
            });
            Curobj.isSelect = false;
          } else throw res.msg;
        })
        .catch(err => {
          Curobj.isSelect = false;
          this.$message({
            type: "error",
            message: "审核失败"
          });
        });
    },
    // 项目方案详情
    timeNodeDetail(runId, Curobj) {
      this.selected(Curobj);
      getAllTimeNodes(runId).then(res => {
        if (res.status == 0) {
          this.timeNode = res.data;
          getProgress(runId).then(res => {
            if (res.status == 0) {
              this.active = res.data.split(/_| /)[0] - 1;
              this.check = true;
            }
          });
        }
      });

      // this.timeNode =
      //   "1.2019-3-18完成项目搭建;2.2019-5-18完成项目并提交;3.2019-5-18完成项目并提交";
      // this.active = 1;
    },
    // 选择
    selected(Curobj) {
      this.select.isSelectx = false;
      Curobj.isSelectx = true;
      this.select = Curobj;
    }
  },
  watch: {}
};
</script>
<style scoped>
.btn-select {
  color: rgb(231, 194, 73);
}
</style>
