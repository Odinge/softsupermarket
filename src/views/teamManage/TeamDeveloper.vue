<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-05 12:50:31
 * @LastEditTime: 2019-10-29 15:51:53
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <div class='team-manage'>
      <div v-show="show_if[0]">
        <div class="full_shadow" ref="full_shadow"></div>
        <!--<div class="line"></div>-->
        <div class="square">
          <div class="line2"></div>
          <div class="line3"></div>
          <table v-if="teamId">
            <tr>
              <td class="type">团队名：</td>
              <td>{{teamInfo.name}}</td>
            </tr>
            <tr>
              <td class="type">团队方向：</td>
              <td>{{teamInfo.direction}}</td>
            </tr>
            <tr>
              <td class="type">操作：</td>
              <td>
                <span class="dissolve" @click="dissolve">解散团队</span>
                <span class="detail" @click="detailClick(true)">查看详情</span>
              </td>
            </tr>
          </table>
        </div>
        <div class="notice">
          <div class="notice-nav">动态公告
            <!-- <span class="more">更多
              <i class="el-icon-d-arrow-right"></i>
            </span> -->
          </div>
          <ul v-if="noticeInfo">
            <li @click="noticeDetail(0)" v-if="noticeInfo[0].createTime"><span class="time">{{noticeInfo[0].createTime}}</span><span class="content">{{noticeInfo[0].title}}</span></li>
            <li @click="noticeDetail(1)" v-if="noticeInfo[1].createTime"><span class="time"> {{noticeInfo[1].createTime}}</span><span class="content">{{noticeInfo[1].title}}</span></li>
            <li @click="noticeDetail(2)" v-if="noticeInfo[2].createTime"><span class="time">{{noticeInfo[2].createTime}}</span><span class="content">{{noticeInfo[2].title}}</span></li>
            <li @click="noticeDetail(3)" v-if="noticeInfo[3].createTime"><span class="time">{{noticeInfo[3].createTime}}</span><span class="content">{{noticeInfo[3].title}}</span></li>
            <li @click="noticeDetail(4)" v-if="noticeInfo[4].createTime"><span class="time">{{noticeInfo[4].createTime}}</span><span class="content">{{noticeInfo[4].title}}</span></li>
          </ul>
        </div>
      </div>
      <devDetail :detail_info="detail_info" :copyInfo="detail_info" @goBack="goBack" @refresh="detailClick(false)" v-if="show_if[1]">
      </devDetail>
    </div>
  </div>
