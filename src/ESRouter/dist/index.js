import { ESLog } from '@extscreen/es-log';
import { ES_LIFECYCLE_ON_PAUSE, ES_LIFECYCLE_ON_SAVE_INSTANCE_SATE, ES_LIFECYCLE_ON_STOP, ES_LIFECYCLE_ON_DESTROY, ES_LIFECYCLE_ON_UNINITIALIZED, ES_LIFECYCLE_ON_RESUME, ES_LIFECYCLE_ON_CREATE, ES_LIFECYCLE_ON_RESTART, ES_LIFECYCLE_ON_START, ES_LIFECYCLE_ON_RESTORE_INSTANCE_SATE, ES_LIFECYCLE_ON_INITIALIZED } from '@extscreen/es-core';

/*  */

Object.freeze({});

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

/**
 * Check if a tag is a built-in tag.
 */
makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
makeMap('key,ref,slot,slot-scope,is');

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  let called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

/* eslint-disable import/prefer-default-export */

/**
 * Hippy debug address
 */
`http://127.0.0.1:${process.env.PORT}/`;

/* eslint-disable prefer-destructuring */

process.env.VUE_VERSION;
process.env.HIPPY_VUE_VERSION;
let _Vue;

function setVue(Vue) {
  _Vue = Vue;
}

function getVue() {
  return _Vue;
}

/**
 * Better function checking
 */
function isFunction(func) {
  return Object.prototype.toString.call(func) === '[object Function]';
}

/**
 *
 */

function lifecycleChanged(componentInstance, evt, params) {
  try {
    if (componentInstance) {
      if (isFunction(componentInstance.onESLifecycleChanged)) {
        if (ESLog.isLoggable(ESLog.DEBUG)) {
          ESLog.d('ESRouter', '-------onESLifecycleChanged------>>>>' + evt.lifecycle);
        }
        componentInstance.onESLifecycleChanged(evt.lifecycle, params);
      }
      //
      else {
        //onCreate
        if (evt.lifecycle === 'onCreate') {
          if (isFunction(componentInstance.onESCreate)) {
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d('ESRouter', '-------onESCreate---success--->>>>');
            }
            componentInstance.onESCreate(params);
          } else {
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d('ESRouter', '-------onESCreate---error--->>>>');
            }
          }
        }
        //onStart
        else if (evt.lifecycle === 'onStart') {
          if (isFunction(componentInstance.onESStart)) {
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d('ESRouter', '-------onESStart---success--->>>>');
            }
            componentInstance.onESStart();
          } else {
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d('ESRouter', '-------onESStart---error--->>>>');
            }
          }
        }
        //onRestoreInstanceSate
        else if (evt.lifecycle === 'onRestoreInstanceSate') {
          if (isFunction(componentInstance.onESRestoreInstanceState)) {
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d('ESRouter', '-------onESRestoreInstanceState---success--->>>>');
            }
            componentInstance.onESRestoreInstanceState(params);
          } else {
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d('ESRouter', '-------onESRestoreInstanceState---error--->>>>');
            }
          }
        }
        //onResume
        else if (evt.lifecycle === 'onResume') {
          if (isFunction(componentInstance.onESResume)) {
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d('ESRouter', '-------onESResume---success--->>>>');
            }
            componentInstance.onESResume();
          } else {
            if (ESLog.isLoggable(ESLog.DEBUG)) {
              ESLog.d('ESRouter', '-------onESResume---error--->>>>');
            }
          }
        }
      }
    }
    //
    else {
      if (ESLog.isLoggable(ESLog.DEBUG)) {
        ESLog.d('ESRouter', '-------onESLifecycleChanged---实例对象为空--->>>>');
      }
    }
  } catch (e) {
  }
}

function destroyRouteList(routeList) {
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

function getComponentInstance(route) {
  if (!route) {
    return null;
  }
  return route.lifecycle.instance;
}


function destroyRoute(route, saveInstanceState) {
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
    ESLog.e('ESRouter', '------destroyRoute----生命周期-->>>>' + route.lifecycle.state);
  } catch (e) {
    if (ESLog.isLoggable(ESLog.DEBUG)) {
      ESLog.d('ESRouter', '-----ERROR-destroyRoute----生命周期-->>>>' + saveInstanceState);
    }
  }
}

