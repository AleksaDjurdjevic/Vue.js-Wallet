<template>
  <div class="app">
    <div class="navH" :class="{tirkiz:change}">
    <div class="navHamb" :class="{container:!change , change:change}" @click="myFunction()">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
    </div>
    <div v-if="showNavHamb" class="navigacija">
      <div class="ponovo" @click="setSelected(0)">
        <router-link :to="links[0].url" :class="{selected: links[0].selected}">Početna</router-link>
      </div>
      <div class="ponovo" @click="setSelected(1)">
        <router-link
          :to="links[1].url"
          :class="{selected: links[1].selected}"
          v-if="isLoggedIn"
        >Transakcije</router-link>
      </div>
      <div class="ponovo" @click="setSelected(2)">
        <router-link
          :to="links[2].url"
          :class="{selected: links[2].selected}"
          v-if="isLoggedIn"
        >Štednja</router-link>
      </div>
      <div class="ponovo" @click="setSelected(3)">
        <router-link
          :to="links[3].url"
          :class="{selected: links[3].selected}"
          v-if="isLoggedIn"
        >Statistika</router-link>
      </div>
      <div class="ponovo" @click="setSelected(5)">
        <router-link
          :to="links[5].url"
          :class="{selected: links[5].selected}"
          v-if="!isLoggedIn"
        >Prijavite se</router-link>
      </div>
      <div class="ponovo" @click="setSelected(6)">
        <router-link
          :to="links[6].url"
          :class="{selected: links[6].selected}"
          v-if="!isLoggedIn"
        >Registracija</router-link>
      </div>
      <div v-if="isLoggedIn" class="ponovo" @click="setSelected('all')">
        <router-link :to="links[4].url">Profil</router-link>
      </div>
      <div v-if="isLoggedIn" class="ponovo">
        <a @click="logout">Odjavite se</a>
      </div>
    </div>
    <!-- showNawHamb -->
