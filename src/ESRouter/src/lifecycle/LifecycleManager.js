/**
 *
 */
import {getVue, isFunction} from '../util/utils.js';
import {
  ES_LIFECYCLE_ON_UNINITIALIZED,
  ES_LIFECYCLE_ON_INITIALIZED,
  ES_LIFECYCLE_ON_CREATE,
  ES_LIFECYCLE_ON_DESTROY,
  ES_LIFECYCLE_ON_PAUSE,
  ES_LIFECYCLE_ON_RESTART,
  ES_LIFECYCLE_ON_RESTORE_INSTANCE_SATE,
  ES_LIFECYCLE_ON_RESUME,
  ES_LIFECYCLE_ON_SAVE_INSTANCE_SATE,
  ES_LIFECYCLE_ON_START,
  ES_LIFECYCLE_ON_STOP
} from "../../../ESCore/core/lifecycle/ESPageLifecycleState";

export function lifecycleChanged(componentInstance, evt, params) {
  try {
    if (componentInstance) {
      if (isFunction(componentInstance.onESLifecycleChanged)) {
        componentInstance.onESLifecycleChanged(evt.lifecycle, params);
      }
      //
      else {
        //onCreate
        if (evt.lifecycle === 'onCreate') {
          if (isFunction(componentInstance.onESCreate)) {
            componentInstance.onESCreate(params);
          } else {
          }
        }
        //onStart
        else if (evt.lifecycle === 'onStart') {
          if (isFunction(componentInstance.onESStart)) {
            componentInstance.onESStart();
          } else {
          }
        }
        //onRestoreInstanceSate
        else if (evt.lifecycle === 'onRestoreInstanceSate') {
          if (isFunction(componentInstance.onESRestoreInstanceState)) {
            componentInstance.onESRestoreInstanceState(params);
          } else {
          }
        }
        //onResume
        else if (evt.lifecycle === 'onResume') {
          if (isFunction(componentInstance.onESResume)) {
            componentInstance.onESResume();
          } else {
          }
        }
      }
    }
    //
    else {
    }
  } catch (e) {
  }
}

export function destroyRouteList(routeList) {
  try {
    if (routeList == null || routeList.length <= 0) {
      return
    }
    for (let i = 0; i < routeList.length; i++) {
      let route = routeList[i];
      destroyRoute(route, true);
    }
  } catch (e) {
  }
}

export function getComponentInstance(route) {
  if (!route) {
    return null;
  }
  return route.lifecycle.instance;
}


export function destroyRoute(route, saveInstanceState) {
  const componentInstance = getComponentInstance(route);
  if (!componentInstance) {
    return;
  }

  if (route.lifecycle.isDestroyed) {
    return;
  }

  try {
    //
    if (isFunction(componentInstance.onESLifecycleChanged)) {
      if (route.lifecycle.state < ES_LIFECYCLE_ON_PAUSE) {
        route.lifecycle.state = ES_LIFECYCLE_ON_PAUSE;
        componentInstance.onESLifecycleChanged('onPause');
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_SAVE_INSTANCE_SATE) {
        if (saveInstanceState) {
          route.lifecycle.state = ES_LIFECYCLE_ON_SAVE_INSTANCE_SATE;
          if (isFunction(componentInstance.onESSaveInstanceState)) {
            componentInstance.onESSaveInstanceState(route.lifecycle.saveInstanceState);
          }
        }
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_STOP) {
        route.lifecycle.state = ES_LIFECYCLE_ON_STOP;
        componentInstance.onESLifecycleChanged('onStop');
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_DESTROY) {
        route.lifecycle.state = ES_LIFECYCLE_ON_DESTROY;
        componentInstance.onESLifecycleChanged('onDestroy');
      }
    }
    //
    else {
      if (route.lifecycle.state < ES_LIFECYCLE_ON_PAUSE) {
        route.lifecycle.state = ES_LIFECYCLE_ON_PAUSE;
        if (isFunction(componentInstance.onESPause)) {
          componentInstance.onESPause();
        }
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_SAVE_INSTANCE_SATE) {
        if (saveInstanceState) {
          route.lifecycle.state = ES_LIFECYCLE_ON_SAVE_INSTANCE_SATE;
          if (isFunction(componentInstance.onESSaveInstanceState)) {
            componentInstance.onESSaveInstanceState(route.lifecycle.saveInstanceState);
          }
        }
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_STOP) {
        route.lifecycle.state = ES_LIFECYCLE_ON_STOP;
        if (isFunction(componentInstance.onESStop)) {
          componentInstance.onESStop();
        }
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_DESTROY) {
        route.lifecycle.state = ES_LIFECYCLE_ON_DESTROY;
        if (isFunction(componentInstance.onESDestroy)) {
          componentInstance.onESDestroy();
        }
      }
    }
  } catch (e) {
  }
}

