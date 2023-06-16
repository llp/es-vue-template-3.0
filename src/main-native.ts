import {
  createApp,
  HippyApp,
} from '@hippy/vue-next';

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
import routes from './routes';
import {createHippyHistory, createHippyRouter} from "../packages/router/src/history";
import {createRouter, Router, RouterOptions} from "../packages/router/src";

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
  console.log('------1-------initCallback-------------????????')
  app.mount('#root');
  // let route = {
  //   name: 'index',
  //   params: {},
  // }
  // router.push(route);
  console.log('------4-------initCallback-------------????????')
};

app.$start().then(initCallback);
