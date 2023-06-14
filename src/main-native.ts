import {
  createApp,
  HippyApp,
} from '@hippy/vue-next';

import App from './App.vue';

const app: HippyApp = createApp(App, {
  appName: 'EsApp',
  trimWhitespace: true,
});

//--------------------ESApp-----------------------
import {setESApp} from "@extscreen/es-core";

setESApp(app);
//-------------------ESComponent-----------------
import {ESComponent} from "@extscreen/es-component";

app.use(ESComponent);
//-------------------ESRouter---------------------
import ESRouter from "@extscreen/es-router";
import routes from './routes';

const router = new ESRouter(routes);
app.use(router);

//----------------------------------------------
const initCallback = ({superProps, rootViewId}) => {
  router.push('/');
  app.mount('#root');
};

app.$start().then(initCallback);