export function clearRouteStack(route) {
  const componentInstance = getComponentInstance(route);
  if (!componentInstance) {
    return;
  }

  try {
    //
    if (isFunction(componentInstance.onESLifecycleChanged)) {
      if (route.lifecycle.state < ES_LIFECYCLE_ON_PAUSE) {
        componentInstance.onESLifecycleChanged('onPause');
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_STOP) {
        componentInstance.onESLifecycleChanged('onStop');
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_DESTROY) {
        componentInstance.onESLifecycleChanged('onDestroy');
      }
    }
    //
    else {
      if (route.lifecycle.state < ES_LIFECYCLE_ON_PAUSE) {
        if (isFunction(componentInstance.onESPause)) {
          componentInstance.onESPause();
        }
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_STOP) {
        if (isFunction(componentInstance.onESStop)) {
          componentInstance.onESStop();
        }
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_DESTROY) {
        if (isFunction(componentInstance.onESDestroy)) {
          componentInstance.onESDestroy();
        }
      }
    }
    //更改标志
    route.lifecycle.isDestroyed = true;

  } catch (e) {
  }
}

export function stopRouteList(routeList) {
  try {
    if (routeList == null || routeList.length <= 0) {
      return
    }
    for (let i = 0; i < routeList.length; i++) {
      let route = routeList[i];
      stopRoute(route);
    }
  } catch (e) {
  }
}

export function stopRoute(route) {
  const componentInstance = getComponentInstance(route);
  if (!componentInstance) {
    return;
  }

  if (route.lifecycle.isDestroyed) {
    return;
  }

  try {
    //
    if (isFunction(componentInstance.onESLifecycleChanged)) {
      if (route.lifecycle.state < ES_LIFECYCLE_ON_PAUSE) {
        route.lifecycle.state = ES_LIFECYCLE_ON_PAUSE;
        componentInstance.onESLifecycleChanged('onPause');
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_STOP) {
        route.lifecycle.state = ES_LIFECYCLE_ON_STOP;
        componentInstance.onESLifecycleChanged('onStop');
      }
    }
    //
    else {
      if (route.lifecycle.state < ES_LIFECYCLE_ON_PAUSE) {
        route.lifecycle.state = ES_LIFECYCLE_ON_PAUSE;
        if (isFunction(componentInstance.onESPause)) {
          componentInstance.onESPause();
        }
      }
      if (route.lifecycle.state < ES_LIFECYCLE_ON_STOP) {
        route.lifecycle.state = ES_LIFECYCLE_ON_STOP;
        if (isFunction(componentInstance.onESStop)) {
          componentInstance.onESStop();
        }
      }
    }
  } catch (e) {

  }
}


