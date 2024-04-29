<template>
  <div class="SumorApp"><slot></slot></div>
</template>
<script>
export default {
  props:[],
  data(){
    return {
      sumor: this.$store("sumor")
    }
  },
  async mounted(){
    if(this.$env.dark){
      this.loadDarkMode();
      this.listenDarkModeChange();
    }

    if (typeof window !== "undefined" && window) {
      window.addEventListener('resize', () => {
        this.sumor.resize();
        setTimeout(()=>{
          this.sumor.resize();
        },10);
      })

      // 监听popstate事件（浏览器前进后退）
      window.addEventListener('popstate', () => {
        this.sumor.resize();
        setTimeout(()=>{
          this.sumor.resize();
        },10);
      })
    }
  },
  methods:{
    loadDarkMode() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 当前处于dark模式
        this.sumor.setDark(true)
      } else {
        // 当前不处于dark模式
        this.sumor.setDark(false)
      }
    },
    listenDarkModeChange() {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // 监听媒体查询的变化
      darkModeMediaQuery.addEventListener('change', (event) => {
        if (event.matches) {
          // dark模式被启用
          this.sumor.setDark(true)
        } else {
          // dark模式被禁用
          this.sumor.setDark(false)
        }
      });
    }
  }
}
</script>
<style scoped>
.SumorApp{
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>