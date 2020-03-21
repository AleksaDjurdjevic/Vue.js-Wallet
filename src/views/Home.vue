<template>
  <div class="dashboard" @click="resetMessage">


   <!-- DIV CREATE ACCOUNT -->
      <div v-if="createAccDiv" class="createAccDiv"></div>
    <div v-if="createAccDiv" class="createAccDiv2">
      <form >
         <p class="exit" @click="showCreateAccDiv(false)"><i class="fas fa-times" style="font-size:25px, text-align:right"></i></p>
     <br>
        <h2>
          Kreiraj novi račun
         
        </h2>
        <label>Izaberi tip računa</label>
        <br />
        <select v-model="createSelected" class="inputWrite">
          <option
            v-for="typ in typeAccount"
            :key="typ.acc_type_id"
            class="option"
          >{{typ.acc_type_name}}</option>
        </select>
        <br />
        <label>Suma</label>
        <br />
        <input type="text" class="inputWrite" v-model="createSum" />
        <br />
        <label>Naziv računa</label>
        <br />
        <input type="text" class="inputWrite" v-model="createName" />
        <br />
        <input type="button" class="inputWrite" value="Kreiraj Račun" @click="checkFormCreateAcc" />
        <br />
        <p v-for=" crErr in createErrors" :key="crErr">{{crErr}}</p>
      </form>
      <!-- end form createAccDivChaild -->
    </div>
    <!-- end DIV CREATE ACCOUNT -->


    <!-- start DELETE ACCOUNT CLASS=createAccDiv is just for style -->
    <div v-if="deleteAccDiv" class="createAccDiv"></div>
    <div v-if="deleteAccDiv" class="createAccDiv2">
      
      <p class="exit" @click="showDeleteAccountDiv(false)"><i class="fas fa-times" style="font-size:25px, text-align:right"></i></p>
     
           <h2>   DA LI STE SIGURNI DA ŽELITE DA IZBRISETE 
           " {{defAcc.acc_name}} " RAČUN?
             </h2>
       
        <br />
        
          <input type="button" class="inputWrite" value="Izbriši Račun" @click="deleteAccount" />
        <br />
  
      <!-- -->
    </div>
    <!-- END DELETE ACCOUNT -->



    <!-- start DELETE TRANSACTION CLASS=createAccDiv is just for style -->
    <div v-if="deleteTransactionDiv" class="createAccDiv"></div>
    <div v-if="deleteTransactionDiv" class="createAccDiv2">
      
      <p class="exit" @click="showDeleteTransactionDiv(false)"><i class="fas fa-times" style="font-size:25px, text-align:right"></i></p>
     
           <h2>   DA LI STE SIGURNI DA ŽELITE DA OPOZOVETE TRANSAKCIJU 
           " {{traDescriptionForDelete}} " ?
             </h2>
             <p>Opozivanjem transakcije pare će Vam automatski biti vraćene na račun sa kojeg su uzete.</p>
     
        <br />
        
          <input type="button" class="inputWrite" value="OPOZOVI TRANSAKCIJU" @click="cancelTransaction(transactionForDelete)" />
        <br />
  
      <!-- -->
    </div>
    <!-- END DELETE TRANSACTION -->

    <h1>where the money goes???</h1>
    <!-- show all bils -->
    <div class="bills">
      <div class="bill" v-for="acc in accounts" :key="acc.acc_id" @click="setBill(acc)">
        <p>{{acc.acc_name}}</p>
      </div>
      <div class="bill create" @click="showCreateAccDiv(true)"><p>napravi račun +</p></div>
    </div>
    <!-- end bills-->
    <div class="nameBill" v-if="this.isLoggedIn">
     <p> Naziv računa:
      <span class="orange">{{defAcc.acc_name}}</span> 
     </p>  
     <p>Stanje:
      <span class="orange">{{defAcc.acc_amount}} - {{defAcc.acc_type_name}} </span> 
      </p>  
      <i @click="showDeleteAccountDiv(true)" class="fas fa-trash-alt" style="font-size:16px"></i>
    
   </div>
    <br />
    <p v-if="message">{{message}}</p>
    <p v-if="err" class="err">{{err}}</p>


    
    <div class="main">

