import {
  createApp,
  HippyApp,
} from "../packages/hippy-vue-next/src";

import ESApp from './App.vue';

console.log('------33333333333333333333-----------????????')

const app: HippyApp = createApp(ESApp, {
  appName: 'EsApp',
  trimWhitespace: true,
});

//--------------------ESApp-----------------------
import {setESApp} from "./ESCore/core/app/ESApp.js";

setESApp(app);
//-------------------ESComponent-----------------
// import {ESComponent} from "@extscreen/es-component";
// app.use(ESComponent);


// setScreenSize({
//   width: 1920,
//   height: 1080,
// });

//-------------------ESRouter---------------------
// import ESRouter from "./ESRouter/src/index.js";
// import routes from './routes';
import {createHippyHistory, createHippyRouter} from "../packages/hippy-vue-router/src/history";
import {createRouter, Router, RouteRecordRaw, RouterOptions} from "../packages/hippy-vue-router/src";

import index from "./views/index";
import error from "./views/error";

const routes: RouteRecordRaw[] = []

routes.push({
  children: [],
  components: undefined,
  end: false,
  redirect: undefined,
  sensitive: false,
  strict: false,
  path: '/index',
  name: 'index',
  component: index
})

routes.push({
  children: [],
  components: undefined,
  end: false,
  redirect: undefined,
  sensitive: false,
  strict: false,
  path: '/error',
  name: 'error',
  component: error
})

const options: RouterOptions = {
  history: createHippyHistory(),
  routes: routes,
  sensitive: false,
  strict: false,
  end: false,
}
const router = createRouter(options);
app.use(router);
//----------------------------------------------
const initCallback = ({superProps, rootViewId}) => {
  console.log(superProps + '------1-------initCallback-------------' + rootViewId)
  // let route = {
  //   name: 'index',
  //   params: {},
  // }
  // router.push('/index');
  app.mount('#root');
  console.log(superProps + '------4-------initCallback-------------' + rootViewId)
};
app.$start().then(initCallback);