</template>
<script>
import devDetail from '@/views/teamManage/devDetail.vue'
import { getTeam, deleteTeam, getMyTeam } from "@/api/team";
import { publish, getStudenId, noticeList, getUserId } from "@/api/notice";
export default {
  components: {
    devDetail
  },
  data() {
    return {
      // teamIdBad:'',
      team: '',//保存自己（队长）团队信息
      detail_info: [],/*存储数据，传给子组件 devDetail*/
      show_if: [true, false], //大 小显示
      teamInfo: { name: '', direction: "" },
      noticeInfo: '',
      teams: '' //多个团队信息
    }
  },
  methods: {
    detailClick(bool) {
      let that = this;
      getTeam(this.teamId).then(function (res) {
        if (res.status === 0) {
          that.detail_info = res.data;
          that.teamInfo.name = res.data[0].teamName;
          that.teamInfo.direction = res.data[0].direction || '暂无';
          if (bool === true) {
            that.show_if = [false, true];
          }
        }
        else {
          that.fail('获取团队信息失败!');
          console.log(res)
        }
      }).catch(() => {
        that.fail('获取数据失败!')
      })
    },
    goBack() {
      this.show_if = [true, false];
    },
    noticeDetail(index) {
      if (!this.noticeInfo[index].announcementId) {
        return false
      }
      if (this.noticeInfo[index].announcementId) {
        this.$router.push({ name: 'teamNoticeDetail', params: { announcementId: this.noticeInfo[index].announcementId } });
      }
      else {
        return false;
      }
    },
    dissolve() {   /*解散处理函数*/
      this.$confirm('解散后将不能恢复，是否确定解散团队?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteTeam(this.teamId).
          then((res) => {
            if (res.status === 0) {
              this.$message({
                type: 'success',
                message: '解散团队成功，即将跳转至首页！'
              });
              window.localStorage.clear();
              // this.$router.push('http://www.ghjhhyuyuy.xin:8081/home')
              this.$router.push('http://software.sicau.edu.cn/')
            }
            else {
              console.log(res);
              this.fail('发生错误，删除失败，请稍后重试!')
            }
          }).catch(() => {
            this.fail('删除失败！')
          })      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解散'
        });
      });
    },
    success(msg) {
      this.$message({
        message: msg,
        type: 'success'
      });
    },
    fail(msg) {
      this.$message.error(msg);
    },
  },
  watch: {
    teamId: { //监听teamId变化
      handler: function (val) {
        if (val) {
          this.detailClick(false);
        }
      },
      immediate: true
    }
  },
  computed: {
    userId() {
      return this.$store.state.username;
    },
    teamId() {
      return JSON.parse(JSON.stringify(this.$store.state.teamId));
    }
  },
  created() {
    (async () => {
      if (!this.teamId) {
        let res = await getMyTeam(this.userId).catch(err => {
          this.$message.error('获取团队信息失败！');
          console.log(err)
        });
        if (res.status === 0) {
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            if (data[i] instanceof Array) {
              this.teams = JSON.parse(JSON.stringify(data[i]));
              this.teamId = JSON.parse(JSON.stringify(data[i][0]['团队id']));
            }
          }
        }
        else {
          this.$message.error(res.msg);
        }
      }
      this.detailClick(false);
      if (!this.teamId) {
        this.$message.error('团队id为空，信息异常，请联系开发人员');
      }
      noticeList().then((res) => {
        if (res.status === 0) {
          let data = res.data.slice(0, 6);
          for (let i = 0; i < data.length; i++) {
            let temp = data[i].createTime.slice(0, 11);
            data[i].createTime = '【' + temp + '】';
            temp = data[i].title.slice(0, 25);
            if (temp.length === 25) {
              temp = temp + '...';
            }
            data[i].title = temp;
          }
          let length = 5 - data.length;
          if (data.length < 6) {
            for (let i = 0; i < length; i++) {
              let temp = {};
              temp.createTime = ' ';
              temp.content = ' ';
              data.push(JSON.parse(JSON.stringify(temp)));
            }
          }
          this.noticeInfo = JSON.parse(JSON.stringify(data));
        }
      })
    })();
  }
}
</script>
<style scoped>
.team-manage {
  background-color: white;
  margin: 10px auto;
  width: 800px;
  height: 100%;
  border: 1px solid #aaa;
}
.detail {
  border: 1px solid #aaa;
  border-radius: 10px;
  padding: 0 8px;
  margin-left: 20px;
  cursor: pointer;
}
.notice {
  height: 250px;
  width: 600px;
  margin: 20px auto;
  border: 1px solid #ccc;
}
.notice li {
  padding: 5px 0 5px 20px;
  line-height: 30px;
  cursor: pointer;
}
li:hover .content {
  text-decoration: underline;
}
.notice li .time {
  color: #777;
  font-size: 14px;
  line-height: 30px;
}
li:nth-child(2),
li:nth-child(4),
li:nth-child(6) {
  background-color: #eee;
}
.notice .time {
  margin-right: 10px;
}
.notice-nav {
  height: 50px;
  background-color: #ccc;
  text-align: left;
  line-height: 50px;
  color: red;
  font-size: 20px;
  padding-left: 20px;
}
.more {
  float: right;
  line-height: 50px;
  margin-right: 20px;
  color: #999;
  font-size: 16px;
  cursor: pointer;
}

.line {
  width: 80%;
  height: 3px;
  background-color: #ccc;
  box-shadow: -1px -12px 20px rgba(1, 1, 1, 0.5);
  margin: 50px auto 50px auto;
}
.square {
  width: 600px;
  border: 1px solid #aaa;
  position: relative;
  box-shadow: 10px 10px 5px rgba(1, 1, 1, 0.1);
  margin: 40px auto;
  min-width: 400px;
}
.line2 {
  position: absolute;
  width: 80%;
  min-width: 360px;
  height: 1px;
  background-color: #aaa;
  top: 20px;
  left: 20px;
}
.line3 {
  position: absolute;
  width: 1px;
  height: 80%;
  background-color: #aaa;
  top: 10px;
  left: 30px;
}
table {
  margin: 30px 50px;
}
.type {
  font-weight: bold;
}
.square tr {
  line-height: 50px;
}
td {
  padding: 0 5px;
}
.dissolve {
  background-color: red;
  border-radius: 10px;
  padding: 0 10px;
  cursor: pointer;
  color: #ddd;
}
.full_shadow {
  position: fixed;
  display: none;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
  background-color: rgba(1, 1, 1, 0.3);
}

.confirm_msg {
  display: none;
  position: fixed;
  width: 500px;
  min-height: 220px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 110;
  background-color: #eee;
}
.icon {
  width: 100%;
  font-size: 50px;
  color: #db4a5c;
  text-align: center;
  margin: 20px 0;
}
.title {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.confirm_btn {
  text-align: center;
  margin-top: 30px;
}
.left_btn {
  display: inline-block;
  padding: 0 20px;
  margin-bottom: 20px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  text-align: center;
  box-shadow: 1px 1px 1px rgba(1, 1, 1, 0.3);
  border: 1px solid #ccc;
}
.left_btn:hover {
  background-color: #ddd;
}
.right_btn {
  display: inline-block;
  margin-left: 20px;
  line-height: 35px;
  cursor: pointer;
  padding: 0 15px;
  height: 37px;
  border: none;
  color: white;
  text-align: center;
  background-color: #0cd26e;
}
.right_btn:hover {
  background-color: #29f38d;
}
.drop {
  position: absolute;
  top: 20px;
  right: 50px;
}
.choose-title {
  font-size: 17px;
  font-weight: bold;
}
</style>
