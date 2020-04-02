<template>
  <div class="dashboard" @dblclick="resetMessage();">
    <!-- DIV CREATE ACCOUNT -->
    <div v-if="createAccDiv" class="createAccDiv" @click="showCreateAccDiv(false)"></div>
    <div v-if="createAccDiv" class="createAccDiv2">
      <form>
        <p class="exit" @click="showCreateAccDiv(false)">
          <i class="fas fa-times" style="font-size:25px, text-align:right"></i>
        </p>

        <h2>Kreiraj novi račun</h2>
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
        <input type="number" class="inputWrite" v-model="createSum" />
        <br />
        <label>Naziv računa</label>
        <br />
        <input type="text" class="inputWrite" v-model="createName" />
        <br />
        <input type="button" class="inputWrite" value="Kreiraj Račun" @click="checkFormCreateAcc" />
        <br />
        <input type="button" class="inputWrite" value="Otkaži" @click="showCreateAccDiv(false)" />
        <br />
        <p class="err" v-if="errCreate">{{ errCreate }}</p>
        <p class="err" v-for=" crErr in createErrors" :key="crErr">{{crErr}}</p>
      </form>
      <!-- end form createAccDivChaild -->
    </div>
    <!-- end DIV CREATE ACCOUNT -->

    <!-- start DELETE ACCOUNT CLASS=createAccDiv is just for style -->
    <div v-if="deleteAccDiv" class="createAccDiv" @click="showDeleteAccountDiv(false)"></div>
    <div v-if="deleteAccDiv" class="createAccDiv2">
      <p class="exit" @click="showDeleteAccountDiv(false)">
        <i class="fas fa-times" style="font-size:25px, text-align:right"></i>
      </p>

      <h2>
        DA LI STE SIGURNI DA ŽELITE DA IZBRISETE
        <span class="orange">{{defAcc.acc_name}}</span>
        RAČUN?
      </h2>

      <br />

      <input type="button" class="inputWrite" value="Izbriši Račun" @click="deleteAccount" />
      <br />

      <input
        type="button"
        class="inputWrite"
        value="Otkaži brisanje"
        @click="showDeleteAccountDiv(false)"
      />
      <br />

      <!-- -->
    </div>
    <!-- END DELETE ACCOUNT -->

    <!-- start DELETE TRANSACTION CLASS=createAccDiv is just for style -->
    <div v-if="deleteTransactionDiv" class="createAccDiv" @click="showDeleteTransactionDiv(false)"></div>
    <div v-if="deleteTransactionDiv" class="createAccDiv2">
      <p class="exit" @click="showDeleteTransactionDiv(false)">
        <i class="fas fa-times" style="font-size:25px, text-align:right"></i>
      </p>

      <h2>
        DA LI STE SIGURNI DA ŽELITE DA OPOZOVETE TRANSAKCIJU
        <span
          class="orange"
        >{{traDescriptionForDelete}}</span> ?
      </h2>
      <p>Opozivanjem transakcije sredstva će Vam automatski biti vraćena na račun sa kojeg su uzeta.</p>

      <br />

      <input
        type="button"
        class="inputWrite"
        value="OPOZOVI TRANSAKCIJU"
        @click="cancelTransaction(transactionForDelete)"
      />
      <br />
      <input
        type="button"
        class="inputWrite"
        value="OTKAŽI OPOZIVANJE"
        @click="showDeleteTransactionDiv(false)"
      />
      <br />

      <!-- -->
    </div>
    <!-- END DELETE TRANSACTION -->

    <h1>
      <span v-if="!this.isLoggedIn">Try it!</span> Where the money goes???
    </h1>
    <p v-if="!this.isLoggedIn">
      <span v-if="!showTryAcc">Napravite probni račun.</span> Sve transakcije koje budete izvršili nece biti upamćene. Za pravljenje više od 1 računa za pamćenje transakcija i još puno dodatnih opcija molimo registrujte se.
    </p>
    <!-- show all bils -->
    <div class="bills">
      <div
        class="bill"
        v-bind:class="{ active: defAcc.acc_name === acc.acc_name }"
        v-for="acc in accounts"
        :key="acc.acc_id"
        @click="setBill(acc)"
      >
        <p>{{acc.acc_name}}</p>
      </div>
      <div v-if="!showTryAcc" class="bill create" @click="showCreateAccDiv(true)">
        <p>napravi račun +</p>
      </div>
    </div>
    <!-- end bills-->
    <div class="nameBill" v-if="this.isLoggedIn && this.accounts ">
      <p>
        Naziv računa:
        <span class="orange">{{defAcc.acc_name}}</span>
      </p>
      <p>
        Stanje:
        <span class="orange">{{defAcc.acc_amount}} - {{defAcc.acc_type_name}}</span>
      </p>
      <i @click="showDeleteAccountDiv(true)" class="fas fa-trash-alt" style="font-size:16px"></i>
    </div>
    <!-- end isLoggedIn -->
    <div class="nameBill" v-else-if="this.showTryAcc && !this.isLoggedIn">
      <p>
        Naziv računa:
        <span class="orange">{{this.createName}}</span>
      </p>
      <p>
        Stanje:
        <span class="orange">{{this.createSum}} - {{this.createSelected}}</span>
      </p>
      <i @click="showDeleteAccountDiv(true)" class="fas fa-trash-alt" style="font-size:16px"></i>
    </div>

    <br />
    <p v-if="message" class="mess">{{ message}}</p>
    <p v-if="err" class="err">{{err}}</p>

    <div class="main">
      <div class="main2" v-if="!showOptionsForTransaction">
        <h2>
          Nemate pristup transakcijama jer nemate račun.
          <br />Pravljenjem računa imaćete pristup transakcijama.
        </h2>
      </div>

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

        <div class="showTransaction scrollTD">
          <p v-if="messageTran" class="mess">{{ messageTran}}</p>
          <p v-if="errTran" class="err">{{errTran}}</p>

          <table v-if="allTransaction && allTransaction.length > 0">
            <tr class="tr">
              <th class="scrollTD">Tip tranakcije:</th>
              <th class="scrollTD">Iznos:</th>
              <th class="scrollTD">Opis:</th>
              <th class="scrollTD">Datum:</th>
              <th class="scrollTD">Opozovi transakciju:</th>
            </tr>
            <tr class="tr" v-for="acc in allTransaction" :key="acc.tra_id">
              <td class="scrollTD">{{acc.tra_type_name}}</td>
              <td class="scrollTD">{{acc.tra_amount}}</td>
              <td class="scrollTD">{{acc.tra_description}}</td>
              <td class="scrollTD">{{formateDate(acc.tra_date)}}</td>
              <td
                class="scrollTD cancelTransaction"
                @click="checkCancelTransaction(acc.tra_id ,acc.tra_description)"
              >Opozovi</td>
            </tr>
          </table>
          <table v-else-if="arrTryTransaction.length>0 && showTryAcc">
            <tr class="tr">
              <th class="scrollTD">Tip tranakcije:</th>
              <th class="scrollTD">Iznos:</th>
              <th class="scrollTD">Opis:</th>
              <th class="scrollTD">Datum:</th>
              <th class="scrollTD">Opozovi transakciju:</th>
            </tr>
            <tr class="tr" v-for="(a,index) in arrTryTransaction" :key="index">
              <td class="scrollTD">{{a.tip}}</td>
              <td class="scrollTD">{{a.iznos}}</td>
              <td class="scrollTD">{{a.opis}}</td>
              <td class="scrollTD">{{a.datum}}</td>
              <td
                class="scrollTD cancelTransaction"
                @click="checkCancelTransaction(index ,a.opis)"
              >Opozovi</td>
            </tr>
          </table>
          <table v-else>
            <tr class="tr">
              <th class="scrollTD">Tip tranakcije:</th>
              <th class="scrollTD">Iznos:</th>
              <th class="scrollTD">Opis:</th>
              <th class="scrollTD">Datum:</th>
              <th class="scrollTD">Opozovi transakciju:</th>
            </tr>
            <tr class="tr">
              <td colspan="5">Nema podataka za prikazivanje</td>
            </tr>
            <tr class="tr" v-for="a in 8" :key="a">
              <td class="scrollTD">
                <br />
              </td>
              <td class="scrollTD">
                <br />
              </td>
              <td class="scrollTD">
                <br />
              </td>
              <td class="scrollTD">
                <br />
              </td>
              <td class="scrollTD">
                <br />
              </td>
            </tr>
          </table>
        </div>
      </div>
      <!-- END transaction allTrans-->

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
          <p v-if="messageBuy" class="mess">{{ messageBuy}}</p>
          <p v-if="errBuy" class="err">{{errBuy}}</p>

          <p class="err" v-for="err in buyErrors" :key="err">{{err}}</p>
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
          <p v-if="messageAdd" class="mess">{{ messageAdd}}</p>
          <p v-if="errAdd" class="err">{{errAdd}}</p>

          <p class="err" v-for="err in addErrors" :key="err">{{err}}</p>
        </div>
        <!-- end tranType -->
      </div>
      <!-- transaction -->

      <div class="transaction showGraf">
        <h2 v-if="setParamsForChartTrue || createName ">Statistika svih transakcija trenutnog računa</h2>
        <h2 v-else>Primer statistike računa sa nasumičnim podacima</h2>
        <ChartCircle />
      </div>
      <!-- end showGraf -->
    </div>
    <!-- end main -->
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
      setParamsForChartTrue: false,
      showTryAcc: false,
      showOptionsForTransaction: false,

      createAccDiv: false,
      createSum: null,
      createType: null,
      createName: null,
      createErrors: [],
      createSelected: null,
      arrTryTransaction: [],
      tryParamsForChart: [],
      tryParams: false,
      errCreate: null,

      categorySelected: null,
      buySum: null,
      buyDesc: null,
      buyErrors: [],
      messageBuy: null,
      errBuy: null,

      addSum: null,
      addDesc: null,
      addErrors: [],
      messageAdd: null,
      errAdd: null,

      deleteAccDiv: false,
      deleteTransactionDiv: false,
      transactionForDelete: 0,
      tra_description: "",
      messageTran: null,
      errTran: null
    };
  },
  async mounted() {
    this.sid = localStorage.getItem("sid");
    await this.getAccounts();
    await this.getTypeAccount();
    await this.getCategory();
    this.resetMessage();
  },
  methods: {
    displayDelete(e) {
      e.preventDefault();
      alert("cao");
    },
    //call in  get accounts and setBill - set value for chart- for default bill
    getParamsForChart(acc_name) {
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/statistics", {
          sid: localStorage.getItem("sid"),
          account: acc_name
        })
        .then(response => {
          this.setParamsForChart(response.data.transactions);
          this.setParamsForChartTrue = true;
        });
    },
    // set Default bill in vuex
    setDefAcc(acc) {
      this.resetMessage();
      this.$store.dispatch("changeDefAcc", acc);
    },
    setParamsForChart(params) {
      this.$store.dispatch("paramsForChartAct", params);
    },
    formateDate(date) {
      return date
        .split("-")
        .reverse()
        .join("/");
    },
    selectTranM(x) {
      this.selectTransaction = x;
    },
    getTypeAccount() {
      this.resetMessage();
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
      this.showTryAcc = false;
      let sid = localStorage.getItem("sid");
      if (sid) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/get/getAccounts/all",
            { sid: sid }
          )
          .then(response => {
            this.accounts = response.data.data;
            this.message = response.data.message;
            if (this.accounts !== undefined) {
              this.showOptionsForTransaction = true;
              this.defAcc = this.accounts[this.accounts.length - 1];
              this.setDefAcc(this.accounts[this.accounts.length - 1]); // set default bill in vuex
              localStorage.setItem("setDefAcc", this.defAcc.acc_name);
              this.getTransactions(this.defAcc.acc_name);
              this.getParamsForChart(this.defAcc.acc_name);
            } else {
              this.defAcc = {};
              this.setDefAcc(null); // set default bill in vuex
              localStorage.setItem("setDefAcc", null);
              this.allTransaction = [];
              this.setParamsForChart([]);
              this.showOptionsForTransaction = false;
            }
          });
      }
      // hendlujemo ako nema sid
    },
    getTransactions(acc_name) {
      this.resetMessage();
      if (acc_name !== "" && localStorage.getItem("sid")) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/wallet/transactionViewsAccount",
            { sid: localStorage.getItem("sid"), account: acc_name }
          )
          .then(response => {
            this.allTransaction = response.data.transaction;
            this.$store.dispatch(
              "allTransactionVuexAct",
              response.data.transaction
            );
          });
      }
    },
    showTransactionByDate(date) {
      this.resetMessage();
      let sid = localStorage.getItem("sid");
      if (sid) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/wallet/transactionViewsAccountByDate",
            { sid: sid, account: this.defAcc.acc_name, date: date }
          )
          .then(response => {
            this.allTransaction = response.data.transaction;
            this.messageTran = response.data.message;
            this.errTran = response.data.err;
          });
      }
    },
    checkFormCreateAcc() {
      this.resetMessage();
      this.createErrors = [];

      if (this.createName && this.createSum) {
        this.createName = this.createName.trim();
        this.createSum = this.createSum.trim();

        if (this.createName.length === 0 || this.createName.length > 12) {
          this.createErrors.push(
            "Naziv računa treba da bude od min 1 do max 12 karaktera."
          );
          return;
        }
        if (this.createSum.length > 30) {
          this.createErrors.push("Iznos ne sme biti duži od 30 cifre");
          return;
        }

        if (
          !isNaN(this.createSum) &&
          this.createSum !== null &&
          this.createSum >= 0
        ) {
          this.createNewAccount();
          return;
        } else {
          this.createErrors.push("Iznos mora biti brojna vrednost.");
        }
      }
      if (!this.createSum) {
        this.createErrors.push("Iznos mora biti unešen.");
      }
      if (this.createSum < 0) {
        this.createErrors.push("Iznos ne sme biti negativna vrednost.");
      }

      if (!this.createName) {
        this.createErrors.push(
          "Ime računa je obavezno zbog lakšeg praćenja transakcija i sredstava."
        );
      }
    },
    createNewAccount() {
      this.resetMessage();
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
            this.message = response.data.message;
            this.errCreate = response.data.err;
            if (!this.errCreate) {
              this.showCreateAccDiv(false);
              this.createSum = null;
              this.createName = null;
              this.getAccounts();
            }
          });
      } else {
        //pravljenje probnog racuna
        this.showCreateAccDiv2();
        this.showTryAcc = true;
        this.tryParamsForChart.push({
          tip_transakcije: "Dostupno",
          iznos: this.createSum
        });
        this.tryParams = true;
        this.showOptionsForTransaction = true;
        this.setParamsForChart(this.tryParamsForChart);
        // this.showCreateAccDiv(false);
      }
    },
    deleteAccount() {
      this.resetMessage();
      let sid = localStorage.getItem("sid");
      if (sid) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/delete/deleteAccount",
            { sid: sid, account: this.defAcc.acc_name }
          )
          .then(response => {
            this.message = response.data.message;
            this.deleteAccDiv = false;
            this.getAccounts();
          });
      } else {
        this.deleteAccDiv = false;
        this.showTryAcc = false;
        this.createSum = null;
        this.createName = null;
        this.arrTryTransaction = [];
        this.showOptionsForTransaction = false;
        this.tryParams = false;
        this.tryParamsForChart = [];
        this.setParamsForChart([]);
      }
    },
    checkFormBuy() {
      this.resetMessage();
      this.buyErrors = [];

      if (this.buySum && this.buyDesc && this.buySum > 0) {
        this.buyDesc = this.buyDesc.trim();
        this.buySum = this.buySum.trim();
        //    console.log( typeof  this.buyDesc +'----------');
        //    console.log(  this.buyDesc.length +'----------');

        if (this.buyDesc.length < 1 || this.buyDesc.length > 25) {
          console.log(this.buyDesc.length + "----------");
          this.buyErrors.push(
            "Opis transakcije treba da bude od min 1 do max 25 karaktera."
          );
          return;
        }
        if (this.buySum.length > 30) {
          this.buyErrors.push("Iznos ne sme biti duži od 30 cifre");
          return;
        }

        if (!isNaN(this.buySum) && this.buySum !== null) {
          this.createBuy();
          return;
        }
        this.buyErrors.push("Unos mora postojati");
      }
      if (!this.buySum) {
        this.buyErrors.push("Iznos mora biti upisan");
      }
      if (this.buySum <= 0) {
        this.buyErrors.push("Iznos za transakciju mora biti veći od 0");
      }
      if (!this.buyDesc) {
        this.buyErrors.push(
          "Unesite opis radi lakšeg praćenja transakcija i sredstava."
        );
      }
    },
    createBuy() {
      this.resetMessage();
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

            this.messageBuy = response.data.message;
            this.errBuy = response.data.err;
            if (this.messageBuy) {
              this.defAcc.acc_amount = response.data.amount;
              this.refreshChart(this.defAcc.acc_name);
              this.buyDesc = null;
              this.buySum = null;
            }
          });
      } else if (this.createName) {
        // tip transakcija Rashod
        //parametri this.categorySelcted  this.buySum this.buyDesc

        if (this.createSum - this.buySum < 0) {
          this.errBuy =
            "Trnsakcija ne može biti obavljena, nemate dovoljno sredstava na računu!";
        } else {
          this.messageBuy = "Transakcija je uspešna";
          let d = new Date();
          d = d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear();
          this.createSum = this.createSum - this.buySum;
          this.arrTryTransaction.push({
            tip: "rashod",
            iznos: this.buySum,
            opis: this.buyDesc,
            datum: d
          });
          this.buyDesc = null;
          this.buySum = null;
        }
      } else {
        this.errBuy =
          "Prvo morate napraviti račun da bi mogli izvršiti transakcije.";
      }
    },
    checkFormAddToAccount() {
      this.resetMessage();
      this.addErrors = [];

      if (this.addSum && this.addDesc && this.addSum > 0) {
        this.addDesc = this.addDesc.trim();
        this.addSum = this.addSum.trim();

        if (this.addDesc.length === 0 || this.addDesc.length > 25) {
          this.addErrors.push(
            "Opis transakcije treba da bude od min 1 do max 25 karaktera."
          );
          return;
        }
        if (this.addSum.length > 30) {
          this.addErrors.push("Iznos ne sme biti duži od 30 cifre");
          return;
        }

        if (!isNaN(this.addSum) && this.addSum !== null) {
          this.createAddMoney();
          return;
        }
        this.addErrors.push("Iznos mora biti upisan numeričkim vrednostima");
      }

      if (!this.addSum) {
        this.addErrors.push("Iznos mora biti upisan");
      }
      if (this.addSum <= 0) {
        this.addErrors.push("Iznos mora biti veći od 0");
      }
      if (!this.addDesc) {
        this.addErrors.push(
          "Unesite opis radi lakšeg praćenja transakcija i sredstava"
        );
      }
    },
    createAddMoney() {
      this.resetMessage();
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
            this.messageAdd = response.data.message;
            this.errAdd = response.data.err;
            if (this.messageAdd) {
              this.defAcc.acc_amount = response.data.amount;
              this.refreshChart(this.defAcc.acc_name);
              this.addDesc = null;
              this.addSum = null;
            }
          });
      } else if (this.createName) {
        this.messageAdd = "Transakcija je uspešna";
        let d = new Date();
        d = d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear();
        this.createSum = parseFloat(this.createSum) + parseFloat(this.addSum);
        this.arrTryTransaction.push({
          tip: "prihod",
          iznos: this.addSum,
          opis: this.addDesc,
          datum: d
        });
        this.addDesc = null;
        this.addSum = null;
      } else {
        this.errAdd =
          "Prvo morate napraviti račun da bi mogli izvršiti transakcije.";
      }
    },
    checkCancelTransaction(id_transaction, tra_description) {
      this.deleteTransactionDiv = true;
      this.transactionForDelete = id_transaction;
      this.traDescriptionForDelete = tra_description;
    },
    cancelTransaction(tra_id) {
      this.resetMessage();
      let sid = localStorage.getItem("sid");

      if (sid) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/delete/cancelTransactionn",
            { sid: sid, acc_id: this.defAcc.acc_id, tra_id: tra_id }
          )
          .then(response => {
            this.messageTran = response.data.message;
            this.errTran = response.data.err;

            if (this.messageTran != "") {
              this.getTransactions(this.defAcc.acc_name);
              this.defAcc.acc_amount = response.data.acc_amount;
              this.refreshChart(this.defAcc.acc_name);
            }
            this.showDeleteTransactionDiv(false);
            this.transactionForDelete = 0;
            this.traDescriptionForDelete = "";
          });
      } else {
        let x = this.arrTryTransaction.splice(tra_id, 1);
        if (x[0].tip === "rashod") {
          this.createSum = parseFloat(this.createSum) + parseFloat(x[0].iznos);
        } else {
          this.createSum = parseFloat(this.createSum) - parseFloat(x[0].iznos);
        }
        this.showDeleteTransactionDiv(false);
        this.transactionForDelete = 0;
        this.traDescriptionForDelete = "";
      }
    },
    // set default bill on click and all value for that bill
    setBill(bill) {
      this.defAcc = bill;
      this.setDefAcc(bill); // set new account as default in vuex
      this.getTransactions(this.defAcc.acc_name);
      localStorage.setItem("setDefAcc", this.defAcc.acc_name);
    },

    showCreateAccDiv(x) {
      this.createSum = null;
      this.createName = null;

      this.createAccDiv = x;
    },
    showCreateAccDiv2() {
      this.createAccDiv = false;
    },
    showCallendarMet(x) {
      this.showCallendar = x;
    },
    showDeleteAccountDiv(x) {
      this.deleteAccDiv = x;
    },
    showDeleteTransactionDiv(x) {
      this.deleteTransactionDiv = x;
      this.transactionForDelete = 0;
      this.traDescriptionForDelete = "";
    },
    resetMessage() {
      this.message = null;
      this.err = null;
      this.messageBuy = null;
      this.errBuy = null;
      this.messageAdd = null;
      this.errAdd = null;
      this.messageTran = null;
      this.errTran = null;
      this.errCreate = null;
      this.createErrors = [];
      this.buyErrors = [];
      this.addErrors = [];
    },
    refreshChart(newValue) {
      this.setParamsForChartTrue = false;
      this.getParamsForChart(newValue);
      this.setParamsForChartTrue = true;
    },
    changeMessage(x) {
      this.message = x;
    }
  },
  watch: {
    defAcc(newValue, oldValue) {
      if (oldValue.acc_name !== undefined) {
        this.refreshChart(newValue.acc_name);
      } else {
        this.setParamsForChart("");
      }
    },
    arrTryTransaction(newValue) {
      this.tryParamsForChart = [];
      if (this.arrTryTransaction.length === 0) {
        this.tryParamsForChart.push(
          { tip_transakcije: "Dostupno", iznos: this.createSum}
          );
      } else {
        this.tryParamsForChart.push(
          { tip_transakcije: "Dostupno", iznos: this.createSum },
          { tip_transakcije: "Rashod", iznos: 0 },
          { tip_transakcije: "Prihod", iznos: 0 }
        );
      }

      if (this.createName === null) {
        return;
      }

      /*  this.tryParamsForChart[0].iznos = this.createSum;
      this.tryParamsForChart[1].iznos = 0;
      this.tryParamsForChart[2].iznos = 0;
*/
      for (let i = 0; i < this.arrTryTransaction.length; i++) {
        if (this.arrTryTransaction[i].tip === "rashod") {
          this.tryParamsForChart[1].iznos += parseFloat(newValue[i].iznos);
        } else if (this.arrTryTransaction[i].tip === "prihod") {
          this.tryParamsForChart[2].iznos += parseFloat(newValue[i].iznos);
        }
      }

      this.setParamsForChart(this.tryParamsForChart);
    }
  },

  computed: {
    ...mapState(["isLoggedIn"]),
    ...mapState(["defAccV"]),
    showMessageErr() {
      return this.message;
    }
  }
};