function clearRouteStack(route) {
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

    ESLog.e('ESRouter', '------clearRouteStack----生命周期-->>>>' + route.lifecycle.state);
  } catch (e) {
    if (ESLog.isLoggable(ESLog.DEBUG)) {
      ESLog.d('ESRouter', '-----ERROR-clearRouteStack----生命周期-->>>>');
    }
  }
}

function stopRoute(route) {
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
    ESLog.e('ESRouter', '------stopRoute----生命周期-->>>>' + route.lifecycle.state);
  } catch (e) {

  }
}


function resumeRoute(route) {
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

function newIntentRoute(route, intent) {
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
      if (ESLog.isLoggable(ESLog.DEBUG)) {
        ESLog.d('ESRouter', '----newIntent方法为空-->>>>');
      }
    }
  } catch (e) {
  }
}

var View = {
  name: 'ESRouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default',
    },
  },
  render(_, {
    props, children, parent, data,
  }) {
    data.routerView = true;
    const h = parent.$createElement;
    props.name;
    //do not delete
    parent.$route;
    let componentList = [];
    const vueRouter = parent.$router;
    let stack = vueRouter.history.stack;

    if (stack && stack.length > 0) {
      for (let i = 0; i < stack.length; i++) {
        let c = stack[i];
        let pageComponent = null;
        let component = null;
        if (c.lifecycle.state < ES_LIFECYCLE_ON_DESTROY
          && c.matched && c.matched.length > 0) {
          const matched = c.matched[0];
          if (!matched.components) {
            break;
          }

          //-----------------------------------------
          let pageData = {
            position: 'absolute',
          };
          pageData.key = i;
          const mc = matched.components.default;
          component = h(mc, pageData);
          parent.$nextTick(() => {
            c.lifecycle.instance = component.componentInstance;
            try {
              let componentInstance = component.componentInstance;
              if (ESLog.isLoggable(ESLog.DEBUG)) {
                ESLog.d("ESRouter", c.name + '---render---生命周期----->>>' + c.lifecycle.state);
              }
              if (c.lifecycle.state <= ES_LIFECYCLE_ON_INITIALIZED) {

                let uninitialized = c.lifecycle.state === ES_LIFECYCLE_ON_UNINITIALIZED;

                //
                c.lifecycle.state = ES_LIFECYCLE_ON_CREATE;
                lifecycleChanged(componentInstance, {
                  lifecycle: 'onCreate'
                }, c.params);
                //
                c.lifecycle.state = ES_LIFECYCLE_ON_START;
                lifecycleChanged(componentInstance, {
                  lifecycle: 'onStart'
                });

                //
                if (uninitialized) {
                  c.lifecycle.state = ES_LIFECYCLE_ON_RESTORE_INSTANCE_SATE;
                  lifecycleChanged(componentInstance, {
                    lifecycle: 'onRestoreInstanceSate'
                  }, c.lifecycle.saveInstanceState);
                }

                //
                c.lifecycle.state = ES_LIFECYCLE_ON_RESUME;
                lifecycleChanged(componentInstance, {
                  lifecycle: 'onResume'
                });
              }
            } catch (e) {
            }
          });
        }
        //
        else {
          if (ESLog.isLoggable(ESLog.DEBUG)) {
            ESLog.d('ESRouter', '-----native--生命周期---不渲染----->>>>index:' + i);
          }
        }
        //----------------------------------------------------------------------

        let pageComponentList = [];
        if (component) {
          pageComponentList.push(component);
        }
        let data = {
          style: {
            position: 'absolute',
          },
        };
        //-------------------------------------------------------
        if (vueRouter.isESPageRouterViewSupported()) {
          pageComponent = h('page', data, pageComponentList);
        } else {
          pageComponent = h('div', data, pageComponentList);
        }
        if (pageComponent) {
          componentList.push(pageComponent);
        }
      }
    }
    data.style = {
      width: 1920,
      height: 1080,
    };
    data.ref = 'pageRouter';
    if (vueRouter.isESPageRouterViewSupported()) {
      if (ESLog.isLoggable(ESLog.DEBUG)) {
        ESLog.d('ESRouter', '-------render----渲染路由-page-router组件---->>>>');
      }
      return h('page-router', data, componentList);
    }
    //
    else {
      if (ESLog.isLoggable(ESLog.DEBUG)) {
        ESLog.d('ESRouter', '-------render----渲染路由-div组件---->>>>');
      }
      return h('div', data, componentList);
    }
  }
};

