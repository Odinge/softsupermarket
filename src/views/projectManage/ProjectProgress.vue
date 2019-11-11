<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-11-11 19:21:13
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="project-progress" ref="page" @scroll="scroll">
    <el-button @click="back" icon="el-icon-back" class="btn-back">返回</el-button>
    <el-button circle class="back-top" type="danger" title="返回顶端" @click="toTop" v-show="scrollTop">top</el-button>
    <div class="project-detail" :class="{showDetail:showDetail}">
      <span class="el-icon-document detail" @click="showDetail = !showDetail" title="项目详情"></span>
      <project-detail :projectId="projectId" class="detail-list"></project-detail>
    </div>

    <el-card class="box-card" v-loading="isLoading">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span class="title-head">
          <i class="el-icon-date sec-head-title"></i>项目日程表
        </span>
        <span class="score-head" v-if="!isRun  && !isLoading">
          <span class="score-title">项目分数</span>
          <rate :score="originScore" style="display:block"></rate>
        </span>
        <el-tag disable-transitions class="state-tag" style="font-size:12px;color:#fff" color="#ff0000a6" v-if="timeout">项目超时</el-tag>

        <el-tag disable-transitions class="state-tag" style="font-size:12px" type="danger" v-if="overtime">超时{{ overtime }}次</el-tag>

        <el-tag disable-transitions class="state-tag" style="font-size:12px" type="danger" v-if="delayTime">已延期 {{ delayTime }} 天</el-tag>

        <el-tag class="state-tag" :type="stateColorTxt(delayState)" v-if="delayState">延期申请状态：{{delayState | filterStateTxt}}</el-tag>

        <template v-if="permission($roles.team) && isRun && !isLoading ">
          <el-button v-if="delayState == '未审核'" round class="btn-delay" size="medium" @click="cancelDelay">取消延期</el-button>
          <el-button v-else round class="btn-delay" type="warning" size="medium" @click="openDelay">延期</el-button>
        </template>
        <template v-if="!isRun  && !isLoading">
          <el-tag class="btn-delay" disable-transitions style="font-size:12px; margin-top:10px;" type="danger" v-if="scoreFlag">未评分</el-tag>
          <el-button class="btn-delay" type="text" @click="showEevaluate=true" v-if="permission(...$roles.manager)">查看评价</el-button>
          <el-button round class="btn-delay" type="warning" size="medium" @click="openScore" v-if="permission(...$roles.manager)">打分</el-button>
        </template>
      </div>
      <!-- 上传文件 -->
      <input type="file" ref="file" style="display: none;" @change="selectedFile">
      <div class="err" v-if="isErr && !isLoading">
        <span>没有任何数据</span>
      </div>
      <!-- 步骤 -->
      <el-steps direction="vertical" :active="active" class="step" finish-status="success" v-else-if="!isLoading">
        <el-step v-for="(node, key) in timeNode" :key="key">
          <template slot="title">
            <i class="el-icon-time"></i>
            {{ node.time }}
          </template>
          <template slot="description">
            <span class="things">{{ node.things }}</span>
            <!-- 操作按钮 -->
            <div class="btn-box">
              <!-- <template v-if="isPrevNode(key) && permission(...$roles.manager, $roles.demander)"> -->
              <template v-if="isPrevNode(key)">
                <!-- 下载按钮 -->
                <el-button circle class="btn" icon="el-icon-download" @click="download(node)" :loading="node.isSelect" :disabled="(achievementState == 0 || achievementState == 6 && permission(...$roles.manager, $roles.demander)) && isCurRunNode(key)"></el-button>
                <a :href="getDownloadUrl(node)" v-show="false" ref="download"></a>
                <!-- 显示节点状态 -->
                <el-tag class="state-tag" disable-transitions :type="stateColor(achievementState)" v-if="isCurRunNode(key) && permission(...$roles.manager, $roles.demander)">{{achievementState | filterStateSub}}</el-tag>
              </template>

              <!-- 操作按钮  start -->
              <template v-if="isCurRunNode(key)">
                <!-- 管理员的操作按钮 -->
                <div class="btn" v-if="permission(...$roles.manager)">
                  <el-button circle size="small" type="success" icon="el-icon-check" :loading="btnLoading" @click="examine('2')" class="state-tag" :disabled="achievementState != 1"></el-button>
                  <el-button circle size="small" icon="el-icon-close" type="danger" :loading="btnLoading" @click="examine('3')" :disabled="achievementState != 1"></el-button>
                </div>
                <!-- 开发团队的操作按钮 -->
                <div class="btn" v-if="permission($roles.team)">
                  <el-button circle title="选择文件" @click="triggerSelect" icon="el-icon-document" :disabled="achievementState ==  1"></el-button>
                  <!-- 上传 -->
                  <el-button circle type="danger" icon="el-icon-upload" :disabled="file.length === 0" @click="handleUpdate" :loading="btnLoading" title="上传文件"></el-button>
                  <!-- 当前节点状态 -->
                  <el-tag class="state-tag" disable-transitions :type="stateColor(achievementState)">{{ achievementState | filterStateSub}}</el-tag>
                  <!-- type="danger" -->
                  <el-button class="state-tag" circle title="取消提交" icon="el-icon-delete" :loading="delLoading" @click="cancelAchievement" v-if="(achievementState == 1) && permission($roles.team)"></el-button>
                  <!-- 提交文件记录 -->
                  <div class="file-list" v-show="file.length" :class="{error:file.state}">
                    <i class="el-icon-document"></i>
                    <span>{{ file.name }}</span>
                    <i class="el-icon-error" style="margin-left:20px;color:#F56C6C;cursor:pointer" v-show="file.state" @click="clearFile"></i>
                  </div>
                  <!-- 提示信息 -->
                  <div class="tip">
                    请上传1个成果文件。文件类型为：
                    <!-- <strong class="tip-msg">文本文件</strong>、 -->
                    <strong class="tip-msg">压缩文件</strong>
                    <!-- <strong class="tip-msg">图片</strong> -->
                  </div>
                </div>
              </template>
              <!-- 操作按钮  end -->

              <!-- 历史记录  start -->
              <div class="recode" v-if="isPrevNode(key)">
                <h4 class="title">
                  <span @click="openHistory(node)">历史</span>
                </h4>
                <div class="list" :class="{'active':node.showHistory}">
                  <el-table :data="node.historys" stripe max-height="300" :default-sort="{prop: 'commitTime', order: 'descending'}" v-loading="node.historyLoading">
                    <el-table-column prop="achievementContent" label="提交内容">
                      <template slot-scope="scope">
                        <span v-overflow-e="scope.row.achievementContent">
                          <i class="el-icon-document"></i>
                          {{ scope.row.achievementContent }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="commitTime" label="提交时间" sortable>
                      <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span>{{ scope.row.commitTime }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="state" label="提交状态">
                      <template slot-scope="scope">
                        <el-tag :type="stateColor(scope.row.state)">{{scope.row.state | filterState}}</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <!-- 历史记录 end -->
            </div>
          </template>
        </el-step>
      </el-steps>
    </el-card>

    <!-- 延期对话框 -->
    <project-delay :is-delay.sync="isDelay" :active-time="activeTime" @updateData="getId"></project-delay>
    <!-- 评价项目 -->
    <el-dialog center width="400px" title="项目评分" :visible.sync="isScore" class="rate-box" v-loading="scoreLoading" element-loading-text="拼命申请中" @closed="closeScore">
      <div class="rate-box">
        <el-rate v-model="score" :max="10" allow-half show-score class="rate" text-color="#ff9900" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" score-template="{value}"></el-rate>
        <el-form ref="form" :model="scoreForm" class="form-score" label-position="top" @submit.native.prevent>
          <el-form-item label="评价" prop="evaluate" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input type="textarea" v-model="scoreForm.evaluate"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="text" @click="delayRate">延迟评价</el-button>
        <el-button type="primary" round @click="submitRate">提交</el-button>
      </div>
    </el-dialog>
    <project-evaluate :check.sync="showEevaluate" :runId="runId"></project-evaluate>
  </div>
</template>
<script>
import ProjectDelay from "./components/ProjectDelay";
import projectEvaluate from "./components/projectEvaluate";
import Rate from "./components/Rate";
import ProjectDetail from "./components/ProjectDetail";
import {
  scoring,
  changeProcess,
  getAllTimeNodes,
  timeoutJudgement,
  getProgress,
  getDelayState,
  getAchievementState,
  getAchievementHistory,
  examineAchievements,
  downloadAchievement,
  uploadAchievements,
  cancelDelay,
  cancelAchievement,
  getDelayAndAchievementsByRunId,
  collectProject,
  getAllDelayTime
} from "../../api/project";
export default {
  components: { ProjectDelay, Rate, ProjectDetail, projectEvaluate },
  data() {
    return {
      isErr: true,
      showEevaluate: false,
      showDetail: false,
      scrollTop: 0,
      isLoading: true,
      btnLoading: false,
      delLoading: false,
      timeNode: [],
      active: 0,
      // 延迟信息
      isDelay: false,
      delayState: 0,
      delayId: "",
      delayTime: 0,
      // 评分
      score: 0,
      originScore: 0,
      isScore: false,
      scoreLoading: false,
      scoreFlag: false,
      scoreForm: {
        evaluate: ""
      },
      // 超时
      timeout: 0,
      // 文件系统
      file: {
        name: "未提交文件",
        length: 0,
        content: null,
        type: "3",
        state: 0
      },
      // isRun: false,
      achievementState: 0,
      achievementId: "",
    };
  },
  computed: {
    curTimeNode() {
      return (this.active + 1).toString();
    },
    curNode() {
      return this.timeNode[this.active];
    },
    runId() {
      return this.$route.params.id;
    },
    projectId() {
      return sessionStorage.getItem("projectId") || "";
    },
    rate() {
      return +this.$route.query.check;
    },
    check() {
      return this.rate === -1;
    },
    overtime() {
      return +this.$route.query.overtime;
    },
    steps() {
      return this.timeNode.length;
    },
    // 当前项目时间
    activeTime() {
      // 初始化延时日期
      let index = this.active % this.steps;
      let node = this.timeNode[index];
      return node ? new Date(node.time) : new Date();
    },
    isRun() {
      return this.steps > 0 && this.steps != this.active;
    }
  },
  mounted() {
    this.score = this.rate || 0;
    this.check && (this.score = 0);
    this.originScore = this.score;
    this.scoreFlag = this.check;
    this.getTimeNode();

    // window.addEventListener("focus", this.getTimeNode);
  },
  // beforeRouteLeave(to, from, next) {
  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
  // window.removeEventListener("focus", this.getTimeNode);
  // next();
  // },
  methods: {
    // 返回上一页
    back() {
      this.$router.go(-1);

    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    // 返回顶端
    toTop() {
      this.$refs.page.scrollTo(0, 0);
    },
    scroll(e) {
      let target = e.srcElement || e.target;
      this.scrollTop = target.scrollTop;
    },
    // 取消延期
    cancelDelay() {
      this.$confirm(`确认取消延期？`, "取消延期", {
        type: "warning"
      })
        .then(() => {
          cancelDelay(this.delayId)
            .then(res => {
              if (res.status == 0) {
                this.getId();
                this.$message.success("取消成功");
              } else throw res.msg;
            })
            .catch(err => {
              this.$message.error("取消失败");
            });
        })
        .catch(() => this.$message.info("已取消"));
    },
    // 取消成果提交
    cancelAchievement() {
      this.$confirm(`确认取消提交？`, "取消提交", {
        type: "warning"
      })
        .then(() => {
          this.delLoading = true;
          this.delAchievement();
        })
        .catch(() => this.$message.info("已取消"));
    },
    // 删除提交
    delAchievement(callback) {
      cancelAchievement(this.achievementId)
        .then(res => {
          if (res.status == 0) {
            this.loadHistory();
            if (!callback) {
              this.$message.success("取消成功");
              this.delLoading = false;
            } else {
              callback();
            }
          } else throw res.msg;
        })
        .catch(err => {
          this.$message.error("取消失败");
          !callback && (this.delLoading = false);
        });
    },
    // 超时判断
    getTimeout() {
      timeoutJudgement(this.runId)
        .then(res => {
          if (res.status == 0) {
            this.timeout = res.data;
            this.getId();
          } else throw res.msg;
        })
        .catch(err => {
          this.isLoading = false;
          this.timeout = 0;
          // this.$message.error("超时判断失败！");
        });
    },
    getDelayTime() {
      getAllDelayTime(this.runId)
        .then(res => {
          if (res.status == 0) {
            this.delayTime = res.data ? res.data.allTime : 0;
          } else throw res.msg;
        })
        .catch(err => this.$message.error("延期获取失败！"));
    },
    // 获取进度
    getProgress() {
      getProgress(this.runId)
        .then(res => {
          if (res.status == 0) {
            let { data } = res;
            if (data === "已完成") {
              this.active = this.steps;
              this.loadHistory();
            } else {
              let index = data.split(/_| /)[0] - 1;
              this.active = index;
              // this.isRun = true;
            }
            // 添加项目信息
            this.getDelayTime();
            if (this.isRun) {
              this.getTimeout();
            } else this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error("进度获取失败");
        });
    },
    // ============================历史======================
    // 打开加载当前历史
    loadHistory() {
      let index = this.isRun ? this.active : this.active - 1;
      this.openHistory(this.timeNode[index], true);
    },
    // 打开历史记录
    openHistory(node, state) {
      node.showHistory = state !== undefined ? state : !node.showHistory;
      // 查找历史记录
      node.showHistory && this.getHistoryRecoed(node);
    },
    // 获取历史记录
    getHistoryRecoed(node) {
      node.historyLoading = true;
      getAchievementHistory(this.runId, node.number)
        .then(res => {
          if (res.status == 0 || res.status == 1) {
            let { data } = res;
            data = data instanceof Array ? data : [data];
            let historys = data[0] ? data : [];
            node.historys = historys;
            node.historyLoading = false;
            if (node === this.curNode) {
              let history = historys[historys.length - 1] || {};
              // if (history) {
              this.achievementState = history.state || 0;
              this.achievementId = history.achievementId || "";
              // }
            }
          } else throw res.msg;
        })
        .catch(err => {
          node.historyLoading = false;
          this.$message.error(err);
        });
    },
    // =======================获取节点数据====================
    // 获取节点信息生成节点树
    getTimeNode() {
      getAllTimeNodes(this.runId)
        .then(res => {
          if (res.status == 0) {
            // 对数据进行处理
            let { data } = res;
            data = data.split(";");

            this.timeNode = data.map(item => {
              item = item.split(" ");
              return {
                number: item[0],
                time: item[1],
                things: item[2],
                isSelect: false,
                historys: [],
                showHistory: false,
                historyLoading: true
              };
            });

            if (!(data.length === 1 && this.timeNode[0].things == undefined)) {
              this.isErr = false;
            }
            // 获取项目进度
            this.getProgress();
          } else throw res.msg;
        })
        .catch(err => {
          this.$message.error("信息获取失败");
          this.isLoading = false;
        });
    },
    // =========================上传文件======================
    // 触犯文件选择
    triggerSelect() {
      this.$refs.file.value = "";
      this.$refs.file.click();
    },
    // 清除上传组件的文件列表
    clearFile() {
      this.file.length = 0;
      this.$refs.file.value = "";
    },
    // 获取文件信息
    selectedFile(e) {
      this.file.state = 0;
      let files = e.target.files;
      let name = files[0].name;
      this.handleExceed(files, name);
    },
    // 上传文件检查
    handleExceedTest(files, name) {
      // let types = ["文本文档", "压缩包", "脑图"];
      let type_png = /\.(png|jpe?g|gif|svg|bmp)(\?.*)?$/i;
      // let type_txt = /\.(txt|doc|docx|rtf|md|ppt|pptx)(\?.*)?$/i;
      let type_txt = /\.(txt)(\?.*)?$/i;
      let type_zip = /\.(zip|gz|z|rar|arj)(\?.*)?$/i;
      if (name.includes(".")) {
        if (type_png.test(name) || type_txt.test(name) || type_zip.test(name)) {
          this.file.type = type_png.test(name)
            ? "3"
            : type_zip.test(name)
              ? "2"
              : "1";
          this.file.content = files[0];
          this.file.name = name;
          this.file.length = files.length;
        } else {
          this.$message({
            type: "warning",
            showClose: true,
            duration: 5000,
            dangerouslyUseHTMLString: true,
            message: `<p style='line-height:20px'>
            文件类型不正确！
            必须为:
            <p>
              <strong class='tip-msg'>文本文件</strong>、
              <strong class='tip-msg'>压缩文件</strong>、
              <strong class='tip-msg'>图片</strong>类型
            </p></p>`
          });
          this.clearFile();
        }
      } else {
        this.$message.warning("上传文件无效！");
        this.clearFile();
      }
    },
    handleExceed(files, name) {

      // let types = ["文本文档", "压缩包", "脑图"];
      let type_png = /\.(png|jpe?g|gif|svg|bmp)(\?.*)?$/i;
      // let type_txt = /\.(txt|doc|docx|rtf|md|ppt|pptx)(\?.*)?$/i;
      let type_txt = /\.(txt)(\?.*)?$/i;
      let type_zip = /\.(zip|gz|z|rar|arj|cab)(\?.*)?$/i;
      if (name.includes(".")) {
        if (type_zip.test(name)) {
          this.file.type = type_png.test(name)
            ? "3"
            : type_zip.test(name)
              ? "2"
              : "1";
          this.file.content = files[0];
          this.file.name = name;
          this.file.length = files.length;
        } else {
          this.$message({
            type: "warning",
            showClose: true,
            duration: 5000,
            dangerouslyUseHTMLString: true,
            message: `<p style='line-height:20px'>
            文件类型不正确！
            必须为:
            <p>
              <strong class='tip-msg'>压缩文件</strong>
            </p></p>`
          });
          this.clearFile();
        }
      } else {
        this.$message.warning("上传文件无效！");
        this.clearFile();
      }
    },
    // 上传行为
    handleUpdate() {
      if (this.file.length) {
        this.$confirm(`确认上传 ${this.file.name} 文件？`, "上传文件", {
          type: "warning"
        })
          .then(() => this.upload(this.file.content, this.file.type))
          .catch(err => this.$message.info("已取消文件上传"));
      } else this.$message.error("未选择任何文件！");
    },
    upload(files, type) {
      // 创建表单数据
      let formData = new FormData();
      formData.append("runId", this.runId);
      formData.append("timeNode", this.curTimeNode);
      formData.append("achievementType", type);
      formData.append("achievement", files);
      this.btnLoading = true;
      // 上传文件
      uploadAchievements(formData)
        .then(res => {
          if (res.status == 0) {
            this.file.length = 0;
            // 上一次提交是否未审核
            if (this.achievementState == 1) {
              this.delAchievement(() => {
                this.$message.success("上传成功");
                this.btnLoading = false;
              })
            } else {
              // 显示记录
              this.loadHistory();
              this.$message.success("上传成功");
              this.btnLoading = false;
            }

          } else throw res.msg;
        })
        .catch(err => {
          this.$message.error("上传失败");
          this.btnLoading = false;
          // 改变文件状态
          this.file.state = 1;
        });
    },
    // =======================下载文件========================
    getDownloadUrl(node) {
      return this.$baseUrl + "/v1/nonpub/supervise/downloadAchievement?runId=" + this.runId + "&timeNode=" + node.number;
    },
    download(Curobj) {
      Curobj.isSelect = true;
      let timeNode = Curobj.number;
      downloadAchievement(this.runId, timeNode)
        .then(res => {
          if (res.status) {
            this.$message.error("下载失败" + res.msg);
          } else {
            this.$refs.download[timeNode - 1].click();
            this.$message.success("资源获取成功");
          }
          Curobj.isSelect = false;
        })
        .catch(err => {
          this.$message.error("下载失败");
          Curobj.isSelect = false;
        });
    },

    // ========================延期==========================
    // 项目延期按钮
    openDelay() {
      // 打开对话框
      this.isDelay = true;
    },
    // 获取延期状态
    getDelayState(delayId) {
      this.delayId = delayId;
      getDelayState(delayId)
        .then(res => {
          if (res.status == 0) {
            if (res.data === "未审核" || res.data === "条件不满足") {
              this.delayState = res.data;
            } else {
              this.delayState = 0;
            }
            this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error("获取延期状态失败");
        });
    },
    // 获取上传成果状态
    getAchievementState(achievementId) {
      this.achievementId = achievementId;
      getAchievementState(achievementId)
        .then(res => {
          if (res.status == 0) {
            this.achievementState = res.data;
            this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error("获取成果状态失败");
        });
    },
    // 获取延期id和成果id
    getId() {
      getDelayAndAchievementsByRunId(this.runId)
        .then(res => {
          if (res.status == 0) {
            let { data } = res;
            let id = data[data.length - 1];
            if (id && id.delayId) {
              this.getDelayState(id.delayId);
            } else this.isLoading = false;
            this.loadHistory();
          } else throw res.msg;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error("ID获取失败");
        });
    },
    // ======================评分============================
    // 打开评分
    openScore() {
      this.isScore = true;
    },
    closeScore() {
      if (this.scoreFlag) {
        this.score = this.originScore;
      }
      this.resetForm();
    },
    // 评分
    scoring(score, show) {
      scoring(this.runId, score, this.scoreForm.evaluate)
        .then(res => {
          if (res.status == 0) {
            let flag = score === -1;
            this.scoreFlag = flag;
            this.originScore = flag ? 0 : score;

            if (!show) {
              this.$message.success("评分成功");
              this.isScore = false;
              this.$router.replace({
                name: "projectProgress",
                params: { id: this.runId },
                query: { check: score }
              });
              this.$route.meta.check = score;
              // this.getAllTimeNodes();
              this.getTimeNode();
            }
          } else throw res.msg;
          this.scoreLoading = false;
        })
        .catch(err => {
          this.$message.error("评分失败");
          this.scoreLoading = false;
        });
    },
    // 确认打分
    tempRate(score, msg) {
      this.$confirm(msg, "提示", { type: "warning" })
        .then(ok => {
          this.scoreLoading = true;
          this.scoring(score);
        })
        .catch(cancel => this.$message.info("已取消操作"));
    },
    // 延期评价
    delayRate() {
      this.tempRate(-1, `确认延期打分？`);
    },
    // 打分
    submitRate() {
      this.$refs.form.validate(vali => {
        if (vali) {
          this.tempRate(this.score, `确认为该项打 ${this.score} 分？`);
        } else {
          return false;
        }
      });
    },

    // ========================管理员审核========================
    // 审核成果
    examine(state) {
      this.btnLoading = true;
      examineAchievements(this.achievementId, state)
        .then(res => {
          if (res.status == 0) {
            this.achievementState = 0;
            if (state == 2) {
              this.changeProcess();
            } else {
              this.$message.success("审核成功");
              this.loadHistory();
              this.btnLoading = false;
            }
          } else throw res.msg;
        })
        .catch(err => {
          this.btnLoading = false;
          this.$message.error("提交审核失败");
        });
    },
    // 改变进度
    changeProcess() {
      changeProcess(this.runId)
        .then(res => {
          if (res.status == 0) {
            if (res.msg === "已完成项目") {
              // this.isRun = false;
              this.active = this.steps;
              this.scoreFlag = true;
            } else {
              this.$message.success("审核成功");
            }
            // this.loadHistory();
            this.getTimeNode();
            this.btnLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.btnLoading = false;
          this.$message.error("改变进度审核失败");
        });
    },
    // ========================权限按钮========================
    // 控制按钮显示隐藏
    // 当前节点显示且只在运行时显示
    isCurRunNode(key) {
      return key === this.active && this.isRun;
    },
    // 当前节点显示
    isCurNode(key) {
      return key === this.active;
    },
    // 在当前节点和之前显示
    isPrevNode(key) {
      return key <= this.active;
    }
  },
  watch: {
    active(newVal) {
      // 检查是否完成项目
      if (!this.isRun) {
        if (isNaN(this.rate)) {
          this.$message.success("完成项目");
          this.scoring(-1, true);
        }
        if (
          (isNaN(this.rate) || this.check) &&
          this.permission(...this.$roles.manager)
        ) {
          this.openScore();
        }
      }
    }
  }
};
</script>
<style scoped>
.project-progress {
  position: relative;
}
/* 返回按钮 */
.btn-back {
  position: fixed;
  display: block;
  margin: 7px 20px;
  z-index: 9;
}
.back-top {
  position: fixed;
  right: 50px;
  bottom: 80px;
  width: 40px;
  height: 40px;
  padding: 0;
  z-index: 88;
  box-shadow: 0 0 4px rgb(133, 86, 86);
}
.back-top::after {
  position: absolute;
  content: "^";
  top: 3px;
  left: 50%;
  transform: translate(-50%);
}

.project-detail {
  position: fixed;
  overflow: hidden;
  width: 100%;
  z-index: 8;
  height: 30px;
  margin-left: -30px;
}
.showDetail {
  height: auto;
}
.detail-list {
  width: 80%;
  margin: 0 auto 10px;
  /* background-color: rgb(251, 244, 222); */
  background-color: #fff;
  box-shadow: 0 0 5px #ccc;
  border-right: 3px solid #79beff;
  border-left: 3px solid #79beff;
}
.detail-list:hover {
  box-shadow: 0 0 8px #ccc;
}
.project-detail .detail {
  display: block;
  width: 0;
  height: 0;
  margin: 0 auto 20px;
  border: 30px solid transparent;
  border-top-color: #f56c6c;
  border-bottom: none;
  color: #fff;
  cursor: pointer;
}
.project-detail .detail::before {
  position: absolute;
  margin-top: -27px;
  margin-left: -7px;
}

/* btn组基础样式 */
.btn {
  display: inline-block;
}
/* 延期 */
.btn-delay {
  float: right;
  margin-top: 8px;
  margin-right: 20px;
}
.box-card {
  position: relative;
  width: 800px;
  margin: 55px auto 30px;
  z-index: 2;
}
.title-head {
  line-height: 46px;
}
/* 头部评分 */
.score-head {
  float: right;
  /* padding: 10px 0 3px; */
  padding-right: 10px;
  text-align: center;
}
.score-title {
  display: inline-block;
  padding-bottom: 10px;
}
.rate-box {
  text-align: center;
}
.rate {
  display: inline-block;
  font-size: 30px;
}
/* 事件 */
.things {
  display: inline-block;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 0.5em;
  background-color: beige;
}
/* 状态标签 */
.state-tag {
  margin-left: 20px;
}
.block {
  display: block;
}
.file-list {
  padding: 7px;
  padding-bottom: 0;
}
.error {
  color: #f56c6c;
}
.tip {
  border-top: 1px solid #ccc;
  margin-top: 10px;
  padding-top: 4px;
  padding-left: 10px;
  /* color: rgb(71, 77, 77); */
  /* font-style:italic; */
}
.tip::before {
  content: "*";
  color: coral;
}
.tip-msg {
  color: #f1d27b;
  font-weight: bold;
}

/* 历史记录 */
.recode {
  width: 660px;
  margin-top: 16px;
  margin-bottom: 18px;
}
.recode .title {
  position: relative;
  border-bottom: 2px solid rgb(145, 192, 236);
  text-align: right;
  z-index: 1;
}
.recode .title span {
  display: inline-block;
  position: absolute;
  top: -24px;
  padding: 5px 8px;
  background-color: rgb(145, 192, 236);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  user-select: none;
}
.recode .title span::before,
.recode .title::after {
  content: "";
  display: block;
  position: absolute;
}
.recode .title::after {
  top: 1px;
  width: 10px;
  height: 10px;
  background-color: rgb(145, 192, 236);
  border-radius: 50%;
  transform: translateY(-50%);
}
.recode .title span::before {
  right: 9px;
  top: 11px;
  width: 0;
  height: 0;
  border: 14px solid rgb(145, 192, 236);
  border-top-color: transparent;
  border-right-color: transparent;
  transform: rotate(45deg);
}
.recode .list {
  overflow: hidden;
  width: 630px;
  height: 0;
  margin-left: 20px;
  background-color: rgba(138, 137, 137, 0.267);
  color: #000;
  /* transition: 1s; */
}
.recode .list.active {
  height: auto;
}

.err {
  color: #f56c6c;
  text-align: center;
}
</style>

