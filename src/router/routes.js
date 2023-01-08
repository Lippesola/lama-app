
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '404', component: () => import('pages/ErrorNotFound.vue') },
      { path: 'leader/activation', component: () => import('pages/ActivationPage.vue') },
      { path: 'avatar', component: () => import('pages/AvatarPage.vue') },
      { path: 'engagement', component: () => import('pages/EngagementPage.vue') },
      { path: 'misc', component: () => import('pages/MiscPage.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') },
      { path: 'tasks', component: () => import('pages/TaskPage.vue') },
    ]
  },
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
