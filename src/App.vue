<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Početna</router-link> |
      <router-link to="/">Transakcije</router-link> |
      <router-link to="/savings">Štednja</router-link> |
      <router-link to="/">Statistika</router-link> |
      <router-link to="/login">UlogujSe</router-link> |
      <router-link to="/registration">Registracija</router-link> 
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  
}
</script>
<style scoped>

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

::-moz-selection { /* Code for Firefox */
    color: rgba(238, 238, 238, 0.966);
    background: rgba(119, 118, 117, 0.6);
}

::selection {
    color: rgba(238, 238, 238, 0.966);
    background: rgba(119, 118, 117, 0.6);
}
</style>
