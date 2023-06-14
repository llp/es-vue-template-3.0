import {isFunction} from '@vue/util/index.js';
import install from './install';
import normalizeLocation from './util/location';
import createMatcher from './create-matcher';
import HippyHistory from './history/hippy';
import {START} from './util/route';
import {assert} from './util/warn';
import {cleanPath} from './util/path';
import {ESLog} from "@extscreen/es-log";
import {destroyRoute, resumeRoute, stopRoute} from "./lifecycle/LifecycleManager";
import {
  ES_ROUTER_LAUNCH_MODE_SINGLE_TASK,
} from "./util/launch-mode";

function registerHook(list, fn) {
  list.push(fn);
  return () => {
    const i = list.indexOf(fn);
    if (i > -1) list.splice(i, 1);
  };
}

function createHref(base, fullPath) {
  return base ? cleanPath(`${base}/${fullPath}`) : fullPath;
}

class ESRouter {
  constructor(options = {}) {
    this.app = null;
    this.pageRouterViewSupported = true;
    this.apps = [];
    this.options = options;
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];
    this.matcher = createMatcher(options.routes || [], this);

    // Running in Hippy
    if (global.__GLOBAL__ && global.__GLOBAL__.appRegister) {
      this.history = new HippyHistory(this, options.base, options.limit);
    } else {
      throw new Error('Hippy-Vue-Router can\t work without Native environment');
    }
  }

  match(raw, current, redirectedFrom) {
    return this.matcher.match(raw, current, redirectedFrom);
  }

  get currentRoute() {
    return this.history && this.history.current;
  }

  setESPageRouterViewSupported(support) {
    this.pageRouterViewSupported = support;
    if (ESLog.isLoggable(ESLog.DEBUG)) {
      ESLog.d('ESRouter', '#----------setESPageRouterViewSupported------->>>>>' + support);
    }
  }

  isESPageRouterViewSupported() {
    return this.pageRouterViewSupported;
  }

  setRouteLimit(limit) {
    this.options.limit = limit;
    this.history.setRouteLimit(limit);
  }

  getRouteLimit() {
    return this.options.limit;
  }

  init(app, Vue) {
    if (process.env.NODE_ENV !== 'production') {
      assert(
        install.installed,
        'not installed. Make sure to call `Vue.use(ESRouter)` before creating root instance.',
      );
    }

    this.apps.push(app);

    // main app already initialized.
    if (this.app) {
      return;
    }

    this.app = app;
    const {history} = this;
    if (history instanceof HippyHistory) {
      history.transitionTo(history.getCurrentLocation());
    }
//------------------------路由切换&&参数传递---------------------------------
    history.listen((route, prevRoute, state) => {
      this.apps.forEach((a) => {
        //处理生命周期
        //---------------------------------------------------
        //push
        if (state === 0) {
          if (prevRoute) {
            if (prevRoute.name === route.name &&
              prevRoute.matched && prevRoute.matched[0]
              && route.matched[0].launchMode === ES_ROUTER_LAUNCH_MODE_SINGLE_TASK) {
            } else {
              stopRoute(prevRoute)
            }
          }
        }
        //go
        else if (state === 1) {
          //
          if (prevRoute) {
            destroyRoute(prevRoute, false)
          }
          //
          if (route) {
            resumeRoute(route);
          }
        }

        a._prevRoute = prevRoute
        a._routeState = state
        a._route = route;
      });
    });
  }

  beforeEach(fn) {
    return registerHook(this.beforeHooks, fn);
  }

  beforeResolve(fn) {
    return registerHook(this.resolveHooks, fn);
  }

  afterEach(fn) {
    return registerHook(this.afterHooks, fn);
  }

  onReady(cb, errorCb) {
    this.history.onReady(cb, errorCb);
  }

  onError(errorCb) {
    this.history.onError(errorCb);
  }

  push(location, onComplete, onAbort) {
    if (ESLog.isLoggable(ESLog.DEBUG)) {
      ESLog.d('ESRouter', '#-------------push--------->>>>>' + location);
    }
    this.history.push(location, onComplete, onAbort);
  }

  replace(location, onComplete, onAbort) {
    this.history.replace(location, onComplete, onAbort);
  }

  go(n) {
    return this.history.go(n);
  }

  back() {
    let result = this.go(-1);
    if (ESLog.isLoggable(ESLog.DEBUG)) {
      ESLog.d('ESRouter', '#-------------back--------->>>>>' + result);
    }
    return result;
  }

  forward() {
    return this.go(1);
  }

  getMatchedComponents(to) {
    const route = to
      ? to.matched
        ? to
        : this.resolve(to).route
      : this.currentRoute;
    if (!route) {
      return [];
    }
    return route.matched.map(m => Object.keys(m.components).map(key => m.components[key]));
  }

  resolve(to, current, append) {
    const location = normalizeLocation(
      to,
      current || this.history.current,
      append,
      this,
    );
    const route = this.match(location, current);
    const fullPath = route.redirectedFrom || route.fullPath;
    const {base} = this.history;
    const href = createHref(base, fullPath);
    return {
      location,
      route,
      href,
      // for backwards compat
      normalizedTo: location,
      resolved: route,
    };
  }

  addRoutes(routes) {
    this.matcher.addRoutes(routes);
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation());
    }
  }
}

ESRouter.install = install;
ESRouter.version = '__VERSION__';

export default ESRouter;

