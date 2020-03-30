<template>
  <div class="registration">
    <!-- v-if="!($store.state.isRegistrated || $store.state.isLoggedIn )" TREBA U BLA DA SE UBACI -->
    <div class="bla" v-if="!($store.state.isRegistrated || $store.state.isLoggedIn )">
      <h1>Registracija</h1> 
      <div>
        
        <label for="fname">Ime</label>
        <input type="text" ref="fname" placeholder="Unesite svoje ime" v-model="name" />
        
        <label for="lname">Prezime</label>
        <input type="text" ref="lname" placeholder="Unesite svoje prezime" v-model="surname" />
        
        <label for="email">E-mail</label>
        <input type="text" ref="email" placeholder="Unesite e-mail adresu" v-model="email" />
        
        <label for="password">Šifra</label>
        <input type="password" ref="pass" placeholder="Unesite šifru" v-model="password" />
      </div>
      <button @click="registration">Registrujte se</button>
      <p class = "msg">{{msg}}</p>
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
import CreateAccount from '@/components/CreateAccount.vue';
export default {
  components:{
    CreateAccount
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
        axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/registration", {
          name: this.name,
          surname: this.surname,
          email: this.email,
          password: this.password,
        })
        .then((r) => {
          this.$store.state.isRegistrated = true;
          this.id = r.data.id_usera;
        })
        .catch((err) => {
          localStorage.clear();
          this.msg = err.response.data.err;
          this.$refs.email.focus();
        }); 
      }
             
}
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
 input[type="text"],
 input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 30%;
  background-color: #17a2b8;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #17a3b8c9;
}

.bla {
  border-radius: 5px;
  /* background-color: #f2f2f2; */
 padding: 20px;
  width: 40%;
  margin-left: 28%;
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
label {
  font-weight: bold;
} 


</style>

