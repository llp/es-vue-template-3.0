
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

export default registerPageRouterView;