<div class="transaction allTrans">
      <div class="transaction2">
        <callendar
          v-if="showCallendar"
          class="callendar"
          v-on:showCallEmit="showCallendarMet($event)"
          v-on:selectDate="showTransactionByDate($event)"
          v-on:selectMonthYear="showTransactionByDate($emit)"
        ></callendar>
        <div class="pickOut3" @click="getTransactions(defAcc.acc_name);">Transakcije računa</div>
        <div @click="showCallendar=!showCallendar" class="pickOut3">Prikaz po datumu</div>
      </div>
      <!-- end transaction 2 -->

      
        <div class="showTransaction scrollTD" >
          <table v-if="allTransaction && allTransaction.length > 0">
          <tr>
            <th class="scrollTD">Tip tranakcije:</th> 
            <th class="scrollTD"> Iznos:</th>
            <th class="scrollTD"> Opis:</th>
            <th class="scrollTD"> Datum: </th>
            <th class="scrollTD">Opozovi transakciju: </th>
          </tr>
          <tr v-for="acc in allTransaction" :key="acc.tra_id">
            <td class="scrollTD">{{acc.tra_type_name}}</td> 
            <td class="scrollTD">{{acc.tra_amount}}</td>
            <td class="scrollTD">{{acc.tra_description}}</td>
            <td class="scrollTD">{{formateDate(acc.tra_date)}}</td>
            <td class="scrollTD cancelTransaction" @click="checkCancelTransaction(acc.tra_id ,acc.tra_description)">Opozovi</td>
          </tr>
          </table>
          <table v-else>
          <tr>
            <th class="scrollTD">Tip tranakcije:</th> 
            <th class="scrollTD"> Iznos:</th>
            <th class="scrollTD"> Opis:</th>
            <th class="scrollTD"> Datum: </th>
            <th class="scrollTD">Opozovi transakciju: </th>
          </tr>
          <tr><td colspan="5">Nema podataka za prikazivanje</td></tr>
          <tr v-for="a in 6" :key="a">
            <td class="scrollTD"> <br> </td> 
            <td class="scrollTD"> <br> </td>
            <td class="scrollTD"> <br> </td>
            <td class="scrollTD"> <br> </td>
            <td class="scrollTD cancelTransaction"></td>
          </tr>
          </table>
              
     
      </div>
    </div><!-- END transaction-->






      <div class="transaction" v-bind:class="{black:selectTransaction}">
        <div class="pickOut pickOut2" @click="selectTranM(true)">Rashod</div>
        <div class="pickOut" @click="selectTranM(false)">Prihod</div>

        <!-- buy transaction -->
        <div v-if="selectTransaction" class="tranType">
          <h2>
            <span class="orange">Rashod</span> - Potrošnja
          </h2>
          <label>Kategorije</label>
          <br />
          <select v-model="categorySelected" class="inputWrite">
            <option v-for="cat in category" :key="cat.cat_id">{{cat.cat_name}}</option>
          </select>
          <br />
          <label>Iznos</label>
          <br />
          <input v-model="buySum" type="number" class="inputWrite" />
          <br />
          <label>Opis</label>
          <br />
          <input v-model="buyDesc" type="text" class="inputWrite" />
          <br />
          <input type="button" value="Unesi" class="inputWrite" @click="checkFormBuy" />
          <br />
          <p v-for="err in buyErrors" :key="err">{{err}}</p>
        </div>
        <!-- end tranType-->

        <!-- add mony to acount -->
        <div v-else class="tranType">
          <h2>
            <span class="orange">Prihod</span> - Uplate
          </h2>
          <label>Iznos</label>
          <br />
          <input v-model="addSum" type="number" class="inputWrite" />
          <br />
          <label>Opis</label>
          <br />
          <input v-model="addDesc" type="text" class="inputWrite" />
          <br />
          <input type="button" value="Unesi" class="inputWrite" @click="checkFormAddToAccount" />
          <br />
          <p v-for="err in addErrors" :key="err">{{err}}</p>
        </div>
        <!-- end tranType -->
      </div>
      <!-- transaction -->

      <div class="showGraf scrollTD">
        <h2 v-if="setParamsForChartTrue">Statistika svih transakcija računa</h2>
        <p v-else>Primer statistike računa sa nasumičnim podatcima</p>
        <ChartCircle />
        
      </div>
      <!-- end showGraf -->
    </div>
    <!-- end main -->

    
    <!-- end main2 -->
  </div>
  <!-- end of dashBoard -->
