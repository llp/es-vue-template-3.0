import {getVue, isFunction} from '@vue/util/index.js';
import runQueue from '../util/async';
import {warn, isError} from '../util/warn';
import {START, isSameRoute} from '../util/route';
import {
  flatten,
  flatMapComponents,
  resolveAsyncComponents,
} from '../util/resolve-components';
import {
  ES_ROUTER_LAUNCH_MODE_CLEAR_TASK,
  ES_ROUTER_LAUNCH_MODE_SINGLE_TASK,
  ES_ROUTER_LAUNCH_MODE_STANDARD
} from "../util/launch-mode";
import {
  clearRouteStack,
  destroyRouteList,
  newIntentRoute,
} from "../lifecycle/LifecycleManager";
import {ESLog} from "@extscreen/es-log";

function normalizeBase(base) {
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = `/${base}`;
  }
  // remove trailing slash
  return base.replace(/\/$/, '');
}

function resolveQueue(
  current,
  next,
) {
  let i;
  const max = Math.max(current.length, next.length);
  for (i = 0; i < max; i += 1) {
    if (current[i] !== next[i]) {
      break;
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i),
  };
}

function extractGuard(def, key) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    const Vue = getVue();
    def = Vue.extend(def);
  }
  return def.options[key];
}

function extractGuards(records, name, bind, reverse) {
  const guards = flatMapComponents(records, (def, instance, match, key) => {
    const guard = extractGuard(def, name);
    if (!guard) {
      return null;
    }
    return Array.isArray(guard)
      ? guard.map(g => bind(g, instance, match, key))
      : bind(guard, instance, match, key);
  });
  return flatten(reverse ? guards.reverse() : guards);
}

function bindGuard(guard, instance) {
  if (!instance) {
    return null;
  }
  return function boundRouteGuard(...args) {
    return guard.apply(instance, args);
  };
}

function extractLeaveGuards(deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true);
}

function extractUpdateHooks(updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard);
}

