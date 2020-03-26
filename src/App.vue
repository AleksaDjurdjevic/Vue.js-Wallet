<template>
  <div class="app">
    <header id="page-header">
      <div class="container">
        <div class="nav cart" >    
          <router-link to="/"><img src="./assets/logo.jpg"  alt id="logo" /></router-link>
          <router-link to="/">Početna</router-link>
          <router-link to="/transactions" v-if="isLoggedIn">Transakcije</router-link>
          <router-link to="/savings" v-if="isLoggedIn">Štednja</router-link>
          <router-link to="/statistics" v-if="isLoggedIn">Statistika</router-link>
        </div>

        <div class="nav" id="nav">
          <div class="cart" id="cart">
            <!-- <img src="./assets/basket.png" alt="Shopping basket"> -->
            <!-- ako nije ulogovan -->
            <router-link to="/profile" id="profile" v-if="!$store.state.isLoggedIn">
            <img src="./assets/placeholder-img.jpg" alt=""></router-link>
            <!-- u trenutku kad se uloguje-->
            <router-link to="/profile" id="profile" v-if="$store.state.isLoggedIn">
              <img v-if= "url === './assets/placeholder-img.jpg'" src="./assets/placeholder-img.jpg" alt="">
              <img v-else :src="url" alt="">
            </router-link>
            <router-link to="/login" v-if="!$store.state.isLoggedIn">Prijavite se</router-link>
            <!-- Ovo se prikazuje kad je user ulogovan -->
            <div class="dropdown" v-if="$store.state.isLoggedIn">    
              <router-link to="/profile" class="dropbtn cart">{{name + " " + surname}}</router-link>
              <div class="dropdown-content">
                <router-link to="/profile">Profil</router-link>
                <a @click = "logout">Odjavite se</a>
              </div>
            </div>

            <router-link to="/registartion" v-if="!$store.state.isLoggedIn">Registracija</router-link>
          </div>
        </div>
      </div>
    </header>
    <router-view :key=asd></router-view>
    <main>
      
    </main>
    <footer class="page-footer">
      <Footer />
    </footer>
  </div>
</template>

<script>
import Footer from "./components/Footer.vue";
import axios from "axios";
import {mapState} from 'vuex';
import {mapActions} from 'vuex';
export default {
  components: {
    Footer
  },
  data() {
    return {
      id: localStorage.getItem("user"),
      url: '',
      name: '',
      surname: '',
      asd: 0
    }
  },
  mounted() {
    setInterval(this.checkSession, 1000*60*15);
    this.checkSession();
    this.checkSid();
    this.readPic();
    this.$root.$on('change-id', () => {
        this.id = localStorage.getItem('user');
    });
    this.$root.$on('change-pic', () => {
        this.readPic();
    });
    this.$root.$on('change-usr-data', () => {
        this.checkSession();
    });
  },
  computed: {
    ...mapState(['isLoggedIn'])
  },
  methods: {
    ...mapActions(['paramsForChartAct']),
    checkSid() {
      let sid = localStorage.getItem("sid");
      if (sid === null || sid === undefined) {
        this.$store.state.isLoggedIn = false;
        return false; //ako nema sid
      }
      this.$store.state.isLoggedIn = true;
      return true; //ako ima sid
    },
    checkSession() {
      axios
        .get(
          "http://053n122.mars-e1.mars-hosting.com/api/wallet/checkSession",
          {
            params:{sid: localStorage.getItem("sid")}
          }
        )
        .then(r => {
          this.name = r.data.usr_data.usr_name;
          this.surname = r.data.usr_data.usr_surname;
        }).catch(()=>{
          localStorage.clear();
        });
    },
    readPic() {
      axios.get("http://053n122.mars-e1.mars-hosting.com/api/wallet/getPic",
        {
          params: {sid: localStorage.getItem("sid")}
        })
        .then(res => {
          axios.get(res.data.poruka3.link)
          .then((r)=>{
            if(r.data.msg === 'placeholder'){
              this.url = "./assets/placeholder-img.jpg";
            }else{
              this.url = res.data.poruka3.link;
            }
          });
      }).catch(()=>{
          localStorage.clear();
      });
    },
    logout() {
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/logout", {
          sid: localStorage.getItem("sid")
        })
        .then(() => {
          this.$store.state.isLoggedIn = false;
          this.paramsForChartAct([]);
          localStorage.clear();
          this.asd += 1;
          this.$store.state.isRegistrated = false;
          this.$router.push("/");
        })
        .catch(() => {
          localStorage.clear();
        });
    }
  }
};
</script>
 
<style >
.app{
   font-family: 'Teko', sans-serif;
   font-size:1.2em;
}
body {
  padding: 0;
  margin: 0;
 
   font-family: 'Teko', sans-serif;
  margin: 0; 
  font-family: 'Teko', sans-serif;
  font-size:1.2em;
}