/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-console */

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[hippy-vue-router] ${message}`);
  }
}

function warn(condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    if (typeof console !== 'undefined') {
      console.warn(`[hippy-vue-router] ${message}`);
    }
  }
}

function isError(err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1;
}

/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const encodeReserveRE = /[!'()*]/g;
const encodeReserveReplacer = c => `%${c.charCodeAt(0).toString(16)}`;
const commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
const encode = str => encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ',');

const decode = decodeURIComponent;

function parseQuery(query) {
  const res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res;
  }

  query.split('&').forEach((param) => {
    const parts = param.replace(/\+/g, ' ').split('=');
    const key = decode(parts.shift());
    const val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res;
}

function resolveQuery(query, extraQuery = {}, _parseQuery) {
  const parse = _parseQuery || parseQuery;
  let parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, e.message);
    }
    parsedQuery = {};
  }
  Object.keys(extraQuery).forEach((key) => {
    parsedQuery[key] = extraQuery[key];
  });
  return parsedQuery;
}

function stringifyQuery(obj) {
  const res = obj ? Object.keys(obj).map((key) => {
    const val = obj[key];

    if (val === undefined) {
      return '';
    }

    if (val === null) {
      return encode(key);
    }

    if (Array.isArray(val)) {
      const result = [];
      val.forEach((val2) => {
        if (val2 === undefined) {
          return;
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(`${encode(key)}=${encode(val2)}`);
        }
      });
      return result.join('&');
    }

    return `${encode(key)}=${encode(val)}`;
  })
    .filter(x => x.length > 0)
    .join('&') : null;
  return res ? `?${res}` : '';
}

const trailingSlashRE = /\/?$/;

function clone(value) {
  if (Array.isArray(value)) {
    return value.map(clone);
  }
  if (value && typeof value === 'object') {
    const res = {};
    Object.keys(value).forEach((key) => {
      res[key] = clone(value[key]);
    });
    return res;
  }
  return value;
}

function formatMatch(record) {
  const res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res;
}

function getFullPath({path, query = {}, hash = ''}, _stringifyQuery) {
  const stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash;
}

function isObjectEqual(a = {}, b = {}) {
  // handle null value #1566
  if (!a || !b) return a === b;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every((key) => {
    const aVal = a[key];
    const bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal);
    }
    return String(aVal) === String(bVal);
  });
}

function createRoute(record, location, redirectedFrom, router) {
  let stringifyQueryStr;
  if (router) {
    ({stringifyQuery: stringifyQueryStr} = router.options);
  }

  let query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {
    // pass
  }

  const route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    lifecycle: {
      state: ES_LIFECYCLE_ON_INITIALIZED,
      saveInstanceState: {},
      isDestroyed: false,
    },
    routeIndex: -1,
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQueryStr),
    matched: record ? formatMatch(record) : [],
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQueryStr);
  }
  return route;
}

function queryIncludes(current, target) {
  for (const key in target) {
    if (!(key in current)) {
      return false;
    }
  }
  return true;
}

// the starting route that represents the initial state
const START = createRoute(null, {
  path: '/',
});

function isSameRoute(a, b) {
  if (b === START) {
    return a === b;
  }
  if (!b) {
    return false;
  }
  if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '')
      && a.hash === b.hash
      && isObjectEqual(a.query, b.query)
    );
  }
  if (a.name && b.name) {
    return (
      a.name === b.name
      && a.hash === b.hash
      && isObjectEqual(a.query, b.query)
      && isObjectEqual(a.params, b.params)
    );
  }
  return false;
}

function isIncludedRoute(current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(target.path.replace(trailingSlashRE, '/')) === 0
    && (!target.hash || current.hash === target.hash)
    && queryIncludes(current.query, target.query)
  );
}

// work around weird flow bug
const toTypes = [String, Object];
const eventTypes = [String, Array];

function guardEvent(e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return false;
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return false;
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return false;
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) return false;
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true;
}

function findAnchor(children) {
  if (!children) {
    return null;
  }
  return children.find((child) => {
    if (child.tag === 'a') {
      return true;
    }
    if (child.children) {
      const c = findAnchor(child.children);
      return !!c;
    }
    return false;
  });
}

var Link = {
  name: 'ESRouterLink',
  props: {
    to: {
      type: toTypes,
      required: true,
    },
    tag: {
      type: String,
      default: 'a',
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click',
    },
  },
  render(h) {
    const router = this.$router;
    const current = this.$route;
    const { location, route, href } = router.resolve(this.to, current, this.append);
    const classes = {};
    const globalActiveClass = router.options.linkActiveClass;
    const globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    // eslint-disable-next-line eqeqeq
    const activeClassFallback = globalActiveClass == null
      ? 'router-link-active'
      : globalActiveClass;
    // eslint-disable-next-line eqeqeq
    const exactActiveClassFallback = globalExactActiveClass == null
      ? 'router-link-exact-active'
      : globalExactActiveClass;
    // eslint-disable-next-line eqeqeq
    const activeClass = this.activeClass == null
      ? activeClassFallback
      : this.activeClass;
    // eslint-disable-next-line eqeqeq
    const exactActiveClass = this.exactActiveClass == null
      ? exactActiveClassFallback
      : this.exactActiveClass;
    const compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;
    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);
    const handler = (e) => {
      if (guardEvent(e)) {
        if (this.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };
    const on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach((e) => {
        on[e] = handler;
      });
    } else {
      on[this.event] = handler;
    }
    const data = {
      class: classes,
    };
    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href };
    } else {
      // find the first <a> child and apply listener and href
      const a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        const aData = { ...a.data };
        a.data = aData;
        aData.on = on;
        const aAttrs = { ...a.data.attrs };
        a.data.attrs = aAttrs;
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default);
  },
};

function registerPageRouterView(Vue) {
  Vue.registerElement('ESPageRouterView', {
    component: {
      name: 'ESPageRouterView',
    },
  });
  Vue.component('page-router', {
    render(h) {
      return h('ESPageRouterView',
        {
          ref: 'ESPageRouterView',
        }, this.$slots.default
      );
    },
    methods: {}
  });
}

/**
 * Capitalize a word
 *
 * @param {string} s The word input
 * @returns string
 */
function capitalize(str) {
  if (typeof str !== 'string') {
    return '';
  }
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

/**
 * Get binding events redirector
 *
 * The function should be calld with `getEventRedirector.call(this, [])`
 * for binding this.
 *
 * @param {string[] | string[][]} events events will be redirect
 * @returns Object
 */
function getEventRedirector(events) {
  const on = {};
  events.forEach((event) => {
    if (Array.isArray(event)) {
      const [exposedEventName, nativeEventName] = event;
      if (Object.prototype.hasOwnProperty.call(this.$listeners, exposedEventName)) {
        on[event] = this[`on${capitalize(nativeEventName)}`];
      }
    } else if (Object.prototype.hasOwnProperty.call(this.$listeners, event)) {
      on[event] = this[`on${capitalize(event)}`];
    }
  });
  return on;
}

function registerPageRootView(Vue) {
  Vue.registerElement('ESPageRootView', {
    component: {
      name: 'ESPageRootView',
      processEventData(event, nativeEventName, nativeEventParams) {
        switch (nativeEventName) {
          case 'onLifecycleChange':
            event.lifecycle = nativeEventParams;
            break;
          case 'onDispatchKeyEvent':
            event.keyEvent = nativeEventParams;
            break;
        }
        return event;
      },
    },
  });
  Vue.component('page', {
    methods: {
      onLifecycleChange(evt) {
        this.$emit("onLifecycleChange", evt);
      },
      onDispatchKeyEvent(evt) {
        this.$emit("onDispatchKeyEvent", evt);
      },
    },
    render(h) {
      const on = getEventRedirector.call(this, [
        ['onLifecycleChange', 'lifecycleChange'],
        ['onDispatchKeyEvent', 'dispatchKeyEvent'],
      ]);
      return h('ESPageRootView',
        {
          on,
          ref: 'pageRootView',
        }, this.$slots.default
      );
    },
  });
}

function install(Vue) {
  if (install.installed && getVue() === Vue) return;
  install.installed = true;

  setVue(Vue);

  const isDef = v => v !== undefined;

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this, Vue);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed() {
      registerInstance(this);
    },
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router;
    },
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    },
  });

  Object.defineProperty(Vue.prototype, '$routeState', {
    get() {
      return this._routerRoot._routeState;
    },
  });
  Object.defineProperty(Vue.prototype, '$prevRoute', {
    get() {
      return this._routerRoot._prevRoute;
    },
  });
  Vue.component('EsRouterView', View);
  Vue.component('EsRouterLink', Link);

  //
  registerPageRouterView(Vue);
  registerPageRootView(Vue);

  const strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options), options)
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens, options) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}
pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const regexpCompileCache = Object.create(null);

function fillParams(path, params, routeMsg) {
  try {
    const filler = regexpCompileCache[path]
      || (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, `missing param for ${routeMsg}: ${e.message}`);
    }
    return '';
  }
}

function resolvePath(relative, base, append) {
  const firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative;
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative;
  }

  const stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/');
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/');
}

function parsePath(path) {
  let hash = '';
  let query = '';

  const hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  const queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path,
    query,
    hash,
  };
}

function cleanPath(path) {
  return path.replace(/\/\//g, '/');
}

/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function normalizeLocation(raw, current, append, router) {
  let next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next;
  }

  // relative params
  if (!next.path && next.params && current) {
    next = { ...next };
    next._normalized = true;
    const params = { ...current.params, ...next.params };
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      const rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, `path ${current.path}`);
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, 'relative params navigation requires a current route.');
    }
    return next;
  }

  const parsedPath = parsePath(next.path || '');
  const basePath = (current && current.path) || '/';
  const path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  const query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery,
  );

  let hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = `#${hash}`;
  }

  return {
    _normalized: true,
    path,
    query,
    hash,
  };
}

