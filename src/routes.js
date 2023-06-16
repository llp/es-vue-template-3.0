import index from "./views/index";
import error from "./views/error";

const routes = [
  {
    path: '/index',
    name: 'index',
    component: index
  },
  {
    path: '/error',
    name: 'error',
    component: error
  },
]

export default {
  routes,
};
