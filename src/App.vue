<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Početna</router-link> |
      <router-link to="/">Transakcije</router-link> |
      <router-link to="/savings">Štednja</router-link> |
      <router-link to="/">Statistika</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/registration">Registration</router-link> | 
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
</style>