function poll(
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid,
) {
  if (
    instances[key]
    && !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
  ) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(() => {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

function bindEnterGuard(
  guard,
  match,
  key,
  cbs,
  isValid,
) {
  return function routeEnterGuard(to, from, next) {
    return guard(to, from, (cb) => {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(() => {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    });
  };
}

function extractEnterGuards(activated, cbs, isValid) {
  return extractGuards(activated, 'beforeRouteEnter', (guard, _, match, key) => bindEnterGuard(guard, match, key, cbs, isValid));
}

const TAG = "ESRouter"

class HippyHistory {
  constructor(router, base = '/', limit = 10) {
    this.router = router;
    this.base = normalizeBase(base);
    // start with a route object that stands for "nowhere"
    this.current = START;
    this.pending = null;
    this.ready = false;
    this.readyCbs = [];
    this.readyErrorCbs = [];
    this.errorCbs = [];
    this.limit = limit;

    if (ESLog.isLoggable(ESLog.DEBUG)) {
      ESLog.d(TAG, '-------页面总数量----constructor-->>>>' + limit);
    }
    this.stack = [];
    this.index = -1;
  }

  push(location, onComplete, onAbort) {
    this.transitionTo(location, (route) => {
      if (ESLog.isLoggable(ESLog.DEBUG)) {
        ESLog.d("ESRouter", "$$$$$$$$$$$$$$$$$$$$生命周期$$$$$$$$$$$$$$$$$$$$")
      }
      if (ESLog.isLoggable(ESLog.DEBUG)) {
        ESLog.d(TAG, '----------start--->>>>'
          + "---->>limit:" + this.limit
        );
      }
      //1.前置处理
      this.stack = this.stack.slice(0, this.index + 1);
      if (route && route.matched && route.matched[0]) {
        let r = route.matched[0];
        switch (r.launchMode) {
          //standard
          case ES_ROUTER_LAUNCH_MODE_STANDARD:
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d(TAG, '----------standard---标准模式--->>>>');
            }
            break;
          //clear task
          case ES_ROUTER_LAUNCH_MODE_CLEAR_TASK:
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d(TAG, '----------clearTask---清空堆栈--->>>>');
            }
            destroyRouteList(this.stack);
            this.stack = [];
            this.index = -1;
            break;
          //singleTask
          case ES_ROUTER_LAUNCH_MODE_SINGLE_TASK:
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d(TAG, '-----------singleTask---单例--->>>>');
            }
            let result = this.getRouteByName(route.name);
            if (result) {
              let index = result.index;
              if (ESLog.isLoggable(ESLog.DEBUG)) {
                ESLog.d(TAG, '----处理前------singleTask------>>>>' +
                  "stack.length: " + this.stack.length +
                  "需要处理的index: " + index
                );
              }
              //index .... end
              try {
                let routeList = this.stack.slice(index + 1, this.stack.length + 1);
                destroyRouteList(routeList);
              } catch (e) {
              }
              this.stack = this.stack.slice(0, index + 1);
              this.index = index;
              if (ESLog.isLoggable(ESLog.DEBUG)) {
                ESLog.d(TAG, '----处理后------singleTask------>>>>' +
                  "stack.length: " + this.stack.length +
                  "index: " + this.index
                );
              }
            }
            //堆栈不存在
            else {
              this.stack = this.stack.concat(route);
              this.index += 1;
            }
            break;
        }
      }

      //limit
      let length = this.stack.length;
      if (length >= this.limit) {
        if (ESLog.isLoggable(ESLog.DEBUG)) {
          ESLog.d(TAG, '---start----------超过总数量--->>>>');
        }
        let count = (length - this.limit) + 1;
        if (count > 0) {
          let routeList = this.stack.slice(0, count);
          if (ESLog.isLoggable(ESLog.DEBUG)) {
            ESLog.d(TAG, '--end-----------超过总数量，销毁的页面--->>>>' + routeList.length);
          }
          destroyRouteList(routeList);
        }
      }

      //3.
      if (route && route.matched && route.matched[0]) {
        let r = route.matched[0];
        switch (r.launchMode) {
          case ES_ROUTER_LAUNCH_MODE_STANDARD:
            this.stack = this.stack.concat(route);
            this.index += 1;
            break;
          case ES_ROUTER_LAUNCH_MODE_SINGLE_TASK:
            newIntentRoute(route, route.params);
            break;
          case ES_ROUTER_LAUNCH_MODE_CLEAR_TASK:
            this.stack = this.stack.concat(route);
            this.index += 1;
            break;
          default:
            this.stack = this.stack.concat(route);
            this.index += 1;
            break;
        }
      } else {
        this.stack = this.stack.concat(route);
        this.index += 1;
      }

      if (isFunction(onComplete)) {
        onComplete(route);
      }
    }, onAbort);
  }

  getRouteByPath(path) {
    if (this.stack && this.stack.length > 0 && path) {
      for (let i = 0; i < this.stack.length; i++) {
        let route = this.stack[i];
        if (route && path === route.path) {
          return {
            index: i,
            route: route
          }
        }
      }
    }
    return null;
  }

  getRouteByName(name) {
    if (this.stack && this.stack.length > 0 && name) {
      for (let i = 0; i < this.stack.length; i++) {
        let route = this.stack[i];
        if (route && name === route.name) {
          return {
            index: i,
            route: route
          }
        }
      }
    }
    return null;
  }

  replace(location, onComplete, onAbort) {
    this.transitionTo(location, (route) => {
      this.stack = this.stack.slice(0, this.index).concat(route);
      if (isFunction(onComplete)) {
        onComplete(route);
      }
    }, onAbort);
  }

  go(n) {
    const targetIndex = this.index + n;
    if (targetIndex < 0) {
      if (ESLog.isLoggable(ESLog.DEBUG)) {
        ESLog.d(TAG, '-------GO_STACK-----小于0->>>>'
          + "---堆栈错误--->>" +
          "stack.length:" + this.stack.length +
          "targetIndex:" + targetIndex
        );
      }

      try {
        if (this.stack != null && this.stack.length > 0) {
          let currentRoute = this.stack[0];
          clearRouteStack(currentRoute);
        }
      } catch (e) {
      }

      this.index = -1;
      this.stack = [];
      return false;
    }
    if (targetIndex >= this.stack.length) {
      if (ESLog.isLoggable(ESLog.DEBUG)) {
        ESLog.d(TAG, '-------GO_STACK---大于总数量--->>>>'
          + "---堆栈错误--->>" +
          "stack.length:" + this.stack.length +
          "targetIndex:" + targetIndex
        );
      }
      return false;
    }

    const route = this.stack[targetIndex];
    this.confirmTransition(route, () => {
      this.index = targetIndex;
      this.updateRoute(route, 1);
      this.stack = this.stack.slice(0, targetIndex + 1);
    });
    return true;
  }

  getCurrentLocation() {
    const current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/';
  }

  ensureURL() {
    // noop
  }

  listen(cb) {
    this.cb = cb;
  }

  onReady(cb, errorCb) {
    if (this.ready) {
      cb();
    } else {
      this.readyCbs.push(cb);
      if (errorCb) {
        this.readyErrorCbs.push(errorCb);
      }
    }
  }

  onError(errorCb) {
    this.errorCbs.push(errorCb);
  }

  transitionTo(location, onComplete, onAbort) {
    let route = this.router.match(location, this.current);
    if (route && route.matched && route.matched[0]) {
      let r = route.matched[0];
      if (r.launchMode === ES_ROUTER_LAUNCH_MODE_SINGLE_TASK) {
        let result = this.getRouteByName(route.name);
        if (result) {
          let newIntent = route.params;
          route = result.route;
          route.params = newIntent;
        }
      }
    }

    this.confirmTransition(route, () => {
      this.updateRoute(route, 0);
      if (isFunction(onComplete)) {
        onComplete(route);
      }
      this.ensureURL();

      // fire ready cbs once
      if (!this.ready) {
        this.ready = true;
        this.readyCbs.forEach((cb) => {
          cb(route);
        });
      }
    }, (err) => {
      if (onAbort) {
        onAbort(err);
      }
      if (err && !this.ready) {
        this.ready = true;
        this.readyErrorCbs.forEach((cb) => {
          cb(err);
        });
      }
    });
  }

  confirmTransition(route, onComplete, onAbort) {
    const {current} = this;
    const abort = (err) => {
      if (isError(err)) {
        if (this.errorCbs.length) {
          this.errorCbs.forEach((cb) => {
            cb(err);
          });
        } else {
          warn(false, 'uncaught error during route navigation:');
        }
      }
      if (isFunction(onAbort)) {
        onAbort(err);
      }
    };
    // 去掉相同路由校验
    // in the case the route map has been dynamically appended to
    // if (isSameRoute(route, current) && route.matched.length === current.matched.length) {
    //   this.ensureURL();
    //   return abort();
    // }

    //1.计算状态
    const {
      updated,
      deactivated,
      activated,
    } = resolveQueue(this.current.matched, route.matched);

    const queue = [].concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // in-config enter guards
      activated.map(m => m.beforeEnter),
      // async components
      resolveAsyncComponents(activated),
    );

    this.pending = route;
    const iterator = (hook, next) => {
      if (this.pending !== route) {
        return abort();
      }
      try {
        return hook(route, current, (to) => {
          if (to === false || isError(to)) {
            // next(false) -> abort navigation, ensure current URL
            this.ensureURL(true);
            abort(to);
          } else if (
            typeof to === 'string'
            || (typeof to === 'object' && (
              typeof to.path === 'string'
              || typeof to.name === 'string'
            ))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort();
            if (typeof to === 'object' && to.replace) {
              this.replace(to);
            } else {
              this.push(to);
            }
          } else {
            // confirm transition and pass on the value
            next(to);
          }
        });
      } catch (e) {
        return abort(e);
      }
    };

    return runQueue(queue, iterator, () => {
      const postEnterCbs = [];
      const isValid = () => this.current === route;
      // wait until async components are resolved before
      // extracting in-component enter guards
      const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
      const q = enterGuards.concat(this.router.resolveHooks);
      runQueue(q, iterator, () => {
        if (this.pending !== route) {
          return abort();
        }
        this.pending = null;
        onComplete(route);
        if (!this.router.app) {
          return null;
        }
        return this.router.app.$nextTick(() => {
          postEnterCbs.forEach((cb) => {
            cb();
          });
        });
      });
    });
  }

  updateRoute(route, state) {
    const prev = this.current;
    this.current = route;
    if (isFunction(this.cb)) {
      this.cb(route, prev, state);
    }
    this.router.afterHooks.forEach((hook) => {
      if (isFunction(hook)) {
        hook(route, prev);
      }
    });
  }

  hardwareBackPress() {
    if (this.stack.length > 1) {
      return this.go(-1);
    }
    const {matched} = this.stack[0];
    if (matched.length) {
      const {components, instances} = matched[0];
      if (components && components.default && isFunction(components.default.beforeAppExit)) {
        return components.default.beforeAppExit.call(instances.default, this.exitApp);
      }
    }
    return this.exitApp();
  }

  exitApp() {
    const Vue = getVue();
    // The method is only able to trigger by pressing hardware back button.
    Vue.Native.callNative('DeviceEventModule', 'invokeDefaultBackPressHandler');
  }
}

export default HippyHistory;
