<template>
  <div  class="createAccDiv">
     <div class="forma">
        <label>Izaberite tip računa</label>
        <br />
        <select v-model="createSelected">
          <option
            v-for="typ in typeAccount"
            :key="typ.acc_type_id"
            class="option"
          >{{typ.acc_type_name}}</option>
        </select>
        <br />
        <label>Suma</label>
        <br />
        <input type="text" v-model="createSum" />
        <br />
        <label>Naziv računa</label>
        <br />
        <input type="text" v-model="createName" />
        <br />
        <button @click="checkFormCreateAcc">Kreiraj Račun</button>
        <br />
        <p class= "msg" v-for=" crErr in createErrors" :key="crErr">{{crErr}}</p>
      </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      createAccDiv: false,
      createSum: '',
      createName: '',
      createErrors: [],
      createSelected: '',
      typeAccount: [],
    };
  },
  props:{
    id: Number
  },
  mounted(){
      this.getTypeAccount();
  },
  methods: {
    checkFormCreateAcc() {
      this.createErrors = [];
      if (this.createSum === "") {
        this.createErrors.push("Potrebno je da unesete sumu.");
      }else if (this.createName === "") {
        this.createErrors.push("Potrebno je da unesete ime za račun.");
      }else{
        if (isNaN(this.createSum)) {
          this.createErrors.push("Unešena suma mora da bude broj.");
        }else{
          this.createNewAccount();
        }
      }
    },
   
    createNewAccount() {
        axios
          .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/createAccountFromReg",
            {
              usr_id: this.id,
              acc_type: this.createSelected,
              acc_amounth: this.createSum,
              acc_name: this.createName
            }
          ).then(()=>{
            this.$router.push('/login');
            this.$store.state.isRegistrated = false;
          }).catch((e)=>{
            this.createErrors.push(e.response.data.err)
          })
      
    },
    getTypeAccount() {
      axios
        .get(
          "http://053n122.mars-e1.mars-hosting.com/api/get/getTypesOfAccounts"
        )
        .then(response => {
          this.typeAccount = response.data.account_type;
          this.createSelected = this.typeAccount[0].acc_type_name;
        });
    },
    
  }
};
</script>

<style scoped>

.createAccDiv{
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
    width: 30%;
    margin: 0 auto;
}
.forma{
  width: 90%;
}
input[type=button]{
  margin-top: 25px;
}
.msg{
  color: #e80000;
}
button {
  width: 45%;
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
</style>