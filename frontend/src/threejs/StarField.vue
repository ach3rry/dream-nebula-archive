<template>
  <div ref="container" class="fixed inset-0 w-full h-full -z-10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, particles, animationId

// 情感到颜色映射
const emotionColors = {
  '平静': { color: new THREE.Color(0x4a69bd), speed: 0.3 },
  '悲伤': { color: new THREE.Color(0x5f6e85), speed: 0.2 },
  '恐惧': { color: new THREE.Color(0x8b0000), speed: 0.8 },
  '兴奋': { color: new THREE.Color(0xffd700), speed: 1.0 },
  '焦虑': { color: new THREE.Color(0xff6b6b), speed: 0.9 },
  '忧郁': { color: new THREE.Color(0x6b4c7a), speed: 0.4 },
  '愉悦': { color: new THREE.Color(0x90EE90), speed: 0.7 }
}

// 初始化 Three.js 场景
function init() {
  // 创建场景
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0005)

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  )
  camera.position.z = 500

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  // 创建粒子星空
  createStarField()

  // 监听窗口大小变化
  window.addEventListener('resize', onWindowResize)

  // 开始动画
  animate()
}

// 创建星空粒子
function createStarField() {
  const particleCount = 1500
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const velocities = new Float32Array(particleCount * 3)

  // 生成粒子数据
  for (let i = 0; i < particleCount; i++) {
    // 随机位置（球形分布）
    const radius = Math.random() * 800 + 200
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    // 随机颜色（偏向紫色和蓝色）
    const colorType = Math.random()
    if (colorType < 0.3) {
      // 紫色
      colors[i * 3] = 0.6 + Math.random() * 0.4
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.3
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
    } else if (colorType < 0.6) {
      // 蓝色
      colors[i * 3] = 0.3 + Math.random() * 0.3
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.3
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
    } else {
      // 白色
      colors[i * 3] = 0.8 + Math.random() * 0.2
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
    }

    // 随机大小
    sizes[i] = Math.random() * 3 + 1

    // 随机速度（布朗运动）
    velocities[i * 3] = (Math.random() - 0.5) * 0.2
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))

  // 创建材质
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  // 创建粒子系统
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

// 窗口大小变化处理
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 动画循环
function animate() {
  animationId = requestAnimationFrame(animate)

  if (particles) {
    // 旋转整个粒子系统
    particles.rotation.y += 0.0002
    particles.rotation.x += 0.0001

    // 更新粒子位置（布朗运动）
    const positions = particles.geometry.attributes.position.array
    const velocities = particles.geometry.attributes.velocity.array

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i]
      positions[i + 1] += velocities[i + 1]
      positions[i + 2] += velocities[i + 2]

      // 边界检查，让粒子保持在视野内
      const maxDist = 1000
      const dist = Math.sqrt(
        positions[i] ** 2 +
        positions[i + 1] ** 2 +
        positions[i + 2] ** 2
      )

      if (dist > maxDist) {
        // 将粒子移回中心附近
        positions[i] *= 0.9
        positions[i + 1] *= 0.9
        positions[i + 2] *= 0.9
      }
    }

    particles.geometry.attributes.position.needsUpdate = true
  }

  renderer.render(scene, camera)
}

// 清理资源
function cleanup() {
  window.removeEventListener('resize', onWindowResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
    container.value?.removeChild(renderer.domElement)
  }
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
div {
  pointer-events: none;
}
</style>
