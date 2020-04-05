<template>
  <div  class="createAccDiv">
     <div class="forma">
        <label>Izaberite valutu računa</label>
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
      }else if (this.createName.length>50) {
        this.createErrors.push("Predugačko ime za račun.");
      }else{
        if (isNaN(this.createSum)) {
          this.createErrors.push("Unešena suma mora da bude broj.");
        }else if (this.createSum <= 0){
          this.createErrors.push("Unešena suma mora da bude pozitivan broj i veći od 0.");
        }else if (this.createSum.length > 65){
          this.createErrors.push("Unešena suma je previsoka.");
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
button{
        transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
        transition: box-shadow, transform, color;
        transition-duration: 0.2s, 0.2s, 0.2s;
        transition-timing-function: ease, ease, ease;
        transition-delay: 0s, 0s, 0s;

        font-family: 'Oswald', sans-serif;
        cursor: pointer;
        font-size: 1.2em;
        font-weight: 500;
        margin: 2%;
        width: 50%;
        background-color: rgb(0, 0, 0);
        border-radius: 10px;
        border: 0;
        box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
            0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
            0 1px 2px 1px rgba(0, 0, 0, 0) inset,
            0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
        background-image: linear-gradient(
            -45deg,
            rgb(131, 131, 131),
            rgb(34, 34, 34)
        );
        color: #e6eaef;
    }
    button:hover, button:focus{
        /*  box-shadow: 0px 2px 8px 2px #888888; */
        font-size: 1.2em;
        /* text-shadow: 2.9px 2.95px 2.95px #000000;*/

        box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
            0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
            0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
    }
    button::-moz-focus-inner {
        border: 0;
    }
    button:active {
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
    }
</style>