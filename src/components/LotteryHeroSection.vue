<script setup lang="ts">
import lotteryFlyerImage from '@/assets/images/blo.jpeg'
import { LOTTERY_FLYER_ALT } from '@/constants/lotteryUi'
</script>

<template>
  <section class="py-4 px-3">
    <div class="container d-flex justify-content-center">
      <img
        class="img-fluid rounded lottery-hero__flyer"
        :src="lotteryFlyerImage"
        :alt="LOTTERY_FLYER_ALT"
      />
    </div>
  </section>
</template>

<style scoped>
.lottery-hero__flyer {
  width: min(100%, 560px);
}
</style>
