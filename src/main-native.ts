import {
  createApp, EventBus,
  HippyApp, setScreenSize,
} from '@hippy/vue-next';

import ESApp from './App.vue';

import Vue from 'vue';

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


setScreenSize({
  width: 1920,
  height: 1080,
});

import ESRouter from "./ESRouter/src/index.js";
import routes from './routes';
//-------------------ESRouter---------------------
const router = new ESRouter(routes);
console.log('------2-------initCallback-------------????????' + Vue)
app.use(ESRouter);

console.log('------3-------initCallback-------------????????')

//----------------------------------------------
const initCallback = ({superProps, rootViewId}) => {
  console.log('------1-------initCallback-------------????????')
  app.mount('#root');
  let route = {
    name: 'index',
    params: {},
  }
  router.push(route);
  console.log('------4-------initCallback-------------????????')
};

app.$start().then(initCallback);
