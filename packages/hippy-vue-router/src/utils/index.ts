import {
  RouteParams,
  RouteComponent,
  RouteParamsRaw,
  RouteParamValueRaw,
} from '../types'

export * from './env'

export function isESModule(obj: any): obj is { default: RouteComponent } {
  return obj.__esModule || obj[Symbol.toStringTag] === 'Module'
}

export const assign = Object.assign

export function applyToParams(
  fn: (v: string | number | null | undefined) => string,
  params: RouteParamsRaw | undefined
): RouteParams {
  const newParams: RouteParams = {}

  for (const key in params) {
    const value = params[key]
    newParams[key] = isArray(value)
      ? value.map(fn)
      : fn(value as Exclude<RouteParamValueRaw, any[]>)
  }

  return newParams
}

export const noop = () => {}

/**
 * Typesafe alternative to Array.isArray
 * https://github.com/microsoft/TypeScript/pull/48228
 */
export const isArray: (arg: ArrayLike<any> | any) => arg is ReadonlyArray<any> =
  Array.isArray


function isFunction(func) {
  return Object.prototype.toString.call(func) === '[object Function]';
}

let _Vue;
let _App;

function setVue(Vue) {
  _Vue = Vue;
}

function getVue() {
  return _Vue;
}

function setApp(app) {
  _App = app;
}

function getApp() {
  return _App;
}


/**
 * Ensure a function is called only once.
 */
function once(fn) {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}

export {
  once,
  setVue,
  getVue,
  setApp,
  getApp,
  isFunction,
};
