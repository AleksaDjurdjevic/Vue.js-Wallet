<template>
  <div class="dashboard" @click="resetMessage">
    <div v-if="createAccDiv" class="createAccDiv">
      <form class="createAccDivChaild">
        <h2>
          Kreiraj novi račun
          <span class="exit" @click="showCreateAccDiv(false)">x</span>
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
    <!-- end createAccDiv -->

    <h1>where the money goes???</h1>
    <!-- show all bils -->
    <div class="bills">
      <div class="bill" v-for="acc in accounts" :key="acc.id" @click="setBill(acc)">
        <p>{{acc.acc_name}}</p>
      </div>
      <div class="bill create" @click="showCreateAccDiv(true)">+</div>
    </div>
    <!-- end bills-->
    <h1 v-if="$store.state.isLoggedIn">
      Naziv računa:
      <span class="orange">{{defAcc.acc_name}}</span> Stanje:
      <span class="orange">{{defAcc.acc_amount}} - {{defAcc.acc_type_name}}</span>
    </h1>
    <br />
    <p v-if="message">{{message}}</p>
    <p v-if="err" class="err">{{err}}</p>
    <div class="main">
      <div class="transaction">
        <div class="pickOut pickOut2" @click="selectTranM(true)">Rashod</div>
        <div class="pickOut" @click="selectTranM(false)">Prihod</div>

        <!-- buy transaction -->
        <div v-if="selectTransaction" class="tranType black">
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

      <div class="showGraf">
        <ChartCircle v-if="setParamsForChartTrue"/>
      </div>
      <!-- end showGraf -->
    </div>
    <!-- end main -->

    <div class="main2">
      <div class="transaction2">
        <callendar
          v-if="showCallendar"
          class="callendar"
          v-on:showCallEmit="showCallendarMet($event)"
          v-on:selectDate="showTransactionByDate($event)"
        ></callendar>
        <div class="pickOut3" @click="getTransactions(defAcc.acc_name);">Transakcije računa</div>
        <div @click="showCallendar=!showCallendar" class="pickOut3">Prikaz po datumu</div>
      </div>
      <!-- end transaction2 -->

      <div class="reverse">
        <div class="showTransaction" v-for="acc in allTransaction" :key="acc.tra_id">
          <div>
            Naziv računa:
            <span class="orange">{{acc.acc_name }}</span>
          </div>
          <div>
            Tip tranakcije:
            <span class="orange">{{acc.tra_type_name}}</span>
          </div>
          <div>
            Iznos:
            <span class="orange">{{acc.tra_amount}}</span>
          </div>
          <div>
            Opis:
            <span class="orange">{{acc.tra_description}}</span>
          </div>
          <div>
            Datum:
            <span class="orange">{{formateDate(acc.tra_date)}}</span>
          </div>
          <div class="cancelTransaction" @click="cancelTransaction(acc.tra_id)">Opozovi</div>
        </div>
      </div>
    </div>
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
      addErrors: []
    };
  },
  async mounted() {
    this.sid = localStorage.getItem("sid");
    await this.getAccounts();
    await this.getTypeAccount();
    await this.getCategory();
  },
  methods: {
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
        .join(" / ");
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
            console.log(this.accounts);
            if (this.accounts !== undefined) {
              this.defAcc = this.accounts[0];
              this.setDefAcc(this.accounts[0]);
              this.getTransactions(this.defAcc.acc_name);
              this.getParamsForChart(this.defAcc.acc_name)
            }
          });
      }
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
              sid: sid,
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
    checkFormBuy() {
      this.buyErrors = [];
      if (this.buySum && this.buyDesc) {
        if (!isNaN(this.buySum) && this.buySum !== null) {
          this.createBuy();
          return;
        }
        this.buyErrors.push("Sum must be a number");
      }
      if (!this.buySum) {
        this.buyErrors.push("Sum required");
      }
      if (!this.buyDesc) {
        this.buyErrors.push("Description required");
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
        this.addErrors.push("Sum must be a number");
      }
      if (!this.addSum) {
        this.addErrors.push("Sum required");
      }
      if (!this.addDesc) {
        this.addErrors.push("Description required");
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
              this.addDesc = null;
              this.addSum = null;
            }
          });
      }
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
            }
          });
      }
    },
    setBill(bill) {
      this.defAcc = bill;
      this.setDefAcc(bill);
      this.getTransactions(this.defAcc.acc_name);
      this.setParamsForChart(this.defAcc.acc_name);
    },
    showCreateAccDiv(x) {
      this.createAccDiv = x;
    },
    showCallendarMet(x) {
      this.showCallendar = x;
    },
    resetMessage() {
      this.message = null;
      this.err = null;
    }
  },
  computed: {
    ...mapState(["isLoggedIn"]),
    ...mapState(["defAccV"])
  }
};
</script>
<style scoped >
.dashboard {
  text-align: center;
  position: relative;
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

  font-weight: 500;
  margin: 0.6%;
  width: 18%;
  height: 60px;
  background-color: rgb(0, 0, 0);
}
.bill p {
  margin: 0 auto;
  box-sizing: border-box;
  line-height: 2.8;
  font-weight: 500;
}
.create {
  cursor: pointer;
  line-height: 1.23;
  font-size: 3em;
  text-shadow: 1.5px 1.5px 1.5px #000000;
  background-color: rgba(0, 0, 0, 0.5);
}
.bill:hover {
  box-shadow: 0px 2px 8px 2px #888888;
  font-size: 1.3em;
}
.create:hover {
  box-shadow: 0px 2px 8px 2px #888888;
  font-size: 3.3em;
  text-shadow: 2.9px 2.95px 2.95px #000000;
}
.bill:active {
  cursor: grab;
  box-shadow: 0px 1px 3px 1px #888888;
  font-size: 1.2em;
}
.create:active {
  font-size: 3em;
}
.main {
  width: 100%;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}
