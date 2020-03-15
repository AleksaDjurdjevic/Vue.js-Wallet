<template>
  <div class="transactions">
    <!-- Left side -->
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
      <!-- Calendar -->
      <div class="calendar-wrapper" v-if="showingCalendar">
        <calendar
          @selectDate = 'setDate'
          @showCallEmit = "showingCalendar = false"
        />
      </div>
    </div>

    <!-- Right side -->
    <div class="main">
      <!-- Accounts -->
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
      <!-- Table -->
      <div class="main-table" v-if = "transactions.length>0">
        <!-- First row -->
        <div class="row-first">
          <div class= "cell-first" @click = "transactionSortBy('tra_date')"><div>Datum</div> <div :class = "sortOrder ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('acc_name')"><div>Naziv Racuna</div> <div :class = "sortOrder ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('tra_type_name')"><div>Tip transakcije</div> <div :class = "sortOrder ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('tra_amount')"><div>Iznos</div> <div :class = "sortOrder ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('cat_name')"><div>Kategorija</div> <div :class = "sortOrder ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('tra_description')"><div>Opis</div> <div :class = "sortOrder ? 'arrow-up': 'arrow-down'"></div></div>
        </div>
        <!-- Data -->
        <div class="table-data">
          <div class="row-other" v-for = "tr in transactions" :key = "tr.tra_id">
            <div class= "cell">{{tr.tra_date}}</div>
            <div class= "cell">{{tr.acc_name}}</div>
            <div class= "cell">{{tr.tra_type_name}}</div>
            <div class= "cell">{{tr.tra_amount + " " + tr.acc_type_name}}</div>
            <div class= "cell">{{tr.cat_name}}</div>
            <div class= "cell">{{tr.tra_description}}</div>
          </div>
        </div>
        <!-- Pagination -->
        <div class="pagination-wrap">
          <div class="first-page-btn"></div>
          <div class="previous-page-btn"></div>
        </div>
      </div>
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
      currentPage: 1,
      numOfPages: 1,
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
      axios.post("http://053n122.mars-e1.mars-hosting.com/api/get/getAllTransactionsAndSortPaging", {
        sid: localStorage.getItem('sid'),
        page: this.currentPage
      })
      .then(r=>{
        this.transactions = r.data.transaction;
        this.allTransactions = r.data.transaction;
        this.numOfPages = Math.ceil(r.data.pages / 5);

        for(let i = 0; i<this.transactions.length; i++){
          if (this.transactions[i].cat_name === null){
            this.transactions[i].cat_name = '/';
          }
        }
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
    // transactionSortBy(property){
      
    // },
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
  mounted(){
    this.getAccounts();
    this.getTransactions();
  }
}
</script>

<style scoped>
@keyframes color-change-blue-shade {
  0% {background-color: #17A8B9;}
  100% {background-color: rgb(148, 222, 233);}
}
@keyframes color-change-white-gray {
  0% {background-color: white;}
  100% {background-color: rgb(196, 188, 188);}
}
@keyframes color-change-row {
  0% {background-color: rgb(234, 236, 236);}
  100% {background-color: rgb(196, 188, 188);}
}

.transactions{
  display:flex;
  margin: 50px auto;
  font-weight: 600;
}
.aside{
  width:14%;
  margin-left: 3%;
}
.main{
  width:80%;
  margin-right: 3%;
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
.main-table {
  overflow: hidden;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 700px;
  background-color: rgb(234, 236, 236);
}
.row-other{
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: rgb(234, 236, 236);
}
.row-first{
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #17A2B8 !important;
  height: 8%;
}
.pagination-wrap{
  width: 100%;
  height: 8%;
  background-color: black;
}
.table-data{
  height: 84%;
}
.row-other:hover{
  animation-name: color-change-row;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
}
.cell, .cell-first{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  border-bottom:1px solid gray;
}
.cell-first:hover{
  cursor: pointer;
  animation-name: color-change-blue-shade;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
}
.row-first .cell:hover{
  cursor: pointer;
}
.calendar-wrapper{
  position: absolute;
  top: 140px;
  left: 270px;
  z-index:1;
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
.each-account.selected:hover{
  animation-name: color-change-blue-shade;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
}
.each-account{
  border: 1px solid gray;
  width: 8%;
  margin: 5px;
  text-align: center;
}
.each-account:hover{
  cursor: pointer;
  animation-name: color-change-white-gray;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
}
.each-account-placeholder{
  border: 1px solid gray;
  margin: 5px;
  margin-right: 30px;
  text-align: center;
}
.each-account-placeholder.selected{
  background-color: #17A2B8;
  color: white;
  border: 1px solid gray;
  margin: 5px;
  margin-right: 30px;
}
.each-account-placeholder:hover{
  cursor: pointer;
  animation-name: color-change-white-gray;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
}
.each-account-placeholder.selected:hover{
  animation-name: color-change-blue-shade;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
}
.far.fa-calendar-alt{
  cursor: pointer;
}
</style>