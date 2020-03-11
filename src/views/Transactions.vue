<template>
  <div class="transactions">
    <!-- Leva strana -->
    <div class="aside">
      <p>Pretraga</p>
      <span>Od datuma</span>
      <input type="text" readonly v-model = "fromDate"> 
        <i class="far fa-calendar-alt" @click = "showCalendarFunc('from')"></i>
        <br>
      <span>Do datuma</span>
      <input type="text" readonly v-model = "toDate">
        <i class="far fa-calendar-alt" @click = "showCalendarFunc('to')"></i>
        <br>
      <!-- Kalendar -->
      <div class="calendar-wrapper" v-if="showingCalendar">
        <calendar
          @selectDate = 'setDate'
          @showCallEmit = "showingCalendar = false"
        />
      </div>
    </div>

    <!-- Desna strana -->
    <div class="main">
      <!-- Racuni -->
      <div :class="{accounts}">
        <div class = "each-account-placeholder" :class = "{selected: showingAccPlaceholder}" @click = "accountPlaceholder"><p>Pregled sa svih racuna</p></div>
        <div v-for="account in accounts" class = "each-account"
          :class = "{selected: account.selected}"
          :key = "account.acc_id"
          @click = "getTransactionsByAccount(account.acc_name)"
        >
            <p>{{account.acc_name}}</p>
        </div>
      </div>
      <!-- Tabela -->
      <table class="main-table" v-if = "transactions.length>0">
        <tr>
          <input type="checkbox" :value = "transactions">
          <th @click = "transactionSortBy('tra_date')">Datum <div :class = "sortOrder ? 'arrow-down': 'arrow-up'"></div></th>
          <th @click = "transactionSortBy('acc_name')">Naziv Racuna <div :class = "sortOrder ? 'arrow-down': 'arrow-up'"></div></th>
          <th @click = "transactionSortBy('tra_type_name')">Tip transakcije <div :class = "sortOrder ? 'arrow-down': 'arrow-up'"></div></th>
          <th @click = "transactionSortBy('tra_amount')">Iznos <div :class = "sortOrder ? 'arrow-down': 'arrow-up'"></div></th>
          <th @click = "transactionSortBy('cat_name')">Kategorija <div :class = "sortOrder ? 'arrow-down': 'arrow-up'"></div></th>
          <th @click = "transactionSortBy('tra_description')">Opis <div :class = "sortOrder ? 'arrow-down': 'arrow-up'"></div></th>
        </tr>
        <tr class="" v-for = "tr in transactions" :key = "tr.tra_id">
          <input type="checkbox" :value = "tr.tra_id" v-model="selected">
          <td>{{tr.tra_date}}</td>
          <td>{{tr.acc_name}}</td>
          <td>{{tr.tra_type_name}}</td>
          <td>{{tr.tra_amount + " " + tr.acc_type_name}}</td>
          <td>{{tr.cat_name}}</td>
          <td>{{tr.tra_description}}</td>
        </tr>
      </table>
      <p v-else>Nema transakcija za prikaz</p>
    </div>
  </div>
</template>

