<template>
  <div class="bla">
    <div v-if="!$store.state.isLoggedIn">
      <h1>Login</h1>
      <label for="emial">Unesite email</label>
      <input type="email" placeholder="Insert email.." v-model="email" />
      <label for="password">IUnesite password</label>
      <input type="password" placeholder="Insert password.." v-model="password" />
      <button @click="login()">LogIn</button>
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
      rolName: "",
      name: null,
      surname: null
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
          console.log(res.data);
          console.log("usepsno logovanje");
          
          localStorage.setItem("sid", res.data.sid);
          localStorage.setItem("user", res.data.user);
          
          console.log("Ovo je local storage",localStorage.getItem('sid'));
          
          this.$store.state.isLoggedIn = true;

          this.name = res.data.name;
          this.surname = res.data.surname;
          console.log(
            "ovo je iz vuexa isLogedIn ",
            this.$store.state.isLoggedIn
          );
          this.$router.push({
            name: 'Home'
          })
        })
        .catch(err => {
          console.log(err);
          console.log("pogresno uneti email ili pass");
        });

        // this.$router.push({
        //   name: 'Home'
        // })
    },
    
    
  }
};
</script>

<style scoped>
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

label {
  font-weight: bold;
}

button {
  width: 40%;
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
  padding: 20px;
  width: 20%;
  margin-left: 40%;
}
</style>

