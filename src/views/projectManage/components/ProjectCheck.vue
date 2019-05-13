<template>
  <div>
    <el-table
      v-loading="isLoading"
      :data="filterData"
      stripe
      max-height="500"
      class="project-table"
      :default-sort="{prop: 'state', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <project-detail :props="props.row"></project-detail>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" sortable></el-table-column>

      <el-table-column label="结项日期" sortable prop="projectTime">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.projectTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="承接团队" v-if="state === 0 && permission($roles.team)" :filters="tags" :filter-method="filterTag">
        <template slot-scope="scope">
          <span
            v-if="scope.row.applyNum === 1"
            v-overflow-e="scope.row.undertake[0].teamName"
          >{{ scope.row.undertake[0].teamName }}</span>
          <span v-else>{{ scope.row.applyNum }} 个团队</span>
        </template>
      </el-table-column>
      <el-table-column prop="undertakeNum" label="团队承接申请" v-if="state" :filters="tags" :filter-method="filterTag">
        <template slot-scope="scope">
          <span v-if="scope.row.undertakeNum === 0">无团队申请</span>
          <span v-else>{{ scope.row.undertakeNum }} 个团队</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="state"
        sortable
        label="状态"
        :filters="tags"
        :filter-method="filterTag"
        v-if="!state"
      >
        <template slot-scope="scope">
          <el-tag
            disable-transitions
            style="font-size:12px"
            :type="stateColor(scope.row.state)"
          >{{scope.row.state | filterState}}</el-tag>
          <el-button
            circle
            class="btn"
            title="取消发布"
            icon="el-icon-delete"
            @click="cancelPublish(scope.row.projectId)"
            v-if="(scope.row.state == 1 || scope.row.state == 3) && permission($roles.demander)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="permission($roles.demander)">
        <template slot-scope="scope" v-if="!scope.row.undertakeNum">
          <el-button
            circle
            class="btn"
            title="取消修改"
            icon="el-icon-delete"
            @click="cancelModificationProject(scope.row)"
            v-if="scope.row.modifiyState == '未审核' || scope.row.modifiyState == '条件不满足'"
          ></el-button>
          <el-button
            round
            v-else
            size="small"
            type="danger"
            icon="el-icon-edit"
            @click="alter(scope.row)"
          >修改</el-button>
          <el-tag
            class="btn"
            disable-transitions
            :type="stateColorTxt(scope.row.modifiyState)"
            v-if="state && scope.row.modifiyState"
          >{{ scope.row.modifiyState | filterModifiy}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <project-alter
      :check.sync="check"
      :form="project"
      :modifiyState="modifiyState"
      @update="getLoadData"
    ></project-alter>
    <!-- 分页器 -->
    <project-pagination :data="data" :filter-data.sync="filterData"></project-pagination>
  </div>
</template>
<script>
import ProjectPagination from "@/components/ProjectPagination";
import ProjectDetail from "../components/ProjectDetail";
import ProjectAlter from "./ProjectAlter";
import {
  getProject,
  getExamineProject,
  getProjectByState,
  getProjectByProgress,
  getModificationState,
  cancelPublish,
  cancelModificationProject,
  getModificationAndUndertake
} from "../../../api/project";
import { getTeam } from "../../../api/team";
export default {
  components: { ProjectPagination, ProjectDetail, ProjectAlter },
  props: {
    state: {
      default: 0
    }
  },
  data() {
    return {
      dataSrc: [], // 数据源
      filterData: [], // 数据筛选
      isLoading: true, // 数据是否加载
      btnLoading: false, // 按钮操作加载
      project: {
        projectId: "",
        projectName: "",
        projectTime: "",
        projectPrice: "",
        projectDescribe: "",
        projectRequirement: ""
      },
      check: false,
      modifiyState: "",
      tags: [
        { text: "没有团队申请", value: 0 },
        { text: "有团队申请的", value: 1 },
      ]
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
    filterTag(value, row) {
      let num = 0;
      if (row.undertakeNum !== undefined) {
        let num = row.undertakeNum;
      } else if (row.applyNum !== undefined) {
        let num = row.applyNum;
      }
      if (value === 0) {
        return num === 0;
      } else {
        return num >= value;
      }
    },
    // 获取加载的数据
    getLoadData() {
      if (this.state === 0) {
        this.getProjectUnchecked();
      } else {
        this.getProjectUndertake();
      }
    },
    // 未承接
    getProjectUndertake() {
      getProjectByProgress("未承接")
        .then(res => {
          if (res.status == 0) {
            this.dataSrc = res.data.map(item => {
              item.modifiyState = 0;
              this.getModificationState(item);
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
    // 项目未审核
    getProjectUnchecked() {
      getProjectByState("1,3")
        .then(res => {
          if (res.status == 0) {
            this.dataSrc = res.data.map(item => {
              item.undertake.forEach((it, index, self) => {
                it.teamName = self.length + " 个团队";
                this.getTeam(it.teamId, self, index);
              });
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
    // 修改
    alter(project) {
      this.project = {};
      this.project = {
        projectId: project.projectId,
        projectName: project.projectName,
        projectPrice: project.projectPrice,
        projectDescribe: project.projectDescribe,
        projectTime: project.projectTime.split("-"),
        projectRequirement: project.projectRequirement
      };
      this.check = true;

      // 确定修改类型
      let state = this.state ? 1 : 3;

      this.modifiyState = state;
    },
    getTeam(teamId, data, index) {
      getTeam(teamId)
        .then(res => {
          if (res.status == 0) {
            data[index] = res.data[0];
          } else throw res.msg;
        })
        .catch(err => this.$message.error("数据获取失败"));
    },
    // 获取项目修改状态
    getModificationState(row) {
      getModificationAndUndertake(row.projectId)
        .then(res => {
          if (res.status == 0) {
            let id = res.data.modificationIdList;
            if (id.length) {
              let modificationId = id[id.length - 1];
              row.modificationId = modificationId;
              getModificationState(modificationId)
                .then(res => {
                  if (res.status == 0) {
                    let state = res.data;
                    if (state !== "已删除") {
                      row.modifiyState = state;
                    } else {
                      row.modifiyState = 0;
                    }
                  } else throw res.msg;
                })
                .catch(err => this.$message.error(err));
            }
          } else throw res.msg;
        })
        .catch(err => this.$message.error(err));
    },
    // 取消修改
    cancelModificationProject(row) {
      this.$confirm(`确认取消修改？`, "取消修改", {
        type: "warning"
      })
        .then(() => {
          cancelModificationProject(row.modificationId)
            .then(res => {
              if (res.status == 0) {
                this.$message.success("取消成功");
                this.getModificationState(row);
              } else throw res.msg;
            })
            .catch(err => {
              this.$message.error("取消失败");
            });
        })
        .catch(() => this.$message.info("已取消"));
    },
    // 取消发布
    cancelPublish(projectId) {
      this.$confirm(`确认取消发布？`, "取消发布", {
        type: "warning"
      })
        .then(() => {
          cancelPublish(projectId)
            .then(res => {
              if (res.status == 0) {
                this.$message.success("取消成功");
                this.getLoadData();
              } else throw res.msg;
            })
            .catch(err => {
              this.$message.error("取消失败");
            });
        })
        .catch(() => this.$message.info("已取消"));
    }
  },
  watch: {
    state() {
      this.isLoading = true;
      this.getLoadData();
    }
  },
  filters: {
    filterModifiy(value) {
      const stateMap = new Map([
        ["未提交", "未提交"],
        ["未审核", "未审核"],
        ["已审核", "已修改"],
        ["条件不满足", "不通过"],
        ["黑名单", "黑名单"],
        ["已作废", "已作废"],
        ["已删除", "已删除"]
      ]);
      return stateMap.get(value);
    }
  }
};
</script>
<style scoped>
.btn {
  font-size: 12px;
  margin-left: 10px;
}
</style>
