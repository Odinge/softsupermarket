<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-08-21 00:41:39
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <i class="el-icon-tickets sec-head-title"></i>发布项目
        </span>
        <el-button class="sec-head-btn" type="text" @click="publish">发布项目</el-button>
      </div>
      <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px" class="form-pub">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="项目方向" prop="projectName">
          <el-input v-model="form.projectDirection"></el-input>
        </el-form-item>-->
        <el-form-item label="项目需求" prop="projectRequirement">
          <el-input type="textarea" v-model="form.projectRequirement"></el-input>
        </el-form-item>
        <el-form-item label="项目时间" prop="projectTime">
          <el-date-picker v-model="form.projectTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy.MM.dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="项目描述" prop="projectDescribe">
          <el-input type="textarea" v-model="form.projectDescribe"></el-input>
        </el-form-item>
        <el-form-item label="项目资金" prop="projectPrice">
          <el-col :span="11">
            <el-input v-model.number="form.projectPrice">
              <template slot="append">￥</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="publish">发布项目</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { publish } from "../../api/project";
export default {
  props: ["projectForm"],
  data() {
    // 日期的验证
    let validateTime = (rule, value, callback) => {
      let now = new Date();
      let cur = new Date(value[0]);
      // now = new Date(now.toLocaleDateString());
      if (now > cur) {
        callback(new Error("起始日期不能小于当前日期"));
      } else {
        callback();
      }
    };
    let validatePrice = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("资金不能小于0"));
      } else if (isNaN(+value)) {
        callback(new Error("资金必须为数字值"));
      } else {
        callback();
      }
    };
    return {
      form: {
        projectName: "", // 项目名称
        projectRequirement: "", // 项目需求
        projectTime: "", // 结项时间
        projectDescribe: "", // 项目描述
        projectPrice: "" // 项目资金
        // projectDirection: "" // 项目方向
      }, // 表单数据
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
      } // 表单规制
    };
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    },
    username() {
      return this.$store.state.username;
    }
  },
  methods: {
    publish() {
      this.$refs.form.validate(valid => {
        // 验证成功
        if (valid) {
          this.$confirm("是否发布项目", "提示", { type: "warning" })
            .then(() => {
              // 反馈给后端发布项目
              let formData = this.form;
              formData.projectTime =
                formData.projectTime[0] + "-" + formData.projectTime[1];
              // formData.userId = this.userId;
              formData.userId = this.username;
              console.log(formData);

              publish(formData)
                .then(res => {
                  // 项目发布成功。等待管理员审核
                  if (res.status == 0) {
                    this.$message({
                      type: "success",
                      message: "发布成功, 1s 后跳到项目管理。",
                      duration: 3000
                    });
                    setTimeout(() => {
                      this.$router.push({
                        path: "/projectManage"
                      });
                    }, 1000);
                  } else throw res.msg;
                })
                .catch(err => {
                  this.$message({
                    type: "error",
                    message: "发布失败"
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消发布"
              });
            });
        } else {
          // 数据验证失败
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
    }
  }
};
</script>


<style scoped>
.box-card {
  width: 600px;
  margin: 20px auto;
}
.form-pub {
  width: 500px;
}
</style>
