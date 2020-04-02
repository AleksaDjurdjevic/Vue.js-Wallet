<template>
<div class="wrapper" >
  <div class="login" >
    <div class="bla">
      <div v-if="!$store.state.isLoggedIn">
        <h1>Prijava</h1>
        <label for="name">E-mail:</label>
        <input id= "name" type="text" placeholder="primer@gmail.com" v-model="email" />

        <label for="pass">Šifra:</label>
        <input id= "pass" type="password" v-model="password" />
        
        <p :class = "{'msg': msg, 'msg-invi': !msg }">{{msg? msg: 'fill'}}</p>
        <button @click="login">Prijavite se</button>
        <p>Niste se registrovali? <router-link to="/registartion">Registruj se</router-link></p>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: '',
      password: '',
      msg: null
    };
  },
  methods: {
    login() {
      if(this.password === '' || this.email === ''){
        this.msg = 'Unesite sva polja.';
      }else{
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/login", {
          email: this.email,
          password: this.password
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
        }).catch(e=>{
          this.msg = e.response.data.err;
        });
      }
    }
  },
  mounted(){
    this.$root.$emit('set-selected', 5);
  }
};
</script>

<style scoped >
h1 {
  margin-bottom: 35px;
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
.wrapper{
  height: 100vh;
}
.login{
  width: 25%;
  background-color: white;
  margin: 4% auto 0 auto;
}
.bla {
  border-radius: 5px;
  padding: 20px;
  width: 80%;
  margin: 0;
}
.bla p{
  margin-top: 30px;
} 
</style>