</template>
      

<script>
// @ is an alias to /src
//import {mapActions} from 'vuex'
import Callendar from "@/components/Callendar.vue";
import ChartCircle from "@/components/ChartCircle.vue";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {
    callendar: Callendar,
    ChartCircle: ChartCircle
  },
  
  data() {
    return {
      selectTransaction: true,
      accounts: [],
      defAcc: {},
      allTransaction: [],
      typeAccount: [],
      category: [],
      showCallendar: false,
      message: null,
      err: null,
      sid: null,
      setParamsForChartTrue:false,

      createAccDiv: false,
      createSum: null,
      createType: null,
      createName: null,
      createErrors: [],
      createSelected: null,

      categorySelected: null,
      buySum: null,
      buyDesc: null,
      buyErrors: [],

      addSum: null,
      addDesc: null,
      addErrors: [],

      deleteAccDiv:false,
      deleteTransactionDiv:false,
      transactionForDelete:0,
      tra_description:''
    };
  },
  async mounted() {
    this.sid = localStorage.getItem("sid");
    await this.getAccounts();
    await this.getTypeAccount();
    await this.getCategory();
  },
  methods: {
    displayDelete(e){
      e.preventDefault();
      alert("cao");
    },
    //call in  get accounts and setBill - set value for chart- for default bill 
     getParamsForChart(acc_name) {
     
      axios.post("http://053n122.mars-e1.mars-hosting.com/api/wallet/statistics", {
          sid: localStorage.getItem("sid"),
          account: acc_name
        })
        .then(response => {
          this.setParamsForChart(response.data.transactions);
          this.setParamsForChartTrue=true
          
        });
    },
    // set Default bill in vuex
    setDefAcc(acc) {
      this.$store.dispatch("changeDefAcc", acc);
    },
    setParamsForChart(params){ 
    
      this.$store.dispatch('paramsForChartAct',params);
    },
    formateDate(date) {
      return date
        .split("-")
        .reverse()
        .join("/");
    },
    selectTranM(x) {
      this.selectTransaction = x;
      console.log(this.selectTransaction);
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
    getCategory() {
      axios
        .get("http://053n122.mars-e1.mars-hosting.com/api/get/getCategory")
        .then(response => {
          this.category = response.data.category;
          this.categorySelected = this.category[0].cat_name;
        });
    },
    getAccounts() {
      let sid = localStorage.getItem("sid");
      console.log(sid);
      if (sid) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/get/getAccounts/all",
            { sid: sid }
          )
          .then(response => {
            this.accounts = response.data.data;
            this.message =response.data.message
          if (this.accounts !== undefined) {
              this.defAcc = this.accounts[0];
              this.setDefAcc(this.accounts[0]); // set default bill in vuex
              localStorage.setItem('setDefAcc',this.defAcc.acc_name)
              this.getTransactions(this.defAcc.acc_name);
              this.getParamsForChart(this.defAcc.acc_name)
            }
          });
      }
      // hendlujemo ako nema sid 
    },
    getTransactions(acc_name) {
      if (acc_name !== "" && localStorage.getItem("sid")) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/wallet/transactionViewsAccount",
            { sid: localStorage.getItem("sid"), account: acc_name }
          )
          .then(response => {
            this.allTransaction = response.data.transaction;
            this.$store.dispatch('allTransactionVuexAct',response.data.transaction);
            console.log(response.data.transaction);
          });
      }
    },
    showTransactionByDate(date) {
      console.log(date);
      let sid = localStorage.getItem("sid");
      if (sid) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/wallet/transactionViewsAccountByDate",
            { sid: sid, account: this.defAcc.acc_name, date: date }
          )
          .then(response => {
            this.allTransaction = response.data.transaction;
            this.message = response.data.message;
            this.err = response.data.err;
          });
      }
    },
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
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/wallet/createAccount",
            {
              sid: localStorage.getItem("sid"),
              acc_type: this.createSelected,
              acc_amounth: this.createSum,
              acc_name: this.createName
            }
          )
          .then(response => {
            this.getAccounts();
            this.message = response.data.message;
            this.err = response.data.err;
            console.log("err -" + this.err + "message- " + this.message);
            if (!this.err) {
              this.showCreateAccDiv(false);
            }
          });
      }
      this.createSum = null;
      this.createName = null;
    },
    deleteAccount(){
      let sid =localStorage.getItem('sid')
      console.log(this.defAcc.acc_name )
      if(sid){
        axios.post("http://053n122.mars-e1.mars-hosting.com/api/delete/deleteAccount",
        {sid:sid ,account:this.defAcc.acc_name }
        )
        .then(
          response=>{
            this.message=response.data.message
            this.deleteAccDiv=false
            this.getAccounts()
          } );
      }
    },
    checkFormBuy() {
      this.buyErrors = [];
      if (this.buySum && this.buyDesc) {
        if (!isNaN(this.buySum) && this.buySum !== null) {
          this.createBuy();
          return;
        }
        this.buyErrors.push("Iznos mora biti upisan numeričkim vrednostima");
      }
      if (!this.buySum) {
        this.buyErrors.push("Iznos mora biti upisan");
      }
      if (!this.buyDesc) {
        this.buyErrors.push("Unesite opis radi lakšeg praćenja toka novca");
      }
    },
    createBuy() {
      let sid = localStorage.getItem("sid");
      if (sid) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/wallet/transactionBuy",
            {
              sid: sid,
              acc_id: this.defAcc.acc_id,
              category: this.categorySelected,
              tra_amount: this.buySum,
              tra_description: this.buyDesc
            }
          )
          .then(response => {
            this.getTransactions(this.defAcc.acc_name);

            this.message = response.data.message;
            this.err = response.data.err;
            if (this.message) {
              this.defAcc.acc_amount = response.data.amount;
               this.refreshChart(this.defAcc.acc_name);
              this.buyDesc = null;
              this.buySum = null;
            }
          });
      }
    },
    checkFormAddToAccount() {
      this.addErrors = [];

      if (this.addSum && this.addDesc) {
        console.log(!isNaN(this.addSum) && this.addSum !== null + "uslov");
        if (!isNaN(this.addSum) && this.addSum !== null) {
          this.createAddMoney();
          return;
        }
        this.addErrors.push("Iznos mora biti upisan numeričkim vrednostima");
      }
      if (!this.addSum) {
        this.addErrors.push("Iznos mora biti upisan");
      }
      if (!this.addDesc) {
        this.addErrors.push("Unesite opis radi lakšeg praćenja toka novca");
      }
    },
    createAddMoney() {
      let sid = localStorage.getItem("sid");
      if (sid) {
        axios
          .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/addMoney", {
            sid: sid,
            acc_id: this.defAcc.acc_id,
            tra_amount: this.addSum,
            tra_description: this.addDesc
          })
          .then(response => {
            this.getTransactions(this.defAcc.acc_name);
            this.message = response.data.message;
            this.err = response.data.err;
            if (this.message) {
              this.defAcc.acc_amount = response.data.amount;
              this.refreshChart(this.defAcc.acc_name);
              this.addDesc = null;
              this.addSum = null;
            }
          });
      }
    },
    checkCancelTransaction(id_transaction,tra_description){
      this.deleteTransactionDiv=true;
      this.transactionForDelete=id_transaction;
      this.traDescriptionForDelete=tra_description;
    },
    cancelTransaction(tra_id) {
      let sid = localStorage.getItem("sid");

      if (sid) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/delete/cancelTransactionn",
            { sid: sid, acc_id: this.defAcc.acc_id, tra_id: tra_id }
          )
          .then(response => {
            this.message = response.data.message;
            this.err = response.data.err;

            if (this.message != "") {
              this.getTransactions(this.defAcc.acc_name);
              this.defAcc.acc_amount = response.data.acc_amount;
              this.refreshChart(this.defAcc.acc_name);
            }
             this.showDeleteTransactionDiv(false);
             this.transactionForDelete=0;
             this.traDescriptionForDelete='';
          });
         
      }
    },
    // set default bill on click and all value for that bill
    setBill(bill) {
      
      this.defAcc = bill;
      this.setDefAcc(bill); // set new account as default in vuex
      this.getTransactions(this.defAcc.acc_name);
      localStorage.setItem('setDefAcc',this.defAcc.acc_name)

    },
    
    showCreateAccDiv(x) {
      this.createAccDiv = x;
    },
    showCallendarMet(x) {
      this.showCallendar = x;
    },
    showDeleteAccountDiv(x){
      this.deleteAccDiv=x;
    },
    showDeleteTransactionDiv(x){
      this.deleteTransactionDiv=x;
      this.transactionForDelete=0;
      this.traDescriptionForDelete='';
    },
    resetMessage() {
      this.message = null;
      this.err = null;
    },
    refreshChart(newValue){
      this.setParamsForChartTrue=false
        this.getParamsForChart(newValue);
        this.setParamsForChartTrue=true
    }
  },
  watch:{
      defAcc(newValue, oldValue){
          console.log(`old value- ${oldValue.acc_name}  newValue- ${newValue.acc_name}`);
       if(oldValue.acc_name !== undefined){
         this.refreshChart(newValue.acc_name);
       } else{ this.setParamsForChart('')
}
      }
  },
  computed: {
    ...mapState(["isLoggedIn"]),
    ...mapState(["defAccV"])
  }
};
</script>
<style scoped >
/* width */
::-webkit-scrollbar {
  height: 8px;
  width:3px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px rgba(3, 3, 3, 0.671); 
  /* border-radius: 10px; */
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(172, 168, 168); 
 /*  border-radius: 10px; */
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(116, 113, 113, 0.774);; 
}
.scrollTD{
  overflow: auto;
}



