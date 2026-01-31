<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useLotteryStore } from '../stores/lottery'

const props = defineProps<{
  index: number
  isRolling: boolean
  finalName?: string
  prizeIndex: number
}>()

const store = useLotteryStore()
const displayName = ref('?')
let intervalId: number | null = null

// 开始滚动
function startRolling() {
  if (intervalId) return
  
  intervalId = window.setInterval(() => {
    displayName.value = store.getRandomName()
  }, 50) // 每50ms切换一次名字
}

// 停止滚动
function stopRolling() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// 监听奖项变化，重置显示为问号
watch(() => props.prizeIndex, () => {
  displayName.value = '?'
}, { immediate: true })

// 监听滚动状态
watch(() => props.isRolling, (rolling) => {
  if (rolling) {
    startRolling()
  } else {
    stopRolling()
  }
}, { immediate: true })

// 当有最终名字时显示
watch(() => props.finalName, (name) => {
  if (name) {
    displayName.value = name
  }
})

// 组件卸载时清理
onUnmounted(() => {
  stopRolling()
})
</script>

<template>
  <div class="rolling-box w-72 h-36 flex items-center justify-center">
    <span 
      class="text-4xl font-bold text-white truncate px-6"
      :class="{ 'name-rolling': isRolling }"
    >
      {{ displayName }}
    </span>
  </div>
</template>
