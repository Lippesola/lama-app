
const routes = [
  {
    path: '/l/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/LoggedInIndexPage.vue') },
      { path: '404', component: () => import('pages/ErrorNotFound.vue') },
      { path: 'leader/activation', component: () => import('pages/ActivationPage.vue') },
      { path: 'avatar', component: () => import('pages/AvatarPage.vue') },
      { path: 'engagement', component: () => import('src/pages/EditEngagementPage.vue') },
      { path: 'engagement/:uuid', component: () => import('src/pages/EngagementPage.vue') },
      { path: 'misc', component: () => import('pages/MiscPage.vue') },
      { path: 'userlist', component: () => import('pages/UserList.vue') },
      { path: 'profile', component: () => import('pages/EditProfilePage.vue') },
      { path: 'profile/:uuid', component: () => import('pages/ProfilePage.vue') },
      { path: 'tasks', component: () => import('pages/TaskPage.vue') },
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    component: () => import('layouts/NotLoggedIn.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue') },
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
