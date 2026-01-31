<script setup lang="ts">
import { onMounted } from 'vue'
import confetti from 'canvas-confetti'

defineProps<{
  show: boolean
  prizeName: string
  winners: string[]
}>()

defineEmits<{
  close: []
}>()

// 放烟花效果
function fireConfetti() {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#DC2626', '#F59E0B', '#FCD34D', '#FBBF24']
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#DC2626', '#F59E0B', '#FCD34D', '#FBBF24']
    })
  }, 250)
}

onMounted(() => {
  fireConfetti()
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      <!-- 弹窗内容 - 加大尺寸适应大屏幕 -->
      <div class="relative bg-gradient-to-b from-red-900 to-red-950 rounded-3xl p-12 max-w-4xl w-full mx-8 gold-border">
        <!-- 顶部装饰 -->
        <div class="absolute -top-8 left-1/2 -translate-x-1/2">
          <div class="bg-festive-gold text-red-900 font-bold text-3xl px-10 py-3 rounded-full shadow-lg">
            🎊 恭喜中奖 🎊
          </div>
        </div>
        
        <!-- 奖项名称 -->
        <h2 class="text-7xl font-bold text-center text-festive-gold mt-6 mb-12 title-glow">
          {{ prizeName }}
        </h2>
        
        <!-- 中奖者名单 -->
        <div class="bg-black/30 rounded-2xl p-8 mb-8">
          <div class="flex flex-wrap justify-center gap-6">
            <div
              v-for="(winner, index) in winners"
              :key="index"
              class="bg-gradient-to-r from-festive-gold to-yellow-500 text-red-900 font-bold text-4xl px-10 py-5 rounded-2xl shadow-lg animate-float"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              {{ winner }}
            </div>
          </div>
        </div>
        
        <!-- 提示 -->
        <p class="text-center text-festive-gold-light text-2xl animate-pulse">
          按 空格键 继续
        </p>
      </div>
    </div>
  </Transition>
</template>
