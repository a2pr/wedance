<script setup lang="ts">
defineProps<{
  sections: { id: string; label: string }[]
  activeIndex: number
  navLabel: string
}>()

const emit = defineEmits<{ navigate: [number] }>()
</script>

<template>
  <nav class="scroll-indicator" :aria-label="navLabel">
    <button
      v-for="(section, index) in sections"
      :key="section.id"
      type="button"
      class="scroll-indicator__dot"
      :class="{ 'scroll-indicator__dot--active': activeIndex === index }"
      :aria-label="section.label"
      :aria-current="activeIndex === index ? 'true' : undefined"
      @click="emit('navigate', index)"
    />
  </nav>
</template>

<style scoped>
.scroll-indicator {
  position: fixed;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 20;
}

.scroll-indicator__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-brand-green);
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.scroll-indicator__dot--active {
  background-color: var(--color-brand-green);
}
</style>
