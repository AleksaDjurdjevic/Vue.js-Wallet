<template>
  <div>
    <!-- v-if="!($store.state.isRegistrated || $store.state.isLoggedIn )" TREBA U BLA DA SE UBACI -->
    <div class="bla" >
      <h1>Registration</h1>
      <div>
        <!--napraviti da je neophodno ineti podatke-->
        <!-- kada user nije ulogovan -->
        <label for="fname">First Name</label>
        <input type="text" placeholder="Insert name.." v-model="name" />
        
        <label for="lname">Last Name</label>
        <input type="text" placeholder="Insert lastanem.." v-model="surname" />
        
        <label for="email">E-mail</label>
        <input type="text" placeholder="Insert email.." v-model="email" />
        
        <label for="password">Password</label>
        <input type="password" placeholder="Insert password.." v-model="password" />
      </div>
      <button @click="registration()">Registration</button>
    </div>
     
      <!-- Kada je user ulogovan -->
    <div v-if="($store.state.isRegistrated || $store.state.isLoggedIn )" class="welcome">
      <h3>Uspesno ste registrovali</h3>
      <br><br>
      <h3>Napravite svoj racun:</h3>
      <CreateAccount />  
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
      name: null,
      surname: null,
      email: null,
      password: null,
      isAdmin: false,
    };
  },
  methods: {
    registration() {
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/registration", {
          name: this.name,
          surname: this.surname,
          email: this.email,
          password: this.password,
        })
        .then(resp => {
          console.log(resp);
          console.log("uspesna registracija");
          this.$store.state.isRegistrated = true;
        })
        .catch(err => {
          console.log(err);
          console.log("neuspesna registarcija");
        });        
}
  }
};
</script>

<style scoped>
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
  background-color: #8c92fa;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #9999ff;
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
label {
  font-weight: bold;
}
</style>>

