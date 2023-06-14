import {lifecycleChanged} from "../lifecycle/LifecycleManager";

import {
  ES_LIFECYCLE_ON_UNINITIALIZED,
  ES_LIFECYCLE_ON_INITIALIZED,
  ES_LIFECYCLE_ON_CREATE,
  ES_LIFECYCLE_ON_RESUME,
  ES_LIFECYCLE_ON_START,
  ES_LIFECYCLE_ON_STOP,
  ES_LIFECYCLE_ON_DESTROY,
  ES_LIFECYCLE_ON_RESTORE_INSTANCE_SATE,
} from "../../../ESCore/core/lifecycle/ESPageLifecycleState";

export default {
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
    const name = props.name
    //do not delete
    const route = parent.$route;
    let componentList = [];
    const vueRouter = parent.$router;
    let stack = vueRouter.history.stack

    let renderComponentIndex = -1;

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
          renderComponentIndex++;

          //-----------------------------------------
          let pageData = {
            position: 'absolute',
          }
          pageData.key = i;
          const mc = matched.components.default;
          component = h(mc, pageData);
          parent.$nextTick(() => {
            c.lifecycle.instance = component.componentInstance;
            try {
              let componentInstance = component.componentInstance;
              if (c.lifecycle.state <= ES_LIFECYCLE_ON_INITIALIZED) {

                let uninitialized = c.lifecycle.state === ES_LIFECYCLE_ON_UNINITIALIZED

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
          })
        }
        //
        else {
        }
        //----------------------------------------------------------------------

        let pageComponentList = [];
        if (component) {
          pageComponentList.push(component)
        }
        let data = {
          style: {
            position: 'absolute',
          },
        }
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
    }
    data.ref = 'pageRouter';
    if (vueRouter.isESPageRouterViewSupported()) {
      return h('page-router', data, componentList);
    }
    //
    else {
      return h('div', data, componentList);
    }
  }
};

