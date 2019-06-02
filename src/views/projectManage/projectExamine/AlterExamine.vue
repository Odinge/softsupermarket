<template>
  <!-- 列表信息 -->
  <div class="project-list">
    <el-table stripe v-loading="isLoading" :data="filterData" max-height="500" class="project-table" :default-sort="{prop: 'state', order: 'ascending'}">
      <el-table-column type="expand">
        <template slot-scope="props" class="extend">
          <project-detail :projectId="props.row.projectId"></project-detail>
        </template>
      </el-table-column>
      <el-table-column prop="modificationType" label="修改类型"></el-table-column>
      <el-table-column prop="modificationPlace" label="修改字段">
        <template slot-scope="scope">{{scope.row.modificationPlace | filterField }}</template>
      </el-table-column>
      <el-table-column prop="modificationContent" label="修改内容">
        <template slot-scope="scope">{{ scope.row.modificationContent }}</template>
      </el-table-column>
      <el-table-column prop="originalData" label="原始内容"></el-table-column>
      <el-table-column prop="state" sortable label="状态" :filters="tags" :filter-method="filterTag">
        <template slot-scope="scope">
          <el-tag disable-transitions style="font-size:12px" :type="stateColorTxt(scope.row.state)">{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="操作">
        <template slot-scope="scope" v-if="scope.row.state === '未审核'">
          <el-button round size="small" type="success" icon="el-icon-check" @click="examine(scope.row, '2')" :loading="scope.row.isSelect">同意</el-button>
          <el-button round size="small" icon="el-icon-close" type="danger" @click="examine(scope.row, '3')" :loading="scope.row.isSelect">拒绝</el-button>
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
  getModificationProject,
  examineModificationProject,
  modificationProjectX,
  getProject,
  examineProject
} from "../../../api/project";
export default {
  components: { ProjectPagination, ProjectDetail },
  data() {
    return {
      // dataSrc: { projects: [], teams: [] }, // 数据源
      dataSrc: [], // 数据源

      // data: [], // 真正的数据
      filterData: [], // 数据筛选
      isLoading: true, // 数据是否加载
      btnLoading: false, // 按钮操作加载
      tags: [
        { text: "未审核", value: "未审核" },
        { text: "已审核", value: "已审核" },
        { text: "不通过", value: "不通过" }
      ]
    };
  },
  computed: {
    data() {
      return this.dataSrc;
    }
  },
  mounted() {
    this.isLoading = true;
    this.getLoadData();
  },
  methods: {
    // 获取加载的数据
    getLoadData() {
      // 获取修改项目
      getModificationProject()
        .then(res => {
          let data = res.data.modificationProject;
          this.dataSrc = data.filter(item => item.state == "未审核" || item.state == "条件不满足");
          this.getMsgNum();
          this.isLoading = false;
        })
        .catch(err => {
          this.$message.error("数据获取失败");
          this.isLoading = false;
        });
    },
    // 审核项目修改
    examine(modification, state) {
      // 选择当前修改
      this.$set(modification, "isSelect", true);
      // 审核项目想改
      examineModificationProject(modification.modificationId, state)
        .then(res => {
          if (res.status == 0) {
            if (state == "2") {
              // 修改项目
              this.alterProject(modification);
            } else {
              this.$message.success("审核成功");
              modification.isSelect = false;
            }
            this.getLoadData();
          } else throw res.msg;
        })
        .catch(err => {
          modification.isSelect = false;
          this.$message.error("审核失败");
        });
    },
    // 修改项目
    alterProject(modification) {
      // 选获取项目信息，在去修改项目
      getProject(modification.projectId)
        .then(res => {
          const data = res.data[0];
          let field = modification.modificationPlace;
          // field = field.replace(/_(\w)/g, ($, $1) => $1.toUpperCase());
          data[field] = modification.modificationContent;
          const project = {
            projectId: data.projectId,
            projectName: data.projectName,
            projectTime: data.projectTime,
            projectRequirement: data.projectRequirement,
            projectDescribe: data.projectDescribe,
            projectPrice: data.projectPrice
          };
          modificationProjectX(project)
            .then(res => {
              if (res.status == 0) {
                // 第一种
                this.$message.success("修改成功");
                modification.isSelect = false;

                // 第二种
                // this.changeProjectState();
              } else throw res.msg;
            })
            .catch(err => {
              modification.isSelect = false;
              this.$message.error("修改失败");
            });
        })
        .catch(err => console.log(err));
    },
    // 改变状态
    changeProjectState(modification) {
      examineProject(modification.projectId, "2")
        .then(res => {
          // 项目发布成功。等待管理员审核
          if (res.status == 0) {
            this.$message.success("修改成功");
            modification.isSelect = false;
          } else throw res.msg;
        })
        .catch(err => {
          modification.isSelect = false;
          this.$message.error("修改失败");
        });
    }
  },
  watch: {}
};
</script>
<style scoped>
.project-table {
  min-width: 1220px;
}
</style>
