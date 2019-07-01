<template>
  <div>
    <el-table v-loading="isLoading" :data="filterData" stripe max-height="500" class="project-table" :default-sort="{prop: 'state', order: 'ascending'}">
      <el-table-column type="expand">
        <template slot-scope="props">
          <project-detail :props="props.row"></project-detail>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" sortable></el-table-column>
      <el-table-column prop="projectPrice" sortable label="项目资金">
        <template slot-scope="scope">
          <span class="price">{{ scope.row.projectPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结项日期" sortable prop="projectTime">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.projectTime }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="state" label="状态" :filters="tags" :filter-method="filterTag">
        <template slot-scope="scope">
          <el-tag disable-transitions style="font-size:12px" :type="stateColor(scope.row.state)">{{scope.row.state | filterState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="projectId" label="操作">
        <template slot-scope="scope" v-if="scope.row.state === '1'">
          <el-button round size="small" type="success" icon="el-icon-check" @click="examine(scope.row, '2')" :loading="scope.row.isSelect">同意</el-button>
          <el-button round size="small" icon="el-icon-close" type="danger" @click="examine(scope.row, '3')" :loading="scope.row.isSelect">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <project-pagination :data="dataSrc" :filter-data.sync="filterData"></project-pagination>
  </div>
</template>
<script>
import ProjectPagination from "@/components/ProjectPagination";
import ProjectDetail from "../components/ProjectDetail";
import {
  getExamineProject,
  examineProject,
  getProjectByState
} from "../../../api/project";

export default {
  components: { ProjectPagination, ProjectDetail },
  data() {
    return {
      dataSrc: [], // 数据源

      // data: [], // 真正的数据
      filterData: [], // 数据筛选
      isLoading: true, // 数据是否加载
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
      getExamineProject()
        .then(res => {
          if (res.status == 0) {
            let { data } = res;
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
    // 审核
    examine(Curobj, state) {
      this.$set(Curobj, "isSelect", true);
      examineProject(Curobj.projectId, state)
        .then(res => {
          // 项目发布成功。等待管理员审核
          if (res.status == 0) {
            this.$message({ type: "success", message: "审核成功" });
            this.getLoadData();
            Curobj.isSelect = false;
          } else throw res.msg;
        })
        .catch(err => {
          Curobj.isSelect = false;
          this.$message({ type: "error", message: "操作失败" });
        });
    }
  },
  watch: {}
};
</script>
<style scoped>
</style>
