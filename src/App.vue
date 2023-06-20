<template>
  <div id="root">
<!--    <router-view class="es-router-view"/>-->
  </div>
</template>

<script>
import {defineComponent, ref} from '@vue/runtime-core';
import {Native} from "../packages/hippy-vue-next/src";
// import {Native} from "@hippy/vue-next";

export default defineComponent({
  name: 'App',
  setup() {
    Native.callNative('ESToastModule', 'showToast', 'SLKDFJLSDJFLDSJF');
    console.log('----###########---------AAAAAAAAAAAA-----------')
    return {};
  },
});

</script>

<style scoped>
#root {
  width: 1920px;
  height: 1080px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #FF5415;
}

.es-router-view {
  width: 1920px;
  height: 1080px;
  background-color: palevioletred;
}
</style>
