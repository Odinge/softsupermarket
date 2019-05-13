<template>
  <el-dialog
    center
    title="修改项目"
    width="540px"
    custom-class="edit"
    @open="open"
    :visible.sync="check"
    :before-close="close"
    v-loading="isLoading"
    element-loading-text="拼命申请中"
  >
    <el-form ref="form" status-icon :rules="rules" :model="origin" label-width="80px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="target.projectName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="项目方向" prop="projectName">
          <el-input v-model="form.projectDirection"></el-input>
      </el-form-item>-->
      <el-form-item label="项目需求" prop="projectRequirement">
        <el-input type="textarea" v-model="target.projectRequirement"></el-input>
      </el-form-item>
      <el-form-item label="项目时间" prop="projectTime">
        <el-date-picker
          v-model="target.projectTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy.MM.dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="项目描述" prop="projectDescribe">
        <el-input type="textarea" v-model="target.projectDescribe"></el-input>
      </el-form-item>
      <el-form-item label="项目资金" prop="projectPrice">
        <el-col :span="11">
          <el-input v-model="target.projectPrice">
            <template slot="append">￥</template>
          </el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item> -->
      <!-- <el-button type="primary" @click="publish">修改项目</el-button>
      <el-button @click="resetForm">重置</el-button>-->
      <!-- </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button round icon="el-icon-edit" type="primary" @click="publish" :disabled="disabled">修改</el-button>
      <el-button round icon="el-icon-refresh" @click="resetForm">重置</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  modificationProject,
  modificationProjectX,
  examineProject
} from "../../../api/project";
export default {
  props: ["form", "check", "modifiyState"],
  data() {
    // 日期的验证
    let validateTime = (rule, value, callback) => {
      let prev = new Date(this.origin.projectTime[0]);
      let cur = new Date(this.target.projectTime[0]);
      if (prev > cur) {
        callback(new Error("起始日期不能小于之前的日期"));
      } else {
        callback();
      }
    };
    let validatePrice = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("资金不能小于0"));
      } else if (isNaN(+value)) {
        callback(new Error("资金不是数字"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
          { min: 2, message: "不能少于2个字符", trigger: "blur" }
        ],
        projectRequirement: [
          { required: true, message: "项目需求不能为空", trigger: "blur" }
        ],
        projectTime: [
          { required: true, message: "结项日期不能为空", trigger: "blur" },
          { validator: validateTime, trigger: "blur" }
        ],
        projectDescribe: [
          { required: true, message: "项目描述不能为空", trigger: "blur" }
        ],
        projectDirection: [
          { required: true, message: "项目方向不能为空", trigger: "blur" }
        ],
        projectPrice: [
          { required: true, message: "资金不能为空" },
          { validator: validatePrice, trigger: "change" }
        ]
      }, // 表单规制
      target: {
        projectName: "",
        projectRequirement: "",
        projectTime: "",
        projectDescribe: "",
        projectPrice: "",
        projectId: ""
      },
      origin: {},
      disabled: true,
      alterInfo: {},
      isLoading: false
    };
  },
  watch: {
    target: {
      handler(val) {
        let n = 0;
        for (const key in val) {
          if (val.hasOwnProperty(key)) {
            const target = val[key];
            const origin = this.origin[key];
            if (target != origin) {
              this.disabled = false;
              n++;
            }
          }
        }
        // 复原
        if (!n) {
          this.disabled = true;
        }
      },
      deep: true
    }
  },
  methods: {
    // 关闭对话框
    close() {
      this.$emit("update:check", false);
      this.resetForm();
      this.disabled = true;
    },
    open() {
      this.origin = { ...this.form };
      this.target = { ...this.form };
      this.alterInfo = {
        projectId: this.form.projectId,
        modificationType: "update",
        modificationContent: [],
        modificationPlace: [],
        originalData: []
      };
    },
    update() {
      this.$emit("update");
    },
    // 重置表单
    resetForm() {
      this.open();
      this.$refs.form.resetFields();
    },
    getAlterInfo() {
      for (let key in this.target) {
        if (this.target.hasOwnProperty(key)) {
          let target = this.target[key];
          let origin = this.origin[key];
          if (target != origin) {
            this.disabled = false;
            if (key === "projectTime") {
              target = target.join("-");
              origin = origin.join("-");
            }
            this.alterInfo.modificationContent.push(target);
            // key = key.replace(/([A-Z])/g, ($, $1) => "_" + $1.toLowerCase());
            this.alterInfo.modificationPlace.push(key);
            this.alterInfo.originalData.push(origin);
          }
        }
      }
      const split = ",";
      this.alterInfo.modificationContent = this.alterInfo.modificationContent.join(
        split
      );
      this.alterInfo.modificationPlace = this.alterInfo.modificationPlace.join(
        split
      );
      this.alterInfo.originalData = this.alterInfo.originalData.join(split);
    },
    // 未审核直接修改项目
    modificationProject() {
      this.target.projectTime = this.target.projectTime.join("-");
      modificationProjectX(this.target)
        .then(res => {
          if (res.status == 0) {
            // 第一种
            // this.close();
            // this.$message({
            //   type: "success",
            //   message: "修改成功"
            // });
            // this.update();
            // this.isLoading = false;

            // 第二种
            this.changeProjectState();
          } else throw res.msg;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message({
            type: "error",
            message: "修改失败"
          });
        });
    },
    // 修改申请
    modificationApply() {
      this.getAlterInfo();
      // 反馈给后端修改项目
      modificationProject(this.alterInfo)
        .then(res => {
          // 项目发布成功。等待管理员审核
          if (res.status == 0) {
            this.close();
            this.$message({
              type: "success",
              message: "修改请求" + res.msg
            });
            this.update();
            this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message({
            type: "error",
            message: "修改请求失败"
          });
        });
    },
    // 改变状态
    changeProjectState() {
      examineProject(this.target.projectId, "1")
        .then(res => {
          // 项目发布成功。等待管理员审核
          if (res.status == 0) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.close();
            this.update();
            this.isLoading = false;
          } else throw res.msg;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message({ type: "error", message: "修改失败" });
        });
    },
    publish() {
      this.$refs.form.validate(valid => {
        // 验证成功
        if (valid) {
          this.$confirm("是否修改项目", "提示", { type: "warning" })
            .then(() => {
              this.isLoading = true;
              // 判断操作方式
              // 第一种
              // if (this.modifiyState == 1) {
              //   this.modificationProject();
              // } else if (this.modifiyState == 3) {
              //   this.modificationApply();
              // }

              // 第二种
              if (this.modifiyState == 3) {
                this.modificationProject();
              } else if (this.modifiyState == 1) {
                console.log(this.alterInfo);
                this.modificationApply();
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消修改"
              });
            });
        } else {
          // 数据验证失败
          return false;
        }
      });
    }
  }
};
</script>

<style>
.box-card {
  width: 600px;
  margin: 20px auto;
}
.edit {
  border-radius: 10px;
}
</style>
