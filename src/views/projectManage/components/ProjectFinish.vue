<template>
  <div class="finish">
    <div class="expbtn">
      <el-button circle type="success" icon="el-icon-upload2" size="small" title="导入项目" @click="showUpload = true" class="tag"></el-button>
      <a :href="exportUrl" class="tag">
        <el-button circle type="warning" icon="el-icon-download" size="small" title="导出项目"></el-button>
      </a>
    </div>
    <el-table stripe v-loading="isLoading" :data="filterData" max-height="500" class="project-table" @row-click="select" :default-sort="{prop: 'state', order: 'ascending'}">
      <el-table-column type="expand">
        <template slot-scope="props">
          <project-detail :projectId="props.row.projectId"></project-detail>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" sortable></el-table-column>
      <el-table-column prop="teamName" label="承接团队"></el-table-column>
      <el-table-column label="结项日期" sortable prop="projectTime">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.projectTime }}</span>
        </template>
      </el-table-column>x
      <el-table-column prop="score" sortable label="状态" :filters="tags" :filter-method="filterTag">
        <template slot-scope="scope">
          <el-tag disable-transitions style="font-size:12px" :type="stateColor(scope.row.score)">{{scope.row.score | filterState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="score" sortable label="评分">
        <template slot-scope="scope">
          <rate :score="scope.row.score"></rate>
          <el-button class="tag" type="text" :class="{'btn-select': scope.row.isSelectx}" @click="openEvaluate(scope.row.runId, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <project-evaluate :check.sync="check" :runId="runId"></project-evaluate>
    <project-export :check.sync="showUpload" @updateData="getLoadData"></project-export>
    <!-- 分页器 -->
    <project-pagination :data="data" :filter-data.sync="filterData"></project-pagination>
  </div>
</template>
<script>
import Rate from "../components/Rate";
import ProjectPagination from "@/components/ProjectPagination";
import ProjectDetail from "../components/ProjectDetail";
import projectEvaluate from "../components/projectEvaluate";
import ProjectExport from "../components/ProjectExport";
import {
  getProjectByState,
  exportProjectCompleted,
  getEvaluatedRunProjects,
  addFinishedProjectByExcel,
  getProjectByProgress,
} from "../../../api/project";
export default {
  components: {
    Rate,
    ProjectDetail,
    ProjectExport,
    projectEvaluate,
    ProjectPagination,
  },
  data() {
    return {
      dataSrc: [], // 数据源

      // data: [], // 真正的数据
      filterData: [], // 数据筛选
      isLoading: true, // 数据是否加载
      btnLoading: false, // 按钮操作加载
      tags: [{ text: "已完成", value: 0 }, { text: "未评分", value: -1 }],
      projectData: [],
      check: false,
      runId: "",
      selectx: {},
      showUpload: false
    };
  },
  computed: {
    data() {
      return this.dataSrc;
    },
    exportUrl() {
      return this.$baseUrl + "/v1/nonpub/supervise/exportProjectCompleted";
    },
  },
  mounted() {
    this.getLoadData();
  },
  methods: {
    filterTag(value, row) {
      if (value === -1) {
        return row.score === -1;
      } else {
        return row.score >= value;
      }
    },
    // 获取加载的数据
    getLoadData() {
      // 获取已完成的项目
      // getProjectByProgress("已完成")
      this.progressFun("已完成")
        .then(res => {
          if (res.status == 0) {
            this.dataSrc = res.data.map(item => {
              item.score = +item.score;
              return item;
            });
            // 获取未处理消息数
            this.getMsgNum();
          } else {
            this.$message({
              type: "error",
              message: "数据获取失败"
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "数据获取失败"
          });
          this.isLoading = false;
        });
    },
    // 根据状态返回颜色
    stateColor(state) {
      return state === -1 ? "danger" : "success";
    },
    // 点击项目查看详细项目情况
    select(row, col) {
      if (col.label != "评分") {
        this.$router.push({
          name: "projectProgress",
          params: { id: row.runId },
          query: { check: row.score }
        });
        this.$route.meta.check = row.score;
        sessionStorage.setItem("projectId", row.projectId);
      }
    },
    // 打开评分
    openEvaluate(runId, Curobj) {
      this.selected(Curobj);
      this.check = true;
      this.runId = runId;
    },
    // 已选择信息
    selected(Curobj) {
      this.selectx.isSelectx = false;
      Curobj.isSelectx = true;
      this.selectx = Curobj;
    }
  },
  filters: {
    filterState(val) {
      return val === -1 ? "未评分" : "已完成";
    }
  },

  // 数据缓存
  beforeRouteEnter(to, from, next) {
    //需要刷新的页面
    if (!["projectProgress", "teamDetail"].includes(from.name)) {
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

};
</script>
<style scoped>
.tag {
  margin-left: 10px;
}
.btn-select {
  color: rgb(231, 194, 73);
}

.expbtn {
  position: absolute;
  z-index: 55;
  right: 80px;
  top: 15px;
}
@media screen and (max-width: 500px) {
  .expbtn {
    display: none;
  }
}
</style>
