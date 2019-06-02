<template>
  <!-- 延期对话框 -->
  <el-dialog center width="440px" title="申请延期" :visible.sync="isDelay" :before-close="handleClose" @open="openDelay" v-loading="isLoading" element-loading-text="拼命申请中">
    <el-form ref="form" :model="delayForm" :rules="rules" label-width="80px">
      <el-form-item label="延期时间" prop="delayTime">
        <el-date-picker type="date" placeholder="选择日期" v-model="delayForm.delayTime"></el-date-picker>
      </el-form-item>
      <i class="el-icon-sort cont-icon"></i>
      <el-form-item label="延期天数" prop="delayDay">
        <el-autocomplete clearable placeholder="数字" v-model="delayForm.delayDay" :fetch-suggestions="querySearch" class="inline-input day" prefix-icon="el-icon-time" @select="handleSelectDay">
          <el-select v-model="selectDay" slot="append" placeholder="请选择">
            <el-option label="天" value="天"></el-option>
            <el-option label="周" value="周"></el-option>
            <el-option label="月" value="月"></el-option>
            <el-option label="年" value="年"></el-option>
          </el-select>
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { delayApply, getDelayState } from "../../../api/project";
export default {
  props: ["isDelay", "activeTime"],
  data() {
    // 日期的验证
    let validateTime = (rule, value, callback) => {
      let old = this.activeTime;
      if (/^\s*$/.test(value) || !value) {
        this.delayForm.delayDay = "";
        callback(new Error("不能为空"));
      } else if (isNaN(value)) {
        callback(new Error("数字无效"));
      } else if (old >= value) {
        this.changeDelayDay(value);
        callback(new Error("日期不能小于当前项目日期"));
      } else {
        this.changeDelayDay(value);
        callback();
      }
    };
    let validateDay = (rule, value, callback) => {
      // 转换成数字类型
      let numVal = value * 1;
      this.changeDelayTime();
      if (/^\s*$/.test(value)) {
        this.delayForm.delayTime = "";
        callback(new Error("不能为空"));
      } else if (isNaN(numVal)) {
        callback(new Error("必须为数字值"));
      } else if (numVal <= 0) {
        callback(new Error("不能小于等于0"));
      } else {
        callback();
      }
    };
    return {
      // 延迟信息
      delayForm: {
        delayTime: "",
        delayDay: ""
      },
      rules: {
        delayTime: [{ validator: validateTime, trigger: "change" }],
        delayDay: [{ validator: validateDay, trigger: "change" }]
      },
      selectDay: "天",
      presetTime: [
        { value: "1天" },
        { value: "2天" },
        { value: "1周" },
        { value: "2周" },
        { value: "1月" },
        { value: "2月" }
      ],
      isLoading: false
    };
  },
  computed: {
    // 当前的延期天数
    delayTime() {
      // 对时间做处理，将日期处理为天数
      const date = new Date(this.activeTime);
      const oldDate = date.getDate();
      const delayDay = this.delayForm.delayDay * 1;
      switch (this.selectDay) {
        case "天":
          return date.setDate(oldDate + delayDay);
          break;
        case "周":
          return date.setDate(oldDate + delayDay * 7);
          break;
        case "月":
          return date.setDate(oldDate + delayDay * 30);
          break;
        case "年":
          return date.setDate(oldDate + delayDay * 365);
          break;
      }
    },
    runId() {
      return this.$route.params.id;
    }
  },
  methods: {
    // 关闭对话框
    close() {
      this.$emit("update:isDelay", false);
    },
    changeState() {
      this.$emit("updateData");
    },
    // 关闭申请对话框
    handleClose() {
      this.$refs.form.resetFields();
      this.close();
    },
    // 项目延期按钮
    openDelay() {
      // 初始化延时日期
      const date = new Date(this.activeTime);
      const oldDate = date.getDate();
      this.delayForm.delayTime = date.setDate(oldDate + 1);
      this.delayForm.delayDay = "1";
      this.selectDay = "天";
    },
    // 根据天数改变时间
    changeDelayTime() {
      this.delayForm.delayTime = this.delayTime;
    },
    // 根据时间改变天数
    changeDelayDay(time) {
      // 获取时间差值
      const dd = time - this.activeTime;
      let delayDay = dd / 1000 / 60 / 60 / 24;
      this.delayForm.delayDay = delayDay + "";
      this.selectDay = "天";
    },
    createFilter(queryString) {
      return time => {
        return (
          time.value
            .toString()
            .toLowerCase()
            .indexOf(queryString.toString().toLowerCase()) === 0
        );
      };
    },
    // 返回预设的天数信息
    querySearch(queryString, cb) {
      var presetTime = this.presetTime;
      var results = queryString
        ? presetTime.filter(this.createFilter(queryString))
        : presetTime;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 选择天数
    handleSelectDay(item) {
      const value = item.value;
      this.selectDay = value.slice(-1);
      this.delayForm.delayDay = value.slice(0, -1);
      this.changeDelayTime();
    },
    // 提交延期申请
    submit() {
      let delayDay = this.delayForm.delayDay + "";
      this.$refs.form.validate(valid => {
        // 验证成功
        if (valid) {
          this.$confirm(`是否申请项目延期${delayDay}天？`, "提示", {
            type: "warning"
          })
            .then(() => {
              // TODO 反馈给后端提交项目延期申请
              this.isLoading = true;
              delayApply(this.runId, delayDay)
                .then(res => {
                  if (res.status == 0) {
                    this.$message({
                      type: "success",
                      message: "项目延期申请成功, 待审核!"
                    });
                    this.changeState();
                    this.close();
                  } else {
                    this.$message({
                      type: "error",
                      message: "申请失败"
                    });
                  }
                  this.isLoading = false;
                })
                .catch(err => {
                  this.$message({
                    type: "error",
                    message: "申请失败"
                  });
                  this.isLoading = false;
                });
            })
            .catch(err => {
              this.$message({
                type: "info",
                message: "已取消申请"
              });
            });
        } else {
          // 数据验证失败
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    // 选择菜单时
    selectDay(newVal) {
      this.changeDelayTime();
    }
  }
};
</script>
<style scoped>
/* 项目延期 */
.el-select {
  width: 80px;
  text-align: center;
  padding-left: -10px;
}
.day {
  width: 190px;
}
.cont-icon {
  position: relative;
  top: -10px;
  left: 30px;
  color: #409eff;
}
</style>

