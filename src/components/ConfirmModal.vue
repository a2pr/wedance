<script setup lang="ts">
import { onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
  }>(),
  {
    title: 'Confirmar',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
  },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('cancel')
}

watch(
  () => props.show,
  (show) => {
    if (show) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  },
)

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <template v-if="show">
    <div class="modal-backdrop show confirm-modal__backdrop" @click="emit('cancel')"></div>
    <div class="modal d-block confirm-modal" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
          </div>
          <div class="modal-body">
            <p class="mb-0">{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="emit('cancel')">
              {{ cancelLabel }}
            </button>
            <button type="button" class="btn btn-success" @click="emit('confirm')">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped>
.confirm-modal,
.confirm-modal__backdrop {
  z-index: 1050;
}
</style>
