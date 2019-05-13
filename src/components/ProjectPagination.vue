<!-- 分页器 -->
<template>
  <el-pagination
    class="x-page"
    layout="total,sizes, prev, pager, next, jumper"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :total="total"
  ></el-pagination>
</template>
<script>
export default {
  name: "ProjectPagination",
  props: {
    data: Array,
    filterData: Array
  },
  data() {
    return {
      currentPage: 1
    };
  },
  computed: {
    // 数据总数目
    total() {
      return this.data.length;
    },
    // 一页有多少条数据
    pageSize() {
      let size = this.total >= 50 ? 50 : this.total;
      return size;
    },
    // 提供每页条数的选择
    pageSizes() {
      let count = Math.ceil(this.total / this.pageSize);
      let sizes = [];
      for (let i = 1; i <= count; i++) {
        sizes.push(this.pageSize * i);
      }
      return sizes;
    }
  },
  methods: {
    // 页面条数改变
    handleSizeChange(val) {
      // TODO 获取项目条数
      // history.pushState('','','/d')
      // location.hash = Math.random();
      this.$emit("update:filterData", this.data.slice(0, val));
      // this.filterData = this.data.slice(0, val);
    },
    // 页面页数改变
    handleCurrentChange(val) {
      // TODO 获取下一页数据
      // history.pushState('','','/d');
      // location.hash = Math.random();
      this.$emit(
        "update:filterData",
        this.data.slice((val - 1) * this.pageSize, val * this.pageSize)
      );
      // this.filterData = this.data.slice(
      //   (val - 1) * this.pageSize,
      //   val * this.pageSize
      // );
    }
  },
  created() {
    this.$emit("update:filterData", this.data.slice(0, this.pageSize));
  },
  watch: {
    // 监控数据变化时获取数据
    data() {
      this.$emit("update:filterData", this.data.slice(0, this.pageSize));
    }
  }
};
</script>
<style scoped>
.x-page {
  margin-top: 10px;
  float: right;
}
</style>
