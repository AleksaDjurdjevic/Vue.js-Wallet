<template>
  <div class="registration" v-on:keyup.enter="registration" >
    <div class="bla" v-if="!($store.state.isRegistrated || $store.state.isLoggedIn )">
      <h1>Registracija</h1> 
      <div>
        
        <label for="fname">Ime:</label>
        <input type="text" ref="fname" placeholder="Unesite svoje ime" v-model="name" />
        
        <label for="lname">Prezime:</label>
        <input type="text" ref="lname" placeholder="Unesite svoje prezime" v-model="surname" />
        
        <label for="email">E-mail:</label>
        <input type="text" ref="email" placeholder="Unesite e-mail adresu" v-model="email" />
        
        <label for="password">Šifra:</label>
        <input type="password" ref="pass" placeholder="Unesite šifru" v-model="password" />
      </div>
      <p :class = "{'msg': msg, 'msg-invi': !msg }">{{msg? msg: 'fill'}}</p>

      <vue-recaptcha sitekey="6Lcak-cUAAAAAKswQ4YMo7BHsla5Qgi-orzyb74P">
        <button @click="registration">Registrujte se</button>
      </vue-recaptcha>

    </div> 
    
    <!-- Kada je user ulogovan -->
    <div v-if="($store.state.isRegistrated || $store.state.isLoggedIn )" class="welcome">
      <h3>Uspešno ste se registrovali.</h3>
      <h3>Napravite svoj račun:</h3>
      <CreateAccount :id="id"/>  
    </div>
  </div>
</template>
    
<script>
import axios from 'axios';
import VueRecaptcha from 'vue-recaptcha';
import CreateAccount from '@/components/CreateAccount.vue';
export default {
  components:{
    CreateAccount,
    VueRecaptcha
  },
  data() {
    return {
      name: '',
      surname: '',
      email: '',
      password: '',
      msg: '',
      id: null
    };
  },
  methods: {
    registration() {
      if(this.name === '' || this.password === '' || this.email === '' || this.surname === ''){
        this.msg = 'Unesite sva polja.';
      }else if(this.name.length>55){
        this.msg = 'Predugačko ime.';
        this.name = '';
        this.$refs.fname.focus();

      }else if(this.surname.length>55){
        this.msg = 'Predugačko prezime.';
        this.surname = '';
        this.$refs.lname.focus();

      }else if(this.password.length>255){
        this.msg = 'Predugačka šifra.';
        this.password = '';
        this.$refs.pass.focus();

      }else if(this.surname.length>55){
        this.msg = 'Predugačka e-mail adresa.';
        this.email = '';
        this.$refs.email.focus();

      }else{
         window.grecaptcha.execute('6Lcak-cUAAAAAKswQ4YMo7BHsla5Qgi-orzyb74P', {action: 'register'})
            .then((token)=>{
              axios
              .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/registration", {
                name: this.name,
                surname: this.surname,
                email: this.email,
                password: this.password,
                token
              })
              .then((r) => {
                window.grecaptcha.execute('6Lcak-cUAAAAAKswQ4YMo7BHsla5Qgi-orzyb74P', {action: 'login'})
                .then((tok)=>{
                  axios
                  .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/login", {
                    email: this.email,
                    password: this.password,
                    token: tok
                  })
                  .then(res => {
                    localStorage.setItem("sid", res.data.sid);
                    localStorage.setItem("user", res.data.user);
                    
                    this.$store.state.isLoggedIn = true;

                    this.$root.$emit('change-id');
                    this.$root.$emit('change-usr-data');
                    this.$root.$emit('change-pic');
                    this.$root.$emit('set-selected', 0);

                    this.$router.push({
                      name: 'Home'
                    })
                  })
                });
                this.id = r.data.id_usera;
              })
              .catch((err) => {
                localStorage.clear();
                this.msg = err.response.data.err;
                this.$refs.email.focus();
              }); 
            });
      }
    }
  },
  mounted(){
    this.$root.$emit('set-selected', 6);
  }
};
</script>

<style scoped>
.registration{
  min-height: 92vh;
}
.msg{
  color: #e80000;
}
.msg-invi{
  visibility:hidden;
}
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.4s;
  transition: background-color 0.4s;
}
input[type="text"]:focus,
input[type="password"]:focus {
  border: 1px solid rgb(0, 0, 0);
  background-color: rgb(235, 233, 233);
}

button{
  display: block;
  transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
  transition-property: box-shadow, transform, color;
  transition-duration: 0.2s, 0.2s, 0.2s;
  transition-timing-function: ease, ease, ease;
  transition-delay: 0s, 0s, 0s;
  font-family: 'Oswald', sans-serif;

  cursor: pointer;
  font-size: 1.2em;
  min-width: 99px;
  font-weight: 500;
  margin: 0.6%;
  width: 100%;
  height: 60px;
  background-color: rgb(0, 0, 0);
  overflow: hidden;
  border-radius: 10px;
  padding-right: 5%;
  border: 0;
  padding-left: 5%;

  box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
    0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
    0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  background-image: linear-gradient(-45deg, rgb(131, 131, 131), rgb(34, 34, 34));
  color: #e6eaef;
}
button:focus{
  outline: none;
  cursor: pointer;
}
button::-moz-focus-inner {
  border: 0;
}
button:hover{
  font-size: 1.2em;
  text-shadow: 2.9px 2.95px 2.95px #000000;

  box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
    0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
button:active{
  box-shadow: 0px 1px 3px 1px #888888;
  font-size: 1.2em;
  box-shadow: 0 5px #666;
  transform: translateY(4px);

  box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
    0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
    0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  transition: 0s;
  color: rgba(18, 104, 117, 0.616);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
  outline: none;
}

.bla {
  border-radius: 5px;
  width: 25%;
  margin: 4% auto;
  padding: 20px;
}

h1 {
  margin-bottom: 35px;
}
.welcome{
  text-align: center;
}
.welcome h3:nth-child(1){
  text-align: center;
  color: #1db802;
}

@media screen and (min-width:410px) and (max-width:820px) {
  .registration{
    margin:0 auto;
    width:100%;
    min-height: 100vh;
    height: auto;
  
  }
  
  .bla{
    box-sizing:border-box;
    width:60%;
  }
  .bla h1{
  margin-bottom: 3%;
} 
}

@media screen and (max-width:409px) {
  .registration{
    margin:0 auto;
   font-size: 1em;
    width:100%;
    min-height: 100vh;
    height: auto;
  }
 
 
  .bla{
    box-sizing:border-box;
    width:80%;
  }
  .bla h1{
    font-size: 1.15em;
     margin-bottom:5%; 
  } 
}
</style>