main {
  display: block;
  text-align: center;
}

#banner {
  position: relative;
  height: 380px;
  background: url(./assets/enon.jpg) no-repeat;
  background-position: center center;
  border-top: 1px solid #000000;
  border-bottom: 1px solid #fff;
  /* box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.56); */
}
#banner h2 {
  font-size: 60px;
  color: #17a2b8;
  margin: 0;
  position: absolute;
  left: 100px;
  top: 60px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  line-height: 1em;
}
.container {
  display: flex;
  justify-content: space-between;
  margin: 0;
  align-items: center;
}
.page-footer .container {
  display: flex;
  justify-content: space-between;
  margin: 0;
  align-items: center;
  box-sizing: border-box;
  padding-left: 5%;
  padding-right: 5%;
}
#page-header {
  top: 0;
  background: #17a2b8;
  color: white;
  padding: 10px 0;
  text-align: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.56);
  position: sticky;
  top: 0;
  z-index: 6000;
}
@keyframes hover{
  0% {border-bottom: 0.1em solid rgba(255, 255, 255, 0);}
  100% {border-bottom: 0.1em solid rgba(255, 255, 255, 0.8)}
}
.nav.cart a:hover {
  animation-name: hover;
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
}
.nav.cart a:nth-child(1):hover {
  animation: none;
}
.nav.cart a:focus, .nav.cart a:active {
  outline: none;
}
#page-header img {
  display: inline-block;
  width: 70px;
  height: 70px;
  vertical-align: middle;
}

#menu {
  padding: 40px 0 0 0;
}
#logo-itb {
  position: relative;
  display: inline-block;
  height: 43px;
  width: 110px;
  vertical-align: middle;
}
article {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px 20px 1px 20px;
  margin-bottom: 40px;
}

article h3 {
  margin: 0 0 10px 0;
}

article p {
  margin: 0 0 20px 0;
}

.page-footer {
  background: #555555;
  text-align: center;
  color: white;
  padding: 0;
}

.app p {
  font-weight: bold;
  margin: 5px 0;
}

/*micro-grid--------------------------------*/

.row {
  margin: 0 -15px 20px -15px;
}
.l-4of12 {
  display: inline-block;
  width: calc(33.3333333333% - 33px);
  margin: 0 15px;
}

/*navigation--------------------------------*/

.nav {
  display: flex;
  justify-content: center;
  flex-direction: row;


  /* margin-left: 30px; */
}

.nav a {
  color: white;
  font-size: 24px;
  text-decoration: none;
  text-transform: uppercase;
  /* margin: 0 10px; */
  font-family: "Teko", sans-serif;
}
.nav a:first-child{
  border: none;
}

#cart {
  display: flex;
  flex-direction: row;
}

/*shopping cart--------------------------------*/
.cart {
  display: block;
  float: right;
  margin:  0 50px;
}

.cart a {
  text-decoration: none;
}

.cart img {
  border-radius: 50%;
  width: 40px !important;
  height: 40px !important;
}
#profile{
  margin-right: 0;
}

/*item--------------------------------*/
.item {
  padding: 20px;
  border-radius: 8px;
  background: #968f88;
  margin-bottom: 30px;
}

.item-img {
  max-width: 80%;
  margin: auto;
}

.item-title {
  text-align: center;
  font-size: 22px;
  margin: 0;
}

.item-footer:after {
  /*clearfix*/
  content: "";
  display: table;
  clear: both;
}

.item-footer strong {
  float: left;
  font-size: 20px;
  background: #ffffff;
  padding: 10px 25px;
  border-radius: 8px;
}

.item-footer button {
  float: right;
  background: #000;
  border: 0;
  padding: 10px 25px;
  border-radius: 8px;
  color: #f8b976;
  font-size: 20px;
}
.item-footer button:hover {
  cursor: pointer;
}
.footer-column {
  display: inline-block;
  width: 49%;
}
#powered {
  text-align: right;
}
#powered img {
  margin-left: 10px;
}

/*fixes--------------------------------*/
img {
  max-width: 100%;
}

.social-icon {
  width: 24px;
  height: 24px;
  margin-right: 6px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Teko", sans-serif;
}

/********STILIZACIJA DROPDOWN BUTTON-A******/

.dropbtn,
.nav a {
  padding: 8px;

  color: #fff;
  font-size: 24px;
  text-decoration: none;
  text-transform: uppercase;
  margin: 0 10px;
  font-family: "Teko", sans-serif;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  background-color:#17a2b8;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: #f8feff;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: start;
}

.dropdown-content a:hover {
  background-color:  #56afbd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

/* .dropdown:hover .dropbtn {
    background-color: #3e8e41;
  }  */
</style>
