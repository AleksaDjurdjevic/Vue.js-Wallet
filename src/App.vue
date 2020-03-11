<template>
  <div class="app">
    <div class="wrraper">
        <header id="page-header">
            <div class="container">
              
                  <div>
                    <img src="./assets/logo.png" alt="" id="logo">
                  </div>
                  <div class='nav'>
                      <ul>
                        <li><router-link to="/">Početna</router-link></li> 
                        <li><router-link to="/transaction">Transakcije</router-link></li>
                        <li><router-link to="/savings">Štednja</router-link></li> 
                        <li><router-link to="/statistics">Statistika</router-link></li>
                      </ul>
                      
                  </div>
             

                <div class='nav' id="nav">
                  <div class="cart" id="cart">      
                    <!-- <img src="./assets/basket.png" alt="Shopping basket"> -->
                    <ul>
                      <li><router-link to="/login" v-if='!$store.state.isLoggedIn'>Ulogujte se</router-link></li>
                    </ul>
                   
                    <!-- Ovo se prikazuje kad je user ulogovan -->
                    <div class="dropdown" v-if="$store.state.isLoggedIn">
                      <ul>
                        <li>
                          <router-link to="/profile" class="dropbtn">Uros Dimitrijevic</router-link>
                        </li>
                      </ul>
                      
                      <div class="dropdown-content">
                        <router-link to="/profile">Profil</router-link>
                        <router-link to="/logOut">Izlogujte se</router-link>
                      </div>
                    </div> 

                    <ul>
                      <li><router-link to="/registartion">Registracija</router-link></li>
                    </ul>

                  </div>
                </div>
                
            </div>
        </header>
        <router-view />
        <main>
            <section id="banner">
            
            </section>
            
            <div class="container">
              <section id="menu">
                <div class="row">
                         
     
                </div>
              </section>
            </div>
        </main>
        <footer class="page-footer">
            <Footer />
        </footer>

        
    </div>
  </div>
</template>

<script>
import Footer from './components/Footer.vue'
import axios from 'axios'
export default {
  components:{
    Footer
  },
  data(){
    return{
      
    }
  },
  mounted(){
     setInterval(this.checkSession(), 900000);
     this.checkSid()
  },
  beforeUpdate(){
    this.checkSid(),
    this.checkSession() 
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
    },
    checkSession(){
      axios.get('http://053n122.mars-e1.mars-hosting.com/api/wallet/checkSession', {
        sid: localStorage.getItem('sid')
      }).then(res => res); 
    }
  } 
};
</script>
<style >
/* .nav {
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
  /* color: rgba(238, 238, 238, 0.966);
  background: rgba(119, 118, 117, 0.6);
}

::selection {
  color: rgba(238, 238, 238, 0.966);
  background: rgba(119, 118, 117, 0.6);
}


/********STILIZACIJA DROPDOWN BUTTON-A******/
/*
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

.dropdown:hover .dropbtn {background-color: #3e8e41;}  */
/* #17a2b8 */ 



/*type------------------------------------------*/
.nav a.router-link-exact-active {
  /* color: #42b983; */
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.8);
}
body{
  background:#17a2b8 ;
  padding:0;
  margin:0;
  font-family: Arial, Helvetica, sans-serif;
}

main{
  display: block;
  text-align: center;
}

#banner{
  position:relative;
  height:380px;
  background: url(./assets/enon.jpg) no-repeat;
  background-position: center center;
  border-top:1px solid #000000;
  border-bottom:1px solid #fff;
  /* box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.56); */

}
#banner h2{
  font-size:60px;
  color:#17a2b8 ;
  margin:0;
  position:absolute;
  left:100px;
  top:60px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  line-height:1em;
}
.container{
  display:flex;
  justify-content: space-between;
  min-width:680px;
  /* max-width:1380px; */
  width:100%;
  margin:0 auto;
  text-align: left;
  align-items: center ;
  /* background-color: red; */
  
}

#page-header{
  position: sticky;
  top:0;
  background:#17a2b8;
  color:white;
  padding:10px 0;
  text-align: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.56);
  position: sticky;
  top:0;
  z-index:6000;
}

#page-header img{
  display:inline-block;
  width:70px;
  height:70px;
  vertical-align: middle;
}

#menu{
  padding:40px 0 0 0 ;
}
#logo-itb{
  position: relative;
  display:inline-block;
  height: 43px;
  width: 110px;
  vertical-align: middle;
}
article{
  background:#ffffff;
  border-radius:8px;
  padding:20px 20px 1px 20px;
  margin-bottom:40px;
}

article h3{
  margin:0 0 10px 0;
}

article p{
  margin:0 0 20px 0;
}

.page-footer{
  background:#555555;
  text-align: center;
  color:white;
  padding:40px 0;
}

#app p{
  font-weight: bold;
  margin: 5px 0; 
}

/*micro-grid--------------------------------*/

.row{
  margin:0 -15px 20px -15px;
}
.l-4of12{
  display:inline-block;
  width: calc(33.3333333333% - 33px);
  margin:0 15px;
}


/*navigation--------------------------------*/

.nav{
  display:inline-block;
  margin-left:30px;
}

.nav ul{
  display:block;
  margin:0;
  padding:0;
  list-style: none;
}

.nav ul li{
  display:inline-block;
  
}

.nav ul li a{
  color:white;
  font-size:24px;
  text-decoration: none;
  text-transform: uppercase;
  margin:0 10px;
  font-family: 'Teko', sans-serif;
}

#cart{
  display: flex;
  flex-direction: row;
  margin-left: 200px;
}

/*shopping cart--------------------------------*/
.cart{
  display:block;
  float:right;
  margin-left: 50px;
}


.cart a{
  text-decoration: none;
    
}

.cart img{
  width:40px !important;
  height:40px !important;
}

/*item--------------------------------*/
.item{
  padding:20px;
  border-radius:8px;
  background:#FFB973;
  margin-bottom:30px;
}

.item-img{
  max-width:80%;
  margin:auto;
}

.item-title{
  text-align: center;
  font-size: 22px;
  margin:0;
}

.item-footer:after{  /*clearfix*/
  content: "";
  display: table;
  clear: both;
}

.item-footer strong{
  float:left;
  font-size:20px;
  background:#ffffff;
  padding:10px 25px;
  border-radius:8px;
}

.item-footer button{
  float:right;
  background:#000;
  border:0;
  padding:10px 25px;
  border-radius:8px;
  color:#F8B976;
  font-size: 20px;
}
.item-footer button:hover{
  cursor: pointer;
}
.footer-column{
  display: inline-block;
  width: 49%;
  
}
#powered{
  text-align: end;
}
#powered img{
  margin-left: 10px;
}

/*fixes--------------------------------*/
img{
  max-width:100%;
}

.social-icon{
  width: 24px;
  height: 24px;
  margin-right: 6px;
}


h1, h2, h3, h4, h5, h6{
  font-family: 'Teko', sans-serif;
}

/********STILIZACIJA DROPDOWN BUTTON-A******/

.dropbtn, .nav a {
  padding: 8px;

  color:#17a2b8 ;
  font-size:24px;
  text-decoration: none;
  text-transform: uppercase;
  margin:0 10px;
  font-family: 'Teko', sans-serif;

}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: yellow;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: #17a2b8;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  
}

.dropdown-content a:hover {
  background-color: pink;
}

.dropdown:hover .dropdown-content {
  display: block;
}

  /* .dropdown:hover .dropbtn {
    background-color: #3e8e41;
  }  */


</style>
