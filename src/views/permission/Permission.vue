<template>
  <div class="permission">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <i class="iconfont icon-quanxian sec-head-title"></i>权限管理
        </span>
      </div>
      <!-- status-icon -->
      <el-form ref="form" :rules="rules" :model="form" class="form-perm" label-position="top" @submit.native.prevent>
        <el-form-item prop="studentId">
          <span slot="label">
            权限查询
            <span style="color:#f1d27b">（配置权限先查询）</span>
          </span>
          <el-input v-model="form.studentId" placeholder="请输入学号" clearable @clear="resetForm" @input="init" @keyup.enter.native="search(form.studentId)">
            <el-button slot="append" icon="el-icon-search" @click="search(form.studentId)" :loading="btnLoading"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="权限配置">
          <el-tag class="tag" closable :key="role" :disable-transitions="false" @close="handleClose(role)" v-for="role in roleTag" :type="roleColor(role)">{{role | roleMap}}</el-tag>
          <template v-if="selectRoles.length && !isCommon">
            <el-select v-model="roleId" placeholder="请选择" @change="selectRole" style="width:90px" class="tag" size="small" v-if="visibleSelect">
              <el-option v-for="item in selectRoles" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button v-else circle :disabled="check" size="small" title="添加权限" @click="showSelect" class="new-tag tag el-icon-plus"></el-button>
          </template>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" :loading="btnLoading" round @click="change" :disabled="check || !selectedRole || !isChange">设置权限</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { changeRole, getRole, getUserId } from "../../api/login";
export default {
  data() {
    return {
      form: {
        studentId: ""
      },
      roleId: "",
      // check: false,
      roleTag: [],
      userId: "",
      visibleSelect: false,
      btnLoading: false,
      roles: [
        { label: "超级管理员", value: "1" },
        { label: "管理员", value: "2" },
        { label: "团队管理员", value: "3" },
        { label: "单位负责人", value: "4" },
        { label: "普通用户", value: "5" }
      ],
      originRole: [],
      rules: {
        studentId: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      btnLoading: false
    };
  },
  computed: {
    selectRoles() {
      // 角色选择列表,保证已选择的角色不出现在列表中
      let roles = this.roles.filter(item => {
        let res = !this.roleTag.includes(item.value);
        return this.roleTag.length > 0 && item.value == 5 ? false : res;
      });
      return roles;
    },
    selectedRole() {
      return this.roleTag.join(",");
    },
    // 检测是否获取到了用户id
    check() {
      return !this.userId;
    },
    isCommon() {
      return this.roleTag.length > 0 && this.roleTag.every(item => item == 5);
    },
    // 判断权限选择和原本的权限是否一样,一样才能改变权限配置
    isChange() {
      if (this.originRole.length !== this.roleTag.length) {
        return true;
      }
      return !this.roleTag.every(item => this.originRole.includes(item));
    }
  },
  methods: {
    init() {
      this.roleTag = [];
      this.originRole = [];
      this.userId = "";
    },
    selectRole() {
      let val = this.roleId;
      if (val) {
        this.roleTag.push(val);
        this.visibleSelect = false;
        this.roleId = "";
      }
    },
    showSelect() {
      this.visibleSelect = true;
    },
    handleClose(tag) {
      this.roleTag.splice(this.roleTag.indexOf(tag), 1);
    },
    // 查询学生的权限信息
    search(studentId) {
      this.$refs.form.validate(vali => vali);
      if (studentId) {
        this.btnLoading = true;
        // 获取用户信息
        getUserId(studentId)
          .then(res => {
            if (res.status == 0) {
              let userId = res.data;
              this.userId = userId;
              // 获取角色权限信息
              getRole(studentId)
                .then(res => {
                  if (res.status == 0) {
                    let roles = res.data.map(item => item.identityId);
                    this.roleTag = roles;
                    // 拷贝一份原始权限信息,以后用于判断
                    this.originRole = [...roles];
                    this.btnLoading = false;
                  } else throw res.msg;
                })
                .catch(err => {
                  this.btnLoading = false;
                  this.$message.warning("用户无任何权限");
                });
            } else throw res.msg;
          })
          .catch(err => {
            this.btnLoading = false;
            this.$message.error(err);
          });
      }
    },
    change() {
      this.$confirm(`是否分配权限给 ${this.form.studentId} ？`, "提示", {
        type: "warning"
      })
        .then(() => {
          // 反馈给后端发布项目
          let formData = {
            userId: this.userId,
            roleId: this.selectedRole
          };
          this.btnLoading = true;
          changeRole(formData)
            .then(res => {
              // 项目发布成功。等待管理员审核
              if (res.status == 0) {
                this.$message.success("设置成功");
                this.btnLoading = false;
              } else throw res.msg;
            })
            .catch(err => {
              this.$message.error("权限设置失败")
              this.btnLoading = false;
            });
        })
        .catch(() => this.$message.info("已取消权限设置"));
    },
    // 重置权限选择
    resetForm() {
      this.$refs.form.resetFields();
    },
    roleColor(role) {
      // 设置权限的样式
      const color = ["", "danger", "warning", "success", "", "info"];
      return color[role];
    }
  },
  filters: {
    // 配置权限列表
    roleMap(roleId) {
      const roles = [
        "",
        "超级管理员",
        "管理员",
        "团队管理员",
        "单位负责人",
        "普通用户"
      ];
      return roles[roleId];
    }
  }
};
</script>
<style scoped>
.box-card {
  width: 600px;
  margin: 20px auto;
}
.form-perm {
  width: 500px;
  margin: auto;
}
.tag {
  margin-left: 10px;
}
</style>

