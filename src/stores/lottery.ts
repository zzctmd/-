import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Prize {
  id: string
  name: string
  count: number
  winners: string[]
}

export type Phase = 'setup' | 'ready' | 'rolling' | 'stopped' | 'finished'

export const useLotteryStore = defineStore('lottery', () => {
  // 状态
  const participants = ref<string[]>([])
  const remaining = ref<string[]>([])
  const prizes = ref<Prize[]>([])
  const currentPrizeIndex = ref(0)
  const phase = ref<Phase>('setup')
  const currentWinners = ref<string[]>([])

  // 计算属性
  const currentPrize = computed(() => prizes.value[currentPrizeIndex.value])
  const hasNextPrize = computed(() => currentPrizeIndex.value < prizes.value.length - 1)
  const isLastPrize = computed(() => currentPrizeIndex.value === prizes.value.length - 1)
  const totalPrizeCount = computed(() => prizes.value.reduce((sum, p) => sum + p.count, 0))

  // Fisher-Yates 洗牌算法
  function shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  // 设置参与者名单
  function setParticipants(names: string[]) {
    participants.value = [...names]
    remaining.value = [...names]
  }

  // 设置奖项
  function setPrizes(prizeList: Omit<Prize, 'id' | 'winners'>[]) {
    prizes.value = prizeList.map((p, index) => ({
      ...p,
      id: `prize-${index}`,
      winners: []
    }))
  }

  // 开始抽奖（从配置页进入抽奖页）
  function startLottery() {
    if (participants.value.length === 0 || prizes.value.length === 0) {
      return false
    }
    currentPrizeIndex.value = 0
    phase.value = 'ready'
    remaining.value = shuffle([...participants.value])
    return true
  }

  // 开始滚动
  function startRolling() {
    if (phase.value === 'ready') {
      phase.value = 'rolling'
    }
  }

  // 停止滚动，确定中奖者
  function stopRolling(): string[] {
    if (phase.value !== 'rolling' || !currentPrize.value) {
      return []
    }

    const count = currentPrize.value.count
    const shuffled = shuffle(remaining.value)
    const winners = shuffled.slice(0, count)

    // 记录中奖者
    currentWinners.value = winners
    currentPrize.value.winners = winners

    // 从剩余名单中移除中奖者
    remaining.value = remaining.value.filter(name => !winners.includes(name))

    phase.value = 'stopped'
    return winners
  }

  // 进入下一个奖项
  function nextPrize() {
    if (phase.value !== 'stopped') return

    if (hasNextPrize.value) {
      currentPrizeIndex.value++
      currentWinners.value = []
      phase.value = 'ready'
    } else {
      phase.value = 'finished'
    }
  }

  // 重置所有状态
  function reset() {
    participants.value = []
    remaining.value = []
    prizes.value = []
    currentPrizeIndex.value = 0
    phase.value = 'setup'
    currentWinners.value = []
  }

  // 返回配置页
  function backToSetup() {
    phase.value = 'setup'
    currentPrizeIndex.value = 0
    currentWinners.value = []
    remaining.value = [...participants.value]
    prizes.value.forEach(p => p.winners = [])
  }

  // 获取随机名字（用于滚动显示）
  function getRandomName(): string {
    if (remaining.value.length === 0) return ''
    const index = Math.floor(Math.random() * remaining.value.length)
    return remaining.value[index]
  }

  return {
    // 状态
    participants,
    remaining,
    prizes,
    currentPrizeIndex,
    phase,
    currentWinners,
    // 计算属性
    currentPrize,
    hasNextPrize,
    isLastPrize,
    totalPrizeCount,
    // 方法
    setParticipants,
    setPrizes,
    startLottery,
    startRolling,
    stopRolling,
    nextPrize,
    reset,
    backToSetup,
    getRandomName,
    shuffle
  }
})
