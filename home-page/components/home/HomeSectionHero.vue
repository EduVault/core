<template>
  <div class="px-10 pb-10 h-screen grid sm:grid-cols-2">
    <div class="md:max-w-3/4 m-auto">
      <img
        id="logo"
        class="px-2 md:max-w-sm sm:max-w-xxs max-w-xs max-w-full mx-auto"
        src="~/assets/img/eduvault-logo.png"
        alt="EDUVAULT logo"
      />
    </div>
    <div class="my-auto flex-col text-center">
      <h1 data-testid="eduvault-title">EDUVAULT</h1>
      <h2>YOUR DATA</h2>
      <h2>YOUR EDUCATION</h2>
      <h2>ANYWHERE</h2>
      <button
        data-testid="button-try-now"
        class="bg-orange text-center text-white py-1 px-2 mt-2 w-32 rounded mx-auto cursor-pointer"
        @click="scrollToElement('try-now')"
      >
        TRY NOW
      </button>
    </div>
  </div>
</template>

<script lang="ts">

import { topBotInView } from '../../helpers/isInView'

export default {
  mounted() {
    const logo = document.getElementById('logo')
    const bounds = logo!.getBoundingClientRect()
    let prevScrollY = window.scrollY
    let prevDegree = 0
    let scrolling: boolean = false

    function rotateLogo(e: MouseEvent) {
      if (!scrolling && topBotInView(logo!)) {
        const centerX = bounds.left + bounds.width / 2 - window.pageXOffset
        const centerY = bounds.top + bounds.height / 2 - window.pageYOffset
        const radians = Math.atan2(e.clientX - centerX, e.clientY - centerY)
        const degree = radians * (180 / Math.PI) * -1 + 180
        logo!.style.transform = `rotate(${degree}deg)`
      }
    }
    function rotateOnScroll() {
      scrolling = true
      const degree = window.scrollY - prevScrollY
      logo!.style.transform = `rotate(${
        prevDegree ? prevDegree + degree : degree
      }deg)`
      prevScrollY = window.scrollY
      prevDegree = prevDegree ? prevDegree + degree : degree
      scrolling = false
    }
    window.addEventListener('mousemove', rotateLogo)
    window.onscroll = () => {
      if (topBotInView(logo!)) rotateOnScroll()
    }
  },
  methods: {
    scrollToElement: (anchor: string) => {
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
<style scoped></style>