function compileRouteRegex(path, pathToRegexpOptions) {
  const regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    const keys = Object.create(null);
    regex.keys.forEach((key) => {
      warn(!keys[key.name], `Duplicate param keys in route with path: "${path}"`);
      keys[key.name] = true;
    });
  }
  return regex;
}

function normalizePath(path, parent, strict) {
  if (!strict) path = path.replace(/\/$/, '');
  if (path[0] === '/') return path;
  // eslint-disable-next-line eqeqeq
  if (parent == null) return path;
  return cleanPath(`${parent.path}/${path}`);
}

// #lizard forgives
function addRouteRecord(
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs,
) {
  const {path, name} = route;
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line eqeqeq
    assert(path != null, '"path" is required in a route configuration.');
    assert(
      typeof route.component !== 'string',
      `route config "component" for path: ${String(path || name)} cannot be a `
      + 'string id. Use an actual component instead.',
    );
  }

  const pathToRegexpOptions = route.pathToRegexpOptions || {};
  const normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict,
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  const record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || {default: route.component},
    instances: {},
    launchMode: route.launchMode,
    limit: route.limit,
    name,
    parent,
    matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    // eslint-disable-next-line eqeqeq
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : {default: route.props},
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(child => /^\/?$/.test(child.path))) {
        warn(
          false,
          `Named Route '${route.name}' has a default child route. `
          + `When navigating to this named route (:to="{name: '${route.name}'"), `
          + 'the default child route will not be rendered. Remove the name from '
          + 'this route and use the name of the default child route for named '
          + 'links instead.',
        );
      }
    }
    route.children.forEach((child) => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`)
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    const aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach((alias) => {
      const aliasRoute = {
        path: alias,
        children: route.children,
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/', // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        'Duplicate named routes definition: '
        + `{ name: "${name}", path: "${record.path}" }`,
      );
    }
  }
}

function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap) {
  // the path list is used to control path matching priority
  const pathList = oldPathList || [];
  // $flow-disable-line
  const pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  const nameMap = oldNameMap || Object.create(null);
  routes.forEach((route) => {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });
  // ensure wildcard routes are always at the end
  for (let i = 0, l = pathList.length; i < l; i += 1) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l -= 1;
      i += 1;
    }
  }
  return {
    pathList,
    pathMap,
    nameMap,
  };
}

function createMatcher(routes, router) {
  const {pathList, pathMap, nameMap} = createRouteMap(routes);
  function addRoutes(rs) {
    createRouteMap(rs, pathList, pathMap, nameMap);
  }

  function match(raw, currentRoute, redirectedFrom) {
    const location = normalizeLocation(raw, currentRoute, false, router);
    const {name} = location;

    if (name) {
      const record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`);
      }
      if (!record) return _createRoute(null, location);
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name);

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        Object.keys(currentRoute.params).forEach((key) => {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        });
      }

      if (record) {
        location.path = fillParams(record.path, location.params, `named route "${name}"`);
        return _createRoute(record, location, redirectedFrom);
      }
    } else if (location.path) {
      location.params = {};
      for (let i = 0; i < pathList.length; i += 1) {
        const path = pathList[i];
        const record = pathMap[path];
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom);
        }
      }
    }
    // no match
    return _createRoute(null, location);
  }

  function redirect(record, location) {
    const originalRedirect = record.redirect;
    let redirect = typeof originalRedirect === 'function'
      ? originalRedirect(createRoute(record, location, null, router))
      : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = {path: redirect};
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, `invalid redirect option: ${JSON.stringify(redirect)}`);
      }
      return _createRoute(null, location);
    }

    const re = redirect;
    const {name, path} = re;

    let {query, hash, params} = location;
    query = Object.prototype.hasOwnProperty.call(re, 'query') ? re.query : query;
    hash = Object.prototype.hasOwnProperty.call(re, 'hash') ? re.hash : hash;
    params = Object.prototype.hasOwnProperty.call(re, 'params') ? re.params : params;

    if (name) {
      // resolved named direct
      const targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, `redirect failed: named route "${name}" not found.`);
      }
      return match({
        _normalized: true,
        name,
        query,
        hash,
        params,
      }, undefined, location);
    }
    if (path) {
      // 1. resolve relative redirect
      const rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      const resolvedPath = fillParams(rawPath, params, `redirect route with path "${rawPath}"`);
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query,
        hash,
      }, undefined, location);
    }
    if (process.env.NODE_ENV !== 'production') {
      warn(false, `invalid redirect option: ${JSON.stringify(redirect)}`);
    }
    return _createRoute(null, location);
  }

  function alias(record, location, matchAs) {
    const aliasedPath = fillParams(matchAs, location.params, `aliased route with path "${matchAs}"`);
    const aliasedMatch = match({
      _normalized: true,
      path: aliasedPath,
    });
    if (aliasedMatch) {
      const {matched} = aliasedMatch;
      const aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location);
    }
    return _createRoute(null, location);
  }

  function _createRoute(record, location, redirectedFrom) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location);
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs);
    }
    return createRoute(record, location, redirectedFrom, router);
  }

  function getRoutes() {
    return pathList.map(path => pathMap[path]);
  }

  return {
    match,
    addRoutes,
    getRoutes,
  };
}

