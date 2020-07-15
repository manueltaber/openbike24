import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Base",
    redirect: "/authentication/signin",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Base.vue"),
    children: [
      {
        path: "/live",
        name: "Live",
        component: () =>
          import(/* webpackChunkName: "live" */ "../views/Live.vue")
      },
      {
        path: "/routes",
        name: "Routes",
        component: () =>
          import(/* webpackChunkName: "routes" */ "../views/Routes.vue")
      },
      {
        path: "/settings",
        name: "Settings",
        component: () =>
          import(/* webpackChunkName: "settings" */ "../views/Settings.vue")
      }
    ]
  },
  {
    path: "/authentication",
    name: "Authentication",
    component: () =>
      import(
        /* webpackChunkName: "authentication" */ "../views/authentication/Authentication.vue"
      ),
    children: [
      {
        path: "/authentication/signin",
        name: "SignIn",
        component: () =>
          import(
            /* webpackChunkName: "signin" */ "../views/authentication/SignIn.vue"
          )
      },
      {
        path: "/authentication/signup",
        name: "SignUp",
        component: () =>
          import(
            /* webpackChunkName: "signup" */ "../views/authentication/SignUp.vue"
          )
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