</div>
  <div class="headerM cf">
    <div class="navLeftM " id="logo" @click="setSelected(0)">
        <router-link to="/">
              <img src="./assets/logo1.png" alt />
        </router-link>
    </div>
    <div class="navLeftM">
          <ul>
              <li @click="setSelected(0)"><router-link :to="links[0].url" :class="{selected: links[0].selected}">Početna</router-link></li>
              <li v-if="isLoggedIn" @click="setSelected(1)"><router-link  :to="links[1].url"  :class="{selected: links[1].selected}" >Transakcije</router-link></li>
              <li v-if="isLoggedIn" @click="setSelected(2)" ><router-link :to="links[2].url" :class="{selected: links[2].selected}" >Štednja</router-link></li>
              <li v-if="isLoggedIn" @click="setSelected(3)" ><router-link  :to="links[3].url"  :class="{selected: links[3].selected}"  >Statistika</router-link></li>
          </ul>
    </div><!-- end navLeftM -->

   
    <div class="navRightM">
          <ul> 
              <li v-if="!isLoggedIn"  @click="setSelected(5)"> <router-link :to="links[5].url" :class="{selected: links[5].selected}">Prijavite&nbsp;se</router-link></li>
              <li v-if="!isLoggedIn" @click="setSelected(6)"><router-link :to="links[6].url"  :class="{selected: links[6].selected}" >Registracija</router-link></li>

             
              <li v-if="isLoggedIn" > <router-link :to="links[4].url" >  {{ name+" "+surname }}  </router-link>
                  <ul>
                    <router-link :to="links[4].url"><li @click="setSelected('all')" >Profil</li></router-link>
                    <a @click="logout"><li>Odjavite se </li></a>
                 </ul>
              </li>
              
    
          </ul>

    </div><!-- end navRightM -->
     <div class="navRightM"> <!-- slika -->
          <div class="" @click="setSelected(0)">
              <router-link :to="links[4].url" id="profile" v-if="!isLoggedIn">
                <img src="./assets/placeholder-img.jpg" alt />
              </router-link>
            </div>

       <div class="navRightM" @click="setSelected('all')">
              <router-link :to="links[4].url" id="profile" v-if="isLoggedIn">
                <img
                  v-if="url === './assets/placeholder-img.jpg'"
                  src="./assets/placeholder-img.jpg"
                  alt
                />
                <img v-else :src="url" alt />
              </router-link>
            </div>
    </div>
  </div><!-- end headerM -->





    <header v-if="false" id="page-header">
      <div class="container">
        <div class="nav cart">
          <div id="logo" @click="setSelected(0)">
            <router-link to="/">
              <img src="./assets/logo1.png" alt />
            </router-link>
          </div>
          <div class="links" @click="setSelected(0)">
            <router-link :to="links[0].url" :class="{selected: links[0].selected}">Početna</router-link>
          </div>
          <div class="links" @click="setSelected(1)">
            <router-link
              :to="links[1].url"
              :class="{selected: links[1].selected}"
              v-if="isLoggedIn"
            >Transakcije</router-link>
          </div>
          <div class="links" @click="setSelected(2)">
            <router-link
              :to="links[2].url"
              :class="{selected: links[2].selected}"
              v-if="isLoggedIn"
            >Štednja</router-link>
          </div>
          <div class="links" @click="setSelected(3)">
            <router-link
              :to="links[3].url"
              :class="{selected: links[3].selected}"
              v-if="isLoggedIn"
            >Statistika</router-link>
          </div>
        </div>
        <!-- end nav cart -->

        <div class="nav" id="nav">
          <div class="cart" id="cart">
            <!-- ako nije ulogovan -->
            <div class="links" @click="setSelected(0)">
              <router-link :to="links[4].url" id="profile" v-if="!isLoggedIn">
                <img src="./assets/placeholder-img.jpg" alt />
              </router-link>
            </div>
            <div class="links right" @click="setSelected(5)">
              <router-link
                :to="links[5].url"
                :class="{selected: links[5].selected}"
                v-if="!isLoggedIn"
              >Prijavite&nbsp;se</router-link>
            </div>
            <div class="links right" @click="setSelected(6)">
              <router-link
                :to="links[6].url"
                :class="{selected: links[6].selected}"
                v-if="!isLoggedIn"
              >Registracija</router-link>
            </div>
            <!-- u trenutku kad se uloguje-->
            <div class="links" @click="setSelected('all')">
              <router-link :to="links[4].url" id="profile" v-if="isLoggedIn">
                <img
                  v-if="url === './assets/placeholder-img.jpg'"
                  src="./assets/placeholder-img.jpg"
                  alt
                />
                <img v-else :src="url" alt />
              </router-link>
            </div>
            <div class="dropdown" v-if="isLoggedIn">
              <div class="links" @click="setSelected('all')">
                <router-link :to="links[4].url" class="special">
                  <div>{{ name }}</div>
                  <div>{{ surname }}</div>
                </router-link>
              </div>
              <div class="dropdown-content">
                <div class="links" @click="setSelected('all')">
                  <router-link :to="links[4].url">Profil</router-link>
                </div>
                <div class="links">
                  <a @click="logout">Odjavite se</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end id nav class nav -->
      </div>
      <!-- end container -->
    </header>
    <router-view :key="asd"></router-view>
    <main></main>
    <footer class="page-footer">
      <Footer />
    </footer>
  </div>
</template>