<script>
import Callendar from '../components/Callendar.vue';
import axios from 'axios';
import moment from  'moment';
export default {
  data(){
    return{
      showingAccPlaceholder: true,
      showingCalendar: false,
      accounts: [],
      allTransactions: [],
      transactions: [],
      selected: '',
      fromDate: '',
      toDate: '',
      targetInput: null,
      sortOrder: false
    }
  },
  components : {
    'calendar': Callendar
  },
  methods: {
    getTransactions(){
      axios.post("http://053n122.mars-e1.mars-hosting.com/api/wallet/transactionViewsAll", {sid: localStorage.getItem('sid')})
      .then(r=>{
        this.transactions = r.data.transaction;
        
        for(let i = 0; i<this.transactions.length; i++){
          if (this.transactions[i].cat_name === null){
            this.transactions[i].cat_name = '/';
          }
        }

        this.allTransactions =  this.transactions;
      })
    },
    getTransactionsByAccount(acc_name){
      this.transactions = this.allTransactions;

      let filteredTransactions = this.transactions.filter(function(tran){
          return tran.acc_name === acc_name;
      })

      this.transactions = filteredTransactions;

      //apply selected
      for(let i = 0; i<this.accounts.length; i++){
        if(this.accounts[i].acc_name === acc_name){
          this.accounts[i].selected = true;
        }else{
          this.accounts[i].selected = false;
        }
      }
      this.showingAccPlaceholder = false;
    },
    getAccounts(){
      axios.post("http://053n122.mars-e1.mars-hosting.com/api/get/getAccounts/all", {sid: localStorage.getItem('sid')})
      .then(r=>{
        this.accounts = r.data.data;
        for(let i = 0; i<this.accounts.length; i++){
          this.accounts[i].selected = false;
        }
        
      })
    },
    getTransactionsByDate(){
      if (this.fromDate !== "" && this.toDate !== ""){
        this.transactions = this.allTransactions;

        let localFrom = this.fromDate;
        let localTo = this.toDate;
        let filteredTransactions = this.transactions.filter(function(tran){
          return moment(tran.tra_date) >= moment(localFrom) && moment(tran.tra_date) <= moment(localTo);
        })
        

        this.transactions = filteredTransactions;
      }
    },
    transactionSortBy(property){
      if (this.transactions !== []) {
          if(this.sortOrder){
              this.transactions.sort((a, b) => (a[property] > b[property]) ? 1 : -1);
          }else if(!this.sortOrder){
              this.transactions.sort((a, b) => (a[property] > b[property]) ? -1 : 1);
          }
      }
      this.sortOrder = !this.sortOrder; 
    },
    showCalendarFunc(x){
      this.showingCalendar = true;
      this.targetInput = x;
    },
    setDate(date){
      let dateParts = date.split("-");
        if (dateParts[2].length === 1){
            dateParts[2] = "0" + dateParts[2];
        }
        date = dateParts.join("-");

      if (this.targetInput === 'from'){
        this.fromDate = date;
      }else if(this.targetInput === 'to'){
        this.toDate = date;
      }

      this.showingCalendar = false;

      this.getTransactionsByDate();
    },
    accountPlaceholder(){
      this.transactions = this.allTransactions;
      this.showingAccPlaceholder = true;
      for(let i = 0; i<this.accounts.length; i++){
        this.accounts[i].selected = false;
      }
    }
  },
  // computed: {
  //   selectAll: {
  //     get: {

  //     }
  //   }
  // },
  mounted(){
    this.getAccounts();
    this.getTransactions();
  }
}
</script>

<style scoped>
.transactions{
  display:flex;
  margin: 50px auto;
  font-weight: 600;
}
.aside{
  width:17%;
}
.main{
  width:83%;
  display:flex;
  flex-direction: column;
}
.arrow-down{
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid white;
}
.arrow-up{
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid white;
}
.main-table th{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 130px;
  background-color: #17A2B8;
  color: white;
  border: 1px solid gray;
  padding: 3px;
}
.main-table td{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 130px;
  color: #17A2B8;
  border: 1px solid gray;
  padding: 3px;
}
.main-table th:hover{
  cursor: pointer;
}
.main-table tr{
  display: flex;
  flex-direction: row;
}
/* .main-table {
  border-collapse: collapse;
} */
.calendar-wrapper{
  position: absolute;
  top: 140px;
  left: 270px;
  z-index:1;
  background-color: aqua;
}
.accounts{
  display:flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.each-account.selected{
  background-color: #17A2B8;
  color: white;
  border: 1px solid gray;
  width: 8%;
  margin: 5px;
}
.each-account{
  color: #17A2B8;
  border: 1px solid gray;
  width: 8%;
  margin: 5px;
  text-align: center;
}
.each-account:hover{
  cursor: pointer;
}
.each-account-placeholder{
  color: #17A2B8;
  border: 1px solid gray;
  margin: 5px;
  margin-right: 30px;
  text-align: center;
}
.each-account-placeholder.selected{
  background-color: #17A2B8;;
  color: white;
  border: 1px solid gray;
  margin: 5px;
  margin-right: 30px;
}
.each-account-placeholder{
  cursor: pointer;
}
</style>