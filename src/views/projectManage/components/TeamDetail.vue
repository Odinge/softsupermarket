<template>
  <div>
    <h3 style="font-size:20px; margin:20px;">承接团队</h3>
    <el-table stripe :data="team" :default-sort="{prop: 'teamScore', order: 'descending'}" class="table-radius" v-loading="isLoading">
      <el-table-column prop="teamName" label="团队名称"></el-table-column>
      <el-table-column prop="direction" label="团队方向"></el-table-column>
      <el-table-column prop="teamScore" sortable label="团队分数">
        <template slot-scope="scope">
          <rate :score="scope.row.teamScore" :base='20'></rate>
        </template>
      </el-table-column>
      <el-table-column prop="teamId" label="操作">
        <template slot-scope="scope">
          <el-button round type="text" size="small" @click="teamDetail(scope.row.teamId)">团队详细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Rate from "./Rate";
import { getTeam } from "../../../api/team";
export default {
  components: { Rate },
  props: ["teamData", "teamId"],
  data() {
    return {
      team: [],
      isLoading: true
    }
  },
  created() {
    if (this.teamData) {
      this.team[0] = this.teamData;
      this.isLoading = false;
    } else {
      this.getTeamData();
    }
  },
  methods: {
    getTeamData(teamId = this.teamId) {
      getTeam(teamId).then(res => {
        if (res.status == 0) {
          this.team = res.data;
          this.isLoading = false;
        } else throw res;
      }).catch(err => {
        this.$message.error("获取团队信息失败");
        this.isLoading = false;
      });
    },
    teamDetail(teamId) {
      this.$router.push({ name: "teamDetail", params: { id: teamId } });
    },
  }
}
</script>

<style>
</style>
