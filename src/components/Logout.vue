<template>
  <div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
      this.logout()
  },  
  methods: {
    logout() {
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/logout", {
          sid: localStorage.getItem("sid")
        })
        .then(res => {
          console.log(res.data);
          this.$store.state.isLoggedIn = false;
          localStorage.removeItem("sid");
          localStorage.removeItem("user");
          console.log("usepsno logout");
          console.log(
            "ovo je iz vuexa isLogedIn ",
            this.$store.state.isLoggedIn
          );
        })
        .catch(err => {
          console.log("nesto ne valja", err);
        });
      (this.email = null),
        (this.password = null),
        (this.name = null),
        (this.$store.state.isLoggedIn = false);
      this.$store.state.isRegistrated = false;

    //   this.$router.push({
    //       name: 'Home'
    //   })
    }
  }
};
</script>

<style>
</style>