<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import WelcomeSection from '@/components/WelcomeSection.vue'
import ScheduleSection from '@/components/ScheduleSection.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'

const SECTION_VISIBILITY_THRESHOLD = 0.5

const sections = [
  { id: 'welcome', label: 'Boas-vindas' },
  { id: 'schedule', label: 'Programação' },
  { id: 'registration', label: 'Inscrição' },
]

const dayViewEl = ref<HTMLElement | null>(null)
const sectionEls = ref<HTMLElement[]>([])
const activeSectionIndex = ref(0)

let observer: IntersectionObserver | null = null

function setSectionRef(el: Element | null, index: number): void {
  if (el instanceof HTMLElement) {
    sectionEls.value[index] = el
  }
}

function scrollToSection(index: number): void {
  sectionEls.value[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const index = sectionEls.value.indexOf(entry.target as HTMLElement)
          if (index !== -1) activeSectionIndex.value = index
        }
      }
    },
    { root: dayViewEl.value, threshold: SECTION_VISIBILITY_THRESHOLD },
  )

  for (const el of sectionEls.value) {
    observer.observe(el)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <main ref="dayViewEl" class="day-view">
    <div :ref="(el) => setSectionRef(el as Element | null, 0)" class="day-view__section">
      <WelcomeSection />
    </div>
    <div :ref="(el) => setSectionRef(el as Element | null, 1)" class="day-view__section">
      <ScheduleSection />
    </div>
    <div :ref="(el) => setSectionRef(el as Element | null, 2)" class="day-view__section">
      <RegistrationForm />
    </div>

    <nav class="scroll-indicator" aria-label="Seções da página">
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        type="button"
        class="scroll-indicator__dot"
        :class="{ 'scroll-indicator__dot--active': activeSectionIndex === index }"
        :aria-label="section.label"
        :aria-current="activeSectionIndex === index ? 'true' : undefined"
        @click="scrollToSection(index)"
      />
    </nav>
  </main>
</template>

<style scoped>
.day-view {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.day-view__section {
  scroll-snap-align: start;
}

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
