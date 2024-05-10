<template>
  <div id="app">
    <Header v-if="!hideHeader" />
    <Sidebar v-if="!hideSidebar" />
    <div class="content" :class="{ 'full-width': hideSidebar }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Sidebar from '@/compent/Sidebar.vue';
import Header from '@/compent/Header.vue';


export default defineComponent({
  name: 'App',
  components: {
    Sidebar,
    Header
  },
  computed: {
    hideSidebar() {
      // 检查当前路由的 meta 字段是否设置为不显示侧边栏
      return this.$route.meta.hideSidebar || false
    },
    hideHeader() {
      // 检查当前路由的 meta 字段是否设置为不显示头部
      return this.$route.meta.hideHeader || false
    }
  },
  setup() {
    const debounce = (callback, delay) => {
      let tid;
      return function (...args) {
        const ctx = self;
        tid && clearTimeout(tid);
        tid = setTimeout(() => {
          callback.apply(ctx, args);
        }, delay);
      };
    };

    const _ = window.ResizeObserver;
    window.ResizeObserver = class ResizeObserver extends _ {
      constructor(callback) {
        callback = debounce(callback, 20);
        super(callback);
      }
    };
  },
});
</script>

<style>
.content {
  margin-top: 90px;
  margin-left: 200px;
  /* 这里是侧边栏的宽度 */
}

/* 可以根据需要添加样式 */
.full-width {
  width: 100%;
  padding: 0;
  /* 确保没有额外的内边距 */
  margin: 0;
  /* 确保没有额外的外边距 */
}

/* 为 Header 组件添加固定样式 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;


  /* 确保 Header 在其他内容之上 */
  /* 其他样式，如背景色、高度、内边距等 */
}
</style>