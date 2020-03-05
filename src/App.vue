<template>
  <div class="app">
    <div class="nav">
      <router-link to="/">Početna</router-link> |
      <router-link to="/transaction">Transakcije</router-link> |
      <router-link to="/savings">Štednja</router-link> |
      <router-link to="/statistics">Statistika</router-link> |

      <router-link to="/login" v-if='!checkSid()'>UlogujSe</router-link>
        <span v-if="!checkSid()"> | </span>

      <!--Ovo se prikazuje kad je user ulogovan -->
      <div class="dropdown" v-if="checkSid()">
        <button class="dropbtn">Uros Dimitrijevic</button>
        <div class="dropdown-content">
          <router-link to="/profile">Profil</router-link>
          <router-link to="/logOut">IzlogujSe</router-link>
        </div>
      </div>  
      
      <span v-if="$store.state.isLoggedIn"> | </span>
      <router-link to="/registartion">Registracija</router-link>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
    }
  },
  beforeUpdate(){
    this.checkSid()
  },
  methods: {
    checkSid(){
      let sid = localStorage.getItem('sid');
      if(sid === null || sid === undefined){
        this.$store.state.isLoggedIn = false;
        return false; //ako nema sid
      }
      this.$store.state.isLoggedIn = true;
      return true; //ako ima sid
    }
  } 
};
</script>
<style scoped>
.nav {
  border-bottom: 1px solid black;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.nav a {
  font-weight: bold;
  color: #2c3e50;
  font-size: 18px;
}

.nav a.router-link-exact-active {
  color: #42b983;
  border: 1px solid #2c3e50;
}

::-moz-selection {
  /* Code for Firefox */
  color: rgba(238, 238, 238, 0.966);
  background: rgba(119, 118, 117, 0.6);
}

::selection {
  color: rgba(238, 238, 238, 0.966);
  background: rgba(119, 118, 117, 0.6);
}


/********STILIZACIJA DROPDOWN BUTTON-A******/
.dropbtn, .nav a {
  padding: 16px;
  font-size: 18px;
  border: none;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  
}

.dropdown-content a:hover {background-color: #ddd;}

.dropdown:hover .dropdown-content {display: block;}

.dropdown:hover .dropbtn {background-color: #3e8e41;}
</style>
