<script setup lang="ts">
import type { ScheduleItem } from '@/constants/schedule'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'

defineProps<{ item: ScheduleItem }>()
</script>

<template>
  <li class="list-group-item d-flex justify-content-between gap-2 schedule-list-item">
    <span class="fw-semibold">{{ item.time }}</span>
    <span class="text-end">
      <template v-if="item.instructor">
        <span class="d-inline-flex align-items-center gap-1">
          {{ item.instructor.name }}
          <a
            v-if="item.instructor.instagramUrl"
            :href="item.instructor.instagramUrl"
            target="_blank"
            rel="noopener"
            class="schedule-list-item__instagram-link"
            :aria-label="`Instagram de ${item.instructor.name}`"
          >
            <InstagramIcon />
          </a>
          <span v-else class="text-muted" aria-hidden="true">
            <InstagramIcon />
          </span>
          <a
            v-if="item.instructor.instagramUrlTwo"
            :href="item.instructor.instagramUrlTwo"
            target="_blank"
            rel="noopener"
            class="schedule-list-item__instagram-link"
            :aria-label="`Instagram de ${item.instructor.name}`"
          >
            <InstagramIcon />
          </a>
        </span>
        : {{ item.activity }}
      </template>
      <template v-else>{{ item.activity }}</template>
    </span>
  </li>
</template>

<style scoped>
.schedule-list-item {
  font-size: clamp(0.45rem, 2.6cqw, 1.125rem);
}

.schedule-list-item__instagram-link {
  color: inherit;
}

.schedule-list-item__instagram-link:hover {
  color: var(--bs-link-hover-color);
}
</style>
