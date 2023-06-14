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
      } else {
      }
    } else if (Object.prototype.hasOwnProperty.call(this.$listeners, event)) {
      on[event] = this[`on${capitalize(event)}`];
    }
  });
  return on;
}

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
  capitalize,
  getEventRedirector,
  isFunction,
};
