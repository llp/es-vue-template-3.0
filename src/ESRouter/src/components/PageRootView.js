import {getEventRedirector} from "../util/utils";

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
        this.$emit("onLifecycleChange", evt)
      },
      onDispatchKeyEvent(evt) {
        this.$emit("onDispatchKeyEvent", evt)
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

export default registerPageRootView;
