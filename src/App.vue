<template>
  <div id="root">
    <es-router-view/>
  </div>
</template>

<script>

export default {
  name: 'ESApp',
  data() {
    return {
      pageParams: {},
    };
  },
  methods: {
    /**
     * ESApplication 生命周期: onESCreate();
     */
    onESCreate(props) {
      this.initLog();
      return Promise.resolve()
    },
    /**
     * 初始化ESLog
     */
    initLog() {

    },
  },
};
</script>

<style scoped>
#root {
  width: 1920px;
  height: 1080px;
}
</style>
