<template>
  <div ref="container" class="fixed inset-0 w-full h-full -z-10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, particles, nebulaParticles, animationId

// Initialize Three.js scene
function init() {
  // Create scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x030014, 0.0003)

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  )
  camera.position.z = 600

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x030014, 1)
  container.value.appendChild(renderer.domElement)

  // Create star field
  createStarField()
  
  // Create nebula particles
  createNebulaParticles()

  // Listen for window resize
  window.addEventListener('resize', onWindowResize)

  // Start animation
  animate()
}

// Create star field particles
function createStarField() {
  const particleCount = 2000
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const velocities = new Float32Array(particleCount * 3)

  // Cyberpunk color palette
  const colorPalette = [
    { r: 0, g: 1, b: 1 },      // Cyan
    { r: 1, g: 0, b: 1 },      // Magenta
    { r: 0.66, g: 0.33, b: 0.97 }, // Purple
    { r: 1, g: 0.43, b: 0.78 },    // Pink
    { r: 0.23, g: 0.51, b: 0.96 }, // Blue
    { r: 1, g: 1, b: 1 },      // White
  ]

  // Generate particle data
  for (let i = 0; i < particleCount; i++) {
    // Random position (spherical distribution)
    const radius = Math.random() * 900 + 100
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    // Random color from palette
    const colorIndex = Math.floor(Math.random() * colorPalette.length)
    const color = colorPalette[colorIndex]
    const intensity = 0.7 + Math.random() * 0.3
    
    colors[i * 3] = color.r * intensity
    colors[i * 3 + 1] = color.g * intensity
    colors[i * 3 + 2] = color.b * intensity

    // Random size
    sizes[i] = Math.random() * 3 + 0.5

    // Random velocity (Brownian motion)
    velocities[i * 3] = (Math.random() - 0.5) * 0.15
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.15
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.15
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))

  // Create material
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  // Create particle system
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

// Create nebula-like larger particles
function createNebulaParticles() {
  const count = 100
  const geometry = new THREE.BufferGeometry()
  
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  const nebulaColors = [
    { r: 0, g: 0.8, b: 1 },      // Cyan
    { r: 1, g: 0, b: 0.8 },      // Magenta
    { r: 0.5, g: 0.2, b: 1 },    // Purple
  ]
  
  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 600 + 200
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
    
    const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  const material = new THREE.PointsMaterial({
    size: 15,
    vertexColors: true,
    transparent: true,
    opacity: 0.15,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })
  
  nebulaParticles = new THREE.Points(geometry, material)
  scene.add(nebulaParticles)
}

// Window resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Animation loop
function animate() {
  animationId = requestAnimationFrame(animate)

  if (particles) {
    // Rotate particle system
    particles.rotation.y += 0.0001
    particles.rotation.x += 0.00005

    // Update particle positions (Brownian motion)
    const positions = particles.geometry.attributes.position.array
    const velocities = particles.geometry.attributes.velocity.array

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i]
      positions[i + 1] += velocities[i + 1]
      positions[i + 2] += velocities[i + 2]

      // Boundary check
      const maxDist = 1000
      const dist = Math.sqrt(
        positions[i] ** 2 +
        positions[i + 1] ** 2 +
        positions[i + 2] ** 2
      )

      if (dist > maxDist) {
        positions[i] *= 0.9
        positions[i + 1] *= 0.9
        positions[i + 2] *= 0.9
      }
    }

    particles.geometry.attributes.position.needsUpdate = true
  }
  
  if (nebulaParticles) {
    nebulaParticles.rotation.y -= 0.00015
    nebulaParticles.rotation.z += 0.0001
  }

  renderer.render(scene, camera)
}

// Cleanup resources
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
