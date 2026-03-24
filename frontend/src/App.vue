<script setup>
import { ref, onMounted, computed } from 'vue'
import StarField from './threejs/StarField.vue'

const isLoading = ref(true)
const dreamContent = ref('')
const activeNav = ref('archive')

// Sample dream data
const dreams = ref([
  {
    id: 1,
    title: '失落的星际图书馆',
    date: '2026-03-23',
    mood: 'mysterious',
    moodIcon: 'M',
    summary: '我漂浮在一座由光构成的图书馆中，每一本书都是一颗微小的星球，我翻阅着时间的碎片...',
    tags: ['宇宙', '知识', '时间']
  },
  {
    id: 2,
    title: '水晶花园的低语',
    date: '2026-03-22',
    mood: 'peaceful',
    moodIcon: 'P',
    summary: '晶莹剔透的花朵在月光下绽放，每一片花瓣都在诉说着一个关于永恒的故事...',
    tags: ['自然', '宁静', '永恒']
  },
  {
    id: 3,
    title: '穿越霓虹城市',
    date: '2026-03-21',
    mood: 'anxious',
    moodIcon: 'A',
    summary: '在霓虹灯闪烁的未来城市中奔跑，追逐着一个永远触碰不到的影子...',
    tags: ['城市', '追逐', '未来']
  },
  {
    id: 4,
    title: '云端的秘密花园',
    date: '2026-03-20',
    mood: 'happy',
    moodIcon: 'H',
    summary: '我发现了一座隐藏在云层之上的秘密花园，那里的花朵会唱歌，蝴蝶会讲故事...',
    tags: ['奇幻', '欢乐', '发现']
  }
])

const moodColors = {
  calm: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
  happy: { bg: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30', icon: 'text-yellow-400' },
  anxious: { bg: 'from-red-500/20 to-pink-500/20', border: 'border-red-500/30', icon: 'text-red-400' },
  mysterious: { bg: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30', icon: 'text-purple-400' },
  peaceful: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', icon: 'text-green-400' }
}

const getMoodStyle = (mood) => moodColors[mood] || moodColors.calm

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})

const handleRecordDream = () => {
  if (dreamContent.value.trim()) {
    console.log('Recording dream:', dreamContent.value)
    dreamContent.value = ''
  }
}
</script>

