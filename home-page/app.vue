<template>
  <div class="main">
    <the-navbar></the-navbar>
    <home-section-hero></home-section-hero>
    <home-section-about></home-section-about>
    <home-section-data></home-section-data>
    <home-section-education></home-section-education>
    <home-section-anywhere></home-section-anywhere>
    <home-section-try-now></home-section-try-now>
    <home-section-developers></home-section-developers>
    <home-section-contact></home-section-contact>
  </div>
</template>

<script lang="ts">


import TheNavbar from './components/home/TheNavbar.vue'
import HomeSectionHero from './components/home/HomeSectionHero.vue'
import HomeSectionAbout from './components/home/HomeSectionAbout.vue'
import HomeSectionContact from './components/home/HomeSectionContact.vue'
import HomeSectionData from './components/home/HomeSectionData.vue'
import HomeSectionDevelopers from './components/home/HomeSectionDevelopers.vue'
import HomeSectionEducation from './components/home/HomeSectionEducation.vue'
import HomeSectionTryNow from './components/home/HomeSectionTryNow.vue'
export default {
  components: {
    TheNavbar,
    HomeSectionHero, 
    HomeSectionAbout
    , HomeSectionContact
    , HomeSectionData
    , HomeSectionDevelopers
    , HomeSectionEducation
    , HomeSectionTryNow
  }
}
</script>

<style >
@import './assets/css/theme.css';
</style>