// transaction
// transaction
</script>
<style scoped >
.scrollTD {
  overflow: auto;
}

/* width */
::-moz-scrollbar {
  height: 8px;
  width: 3px;
}
::-webkit-scrollbar {
  height: 8px;
  width: 3px;
}

/* Track */
::-moz-scrollbar-track {
  box-shadow: inset 0 0 2px rgba(3, 3, 3, 0.671);
  /* border-radius: 10px; */
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px rgba(3, 3, 3, 0.671);
  /* border-radius: 10px; */
}

/* Handle */
::-moz-scrollbar-thumb {
  background: rgb(172, 168, 168);
  /*  border-radius: 10px; */
}
::-webkit-scrollbar-thumb {
  background: rgb(172, 168, 168);
  /*  border-radius: 10px; */
}

/* Handle on hover */
::-moz-scrollbar-thumb:hover {
  background: rgba(116, 113, 113, 0.774);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(116, 113, 113, 0.774);
}
.scrollTD {
  overflow: auto;
}

.dashboard {
  text-align: center;
  padding: 0 0 0 0;
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
  transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
  transition: box-shadow, transform, color;
  transition-duration: 0.2s, 0.2s, 0.2s;
  transition-timing-function: ease, ease, ease;
  transition-delay: 0s, 0s, 0s;

  cursor: pointer;
  font-size: 1.2em;
  min-width: 99px;
  font-weight: 500;
  margin: 0.6%;
  width: 18%;
  height: 60px;
  background-color: rgb(0, 0, 0);
  overflow: hidden;
  border-radius: 10px;
  display:flex;
  justify-content: center;
  align-items: center;

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
.bill p {
  margin: 0 auto;
  box-sizing: border-box;
 /* line-height: 2.1; */
  font-weight: 500;
}
.create {
  transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
  transition: box-shadow, transform, color;
  transition-duration: 0.2s, 0.2s, 0.2s;
  transition-timing-function: ease, ease, ease;
  transition-delay: 0s, 0s, 0s;

  cursor: pointer;
  box-shadow: 0px 1px 1px 1px #888888;
 
  background-color: rgba(0, 0, 0, 0.5);
  background: #117a8a ;
  box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
    0 5px 5px -1px rgba(0, 0, 0, 0.644), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
    0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
    background-image: linear-gradient(
    -45deg  #117a8a,
     #f8f8f8
  ); 
  
  color: #e6eaef;
}

.bill:hover {
  /*  box-shadow: 0px 2px 8px 2px #888888; */
  font-size: 1.2em;
 /* text-shadow: 2.9px 2.95px 2.95px #000000;*/

  box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
    0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
.create:hover {
  box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
    0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
 /* text-shadow: 2.9px 2.95px 2.95px #000000; */
}
.bill:active {
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
.create:active {
  box-shadow: 0px 1px 3px 1px #888888;
  font-size: 1.2em;
  box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
    0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
    0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
}
.active,
.active:hover {
  background-color: rgba(0, 0, 0, 0.5);
   background-image: linear-gradient(
    -45deg rgb(78, 75, 75),
    rgba(36, 35, 35, 0.5)
  )!important;
  
  box-shadow: 0px 1px 3px 1px #888888;
  font-size: 1.2em;
  box-shadow: 0 5px #666;
  transform: translateY(4px);

  box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
    0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
    0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  transition: 0s;
  color: rgba(15, 201, 230, 0.911);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);

}

.main {
  position: relative;
  width: 100%;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.main2 {
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  background: #00000085;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5100;
}
.main2 p,
.main2 h2 {
  font-weight: normal;
  color: rgb(255, 255, 255);
  text-shadow: 4px 4px 4px #000000;
}
.transaction {
  box-sizing: border-box;
  width: 33.3%;
  display: flex;
  flex-wrap: wrap;
  background-color: #cccccc;
  max-height: 100%;
  align-content: flex-start;
  display: flex;
  flex-wrap: flex;
  justify-content: center;
  min-width: 300px;
  min-height: 580px;
}
.allTrans,
.showGraf {
  font-size: initial;
  background-color: #bebebe79;
}
.showGraf {
  font-size: 0.9;
  box-sizing: border-box;
  width: 33.3%;
  display: flex;
  flex-wrap: wrap;
  max-height: 48%;
  min-width: 300px;
  justify-content: center;
  padding-top: 2%;
}

.pickOut {
  box-sizing: border-box;
  font-size: 1.4em;
  line-height: 1.23;
  width: 50%;
  padding: 10px;
  height: 50px;
  background: #cccccc;
  /* border:1px solid rgba(92, 86, 74, 0.527); */
}
.pickOut2 {
  background: rgb(234, 236, 236);
}
i:hover,
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
  box-sizing: border-box;
  background: rgb(234, 236, 236);
  color: rgb(85, 81, 81) !important;
}
.inputWrite {
  padding: 1.5% 1%;
  margin-bottom: 2%;
  width: 60% !important;
  background-color: rgb(255, 255, 255);
  border-color: rgb(196, 188, 188);
  font-family: "Oswald", sans-serif !important; 
  font-size: initial;
  box-shadow: 0px 1px 1px 1px #888888;
}
select.inputWrite {
  width: 62.5% !important;
  border: inset 2px rgb(196, 188, 188);
}
.option:hover {
  cursor: pointer;
}

input:focus {
  background-color: rgb(234, 236, 236);
  border-color: transparent;
  border: solid 2px rgb(8, 8, 8) !important;
}

input[type="button"] {
  transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
  transition: box-shadow, transform, color;
  transition-duration: 0.2s, 0.2s, 0.2s;
  transition-timing-function: ease, ease, ease;
  transition-delay: 0s, 0s, 0s;

  font-size: 1.3em;
  /*  width: 42.5%; */
  /* width: 62.5% !important; */
  width: 63% !important;
  /* border: inset 2px rgb(77, 74, 74) !important; */
  border: none;
  outline: none;
  cursor: pointer;
  padding: initial;

  box-shadow: 1px 3px 0 0 rgba(24, 68, 75, 0.616),
    0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
    0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  background-image: linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0.5),
    rgb(78, 75, 75)
  );
  color: #e6eaef;
}
input[type="button"]:focus {
  border: none !important;
}
input[type="button"]:hover {
  text-shadow: 0.8px 0.8px 0.8px #000000;
  box-shadow: 1px 3px 0 0 #126875, 0 7px 5px -1px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
input[type="button"]:active {
  text-shadow: 0.3px 0.3px 0.3px #000000;
  box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
    0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
    0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  transition: 0s;
  color: rgba(18, 104, 117, 0.616);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
}
.main {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.transaction2 {
  font-size: 1.3em;
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
  padding: 0;
  z-index: 5;
}

.showTransaction {
  box-sizing: border-box;
  padding-bottom: 25px;
  margin: 20px 9px;
  max-width: 100%;
  font-size: 1.1em;
}
table {
  box-sizing: border-box;
  min-width: 100%;
  border-collapse: collapse;
}
.tr {
  border-top: solid 1px rgb(113, 113, 116, 0.459) !important;
  border-bottom: solid 1px rgba(113, 113, 116, 0.459) !important;
}

td,
th {
  padding: 6px;
  max-width: 100px;
  min-width: 60px;
  border-right: solid 1px rgba(113, 113, 116, 0.2);
  border-left: solid 1px rgba(113, 113, 116, 0.2);
}
th {
  background-color: #17a2b8;

  max-height: 50px;
  /*  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; */
  /* letter-spacing:0.5px; */
}

h1 {
  font-weight: normal;
  margin: 0 auto;
  padding: 1% 0 0 0;
  max-width: fit-content;
}
h1 .orange {
  word-spacing: 20px;
}

.nameBill p {
  display: inline-block;
  font-size: 2em;
  margin-right: 2.5%;
  border-bottom: double black;
}

@keyframes opacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.6;
  }
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
  top: 2%;
  left: 25%;
  background: #fff;
  width: 50%;

  z-index: 1000200;
  padding: 0 1% 3% 1%;
}
.exit {
  text-align: right;
  cursor: pointer;
  padding-left: 14%;
}
.exit :hover {
  font-size: 1.1em;
  text-shadow: 1.5px 1.5px 1.5px #000000;
}
.err {
  font-weight: normal;
  color: #e80000;
  text-shadow: -0.5px 0 black, 0 0.5px black, 0.5px 0 black, 0 -0.5px black;
}
.mess {
  font-weight: normal;
  color: #1db802;
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
i :hover {
  font-size: 1.1em;
  cursor: pointer;
}
</style>
