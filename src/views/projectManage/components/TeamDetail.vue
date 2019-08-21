<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-27 15:35:03
 * @LastEditTime: 2019-08-13 15:44:16
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <h3 style="font-size:20px; margin:20px;">承接团队</h3>
    <el-table stripe :data="team" :default-sort="{prop: 'teamScore', order: 'descending'}" class="table-radius" v-loading="isLoading">
      <el-table-column prop="teamName" label="团队名称"></el-table-column>
      <el-table-column prop="direction" label="团队方向"></el-table-column>
      <el-table-column prop="teamScore" sortable label="团队分数">
        <template slot-scope="scope">
          <span style="color:#ff9900;font-size:18px">{{scope.row.teamScore}}</span>
          <!-- <rate :score="scope.row.teamScore" :base='20'></rate> -->
        </template>
      </el-table-column>
      <el-table-column prop="teamId" label="操作">
        <template slot-scope="scope">
          <router-link :to='{ name: "teamDetail", params: { id: scope.row.teamId } }' class="a-detail">团队详细</router-link>
          <!-- <el-button round type="text" size="small" @click="teamDetail(scope.row.teamId)">团队详细</el-button> -->
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
.a-detail {
  color: #409eff;
}
.a-detail:hover {
  color: #89b0d6;
}
.a-detail-select {
  color: rgb(231, 194, 73);
}
</style>
