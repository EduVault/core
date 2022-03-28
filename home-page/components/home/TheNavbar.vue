<template>
  <div class="mx-5 mt-5">
    <ul class="flex justify-evenly">
      <li class="cursor-pointer" @click="scrollToEl('about')">
        <h4 class="spread-hover">ABOUT</h4>
      </li>
      <li class="cursor-pointer" @click="scrollToEl('developers')">
        <h4 class="spread-hover">DEVELOPERS</h4>
      </li>
      <li class="cursor-pointer" @click="scrollToEl('contact')">
        <h4 class="spread-hover">CONTACT</h4>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">

export default {
  methods: {
    scrollToEl: (anchor: string) => {
      const element = document.querySelector('#' + anchor)
      const topPos = element!.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: topPos,
        behavior: 'smooth',
      })
    },
  },
}
</script>
