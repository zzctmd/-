<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useLotteryStore } from '../stores/lottery'
import RollingBox from './RollingBox.vue'
import WinnerModal from './WinnerModal.vue'

const store = useLotteryStore()

const isRolling = computed(() => store.phase === 'rolling')
const showModal = computed(() => store.phase === 'stopped')
const isFinished = computed(() => store.phase === 'finished')

// 获取当前奖项需要的滚动框数量
const boxCount = computed(() => store.currentPrize?.count || 0)

// 空格键处理
function handleKeyDown(event: KeyboardEvent) {
  if (event.code !== 'Space') return
  event.preventDefault()
  
  switch (store.phase) {
    case 'ready':
      // 开始滚动
      store.startRolling()
      break
    case 'rolling':
      // 停止滚动，确定中奖者
      store.stopRolling()
      break
    case 'stopped':
      // 进入下一个奖项
      store.nextPrize()
      break
    case 'finished':
      // 完成后可以返回配置页
      store.backToSetup()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-8">
    <!-- 完成页面 -->
    <template v-if="isFinished">
      <div class="text-center w-full max-w-6xl">
        <h1 class="text-8xl font-bold text-festive-gold title-glow mb-12">
          🎉 抽奖完成 🎉
        </h1>
        
        <!-- 所有中奖结果 -->
        <div class="bg-black/30 backdrop-blur-sm rounded-3xl p-10 gold-border mx-auto mb-10">
          <h2 class="text-4xl text-festive-gold-light mb-8">中奖名单</h2>
          <div class="space-y-8">
            <div v-for="prize in store.prizes" :key="prize.id" class="text-left">
              <h3 class="text-3xl text-festive-gold font-bold mb-4">{{ prize.name }}</h3>
              <div class="flex flex-wrap gap-4">
                <span
                  v-for="(winner, idx) in prize.winners"
                  :key="idx"
                  class="px-6 py-3 bg-festive-red/50 text-white text-2xl rounded-xl"
                >
                  {{ winner }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <p class="text-festive-gold-light text-3xl animate-pulse">
          按 空格键 返回配置页面
        </p>
      </div>
    </template>
    
    <!-- 抽奖页面 -->
    <template v-else>
      <!-- 当前奖项名称 -->
      <div class="mb-16 text-center">
        <h1 class="text-8xl font-bold text-festive-gold title-glow mb-8">
          {{ store.currentPrize?.name }}
        </h1>
        <p class="text-3xl text-festive-gold-light">
          第 {{ store.currentPrizeIndex + 1 }} / {{ store.prizes.length }} 轮
          · 本轮抽取 {{ store.currentPrize?.count }} 人
        </p>
      </div>
      
      <!-- 滚动框区域 -->
      <div class="flex flex-wrap justify-center gap-10 mb-20 max-w-7xl">
        <RollingBox
          v-for="i in boxCount"
          :key="`${store.currentPrizeIndex}-${i}`"
          :index="i - 1"
          :is-rolling="isRolling"
          :final-name="store.currentWinners[i - 1]"
          :prize-index="store.currentPrizeIndex"
        />
      </div>
      
      <!-- 操作提示 -->
      <div class="text-center">
        <p v-if="store.phase === 'ready'" class="text-4xl text-festive-gold-light animate-pulse">
          按 空格键 开始抽奖
        </p>
        <p v-else-if="store.phase === 'rolling'" class="text-4xl text-festive-gold-light animate-pulse">
          按 空格键 停止
        </p>
      </div>
      
      <!-- 返回按钮 -->
      <button
        @click="store.backToSetup"
        class="fixed top-8 left-8 bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3 text-xl text-festive-gold-light hover:text-festive-gold transition-colors gold-border"
      >
        ← 返回配置
      </button>
    </template>
    
    <!-- 中奖弹窗 -->
    <WinnerModal
      :show="showModal"
      :prize-name="store.currentPrize?.name || ''"
      :winners="store.currentWinners"
    />
  </div>
</template>