export function resumeRoute(route) {
  try {
    const componentInstance = getComponentInstance(route);
    if (!componentInstance) {
      return;
    }
    let state = route.lifecycle.state;
    let isDestroyed = state >= ES_LIFECYCLE_ON_DESTROY;
    if (isDestroyed) {
      route.lifecycle.state = ES_LIFECYCLE_ON_UNINITIALIZED;
      return;
    }
    if (state > ES_LIFECYCLE_ON_RESUME) {
      //
      if (isFunction(componentInstance.onESLifecycleChanged)) {
        //onCreate
        if (isDestroyed) {
          route.lifecycle.state = ES_LIFECYCLE_ON_CREATE;
          componentInstance.onESLifecycleChanged('onCreate', route.params);
        }
        //onRestart
        else {
          route.lifecycle.state = ES_LIFECYCLE_ON_RESTART;
          componentInstance.onESLifecycleChanged('onRestart');
        }
        //onStart
        route.lifecycle.state = ES_LIFECYCLE_ON_START;
        componentInstance.onESLifecycleChanged('onStart');

        //onRestoreInstanceState
        route.lifecycle.state = ES_LIFECYCLE_ON_RESTORE_INSTANCE_SATE;
        if (isDestroyed && isFunction(componentInstance.onESRestoreInstanceState)) {
          componentInstance.onESRestoreInstanceState(route.lifecycle.saveInstanceState);
        }
        //onResume
        route.lifecycle.state = ES_LIFECYCLE_ON_RESUME;
        componentInstance.onESLifecycleChanged('onResume');
        //rest
        route.lifecycle.saveInstanceState = {};
      }
      //
      else {
        //onCreate
        if (isDestroyed) {
          route.lifecycle.state = ES_LIFECYCLE_ON_CREATE;
          componentInstance.onESCreate(route.params);
        }
        //onRestart
        else {
          route.lifecycle.state = ES_LIFECYCLE_ON_RESTART;
          componentInstance.onESRestart();
        }
        //onStart
        route.lifecycle.state = ES_LIFECYCLE_ON_START;
        componentInstance.onESStart();

        //onRestoreInstanceState
        route.lifecycle.state = ES_LIFECYCLE_ON_RESTORE_INSTANCE_SATE;
        if (isDestroyed && isFunction(componentInstance.onESRestoreInstanceState)) {
          componentInstance.onESRestoreInstanceState(route.lifecycle.saveInstanceState);
        }

        //onResume
        route.lifecycle.state = ES_LIFECYCLE_ON_RESUME;
        componentInstance.onESResume();

        //rest
        route.lifecycle.saveInstanceState = {};
      }
    }
  } catch (e) {
  }
}

export function newRoute(route) {
  try {
    const componentInstance = getComponentInstance(route);
    if (!componentInstance) {
      return;
    }

    if (isFunction(componentInstance.onESLifecycleChanged)) {
      route.lifecycle.state = ES_LIFECYCLE_ON_CREATE;
      componentInstance.onESLifecycleChanged('onCreate', route.params);
      route.lifecycle.state = ES_LIFECYCLE_ON_START;
      componentInstance.onESLifecycleChanged('onStart');
      route.lifecycle.state = ES_LIFECYCLE_ON_RESUME;
      componentInstance.onESLifecycleChanged('onResume');
    }
    //
    else {
      if (isFunction(componentInstance.onESCreate)) {
        route.lifecycle.state = ES_LIFECYCLE_ON_CREATE;
        componentInstance.onESCreate(route.params);
      }
      if (isFunction(componentInstance.onESStart)) {
        route.lifecycle.state = ES_LIFECYCLE_ON_START;
        componentInstance.onESStart();
      }
      if (isFunction(componentInstance.onESResume)) {
        route.lifecycle.state = ES_LIFECYCLE_ON_RESUME;
        componentInstance.onESResume();
      }
    }
  } catch (e) {
  }
}

export function newIntentRoute(route, intent) {
  try {
    const componentInstance = getComponentInstance(route);
    if (!componentInstance) {
      return;
    }
    if (isFunction(componentInstance.onESNewIntent)) {
      componentInstance.onESNewIntent(intent);
    }
    //
    else {
    }
  } catch (e) {
  }
}
