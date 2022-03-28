<template>
  <div id="about" class="min-h-screen bg-orange section relative">
    <div class="section-wrap">
      <parallax
        class="burn absolute -bottom-16 right-0 mt-10"
        :full-view="false"
        :speed-factor="0.05"
      >
        <img
          class="burn max-h-screen sm:max-w-xxxs"
          src="@/assets/img/data-bg.png"
        />
      </parallax>
      <parallax class="absolute top-1/2 left-1/6" :speed-factor="0.1">
        <h1 class="text-center text-white">BRING</h1>
      </parallax>
      <parallax class="absolute top-1/2 left-1/3" :speed-factor="0.18">
        <h1 class="text-center text-white">YOUR</h1>
      </parallax>

      <parallax class="absolute top-1/2 right-1/3" :speed-factor="0.08">
        <h1 class="text-center text-white">OWN</h1>
      </parallax>

      <parallax class="absolute top-1/2 right-1/6" :speed-factor="0.23">
        <h1 class="text-center text-white">DATA</h1>
      </parallax>
      <div class="spacer min-h-screen50"></div>
      <h3 class="text-gray-300 mb-10 text-center">
        and unlock the power of
        <h3 class="text-white">interoperability</h3>
      </h3>
      <h4 class="text-gray-300 mb-3">
        Sync your educational progress between apps.
      </h4>
      <h4 class="text-gray-300 mb-3">
        Store your data on a private personal cloud.
      </h4>
      <h4 class="text-gray-300 mb-3">
        Try out new apps and instantly have access to your notes, flashcards,
        and more
      </h4>
    </div>
  </div>
</template>

<script>
import Parallax from './Parallax.vue'

export default {
  components: {
    Parallax,
  },
}
</script>
