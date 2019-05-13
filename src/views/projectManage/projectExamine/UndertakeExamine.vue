<template>
  <!-- 列表信息 -->
  <div class="project-list">
    <el-table
      v-loading="isLoading"
      :data="filterData"
      stripe
      max-height="500"
      class="project-table"
      :default-sort="{prop: 'projectTime', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <project-detail :props="props.row"></project-detail>
          <el-table
            stripe
            :data="props.row.teamUndertakePOList"
            :default-sort="{prop: 'teamScore', order: 'descending'}"
            class="table-radius"
          >
            <el-table-column prop="teamName" label="团队名称"></el-table-column>
            <el-table-column prop="direction" label="团队方向">
              <!-- <template slot-scope="scope">{{ teamDirection[scope.row.direction].directionName }}</template> -->
              <template slot-scope="scope">{{ scope.row.direction | filterTeamDirection }}</template>
            </el-table-column>
            <el-table-column prop="teamScore" sortable label="团队分数">
              <template slot-scope="scope">
                <rate :score="scope.row.teamScore" :base='20'></rate>
              </template>
            </el-table-column>
            <el-table-column prop="teamId" label="操作">
              <template slot-scope="scope">
                <el-button
                  round
                  type="success"
                  size="small"
                  icon="el-icon-edit-outline"
                  @click="undertakeProject(scope.row, '2')"
                  :loading="btnLoading"
                >承接</el-button>
                <el-button round type="text" size="small" @click="teamDetail(scope.row.teamId)">团队详细</el-button>
                <el-button
                  round
                  type="text"
                  size="small"
                  @click="timeNodeDetail(scope.row)"
                  :class="{'btn-select':scope.row.isSelect}"
                >查看项目方案</el-button>
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
import { getAllocation, examineAllocation } from "../../../api/project";
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
        {
          projectName: "猪场管家",
          projectRequirement: "认真仔细",
          projectTime: "2019-01-31",
          projectDescribe: "就是养猪的",
          projectPrice: "2000",
          releaseTime: "2019-01-31",
          projectId: "asd96eb3e28437216e3bfd92e9c72fd1",
          state: "未审核",
          teamUndertakePOList: [
            {
              teamId: "dafafawfawfafa",
              teamName: "学习网者团队",
              direction: "java后端",
              teamScore: 4
            },
            {
              teamId: "11adssdwcvee",
              teamName: "108团队",
              direction: "平面设计",
              teamScore: 3
            }
          ]
        },
        {
          projectName: "软件超市",
          projectRequirement: "认真仔细1",
          projectTime: "2019-02-20",
          projectDescribe: "就是搞软件的",
          projectPrice: "5000",
          releaseTime: "2019-01-31",
          projectId: "asd96eb3e28437216e3bfd92e9c7fsd2",
          state: "未审核",
          teamUndertakePOList: [
            {
              teamId: "wcaikaojawhjod",
              teamName: "man团队",
              direction: "app制作",
              teamScore: 5
            },
            {
              teamId: "212dawdvg",
              teamName: "909团队",
              direction: "平面设计",
              teamScore: 1
            }
          ]
        },
        {
          projectName: "这是一个项目",
          projectRequirement: "严谨严谨",
          projectTime: "2019-03-20",
          projectDescribe: "就是一个项目",
          projectPrice: "1000",
          releaseTime: "2019-01-21",
          projectId: "asd96eb3e2d437216e3bfd92e9c7fsd3",
          state: "未审核",
          teamUndertakePOList: [
            {
              teamId: "146416awdawdad",
              teamName: "王者团队",
              direction: "java后端",
              teamScore: 3
            }
          ]
        }
      ],
      check: false,
      timeNode: "",
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
    // this.isLoading = false;
    this.getLoadData();
    // this.$route.meta.msgNum = 10;
  },
  methods: {
    // 获取加载的数据
    getLoadData() {
      getAllocation()
        .then(res => {
          if (res.status == 0 || res.status == 10) {
            let { data } = res;
            this.dataSrc = data || [];
            this.getMsgNum();
            this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.$message.error("数据获取失败");
          this.isLoading = false;
        });
      // 获取团队方向列表
      // getAllTeamDirection().then(res => {
      //   this.teamDirection = res.data;
      // });
    },
    // 选择承接的团队
    undertakeProject(Curobj, state) {
      this.$confirm(`是否选择 ${Curobj.teamName} 团队承接此项目?`, "提示", {
        type: "warning",
        center: true
      }).then(() => {
        this.btnLoading = true;
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
    selected(Curobj) {
      this.select.isSelect = false;
      Curobj.isSelect = true;
      this.select = Curobj;
    }
  },
  watch: {}
};
</script>
<style scoped>
.table-radius {
  border-radius: 10px;
}
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