.transaction {
  box-sizing: border-box;
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  background-color: #cccccc;
  padding-bottom: 30px;
  min-width: 300px;
}
.showGraf {
  box-sizing: border-box;
  width: 45%;
  display: flex;
  flex-wrap: wrap;
  min-width: 300px;
}

.pickOut {
  box-sizing: border-box;
  font-size: 1.5em;
  line-height: 1.23;
  width: 50%;
  padding: 10px;
  height: 50px;
  /* border:1px solid rgba(92, 86, 74, 0.527); */
}
.pickOut2 {
  background: rgb(234, 236, 236);
}
.pickOut:hover,
.pickOut3:hover {
  cursor: pointer;
  text-shadow: 1.5px 1.5px 1.5px #000000;
}
.pickOut:active,
.pickOut3:active {
  cursor: grab;
  text-shadow: 0.5px 0.5px 0.5px #000000;
}

.tranType {
  width: 100%;
}
.tranType h2 {
  /* text-decoration: underline rgb(250, 174, 33);  */
  text-shadow: 1.5px 1.5px 1.5px #000000;
}
.orange {
  color: rgb(250, 174, 33) !important;
  text-shadow: 1.5px 1.5px 1.5px #000000;
}

.black {
  background: rgb(234, 236, 236);
  color: rgb(85, 81, 81) !important;
  height: 100%;
}
.inputWrite {
  padding: 1%;
  margin-bottom: 2%;
  width: 40%;
  background-color: rgb(231, 226, 219);
  border-color: rgb(196, 188, 188);
}
select.inputWrite {
  width: 42.5%;
  border: inset 2px rgb(196, 188, 188);
}
.option:hover {
  cursor: pointer;
}

input:focus {
  border-color: transparent;
}

input[type="button"] {
  font-size: 1.3em;
  width: 42.5%;
  border: inset 2px rgb(196, 188, 188);
  cursor: pointer;
}
input[type="button"]:hover {
  text-shadow: 1.5px 1.5px 1.5px #000000;
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
  padding: 3% 0;
  z-index: 5;
}

.showTransaction {
  box-sizing: border-box;
  padding-bottom: 25px;
  margin: 25px 60px;
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  border-bottom: solid 2px rgba(0, 0, 0, 0.5);
}
.reverse {
  box-sizing: border-box;
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;

  flex-direction: column-reverse;
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

.createAccDiv {
  padding-top: 6%;
  color: #fff;
  width: 100%;
  height: 100%;
  background: #000000;
  opacity: 0.7;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
}
.createAccDivChaild {
  position: relative;
  width: 70%;
  margin: 0 auto;
  opacity: 1 !important;
}
.exit {
  cursor: pointer;
  padding-left: 14%;
}
.exit :hover {
  font-size: 4.1em;
  text-shadow: 3.5px 3.5px 3.5px #000000;
}
.err {
  color: rgba(255, 0, 0, 0.733);
  text-shadow: 1.5px 1.5px 1.5px #000000;
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
</style>