function matchRoute(regex, path, params) {
  const m = path.match(regex);

  if (!m) {
    return false;
  }
  if (!params) {
    return true;
  }

  for (let i = 1, len = m.length; i < len; i += 1) {
    const key = regex.keys[i - 1];
    const val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      // Fix #1994: using * with props: true generates a param named 0
      params[key.name || 'pathMatch'] = val;
    }
  }

  return true;
}

function resolveRecordPath(path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true);
}

/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function runQueue(queue, fn, cb) {
  const step = (index) => {
    if (index >= queue.length) {
      cb();
    } else if (queue[index]) {
      fn(queue[index], () => {
        step(index + 1);
      });
    } else {
      step(index + 1);
    }
  };
  step(0);
}

/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const hasSymbol = typeof Symbol === 'function'
  && typeof Symbol.toStringTag === 'symbol';

function isESModule(obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module');
}

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

function flatMapComponents(matched, fn) {
  return flatten(matched.map(m => Object.keys(m.components).map(key => fn(
    m.components[key],
    m.instances[key],
    m, key,
  ))));
}

function resolveAsyncComponents(matched) {
  return (to, from, next) => {
    let hasAsync = false;
    let pending = 0;
    let error = null;

    flatMapComponents(matched, (def, _, match, key) => {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending += 1;

        const resolve = once((resolvedDef) => {
          const Vue = getVue();
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending -= 1;
          if (pending <= 0) {
            next();
          }
        });

        const reject = once((reason) => {
          const msg = `Failed to resolve async component ${key}: ${reason}`;
          if (process.env.NODE_ENV !== 'production') {
            warn(false, msg);
          }
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        let res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            const comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) next();
  };
}

//
const ES_ROUTER_LAUNCH_MODE_STANDARD = 'standard';
const ES_ROUTER_LAUNCH_MODE_CLEAR_TASK = 'clearTask';
const ES_ROUTER_LAUNCH_MODE_SINGLE_TASK = 'singleTask';

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

const TAG = "ESRouter";

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
        ESLog.d("ESRouter", "$$$$$$$$$$$$$$$$$$$$生命周期$$$$$$$$$$$$$$$$$$$$");
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
              && route.matched[0].launchMode === ES_ROUTER_LAUNCH_MODE_SINGLE_TASK) ; else {
              stopRoute(prevRoute);
            }
          }
        }
        //go
        else if (state === 1) {
          //
          if (prevRoute) {
            destroyRoute(prevRoute, false);
          }
          //
          if (route) {
            resumeRoute(route);
          }
        }

        a._prevRoute = prevRoute;
        a._routeState = state;
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

export { ESRouter as default };
