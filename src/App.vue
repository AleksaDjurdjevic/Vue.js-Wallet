<template>
  <div class="app">
    <header id="page-header">
      <div class="container">
        <div class="nav cart" >    
          <div id="logo" @click="setSelected(0)"><router-link to="/"><img src="./assets/logo1.png" alt=""></router-link></div>
          <div class="links" @click="setSelected(0)"> <router-link :to="links[0].url" :class = "{selected: links[0].selected}">Početna</router-link></div>
          <div class="links" @click="setSelected(1)"> <router-link :to="links[1].url" :class = "{selected: links[1].selected}" v-if="isLoggedIn">Transakcije</router-link></div>
          <div class="links" @click="setSelected(2)"> <router-link :to="links[2].url" :class = "{selected: links[2].selected}" v-if="isLoggedIn">Štednja</router-link></div>
          <div class="links" @click="setSelected(3)"> <router-link :to="links[3].url" :class = "{selected: links[3].selected}" v-if="isLoggedIn">Statistika</router-link></div>
        </div>

        <div class="nav" id="nav">
          <div class="cart" id="cart">
            <!-- ako nije ulogovan -->
            <div class="links" @click="setSelected(0)"><router-link :to="links[4].url" id="profile" v-if="!isLoggedIn">
            <img src="./assets/placeholder-img.jpg" alt=""></router-link></div>
            <!-- u trenutku kad se uloguje-->
            <div class="links" @click="setSelected('all')"><router-link :to="links[4].url" id="profile" v-if="isLoggedIn">
              <img v-if= "url === './assets/placeholder-img.jpg'" src="./assets/placeholder-img.jpg" alt="">
              <img v-else :src="url" alt="">
            </router-link></div>
            <div class="links right" @click="setSelected(5)"><router-link :to="links[5].url" :class = "{selected: links[5].selected}" v-if="!isLoggedIn">Prijavite se</router-link></div>
            <!-- Ovo se prikazuje kad je user ulogovan -->
            <div class="dropdown" v-if="isLoggedIn">    
              <div class="links" @click="setSelected('all')"><router-link :to="links[4].url" class="dropbtn cart">{{name + " " + surname}}</router-link></div>
              <div class="dropdown-content">
                <div class="links" @click="setSelected('all')"><router-link :to="links[4].url">Profil</router-link></div>
                <a @click = "logout">Odjavite se</a>
              </div>
            </div>

            <div class="links right" @click="setSelected(6)"><router-link  :to="links[6].url" :class = "{selected: links[6].selected}" v-if="!isLoggedIn">Registracija</router-link></div>
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
      asd: 0,
      links: [
        {url: '/', selected: true},
        {url: '/transactions', selected: false},
        {url: '/savings', selected: false},
        {url: '/statistics', selected: false},
        {url: '/profile', selected: false},
        {url: '/login', selected: false},
        {url: '/registartion', selected: false}
      ]

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
    this.$root.$on('set-selected', () => {
        this.setSelected(0);
    });
  },
  computed: {
    ...mapState(['isLoggedIn'])
  },
  methods: {
    ...mapActions(['paramsForChartAct', 'changeIsLoggedIn']),
    setSelected(index){
      if(index === 'all'){
        for (let i=0; i<this.links.length; i++){
          this.links[i].selected = false;
        }
      }else{
        for (let i=0; i<this.links.length; i++){
          if (i===index){
            this.links[i].selected = true;
          }else{
            this.links[i].selected = false;
          }
        }
      }
    },
    checkSid() {
      let sid = localStorage.getItem("sid");
      if (sid === null || sid === undefined) {
        this.changeIsLoggedIn(false);
        return false; //ako nema sid
      }
      this.changeIsLoggedIn(true);
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
          this.changeIsLoggedIn(false);
          this.paramsForChartAct([]);
          localStorage.clear();
          this.asd += 1;
          this.$store.state.isRegistrated = false;
          this.setSelected(0);
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
::-moz-selection { /* Code for Firefox */
    color: rgba(238, 238, 238, 0.966) !important;
    background: rgba(119, 118, 117, 0.6) !important;
}

::selection {
    color: rgba(238, 238, 238, 0.966);
    background: rgba(119, 118, 117, 0.6) !important;
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
.links{
  display: inline-block;
  text-align: end;
}
.nav.cart .links a{
  border-bottom: 0.1em solid rgba(255, 255, 255, 0);
  transition:border-bottom 0.3s;
  padding-bottom: 4%;
}
#nav.nav .links.right a{
  border-bottom: 0.1em solid rgba(255, 255, 255, 0);
  transition:border-bottom 0.3s;
  padding-bottom: 4%;
}
#nav.nav .links.right a:hover{
  border-bottom: 0.1em solid rgba(255, 255, 255, 0.8);
}
.nav.cart .links a:hover{
  border-bottom: 0.1em solid rgba(255, 255, 255, 0.8);
}
.nav.cart .links a.selected{
  border-bottom: 0.1em solid rgba(255, 255, 255, 0.8);
}
#nav.nav .links.right a.selected{
  border-bottom: 0.1em solid rgba(255, 255, 255, 0.8);
}
.nav.cart a:nth-child(1):hover {
  animation: none;
}
.nav.cart a:focus, .nav.cart .a:active,  #nav.nav .links.right a:focus,  #nav.nav .links.right a:active{
  outline: none;
}
#nav.nav{
  justify-content: end;
}
#cart.cart{
  margin: 0;
  margin-right: 5%;
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
#logo{
  display: inline-block;
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
  /* margin-right: 30px; */
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
#nav{
  min-width: 25%;
}
#cart {
  display: flex;
  flex-direction: row;
  align-items: center;
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
  width: 50px !important;
  height: 50px !important;
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
  display: flex;
  align-items: center;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  /* left: -30%; */
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
