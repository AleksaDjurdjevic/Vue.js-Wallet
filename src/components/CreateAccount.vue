<template>
  <div  class="createAccDiv">
    <form class="createAccDivChaild">
      <h2> Kreiraj novi račun</h2>
      <label>Izaberi tip računa</label>
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
      <input type="button" value="Kreiraj Račun" @click="checkFormCreateAcc" />
      <br />
      <p v-for=" crErr in createErrors" :key="crErr">{{crErr}}</p>
    </form>

  </div> <!-- end createAccDiv -->
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      createAccDiv: false,
      createSum: null,
      createType: null,
      createName: null,
      createErrors: [],
      createSelected: null,
      typeAccount: [],
    };
  },
  mounted(){
      this.getTypeAccount()
  },
  methods: {
    checkFormCreateAcc() {
      this.createErrors = [];
      console.log(
        !isNaN(this.createSum) &&
          this.createSum !== null + " checkFormCreateAcc"
      );
      if (this.createName && this.createSum) {
        if (!isNaN(this.createSum) && this.createSum !== null) {
          this.createNewAccount();
          return;
        }
        this.createErrors.push("Sum must be a number required.");
      }
      if (!this.createSum) {
        this.createErrors.push("Sum required.");
      }
      if (!this.createName) {
        this.createErrors.push("Name of account required.");
      }
    },
   
    createNewAccount() {
      let sid = localStorage.getItem("sid");
      if (sid) {
        axios
          .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/createAccount",
            {
              sid: sid,
              acc_type: this.createSelected,
              acc_amounth: this.createSum,
              acc_name: this.createName
            }
          )
          .then(response => {
            this.message = response.data.message;         
          });
      }
      this.createSum = null;
      this.createName = null;
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

<style sccoped>

.createAccDivChaild{
    border: 1px solid black;
    width: 30%;
}
.createAccDiv{
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
}

</style>