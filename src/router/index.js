import {
	createRouter,
	createWebHashHistory
} from "vue-router"
const routes = [{
	path: '/1',
	name: 'login',
	component: () => import( /*webpackChunkName:'Login'*/ '@/page/login/login.vue')
}, {
	path: '/',
	name: 'files',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/File.vue'),

}, {
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
	name: 'file',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/new.vue'),

},
{
	path: '/exercise',
	name: 'file',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/exercise.vue'),

},
{
	path: '/home',
	name: 'home',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/home.vue'),

}
]

const router = createRouter({
	// 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
	history: createWebHashHistory(),
	routes
})

export default router
