<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLotteryStore } from '../stores/lottery'
import { parseExcelFirstColumn } from '../utils/excel'

const store = useLotteryStore()

// 导入的名单
const importedNames = ref<string[]>([])
const importError = ref('')
const isImporting = ref(false)

// 奖项设置
interface PrizeInput {
  name: string
  count: number
}
const prizeInputs = ref<PrizeInput[]>([
  { name: '一等奖', count: 1 },
  { name: '二等奖', count: 2 },
  { name: '三等奖', count: 3 }
])

// 表单验证
const canStart = computed(() => {
  if (importedNames.value.length === 0) return false
  if (prizeInputs.value.length === 0) return false
  
  const totalPrizes = prizeInputs.value.reduce((sum, p) => sum + p.count, 0)
  if (totalPrizes > importedNames.value.length) return false
  
  return prizeInputs.value.every(p => p.name.trim() && p.count > 0)
})

const totalPrizeCount = computed(() => {
  return prizeInputs.value.reduce((sum, p) => sum + p.count, 0)
})

// 处理文件上传
async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  isImporting.value = true
  importError.value = ''
  
  try {
    const names = await parseExcelFirstColumn(file)
    if (names.length === 0) {
      importError.value = '未能从文件中读取到任何名字'
    } else {
      importedNames.value = names
    }
  } catch (e) {
    importError.value = '文件解析失败，请确保是有效的 Excel 文件'
  } finally {
    isImporting.value = false
  }
}

// 添加奖项
function addPrize() {
  const nextNum = prizeInputs.value.length + 1
  const names = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  const prizeName = nextNum <= 10 ? `${names[nextNum - 1]}等奖` : `${nextNum}等奖`
  prizeInputs.value.push({ name: prizeName, count: 1 })
}

// 删除奖项
function removePrize(index: number) {
  if (prizeInputs.value.length > 1) {
    prizeInputs.value.splice(index, 1)
  }
}

// 开始抽奖
function handleStart() {
  if (!canStart.value) return
  
  store.setParticipants(importedNames.value)
  store.setPrizes(prizeInputs.value)
  store.startLottery()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8">
    <div class="w-full max-w-6xl">
      <!-- 标题 -->
      <h1 class="text-4xl font-bold text-center mb-12 text-festive-gold title-glow">
        🎊 年会抽奖 🎊
      </h1>
      
      <div class="grid md:grid-cols-2 gap-8">
        <!-- 左侧：名单导入 -->
        <div class="bg-black/30 backdrop-blur-sm rounded-2xl p-6 gold-border">
          <h2 class="text-2xl font-bold text-festive-gold mb-6 flex items-center gap-2">
            <span>📋</span> 导入名单
          </h2>
          
          <!-- 文件上传 -->
          <div class="mb-6">
            <label class="block mb-3 text-white/80">
              上传 Excel 文件（第一列：姓名，第二列：部门）
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              @change="handleFileUpload"
              class="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-festive-gold file:text-black file:font-semibold hover:file:bg-festive-gold-light file:cursor-pointer cursor-pointer"
              :disabled="isImporting"
            />
            <p v-if="importError" class="mt-2 text-red-400 text-sm">{{ importError }}</p>
          </div>
          
          <!-- 已导入名单预览 -->
          <div v-if="importedNames.length > 0" class="mt-4">
            <div class="flex justify-between items-center mb-3">
              <span class="text-festive-gold-light font-semibold">
                已导入 {{ importedNames.length }} 人
              </span>
              <button
                @click="importedNames = []"
                class="text-sm text-red-400 hover:text-red-300"
              >
                清除
              </button>
            </div>
            <div class="max-h-48 overflow-y-auto bg-black/30 rounded-lg p-3">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(name, index) in importedNames.slice(0, 50)"
                  :key="index"
                  class="px-2 py-1 bg-festive-red/50 text-white text-sm rounded"
                >
                  {{ name }}
                </span>
                <span v-if="importedNames.length > 50" class="text-white/60 text-sm py-1">
                  ... 还有 {{ importedNames.length - 50 }} 人
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：奖项设置 -->
        <div class="bg-black/30 backdrop-blur-sm rounded-2xl p-6 gold-border min-w-[400px]">
          <h2 class="text-2xl font-bold text-festive-gold mb-6 flex items-center gap-2">
            <span>🏆</span> 设置奖项
          </h2>
          
          <!-- 奖项列表 -->
          <div class="space-y-3 mb-4 max-h-72 overflow-y-auto overflow-x-hidden pr-2">
            <div
              v-for="(prize, index) in prizeInputs"
              :key="index"
              class="flex items-center gap-4"
            >
              <input
                v-model="prize.name"
                type="text"
                placeholder="奖项名称"
                class="input-festive flex-1 min-w-[120px]"
              />
              <div class="flex items-center gap-2 shrink-0">
                <input
                  v-model.number="prize.count"
                  type="number"
                  min="1"
                  placeholder="人数"
                  class="input-festive w-24 text-center"
                />
                <span class="text-white/60 text-sm">人</span>
              </div>
              <button
                @click="removePrize(index)"
                class="text-red-400 hover:text-red-300 text-xl px-2 shrink-0"
                :disabled="prizeInputs.length <= 1"
              >
                ✕
              </button>
            </div>
          </div>
          
          <!-- 添加奖项按钮 -->
          <button
            @click="addPrize"
            class="w-full py-2 border-2 border-dashed border-festive-gold/50 rounded-lg text-festive-gold hover:border-festive-gold hover:bg-festive-gold/10 transition-all"
          >
            + 添加奖项
          </button>
          
          <!-- 统计 -->
          <div class="mt-4 text-white/80 text-sm">
            共 {{ prizeInputs.length }} 个奖项，{{ totalPrizeCount }} 个名额
            <span v-if="importedNames.length > 0">
              （剩余 {{ importedNames.length - totalPrizeCount }} 人未中奖）
            </span>
          </div>
        </div>
      </div>
      
      <!-- 开始按钮 -->
      <div class="mt-10 text-center">
        <button
          @click="handleStart"
          :disabled="!canStart"
          class="btn-festive text-2xl px-16 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🎉 开始抽奖 🎉
        </button>
        <p v-if="!canStart && importedNames.length > 0 && totalPrizeCount > importedNames.length" class="mt-3 text-red-400">
          奖项名额（{{ totalPrizeCount }}）不能超过参与人数（{{ importedNames.length }}）
        </p>
      </div>
    </div>
  </div>
</template>
