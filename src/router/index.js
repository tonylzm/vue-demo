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

},
{
	path: '/hello',
	name: 'file',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/new.vue'),

},
{
	path: '/test',
	name: 'file',
	component: () => import( /*webpackChunkName:'Home'*/ '@/page/test.vue'),

}
]

const router = createRouter({
	// 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
	history: createWebHashHistory(),
	routes
})

export default router
