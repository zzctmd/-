<script setup lang="ts">
import { computed } from 'vue'
import { useLotteryStore } from './stores/lottery'
import SetupPage from './components/SetupPage.vue'
import LotteryPage from './components/LotteryPage.vue'

const store = useLotteryStore()

const showLottery = computed(() => store.phase !== 'setup')
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- 喜庆背景 -->
    <div class="festive-bg"></div>
    
    <!-- 装饰元素层 -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- 左上角灯笼 -->
      <div class="absolute top-4 left-8 text-6xl animate-swing origin-top">🏮</div>
      <div class="absolute top-4 left-28 text-5xl animate-swing origin-top" style="animation-delay: 0.3s;">🏮</div>
      
      <!-- 右上角灯笼 -->
      <div class="absolute top-4 right-8 text-6xl animate-swing origin-top" style="animation-delay: 0.5s;">🏮</div>
      <div class="absolute top-4 right-28 text-5xl animate-swing origin-top" style="animation-delay: 0.2s;">🏮</div>
      
      <!-- 左下角装饰 -->
      <div class="absolute bottom-8 left-8 text-5xl opacity-70 animate-float">🧧</div>
      <div class="absolute bottom-24 left-16 text-4xl opacity-60 animate-float" style="animation-delay: 0.5s;">🪙</div>
      <div class="absolute bottom-40 left-6 text-3xl opacity-50 animate-twinkle">✨</div>
      
      <!-- 右下角装饰 -->
      <div class="absolute bottom-8 right-8 text-5xl opacity-70 animate-float" style="animation-delay: 0.3s;">🧧</div>
      <div class="absolute bottom-24 right-16 text-4xl opacity-60 animate-float" style="animation-delay: 0.8s;">🪙</div>
      <div class="absolute bottom-40 right-6 text-3xl opacity-50 animate-twinkle" style="animation-delay: 0.4s;">✨</div>
      
      <!-- 左边缘烟花 -->
      <div class="absolute top-1/4 left-4 text-4xl opacity-50 animate-twinkle">🎆</div>
      <div class="absolute top-2/3 left-6 text-3xl opacity-40 animate-twinkle" style="animation-delay: 0.6s;">🎇</div>
      
      <!-- 右边缘烟花 -->
      <div class="absolute top-1/3 right-4 text-4xl opacity-50 animate-twinkle" style="animation-delay: 0.3s;">🎆</div>
      <div class="absolute top-3/4 right-6 text-3xl opacity-40 animate-twinkle" style="animation-delay: 0.9s;">🎇</div>
      
      <!-- 散落的金币和星星 -->
      <div class="absolute top-1/5 left-1/4 text-2xl opacity-40 animate-twinkle" style="animation-delay: 0.2s;">💫</div>
      <div class="absolute top-1/6 right-1/4 text-2xl opacity-40 animate-twinkle" style="animation-delay: 0.7s;">💫</div>
      <div class="absolute bottom-1/4 left-1/3 text-xl opacity-30 animate-twinkle" style="animation-delay: 0.4s;">⭐</div>
      <div class="absolute bottom-1/3 right-1/3 text-xl opacity-30 animate-twinkle" style="animation-delay: 0.5s;">⭐</div>
    </div>
    
    <!-- 主内容 -->
    <div class="relative z-10">
      <SetupPage v-if="!showLottery" />
      <LotteryPage v-else />
    </div>
  </div>
</template>

<style scoped>
/* 灯笼摇摆动画 */
.animate-swing {
  animation: swing 3s ease-in-out infinite;
}

@keyframes swing {
  0%, 100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(8deg);
  }
}

/* 浮动动画 */
.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* 闪烁动画 */
.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.15);
  }
}
</style>
