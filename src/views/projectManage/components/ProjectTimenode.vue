<template>
  <!-- 显示时间节点 -->
  <el-dialog center width="440px" title="项目方案" :visible.sync="check" :before-close="handleClose" @open="open">
    <el-steps direction="vertical" :active="active" :finish-status="type">
      <el-step v-for="(node, key) in timeNodes" :key="key">
        <template slot="title">
          <i class="el-icon-time"></i>
          {{ node.time }}
        </template>
        <template slot="description">
          <span class="things">{{ node.things }}</span>
        </template>
      </el-step>
    </el-steps>
  </el-dialog>
</template>
<script>
export default {
  props: ["timeNode", "check", "activeNode"],
  data() {
    return {
      active: 0,
      type: "progress"
    };
  },
  computed: {
    // 渲染时间节点
    timeNodes() {
      if (this.timeNode) {
        let data = this.timeNode.split(";");
        data.forEach((item, index, self) => {
          let arr = [];
          let node = {};
          if (item.split(".").length > 1) {
            arr = item.split(".");
            let it = arr[1].split(/(?=[^\-0-9])/);
            node = {
              number: arr[0],
              time: it[0]
            };
            it.shift();
            node.things = it.join("");
          } else {
            arr = item.split(" ");
            node = {
              number: arr[0],
              time: arr[1],
              things: arr[2]
            };
          }
          self[index] = node;
        });
        this.active = data.length;
        return data;
      } else {
        return "";
      }
    }
  },
  methods: {
    // 关闭对话框
    close() {
      this.$emit("update:check", false);
    },
    // 关闭申请对话框
    handleClose() {
      this.close();
    },
    open() {
      if (this.activeNode) {
        this.active = this.activeNode;
        this.type = "success";
      }
    }
  }
};
</script>
<style scoped>
/* 事件 */
.things {
  display: inline-block;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 0.5em;
  background-color: beige;
}
</style>