<script>
import Footer from "./components/Footer.vue";
import axios from "axios";
import { mapState } from "vuex";
import { mapActions } from "vuex";
export default {
  components: {
    Footer
  },
  data() {
    return {
      id: localStorage.getItem("user"),
      url: "",
      name: "",
      surname: "",
      asd: 0,
      links: [
        { url: "/", selected: true },
        { url: "/transactions", selected: false },
        { url: "/savings", selected: false },
        { url: "/statistics", selected: false },
        { url: "/profile", selected: false },
        { url: "/login", selected: false },
        { url: "/registartion", selected: false }
      ],
      showNavHamb: false,
      change: false
    };
  },
  created() {
    this.checkSession();
    setInterval(this.checkSession, 1000 * 60 * 15);
    this.readPic();
  },
  mounted() {
    this.$root.$on("change-id", () => {
      this.id = localStorage.getItem("user");
    });
    this.$root.$on("change-pic", () => {
      this.readPic();
    });
    this.$root.$on("change-usr-data", () => {
      this.checkSession();
    });
    this.$root.$on("set-selected", n => {
      this.setSelected(n);
    });
    this.$root.$on("change-name", name => {
      this.name = name;
    });
    this.$root.$on("change-surname", surname => {
      this.surname = surname;
    });
  },
  computed: {
    ...mapState(["isLoggedIn"])
  },
  methods: {
    ...mapActions(["paramsForChartAct", "changeIsLoggedIn"]),
    setSelected(index) {
      if (index === "all") {
        for (let i = 0; i < this.links.length; i++) {
          this.links[i].selected = false;
        }
      } else {
        for (let i = 0; i < this.links.length; i++) {
          if (i === index) {
            this.links[i].selected = true;
          } else {
            this.links[i].selected = false;
          }
        }
      }
    },
    checkSession() {
      axios
        .get(
          "http://053n122.mars-e1.mars-hosting.com/api/wallet/checkSession",
          {
            params: { sid: localStorage.getItem("sid") }
          }
        )
        .then(r => {
          this.name = r.data.usr_data.usr_name;
          this.surname = r.data.usr_data.usr_surname;
          this.changeIsLoggedIn(true);
        })
        .catch(() => {
          localStorage.clear();
          this.changeIsLoggedIn(false);
        });
    },
    readPic() {
      axios
        .get("http://053n122.mars-e1.mars-hosting.com/api/wallet/getPic", {
          params: { sid: localStorage.getItem("sid") }
        })
        .then(res => {
          axios.get(res.data.poruka3.link).then(r => {
            if (r.data.msg === "placeholder") {
              this.url = "./assets/placeholder-img.jpg";
            } else {
              this.url = res.data.poruka3.link;
            }
          });
        })
        .catch(() => {
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
          if (this.$route.path !== "/") {
            this.$router.push("/");
          }
        })
        .catch(() => {
          localStorage.clear();
        });
    },
    myFunction() {
      this.change = !this.change;
      this.showNavHamb = !this.showNavHamb;
    }
  }
};
</script>
 
<style >
.app {
  /* font-size:1.2em; */
  font-family: "Oswald", sans-serif;
  
}
body {
  padding: 0;
  margin: 0;

  margin: 0;
  font-family: "Oswald", sans-serif;
  font-size: 1.2em;
}

main {
  display: block;
  text-align: center;
}
::-moz-selection {
  /* Code for Firefox */
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
.links {
  display: inline-block;
  text-align: end;
}

.nav.cart .links a,
#nav.nav .links.right a {
  border-bottom: 0.1em solid rgba(255, 255, 255, 0);
  transition: border-bottom 0.3s;
  padding-bottom: 4%;
}

.nav.cart .links a:hover,
#nav.nav .links.right a:hover {
  border-bottom: 0.1em solid rgba(255, 255, 255, 0.8);
}

.nav.cart .links a.selected,
#nav.nav .links.right a.selected {
  border-bottom: 0.1em solid rgba(255, 255, 255, 0.8);
}
.nav.cart a:nth-child(1):hover {
  animation: none;
}
.nav.cart a:focus,
.nav.cart .a:active,
#nav.nav .links.right a:focus,
#nav.nav .links.right a:active {
  outline: none;
}
#nav.nav {
  width: 30%;
}
.links a div {
  display: inline-block;
  margin-left: 0%;
}
.dropdown .links a.special {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

a:hover {
  cursor: pointer;
}
#cart.cart {
  margin: 0;
  width: fit-content;
  display: flex;
  justify-content: end;
  box-sizing: border-box;
}
a div {
  padding-left: 10px;
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
#logo {
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
 /* width: calc(33.3333333333% - 33px);*/
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
  font-family: "Oswald", sans-serif;
}
.nav a:active,
.nav a:focus {
  outline: none;
}
.nav a:first-child {
  border: none;
}
#nav {
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
  margin: 0 50px;
}

.cart a {
  text-decoration: none;
}


.cart img {
  border-radius: 50%;
  width: 50px !important;
  height: 50px !important;
}
#profile {
  margin-right: 0px;
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
  font-family: "Oswald", sans-serif;
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
  font-family: "Oswald", sans-serif;
}

