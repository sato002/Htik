import { createWebHashHistory, createWebHistory, createRouter } from "vue-router";
import AppLayout from '../layout/AppLayout.vue';

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'dashboard',
                component: () => import('../views/Dashboard.vue')
            }
        ]
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;