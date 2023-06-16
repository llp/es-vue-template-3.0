/**
 * hippy history implement, reference memory history of vue-router
 *
 * https://github.com/vuejs/router/blob/main/packages/router/src/history/memory.ts
 */
import {RouterHistory} from "./common";
import {RouteRecordRaw} from "../types";
import {createRouter, Router} from "../router";

import {BackAndroid, Native} from '@hippy/vue-next';
import {HippyRouterHistory, createHippyHistory} from './history';

/**
 * inject android hardware back press to execute router operate
 *
 * @param router - router instance
 *
 * @public
 */
function injectAndroidHardwareBackPress(router: Router) {
  if (Native.isAndroid()) {
    function hardwareBackPress() {
      const {position} = router.options.history as HippyRouterHistory;
      if (position > 0) {
        // has other history, go back
        router.back();
        return true;
      }
      // if no any other history, exit app
    }

    // we need call hippy native function to inject hardware press, when router is ready, hippy native registered.
    // so we place inject logic here
    router.isReady().then(() => {
      // Enable hardware back event and listen the hardware back event and redirect to history.
      BackAndroid.addListener(hardwareBackPress);
    });
  }
}

/**
 * create hippy router that inject android hardware back press default
 *
 * @param options - router options
 *
 * @public
 */
export function createHippyRouter(options: {
  history?: RouterHistory;
  routes: Readonly<RouteRecordRaw[]>;
  noInjectAndroidHardwareBackPress?: boolean;
}): Router {
  const router: Router = createRouter({
    history: options.history ?? createHippyHistory(),
    routes: options.routes,
  });

  // if you do not need the default inject logic, you can pass true to not inject,
  // then you can write your own inject logic.
  // e.g. you may use hippy embed in another app, so you should call app's exit method instead default
  // exit method of hippy
  if (!options.noInjectAndroidHardwareBackPress) {
    injectAndroidHardwareBackPress(router);
  }

  return router;
}

export * from './history';
