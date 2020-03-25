<template>
<div class="wrapper" >
  <div class="login" >
    <div class="bla">
      <div v-if="!$store.state.isLoggedIn">
        <h1>Prijava</h1>
        <input type="email" placeholder="Unesite email.." v-model="email" />
        <input type="password" placeholder="Unesite sifru.." v-model="password" />
        <button @click="login()">Prijavite se</button>
        <p>Niste se registrovali? <router-link to="/registartion">Registruj se.</router-link></p>
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
      email: null,
      password: null,
      name: null,
    };
  },
  methods: {
    login() {
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/login", {
          email: this.email,
          password: this.password
        })
        .then(res => {
          localStorage.setItem("sid", res.data.sid);
          localStorage.setItem("user", res.data.user);
          
          this.$store.state.isLoggedIn = true;
          this.name = res.data.name;
          this.surname = res.data.surname;

          this.$root.$emit('change-id');
          this.$root.$emit('change-usr-data');
          this.$root.$emit('change-pic');

          this.$router.push({
            name: 'Home'
          })
          
        });
    }
  }
};
</script>

<style scoped >
h1 {
  margin-bottom: 35px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 15px;
}


button {
  width: 100%;
  background-color: #17a2b8;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

button:hover {
  background-color:#17a3b8c9;
}
.wrapper{
  height: 100vh;
}
.login{
  border: 1px solid black;
  width: 25%;
  background-color: white;
  margin: 8% auto 0 auto;
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