.dashboard {
  text-align: center;
  padding:3% 0 0 0 ;
  width: 100%;
}
.bills {
  padding: 6px 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  color: floralwhite;
}
.bill {
  cursor: pointer;
  font-size: 1.2em;
  min-width:99px;
  font-weight: 500;
  margin: 0.6%;
  width: 18%;
  height: 60px;
  background-color: rgb(0, 0, 0);
  overflow:hidden;
}
.bill p {
  margin: 0 auto;
  box-sizing: border-box;
  line-height: 2.8;
  font-weight: 500;
}
.create {
  cursor: pointer;

  text-shadow: 1.5px 1.5px 1.5px #000000;
  background-color: rgba(0, 0, 0, 0.5);
 
}

.bill:hover {
  box-shadow: 0px 2px 8px 2px #888888;
  font-size: 1.3em;
}
.create:hover {
  box-shadow: 0px 2px 8px 2px #888888;
  font-size: 1.26em;
  text-shadow: 2.9px 2.95px 2.95px #000000;
}
.bill:active {
  cursor: grab;
  box-shadow: 0px 1px 3px 1px #888888;
  font-size: 1.2em;
}
.create:active {
  box-shadow: 0px 1px 3px 1px #888888;
  font-size: 1.2em;
}
.main {
  width: 100%;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content:center;
}
.transaction {
  box-sizing: border-box;
  width: 33.3%;
  display: flex;
  flex-wrap: wrap;
  background-color: #cccccc;
  max-height:100%;
  align-content: flex-start;
 
  min-width: 300px;
}
.allTrans,
.showGraf{
  background-color: #bebebe79;
  
}
.showGraf {
  box-sizing: border-box;
  width: 33.3%;
  display: flex;
  flex-wrap: wrap;
  max-height:50%;
  min-width: 300px;
  justify-content: center;
  padding-top:2%;
 
}