.dropdown {
  position: relative;
  display: flex;
  align-items: center;
  width: 45%;
}
.dropdown .links {
  width: 100%;
  display: flex;
  justify-content: end;
}
.dropdown .links a.special {
  margin: 0;
  padding: 0;
}
.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  /* left: -30%; */
  background-color: #17a2b8;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: #f8feff;
  text-decoration: none;
  display: block;
}
.dropdown-content .links {
  display: flex;
  justify-content: start;
}
.dropdown-content .links a {
  display: flex;
  width: 100%;
}
.dropdown-content a:hover {
  background-color: #56afbd;
}

.dropdown:hover .dropdown-content {
  display: block;
}






/* ------ MIRJANA style -------- */
.cf:after{
  content:" ";
  display:table;
  clear:both;   
  }

.headerM{
  font-size: 24px;
  padding:10px 15px 8px 50px;
  max-width:100%;
  background: #17a2b8;
  color:#ffffff;
  position: sticky;
  top:0;
  z-index: 6000;
}
.headerM ul{
  margin:0;
  padding:0;
  list-style: none;
}
.navLeftM{
  float:left;
}
.navRightM{
   width:fit-content;
  float: right;
}


.navLeftM ul li,
.navRightM ul li{
  float:left;
  position:relative;
   padding:10px 5px 13px 5px;
}

.navLeftM ul li a,
.navRightM ul li a{
    color:#ffffff;
    text-decoration:none;
    display:block;
}

.navLeftM ul li a:hover,
.navRightM ul li a:hover{
    color:rgba(255, 255, 255, 0.685);
   
}

.navLeftM ul li a.selected,
.navRightM ul li a.selected{
    border-bottom: 0.1em solid rgba(255, 255, 255, 0.8);
}


.navRightM ul li ul{
    background: #17a2b8;
    position:absolute;
    top:100%;
    width:140px;
    display:none;
}
.navRightM ul li:hover ul{
  display: block;
}
.navRightM ul li ul li{
  float:none;
}

.navRightM a img,
.navLeftM a img {
  border-radius: 50%;
  width: 50px !important;
  height: 50px !important;
}


.navHamb {
  display: none;
}
.navigacija {
  display: none;
}
 #page-header {
    display: none;
  }

@media screen and (max-width: 720px) {
  #page-header,
  .headerM {
    display: none;
  }
  .app {
    transition: 800ms ease-in-out all;
  }
  .navH{
    max-width:100%;
    position: sticky;
    top:0;
    z-index: 6000;
    background: #ffffff;
  }
  .tirkiz{
    background: #17a2b8 !important;
  }

  .navHamb {
    
    display: block;
    padding: 1% 3%;
    font-size: 1.2em;
    margin: 0;
    
  }
  .navigacija {
    transition: 800ms ease-in-out background-color;
    display: block;
    padding-bottom: 5%;
    background-color: #17a2b8;
    text-align: center;
    color: #ffffff;
    margin: 0;
  }

  .navigacija a {
    color: #ffffff;
    text-decoration: none;
    font-size: 1.2em;
  }
  a.selected {
    border-bottom: 0.1em solid rgba(255, 255, 255, 0.8);
  }

  .container {
    animation-name: opacity;
    animation-duration: 0.3s;
    display: block;
    cursor: pointer;
  }

  .bar1,
  .bar2,
  .bar3 {
    width: 35px;
    height: 5px;
    background-color: #333;
    margin: 6px 0;
    transition: 0.4s;
  }
  .change {
    animation-name: opacity;
    animation-duration: 0.3s;
    margin: 0;
    background-color: #17a2b8;
  }
  .change:hover {
    cursor: pointer;
  }

  .change .bar1 {
    -webkit-transform: rotate(-45deg) translate(-9px, 6px);
    transform: rotate(-45deg) translate(-9px, 6px);
  }

  .change .bar2 {
    opacity: 0;
  }

  .change .bar3 {
    -webkit-transform: rotate(45deg) translate(-8px, -8px);
    transform: rotate(45deg) translate(-8px, -8px);
  }
}

/* .dropdown:hover .dropbtn {
    background-color: #3e8e41;
  }  */
</style>
