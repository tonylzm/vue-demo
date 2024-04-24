import {
	createApp
} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from './router/index.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'




const app = createApp(App)
app.use(router)
app.use(ElementPlus, {
	locale: zhCn
})
function logout() {
	localStorage.clear();
  }
// 捕获全局范围内的运行时错误
window.onerror = function(message, source, lineno, colno, error) {
	// 在这里可以根据需要进行错误处理，比如记录错误信息，然后重定向到404页面
	console.error('Unhandled error:', error)
	// 重定向到404页面
	router.push('/unauthorized')
	// 返回true表示阻止浏览器默认行为
	return true
  }

  //如果sessionStorage中没有user信息，那么跳转到登录页面
  if (sessionStorage.getItem('user')===null) {
	logout();
  }

  
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

app.mount('#app')
