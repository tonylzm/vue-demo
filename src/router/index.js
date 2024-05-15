import {
	createRouter,
	createWebHashHistory
} from "vue-router"

const routes = [
	// {
	// 	path: '/1',
	// 	name: 'login1',
	// 	component: () => import( /*webpackChunkName:'Login'*/ '@/page/login/login.vue'),
	// 	meta: {
	// 		hideSidebar: true, // 标记不显示侧边栏
	// 		hideHeader: true // 标记不显示头部
	// 	}
	// },
	{
		path: '/',
		name: 'login',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/login/logintest.vue'),
		meta: {
			hideSidebar: true, // 标记不显示侧边栏，
			hideHeader: true // 标记不显示头部
		}
	},
	{
		path: '/files',
		name: 'files',
		component: () => import( /*webpackChunkName:'Home'*/ '@/page/publicfiles/File.vue'),
		meta: { requiresAuth: true, requiredRoles: ['user', 'check', 'college'] }

	},
	// 	, {
	// 	path: '/ok',
	// 	name: 'test1',
	// 	component: () => import( /*webpackChunkName:'Login'*/ '@/page/test.vue'),
	// 	meta: { requiresAuth: true, requiredRoles: ['user', 'check','college'] }
	// },
	// {
	// 	path: '/3',
	// 	name: 'test',
	// 	component: () => import( /*webpackChunkName:'Login'*/ '@/page/test2.vue'),
	// 	meta: { requiresAuth: true, requiredRoles: ['user', 'check','college'] }
	// },
	// {
	// 	path: '/hello',
	// 	name: 'new',
	// 	component: () => import( /*webpackChunkName:'Home'*/ '@/page/new.vue'),
	// 	meta: { requiresAuth: true, requiredRoles: ['user', 'check','college'] }

	// },
	{
		path: '/administrotor',
		name: 'administrotor',
		component: () => import( /*webpackChunkName:'Home'*/ '@/page/college/administrotor.vue'),
		meta: { requiresAuth: true, requiredRoles: ['college'] }

	},
	// {
	// 	path: '/home',
	// 	name: 'home',
	// 	component: () => import( /*webpackChunkName:'Home'*/ '@/page/home.vue'),
	// 	meta: { requiresAuth: true, requiredRoles: ['user', 'check','college'] }

	// },

	{
		path: '/college',
		name: 'college',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/college/college.vue'),
		//meta: { requiresAuth: true, requiredRoles: ['college'] }
	},
	{
		path: '/teacher',
		name: 'teacher',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/teachers/teacher.vue'),
		meta: { requiresAuth: true, requiredRoles: ['user', 'check', 'college'] }
	},
	{
		path: '/audit',
		name: 'audit',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/teachers/audit.vue'),
		meta: { requiresAuth: true, requiredRoles: ['user', 'check', 'college'] }
	},
	{
		path: '/personalcentre',
		name: 'personalcentre',
		component: () => import( /*webpackChunkName:'Home'*/ '@/page/publicfiles/personalcentre.vue'),
		meta: { requiresAuth: true, requiredRoles: ['user', 'check', 'college'] }
	}, {
		path: '/unauthorized',
		name: '404',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/error/404.vue'),
		meta: { requiresAuth: true, requiredRoles: ['user', 'check', 'college'] }
	},
	{
		path: '/class',
		name: 'class',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/class/class.vue'),
		meta: { requiresAuth: true, requiredRoles: ['check'] }
	}
	,
	{
		path: '/classadmin',
		name: 'classadmin',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/class/classadmin.vue'),
		meta: { requiresAuth: true, requiredRoles: ['check'] }
	}
	,
	{
		path: '/collegeadmin',
		name: 'collegeadmin',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/college/collegeadmin.vue'),
		meta: { requiresAuth: true, requiredRoles: ['college'] }
	}
	,
	{
		path: '/log',
		name: 'log',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/log/log.vue'),
		meta: { requiresAuth: true, requiredRoles: ['college'] }

	}
	,
	{
		path: '/logt',
		name: 'logt',
		component: () => import( /*webpackChunkName:'Login'*/ '@/page/log/test.vue'),
		meta: { requiresAuth: true, requiredRoles: ['college'] }

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
	if (to.meta.requiresAuth && !isLoggedIn) {
		next('/'); // Redirect to login page if authentication is required but user is not logged in
	} else if (to.meta.requiredRoles && !to.meta.requiredRoles.includes(userRole)) {
		next('/unauthorized'); // Redirect to unauthorized page if user's role doesn't match required roles
	} else {
		next(); // Proceed to the requested page
	}
})
export default router
