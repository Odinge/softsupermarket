<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-05 14:55:49
 * @LastEditors: Please set LastEditors
 -->
<template>
  <!-- 列表信息 -->
  <div class="project-run">
    <el-tooltip class="item" effect="dark" content="详情信息在加载中" placement="bottom">
      <i class="el-icon-loading load-icon" v-show="!allLoad"></i>
    </el-tooltip>

    <el-table v-loading="isLoading" :data="filterData" max-height="500" class="project-table" @row-click="select" :default-sort="{prop: 'state', order: 'ascending'}" :row-class-name="timeoutClass">
      <template v-if="allLoad">
        <el-table-column type="expand">
          <template slot-scope="props">
            <project-detail :props="props.row"></project-detail>
            <team-detail v-if="!permission($roles.team)" :teamId='props.row.teamId'></team-detail>
          </template>
        </el-table-column>
      </template>
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
import TeamDetail from "../components/TeamDetail";
import {
  getAllTimeNodes,
  timeoutJudgement,
  getAchievementState,
  getAllDelayTime,
  getDelayAndAchievementsByRunId,
  getProjectByProgress, // 管理员
  getProjectByProgressLimit, // 项目负责人
} from "../../../api/project";
// import { mapState } from "vuex";
export default {
  components: { ProjectPagination, ProjectDetail, TeamDetail },
  data() {
    return {
      dataSrc: [], // 数据源

      // data: [], // 真正的数据
      filterData: [], // 数据筛选
      isLoading: true, // 数据是否加载
      // allLoad: false,
      loadFlag: {
        timeNode: false,
        timeout: false,
        examineState: false,
        delayTime: false
      }
    };
  },
  computed: {
    // ...mapState(["role", "username"]),
    data() {
      return this.dataSrc;
    },
    allLoad() {
      return Object.keys(this.loadFlag).every(key => this.loadFlag[key]);
    },
  },
  watch: {
    allLoad(val) {
      this.getMsgNum().then(res => {
        if (val) {
          const msgNum = this.data.filter(item => item.timeout || ["条件不满足", "未审核", "未提交"].includes(item.examineState)).length;
          this.$store.commit("SET_PROJECTRUN_MSG_NUM", msgNum);
        }
      });
    }
  },
  mounted() {
    this.getLoadData();
  },
  methods: {
    // 获取加载的数据
    getLoadData() {
      this.progressFun("未完成")
        .then(res => {

          if (res.status == 0) {
            let { data } = res;
            // console.log(data);

            if (data.length === 0) {
              this.init(true);
            } else {
              this.dataSrc = data.map(item => {
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
            }
            // this.getMsgNum();
            this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.$message.error("数据获取失败");
          this.isLoading = false;
          this.init(true);
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

            // 置加载位
            this.loadFlag.timeNode = true;

          } else throw res.msg;
        })
        .catch(err => {
          this.loadFlag.timeNode = true;
          this.$message.error("获取进度数据失败！")
        });
    },
    // 超时判断
    timeout(row) {
      timeoutJudgement(row.runId)
        .then(res => {
          if (res.status == 0) {
            this.$set(row, "timeout", res.data);
            // 置加载位
            this.loadFlag.timeout = true;

          } else throw res.msg;
        })
        .catch(err => {
          this.loadFlag.timeout = true;
          this.$set(row, "timeout", 0);
          // this.$message.error("超时判断失败！")
        });
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
          if (res.status == 0) {
            let id = res.data[res.data.length - 1];
            if (id && id.achievementsId) {
              getAchievementState(id.achievementsId)
                .then(res => {
                  if (res.status == 0) {
                    if (res.data !== "已审核") {
                      this.$set(row, "examineState", res.data);
                    }
                    // 置加载位
                    this.loadFlag.examineState = true;
                  } else throw res.msg;
                })
                .catch(err => {
                  // 置加载位
                  this.loadFlag.examineState = true;
                  this.$message.error(err)
                });
            } else {
              this.$set(row, "examineState", "未提交");
              // 置加载位
              this.loadFlag.examineState = true;
            }
          } else throw res.msg;
        })
        .catch(err => {
          this.loadFlag.examineState = true;
          this.$message.error(err)
        });
    },
    // 获取延期
    getAllDelayTime(row) {
      getAllDelayTime(row.runId)
        .then(res => {
          if (res.status == 0) {
            let allTime = res.data ? res.data.allTime : 0;
            this.$set(row, "delayTime", allTime);

            // 置加载位
            this.loadFlag.delayTime = true;

          } else throw res.msg;
        })
        .catch(err => {
          // 置加载位
          this.loadFlag.delayTime = true;
          this.$message.error("延期获取失败！")
        });
    },
    // 查看详情
    select(row, col) {
      if (col.label === "项目进度") {
        this.$router.push({
          name: "projectProgress",
          params: { id: row.runId },
          query: { overtime: row.overtime }
        });
        sessionStorage.setItem("projectId", row.projectId);
      }
    },
    init(bool = false) {
      this.loadFlag = {
        timeNode: bool,
        timeout: bool,
        examineState: bool,
        delayTime: bool
      }
    }
  },

  // 数据缓存
  beforeRouteEnter(to, from, next) {
    //需要刷新的页面
    // if (!["projectProgress", "teamDetail"].includes(from.name)) {
    if (!["teamDetail"].includes(from.name)) {
      to.meta.isRefresh = true;
    }
    next()
  },
  activated() {
    if (this.$route.meta.isRefresh) {
      // 先重置
      this.$route.meta.isRefresh = false;
      this.isLoading = true;
      this.init();
      this.getLoadData();
    }
  },

};
</script>
<style>
.project-run {
  position: relative;
}
.timeout {
  background-color: #fde6e6;
  animation: timeout 1.2s linear infinite;
}
.load-icon {
  position: absolute !important;
  left: 80px;
  top: 35px;
  z-index: 100;
  font-size: 20px;
  color: #ff4040;
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

