<script setup>
import { ref, onMounted } from 'vue'
import StarField from './threejs/StarField.vue'

const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <div id="app" class="min-h-screen bg-nebula-base overflow-hidden">
    <!-- 加载动画 -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-nebula-base">
        <div class="text-center">
          <div class="mb-4 text-6xl animate-pulse">🌌</div>
          <p class="text-nebula-accent-light text-lg">梦境星云档案馆</p>
          <p class="text-gray-500 text-sm mt-2">正在连接潜意识的星辰...</p>
        </div>
      </div>
    </Transition>

    <!-- 主界面 -->
    <div v-if="!isLoading" class="relative">
      <!-- Three.js 星空背景 -->
      <StarField />

      <!-- 导航栏 -->
      <nav class="fixed top-0 left-0 right-0 z-40 px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <h1 class="text-2xl font-bold text-white flex items-center gap-2">
            <span class="text-3xl">✨</span>
            <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              梦境星云档案馆
            </span>
          </h1>
          <div class="flex gap-4">
            <button class="px-4 py-2 text-white/80 hover:text-white transition-colors">
              捕梦
            </button>
            <button class="px-4 py-2 text-white/80 hover:text-white transition-colors">
              档案馆
            </button>
            <button class="px-4 py-2 text-white/80 hover:text-white transition-colors">
              画像
            </button>
          </div>
        </div>
      </nav>

      <!-- 主内容区 -->
      <main class="relative z-10">
        <div class="min-h-screen flex items-center justify-center px-6">
          <div class="text-center max-w-2xl">
            <h2 class="text-5xl font-bold text-white mb-6 animate-float">
              每一个梦境，都是星空中独特的星辰
            </h2>
            <p class="text-xl text-gray-300 mb-8">
              记录你的梦境，让 AI 解析潜意识，在星空中找到属于你的那颗星
            </p>
            <button class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-purple-500/50">
              🌟 开始捕梦
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#app {
  position: relative;
  width: 100vw;
  min-height: 100vh;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a1a;
}

::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}
</style>
