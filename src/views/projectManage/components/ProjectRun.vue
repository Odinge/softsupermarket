<template>
  <!-- 列表信息 -->
  <div>
    <!-- stripe -->
    <el-table v-loading="isLoading" :data="filterData" max-height="500" class="project-table" @row-click="select" :default-sort="{prop: 'state', order: 'ascending'}" :row-class-name="timeoutClass">
      <el-table-column type="expand">
        <template slot-scope="props">
          <project-detail :props="props.row"></project-detail>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" sortable></el-table-column>
      <el-table-column prop="progress" label="项目进度">
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="18" :color="scope.row.progressStatus" :percentage="scope.row.progressNum"></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="结项日期" sortable prop="projectTime">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.projectTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" sortable label="状态" :filters="tags" :filter-method="filterTag">
        <template slot-scope="scope">
          <el-tag disable-transitions style="font-size:12px" :type="stateColorTxt(scope.row.examineState)" v-if="scope.row.examineState">{{scope.row.examineState | filterStateTxt}}</el-tag>
          <!-- >{{scope.row.examineState}}</el-tag> -->
          <el-tag disable-transitions style="font-size:12px" type="danger" v-if="scope.row.overtime > 0">已超时{{ scope.row.overtime }}次</el-tag>
          <el-tag disable-transitions style="font-size:12px" type="danger" v-if="scope.row.delayTime > 0">已延期{{ scope.row.delayTime }}天</el-tag>

          <el-tag disable-transitions style="font-size:12px;color:#fff" color="#ff0000a6" v-if="scope.row.timeout > 0">项目超时</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <project-pagination :data="data" :filter-data.sync="filterData"></project-pagination>
  </div>
</template>
<script>
import ProjectPagination from "@/components/ProjectPagination";
import ProjectDetail from "../components/ProjectDetail";
import {
  getAllTimeNodes,
  timeoutJudgement,
  getProjectByProgress,
  getAchievementState,
  getAllDelayTime,
  getDelayAndAchievementsByRunId
} from "../../../api/project";
export default {
  components: { ProjectPagination, ProjectDetail },
  data() {
    return {
      dataSrc: [], // 数据源

      // data: [], // 真正的数据
      filterData: [], // 数据筛选
      isLoading: true // 数据是否加载
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
      getProjectByProgress("未完成")
        .then(res => {
          if (res.status == 0) {
            this.dataSrc = res.data.map(item => {
              // 局部更新
              this.renewal(item);
              // 超时判断
              this.timeout(item);
              item.examineState = "未提交";
              // 获取审核状态
              this.getExamineState(item);
              // 获取延迟时间
              this.getAllDelayTime(item);
              return item;
            });
            this.getMsgNum();
            this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.$message.error("数据获取失败");
          this.isLoading = false;
        });
    },
    // 局部更新
    renewal(row) {
      const status = ["#FF6978", "#f6941d", "#67C23A"];
      getAllTimeNodes(row.runId)
        .then(res => {
          if (res.status == 0) {
            let { data } = res;
            let all = data.split(";").length;
            let progress = row.progress.split(" ")[0] - 1;
            let num = progress / all;
            let percent = Math.round(num * 100);
            let index = Math.round(num * status.length);
            this.$set(row, "progressNum", percent);
            this.$set(row, "progressStatus", status[index]);
          } else throw res.msg;
        })
        .catch(err => this.$message.error("获取进度数据失败！"));
    },
    // 超时判断
    timeout(row) {
      timeoutJudgement(row.runId)
        .then(res => {
          if (res.status == 0) {
            this.$set(row, "timeout", res.data);
          } else throw res.msg;
        })
        .catch(err => this.$message.error("超时判断失败！"));
    },
    timeoutClass({ row }) {
      if (row.timeout) {
        return "timeout";
      }
    },
    // 获取审核状态
    getExamineState(row) {
      getDelayAndAchievementsByRunId(row.runId)
        .then(res => {
          if (res.status == 12) {
            let id = res.data[res.data.length - 1];
            if (id && id.achievementsId) {
              getAchievementState(id.achievementsId)
                .then(res => {
                  if (res.status == 0) {
                    if (res.data !== "已审核") {
                      this.$set(row, "examineState", res.data);
                    }
                  } else throw res.msg;
                })
                .catch(err => this.$message.error(err));
            }
          } else throw res.msg;
        })
        .catch(err => this.$message.error(err));
    },
    // 获取延期
    getAllDelayTime(row) {
      getAllDelayTime(row.runId)
        .then(res => {
          if (res.status == 0 || res.status == -1) {
            let allTime = res.data ? res.data.allTime : 0;
            this.$set(row, "delayTime", allTime);
          } else throw res.msg;
        })
        .catch(err => this.$message.error("延期获取失败！"));
    },
    // 查看详情
    select(row, event, col) {
      if (col.label !== "操作") {
        this.$router.push({
          name: "projectProgress",
          params: { id: row.runId },
          query: { overtime: row.overtime }
        });
        window.sessionStorage.setItem("prevPage", JSON.stringify([]));
        window.sessionStorage.setItem("projectId", row.projectId);
      }
    }
  },
  watch: {}
};
</script>
<style>
.timeout {
  background-color: #fde6e6;
  animation: timeout 1.2s linear infinite;
}
/* .timeout:hover {
  animation-play-state: paused;
} */
@keyframes timeout {
  form {
    background-color: #fde6e6;
  }
  to {
    background-color: #eb5f5f;
    color: #fff;
  }
}
</style>