.pickOut {
  box-sizing: border-box;
  font-size: 1.5em;
  line-height: 1.23;
  width: 50%;
  padding: 10px;
  height: 50px;
  background:#cccccc;
  /* border:1px solid rgba(92, 86, 74, 0.527); */
}
.pickOut2 {
  background: rgb(234, 236, 236);
}
.pickOut:hover,
.pickOut3:hover {
  cursor: pointer;
  text-shadow: 1px 1px 1px #000000;
}
.pickOut:active,
.pickOut3:active {
  cursor: grab;
  text-shadow: 0.5px 0.5px 0.5px #000000;
}

.tranType {
  padding:10% 0%;
  width: 100%;
 
}
.tranType h2 {
  /* text-decoration: underline rgb(250, 174, 33);  */
  text-shadow: 1.5px 1.5px 1.5px #000000;
}
.orange {
  color: #17a2b8 !important;
  text-shadow: 1.5px 1.5px 1.5px #000000;
}

.black {
  box-sizing:border-box;
  background: rgb(234, 236, 236);
  color: rgb(85, 81, 81) !important;
  

}
.inputWrite {
  padding: 1%;
  margin-bottom: 2%;
  width: 60%;
  background-color: rgb(255, 255, 255);
  border-color: rgb(196, 188, 188);
}
select.inputWrite {
  
  /* width: 42.5%; */
  border: inset 2px rgb(196, 188, 188);
}
.option:hover {
  cursor: pointer;
}

