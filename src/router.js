import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from './components/UserLogin.vue';
import AdminLogin from './components/AdminLogin.vue';
import AdminLayout from './components/AdminLayout.vue';
import AdminUsers from './components/AdminUsers.vue';
import AdminDashboard from './components/AdminDashboard.vue';
import AdminSales from './components/AdminSales.vue';
import AdminAcquisition from './components/AdminAcquisition.vue';

const routes = [
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin,
  },
  {
    path: '/adminlogin',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/users',
    redirect: '/admin/users',
  },
  {
    path: '/dashboard',
    redirect: '/admin/dashboard',
  },
  {
    path:'adminlogin',
    redirect:'https://salessyncpython.onrender.com/adminlogin/',
  },
  {
    path: '/sales',
    redirect: '/admin/sales',
  },
  {
    path: '/acquisition',
    redirect: '/admin/acquisition',
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
      },
      {
        path: 'sales',
        name: 'AdminSales',
        component: AdminSales,
      },
      {
        path: 'acquisition',
        name: 'AdminAcquisition',
        component: AdminAcquisition,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('access_token') !== null; // Changed here

  if (requiresAuth && !isAuthenticated) {
    next('/adminlogin');
  } else if (!requiresAuth && isAuthenticated) {
    if (to.name === 'AdminLogin') {
      next('/admin/dashboard');
    } else if (to.name === 'UserLogin') {
      next('/');
    }
  } else {
    next();
  }
});

export default router;