<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-01 10:11:47
 * @LastEditors: Please set LastEditors
 -->
<template>
  <!-- 渲染导航列表 -->
  <div class="sidebar" :class="{mini}">
    <router-link class="nav" v-for="(router, key) in routers" :key="key" :to="router.path">
      <message-num :menu="{path:router.name}" custom-class="top:-12px;right:-12px">
        <i class="iconfont" :class="'icon-'+router.meta.icon"></i>
      </message-num>
      <span class="title" v-show="showTitle">{{ router.meta.title }}</span>
    </router-link>
  </div>
</template>
<script>
import eventBus from "../../utils/eventBus.js";
import MessageNum from "../MessageNum";
export default {
  name: "sidebar",
  components: { MessageNum },
  data() {
    return {
      mini: true,
      showTitle: true
    };
  },
  mounted() {
    // 切换显示列表
    eventBus.$on("showNav", this.change);
  },
  computed: {
    routers() {
      return this.$store.getters.addRouter.filter(r => r.meta && r.meta.title);
    }
  },
  methods: {
    // 该表导航样式
    change() {
      this.mini = !this.mini;
      if (!this.mini) {
        this.showTitle = false;
        setTimeout(() => {
          this.showTitle = true;
        }, 900);
      } else {
        this.showTitle = false;
        setTimeout(() => {
          this.showTitle = true;
        }, 900);
      }
    }
  }
};
</script>
<style scoped>
.sidebar {
  /* overflow: hidden; */
  position: relative;
  box-sizing: border-box;
  float: left;
  width: 200px;
  height: 100%;
  padding-top: 20px;
  background-color: cornflowerblue;
  transition: 1s;
}
.nav {
  position: relative;
  display: block;
  padding: 18px 0;
  font-size: 18px;
  text-align: center;
  color: #fff;
}
.nav::before {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 75%;
  margin: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.router-link-active {
  background-color: rgb(143, 176, 236);
}
.router-link-active::after {
  content: ">";
  position: absolute;
  right: 15px;
  background-color: rgb(143, 176, 236);
}
.iconfont {
  font-size: 20px;
}
.title {
  margin-left: 10px;
}

/* 改变图标导航 */
.mini {
  width: 70px;
  overflow: hidden;
}
.mini:hover {
  overflow: initial;
}
.mini .router-link-active::after {
  display: none;
}
.mini .nav .title {
  position: absolute;

  right: -5em;
  /* right: -6.5em; */

  top: 50%;
  padding: 0.3em 0.5em;
  border-radius: 5px;
  background-color: #555;
  font-size: 15px;
  transform: translateY(-50%);
  opacity: 0;
}
.mini .nav:hover .title {
  opacity: 1;

  right: -5.5em;
  /* right: -7.3em; */

  transition: 0.5s;
  z-index: 9999;
}
.mini .nav .title::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  margin: auto;
  border: 5.5px solid transparent;
  border-right-color: #555;
  transform: translateX(-95%);
  opacity: 0;
}
.mini .nav .title::before {
  opacity: 1;
  transition: 0.5s;
}
</style>