input:focus {
   background-color: rgb(234, 236, 236);
  border-color: transparent;
}

input[type="button"] {
  font-size: 1.3em;
 /* width: 42.5%; */
  border: inset 2px rgb(196, 188, 188);
  cursor: pointer;
}
input[type="button"]:hover {
  text-shadow: 0.8px 0.8px 0.8px #000000;
}
input[type="button"]:active {
  text-shadow: 0.3px 0.3px 0.3px #000000;
  cursor: grab;
}
.main {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.transaction2 {
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: flex;
}

.pickOut3 {
  box-sizing: border-box;
  font-size: 1.5em;
  line-height: 2.23;
  width: 50%;
  padding:  0;
  z-index: 5;
}


.showTransaction {
  box-sizing: border-box;
  padding-bottom: 25px;
  margin: 20px 9px;
  max-width: 100%;
  
  
}
table{
  box-sizing: border-box;
  min-width:100%;
 
}
tr{
   border-top:solid 1px rgba(113, 113, 116);
    border-bottom:solid 1px rgba(113, 113, 116);
}


td, th{
  padding:8px;
  max-width: 100px;
  min-width:60px;
  border-right:solid 1px rgba(113, 113, 116, 0.2);
    border-left:solid 1px rgba(113, 113, 116, 0.2);

  
}
th{
  background-color: #17a2b8;

  max-height: 50px;
    /*  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; */
    /* letter-spacing:0.5px; */
}


h1:nth-of-type(2) {
  margin: 0 auto;
  padding: 3% 0 0 0;
  max-width: fit-content;
  border-bottom: solid rgb(250, 174, 33);
  border-bottom: double black;
}
h1 .orange {
  word-spacing: 20px;
}
.nameBill p{
  display: inline-block;
  font-size: 2em;
  margin-right:2.5%;

}

@keyframes opacity{
    0% {opacity:0;}
    100% {opacity: 0.6;}
}

.createAccDiv {
  animation-name: opacity;
  animation-duration: 0.3s;
  padding-top: 6%;
  color: #fff;
  width: 100%;
  min-height: 100%;
  background: #000000;
 
  opacity: 0.6;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000100; 
}
.createAccDiv2 {
  animation-name: opacity;
  animation-duration: 0.2s;
 position: fixed;
 top:10%;
 left:23%;
 background:#fff;
  width: 60%;
  
  z-index:1000200;
  padding: 1%;
}
.exit {
  text-align:right;
  cursor: pointer;
  padding-left: 14%;
}
.exit :hover {
  font-size: 1.1em;
  text-shadow: 1.5px 1.5px 1.5px #000000;
}
.err {
  font-size:1.1em;
  letter-spacing: 1px;
  color: rgba(255, 0, 0, 0.733);
  text-shadow: -0.5px 0 black, 0 0.5px black, 0.5px 0 black, 0 -0.5px black;

}
.callendar {
  background: #fff;
  position: absolute;
  top: 70%;
  left: 55%;
  z-index: 10;
}
.cancelTransaction:hover {
  cursor: pointer;
}
 i :hover{
  font-size:1.1em;
  cursor:pointer;
}
</style>
