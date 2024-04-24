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
</style>
