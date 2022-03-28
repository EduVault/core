<template>
  <client-only>
    <div class="masthead">
      <div ref="wrapper" :style="state.transform">
        <slot></slot>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts">

import { fullyInView, topInView } from '../../helpers/isInView'
export default {
  props: {
    speedFactor: Number,
    fullView: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const state = reactive({
      transform: '',
    })
    const wrapper = ref(null)

    onMounted(() => {
      document.addEventListener('scroll', handleScroll)
    })
    const handleScroll = () => {
      // @ts-ignore
      const el: Element = wrapper.value
      if (props.fullView ? !fullyInView(el) : !topInView(el)) return

      const scrollY = window.scrollY
      state.transform = `transform: translate(0px,-${
        scrollY * props.speedFactor!
      }px)`
    }
    onUnmounted(() => {
      document.removeEventListener('scroll', handleScroll)
    })

    return { state, wrapper }
  },
}
</script>
