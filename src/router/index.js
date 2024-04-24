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
	meta: { requiresAuth: true, requiredRoles: ['user','check'] } 

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
},{
	path: '/unauthorized',
	name: '404',
	component: () => import( /*webpackChunkName:'Login'*/ '@/page/error/404.vue')
}

]

const router = createRouter({
	// 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
	history: createWebHashHistory(),
	routes
})

router.beforeEach((to, from, next) => {
	const isLoggedIn = !!localStorage.getItem('user'); // Check if user is logged in
	const user = JSON.parse(localStorage.getItem('user'));
	const userRole = user ? user.role : null; // Get user role
	console.log(userRole)
	if (to.meta.requiresAuth && !isLoggedIn) {
		console.log(1)
	  next('/login'); // Redirect to login page if authentication is required but user is not logged in
	} else if (to.meta.requiredRoles && !to.meta.requiredRoles.includes(userRole)) {
		console.log(2)
	  next('/unauthorized'); // Redirect to unauthorized page if user's role doesn't match required roles
	} else {
		console.log(to.meta.requiredRoles)
	  next(); // Proceed to the requested page
	}
  })
export default router