<template>
  <div id="app" class="min-h-screen bg-nebula-base overflow-hidden relative">
    <!-- Floating Nebula Orbs Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <!-- Purple Orb -->
      <div 
        class="nebula-orb w-[600px] h-[600px] bg-purple-600/30 top-[-200px] left-[-100px] animate-nebula-drift"
      ></div>
      <!-- Pink Orb -->
      <div 
        class="nebula-orb w-[500px] h-[500px] bg-pink-500/25 top-[30%] right-[-150px] animate-nebula-drift-2"
      ></div>
      <!-- Blue Orb -->
      <div 
        class="nebula-orb w-[700px] h-[700px] bg-blue-600/20 bottom-[-200px] left-[20%] animate-nebula-drift-3"
      ></div>
      <!-- Cyan Orb -->
      <div 
        class="nebula-orb w-[400px] h-[400px] bg-cyan-500/20 top-[60%] left-[-100px] animate-nebula-drift"
        style="animation-delay: -5s"
      ></div>
      <!-- Magenta Orb -->
      <div 
        class="nebula-orb w-[450px] h-[450px] bg-fuchsia-500/25 top-[10%] right-[30%] animate-nebula-drift-2"
        style="animation-delay: -10s"
      ></div>
    </div>

    <!-- Loading Animation -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-500 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-nebula-base">
        <div class="text-center">
          <div class="relative w-24 h-24 mx-auto mb-6">
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-spin opacity-50 blur-md"></div>
            <div class="absolute inset-2 rounded-full bg-nebula-base flex items-center justify-center">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-magenta-500 animate-pulse"></div>
            </div>
          </div>
          <h2 class="gradient-text text-2xl font-display font-semibold mb-2">Dream Nebula Archive</h2>
          <p class="text-white/50 text-sm">正在连接潜意识的星辰...</p>
        </div>
      </div>
    </Transition>

    <!-- Main Interface -->
    <div v-if="!isLoading" class="relative z-10">
      <!-- Three.js Star Field Background -->
      <StarField />

      <!-- Navigation Bar -->
      <nav class="fixed top-0 left-0 right-0 z-40 px-6 py-4">
        <div class="max-w-6xl mx-auto">
          <div class="glass-card px-6 py-3 flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center jelly-btn cursor-pointer">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <span class="gradient-text text-xl font-display font-semibold hidden sm:block">Dream Nebula</span>
            </div>

            <!-- Nav Links -->
            <div class="flex items-center gap-2">
              <button 
                @click="activeNav = 'archive'"
                :class="[
                  'nav-link px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 jelly-btn',
                  activeNav === 'archive' 
                    ? 'bg-white/10 text-cyan-400' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                ]"
              >
                Archive Explorer
              </button>
              <button 
                @click="activeNav = 'dreams'"
                :class="[
                  'nav-link px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 jelly-btn',
                  activeNav === 'dreams' 
                    ? 'bg-white/10 text-cyan-400' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                ]"
              >
                My Dreams
              </button>
            </div>

            <!-- Profile -->
            <button class="w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center jelly-btn hover:border-cyan-500/50 transition-colors">
              <svg class="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="relative pt-28 pb-20 px-6">
        <div class="max-w-4xl mx-auto">
          <!-- Hero Section -->
          <div class="text-center mb-16 animate-fade-in-up">
            <h1 class="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              <span class="gradient-text">Dream Nebula</span>
              <br />
              <span class="text-white/90">Archive</span>
            </h1>
            <p class="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              记录你的梦境，让 AI 解析潜意识中的密码，在星空中寻找属于你的星辰
            </p>
          </div>

          <!-- Dream Recorder -->
          <div class="mb-16 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="vapor-glow">
              <div class="glass-card p-6">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h2 class="text-lg font-semibold text-white">Dream Recorder</h2>
                </div>
                <textarea
                  v-model="dreamContent"
                  placeholder="描述你的梦境... 让每一个细节都化作星辰的光芒..."
                  class="w-full h-36 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                ></textarea>
                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center gap-2">
                    <button class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all jelly-btn">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <button class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all jelly-btn">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  </div>
                  <button 
                    @click="handleRecordDream"
                    class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all jelly-btn flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    记录梦境
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Dream Feed Section -->
          <div class="animate-fade-in-up" style="animation-delay: 0.4s">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-display font-semibold text-white flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Recent Dreams
              </h2>
              <button class="text-sm text-white/50 hover:text-cyan-400 transition-colors">
                查看全部
              </button>
            </div>

            <!-- Dream Cards Grid -->
            <div class="grid gap-4">
              <TransitionGroup name="dream-list">
                <div
                  v-for="dream in dreams"
                  :key="dream.id"
                  class="nebula-card glass-card glass-card-hover p-5 cursor-pointer"
                  :class="getMoodStyle(dream.mood).border"
                >
                  <div class="flex items-start gap-4">
                    <!-- Mood Indicator -->
                    <div 
                      :class="[
                        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br',
                        getMoodStyle(dream.mood).bg
                      ]"
                    >
                      <span :class="['text-xl font-bold', getMoodStyle(dream.mood).icon]">
                        {{ dream.moodIcon }}
                      </span>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-4 mb-2">
                        <h3 class="text-lg font-semibold text-white truncate">{{ dream.title }}</h3>
                        <span class="text-xs text-white/40 shrink-0">{{ dream.date }}</span>
                      </div>
                      <p class="text-sm text-white/60 leading-relaxed mb-3 line-clamp-2">
                        {{ dream.summary }}
                      </p>
                      <div class="flex items-center gap-2">
                        <span 
                          v-for="tag in dream.tags" 
                          :key="tag"
                          class="px-2 py-1 text-xs rounded-md bg-white/5 text-white/50 border border-white/10"
                        >
                          #{{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </main>

      <!-- Floating Action Button -->
      <button class="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all jelly-btn z-30">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Dream List Transitions */
.dream-list-enter-active,
.dream-list-leave-active {
  transition: all 0.5s ease;
}

.dream-list-enter-from,
.dream-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.dream-list-move {
  transition: transform 0.5s ease;
}

/* Line Clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation Delays for Staggered Effect */
.animate-fade-in-up {
  opacity: 0;
}
</style>
