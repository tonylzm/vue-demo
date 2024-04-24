import {
	createRouter,
	createWebHashHistory
} from "vue-router"
const routes = [{
	path: '/1',
	name: 'login1',
	component: () => import( /*webpackChunkName:'Login'*/ '@/page/login/login.vue'),
	meta: {
		hideSidebar: true, // 标记不显示侧边栏
		hideHeader: true // 标记不显示头部
	}
}
	, {
	path: '/',
	name: 'files',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/File.vue'),

}
	, {
	path: '/ok',
	name: 'test1',
	component: () => import( /*webpackChunkName:'Login'*/ '@/page/test.vue')
},
{
	path: '/3',
	name: 'test',
	component: () => import( /*webpackChunkName:'Login'*/ '@/page/test2.vue')
},
{
	path: '/hello',
	name: 'new',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/new.vue'),

},
{
	path: '/exercise',
	name: 'exercise',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/exercise.vue'),

},
{
	path: '/administrotor',
	name: 'administrotor',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/administrotor.vue'),

},
{
	path: '/home',
	name: 'home',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/home.vue'),

},
{
	path: '/4',
	name: 'login',
	component: () => import( /*webpackChunkName:'Login'*/ '@/page/login/logintest.vue'),
	meta: {
		hideSidebar: true, // 标记不显示侧边栏，
		hideHeader: true // 标记不显示头部
	}
},
{
	path: '/5',
	name: 'college',
	component: () => import( /*webpackChunkName:'Login'*/ '@/page/college.vue')
},
{
	path: '/teacher',
	name: 'teacher',
	component: () => import( /*webpackChunkName:'Login'*/ '@/page/teacher.vue')
},
{
	path: '/personalcentre',
	name: 'personalcentre',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/personalcentre.vue'),
},

]

const router = createRouter({
	// 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
	history: createWebHashHistory(),
	routes
})

export default router
