<template>
  <div id="app">
    <Sidebar />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Sidebar from '@/page/Sidebar.vue';

export default defineComponent({
  name: 'App',
  components: {
    Sidebar
  },

  computed: {
    hideSidebar() {
      // 检查当前路由的 meta 字段是否设置为不显示侧边栏
      return this.$route.meta.hideSidebar || false
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
  padding-left: 50px;
  margin-left: 200px;
  /* 这里是侧边栏的宽度 */
}
</style>
