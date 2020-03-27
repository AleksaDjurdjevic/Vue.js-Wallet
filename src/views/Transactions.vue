<template>
  <div class="transactions">
    <!-- Left side -->
    <div class="aside">
      <!-- Accounts -->
      <p class = "heading">Kliknite na račun kako biste filtrirali transakcije po računu</p>
      <div class="accounts">
        <div class = "each-account-placeholder" :class = "{selected: showingAccPlaceholder}" @click = "accountPlaceholder"><p>Pregled sa svih računa</p></div>
        <div v-for="account in accounts" class = "each-account"
          :class = "{selected: account.selected}"
          :key = "account.acc_id"
          @click = "getTransactionsByAccount(account.acc_name)"
        >
          <p>{{account.acc_name}}</p>
        </div>
      </div>
    </div>

    <!-- Right side -->
    <div class="main">
      <div class="search-date">
        <div class="each-search-date">
          <span>Od datuma</span>
          <div class="input-calendar">
            <input type="text" readonly v-model = "fromDate">
            <i class="far fa-calendar-alt fa-2x" @click = "showCalendarFunc('from')"></i>
          </div>
        </div>
        <div class="each-search-date">
          <span>Do datuma</span>
          <div class="input-calendar">
            <input type="text" readonly v-model = "toDate">
            <i class="far fa-calendar-alt fa-2x" @click = "showCalendarFunc('to')"></i>
          </div>
        </div>
      </div>
      <!-- Table -->
      <div class="main-table">
        <!-- Calendar -->
        <div class="calendar-wrapper" v-if="showingCalendar">
          <calendar
            @selectDate = 'setDate'
            @showCallEmit = "showingCalendar = false"
          />
          <button @click = "clearDate">Obrišite unet datum</button>
        </div>
        <!-- First row -->
        <div class="row-first">
          <div class= "cell-first" @click = "transactionSortBy('tra_date')"><div>Datum</div> <div :class = "orderBy == 'ASC' ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('ac.acc_name')"><div>Naziv Računa</div> <div :class = "orderBy == 'ASC' ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('tra_type_name')"><div>Tip transakcije</div> <div :class = "orderBy == 'ASC' ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('tra_amount')"><div>Iznos</div> <div :class = "orderBy == 'ASC' ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('cat_name')"><div>Kategorija</div> <div :class = "orderBy == 'ASC' ? 'arrow-up': 'arrow-down'"></div></div>
          <div class= "cell-first" @click = "transactionSortBy('tra_description')"><div>Opis</div> <div :class = "orderBy == 'ASC' ? 'arrow-up': 'arrow-down'"></div></div>
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
        <div class = "table-shade" v-if = "showingTableShade"></div>
        <p class = "table-shade-p" v-if = "showingTableShade">Nemate transakcije za prikaz</p>
        <!-- Pagination -->
        <div class="pagination-wrap" v-if = "allPagesArray.length > 1">
          <div class="pages-dynamic">
            <button class="page-btn" @click= "setPage(allPagesArray[0])">Prva strana</button>
            <button class="page-btn" @click= "setPage(validateDisplayingPages('previous', allPagesArray[currentPage-2]))">Prethodna strana</button>
          </div>

          <div class="pages-dynamic">
            <button v-for = "page in displayingPages" :key="page.page" @click= "setPage(page)" :class = "{selected: page.selected}">
              {{page.page}}
            </button>
          </div>

          <div class="pages-dynamic">
            <button class="page-btn" @click= "setPage(validateDisplayingPages('next', allPagesArray[currentPage]))">Sledeća strana</button>
            <button class="page-btn" @click= "setPage(allPagesArray[allPagesArray.length-1])">Poslednja strana</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Callendar from '../components/Callendar.vue';
import axios from 'axios';
import {mapState, mapActions} from 'vuex';
export default {
  data(){
    return{
      showingAccPlaceholder: true,
      showingCalendar: false,
      accounts: [],
      transactions: [],
      currentPage: 1,
      numOfPages: 1,
      allPagesArray: [],
      displayingPages: [],
      fromDate: null,
      toDate: null,
      targetInput: null,
      sortBy: 'tra_date',
      orderBy: 'ASC',
      acc_name: null,
      showingTableShade: false
    }
  },
  components : {
    'calendar': Callendar
  },
  computed: {
      ...mapState(['isLoggedIn'])
  },
  methods: {
    getTransactions(){
      axios.post("http://053n122.mars-e1.mars-hosting.com/api/get/getAllTransactionsAndSortPaging", {
        sid: localStorage.getItem('sid'),
        page: this.currentPage,
        sortBy: this.sortBy,
        orderBy: this.orderBy,
        accName: this.acc_name,
        fromDate: this.fromDate,
        toDate: this.toDate 
      })
      .then(r=>{
        //Check for empty result set, if its empty - apply table shade
        if (r.data.transaction.length === 0){
          this.showingTableShade = true;
        }else{
          //If shade is previously applied, remove it
          if(this.showingTableShade){
            this.showingTableShade = false;
          }

          this.transactions = r.data.transaction;
          this.numOfPages = Math.ceil(r.data.pages / 20);
          this.allPagesArray = [];
          this.displayingPages = [];

          //Get all pages
          for(let i = 1; i<=this.numOfPages; i++){
            //Page one will be selected
              if(i === 1){
                let pageObj = {
                  page: i,
                  selected: true
                };
                 this.allPagesArray.push(pageObj);
              }else{
                let pageObj = {
                  page: i,
                  selected: false
                };
                this.allPagesArray.push(pageObj);
              }
          }
          
          //Set pages to display
          if (this.numOfPages > 5){
            for(let i = 1; i<=5; i++){
              //Page one will be selected
              if(i === 1){
                let pageObj = {
                  page: i,
                  selected: true
                };
                this.displayingPages.push(pageObj);
              }else{
                let pageObj = {
                  page: i,
                  selected: false
                };
                this.displayingPages.push(pageObj);
              }  
            }
          }else{
            for(let i = 1; i<=this.numOfPages; i++){
              //Page one will be selected
              if(i === 1){
                let pageObj = {
                  page: i,
                  selected: true
                };
                this.displayingPages.push(pageObj);
              }else{
                let pageObj = {
                  page: i,
                  selected: false
                };
                this.displayingPages.push(pageObj);
              }  
            }
          } 
        }
      }).catch(()=>{
        localStorage.clear();
      });
    },
    getTransactionsByAccount(acc_name){
      if(this.acc_name !== acc_name){
        this.acc_name = acc_name;
        this.currentPage = 1;
        this.getTransactions();
        //apply selected
        for(let i = 0; i<this.accounts.length; i++){
          if(this.accounts[i].acc_name === acc_name){
            this.accounts[i].selected = true;
          }else{
            this.accounts[i].selected = false;
          }
        }
        this.showingAccPlaceholder = false;
      }
    },
    getAccounts(){
      axios.post("http://053n122.mars-e1.mars-hosting.com/api/get/getAccounts/all", {sid: localStorage.getItem('sid')})
      .then(r=>{
        this.accounts = r.data.data;
        for(let i = 0; i<this.accounts.length; i++){
          this.accounts[i].selected = false;
        }
      }).catch(()=>{
        localStorage.clear();
      });
    },
    getTransactionsByDate(){
      if (this.fromDate !== null && this.toDate !== null){
        this.getTransactions();
      }
    },
    transactionSortBy(property){
      if(this.sortBy === property){
        if(this.orderBy === 'ASC'){
          this.orderBy = 'DESC'
        }else{
          this.orderBy = 'ASC'
        }
      }else{
        this.sortBy = property;
      }

      axios.post("http://053n122.mars-e1.mars-hosting.com/api/get/getAllTransactionsAndSortPaging", {
        sid: localStorage.getItem('sid'),
        page: this.currentPage,
        sortBy: property,
        orderBy: this.orderBy,
        accName: this.acc_name,
        fromDate: this.fromDate,
        toDate: this.toDate 
      }).then(r=>{
        this.transactions = r.data.transaction;
      }).catch(()=>{
        localStorage.clear();
      })
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
    clearDate(){
      if (this.targetInput === 'from'){
        this.fromDate = null;
      }else if(this.targetInput === 'to'){
        this.toDate = null;
      }

      this.showingCalendar = false;
      if(this.fromDate === null ^ this.toDate === null){
        this.getTransactions();
      }
    },
    accountPlaceholder(){
      //Applying classes
      this.showingAccPlaceholder = true;
      for(let i = 0; i<this.accounts.length; i++){
        this.accounts[i].selected = false;
      }
      //Validation to prevent displaying the same results
      if(this.acc_name !== null){
        this.acc_name = null;
        this.currentPage = 1;
        this.getTransactions();
      }
    },
    validateDisplayingPages(direction, obj){
      if(obj === undefined){
        if(direction === 'next'){
          return this.allPagesArray[this.allPagesArray.length-1];
        }else if (direction === 'previous'){
          return this.allPagesArray[0];
        }
      }else{
        return obj;
      }
    },
    setPage(page){
      //Validation for "next" and "previous" page buttons
      if(page.page<1){
        page.page=1;
      }else if (page.page>this.allPagesArray.length){
        page.page = this.allPagesArray.length;
      }
      //If page is changed
      if(page.page !== this.currentPage){
        //Fetching data
        axios.post("http://053n122.mars-e1.mars-hosting.com/api/get/getAllTransactionsAndSortPaging", {
          sid: localStorage.getItem('sid'),
          page: page.page,
          sortBy: this.sortBy,
          orderBy: this.orderBy,
          accName: this.acc_name 
        }).then(r=>{
          this.transactions = r.data.transaction;

          //Apply "selected" to page number in pageNav bar, and remove selected from other
          for(let i = 0; i < this.displayingPages.length; i++){
            if(this.displayingPages[i].page === page.page){
              this.displayingPages[i].selected = true;
            }else{
              this.displayingPages[i].selected = false;
            }
          }
        }).catch(()=>{
          localStorage.clear();
        });
      }

      //This part is for rendering the pages navigation bar
      let localallPagesArray = this.allPagesArray; //keyword "this" in filter method doesnt refer to vue properties.
      
      this.displayingPages = this.allPagesArray.filter(function(oldPage){
        //if the page clicked is the last page
        if (page.page === localallPagesArray[localallPagesArray.length-1].page){
          return oldPage.page == page.page-4 || oldPage.page == page.page-3 || oldPage.page == page.page-2|| oldPage.page == page.page-1 || oldPage.page == page.page;
        //if the page clicked is one before the last
        }else if (page.page === localallPagesArray[localallPagesArray.length-2].page){
          return oldPage.page == page.page-3 || oldPage.page == page.page-2 || oldPage.page == page.page-1|| oldPage.page == page.page || oldPage.page == page.page+1;
        //if its second page
        }else if (page.page === localallPagesArray[1].page){
          return oldPage.page == page.page-1 || oldPage.page == page.page || oldPage.page == page.page+1|| oldPage.page == page.page+2 || oldPage.page == page.page+3;
        //If its first page
        }else if (page.page === localallPagesArray[0].page){
          return oldPage.page == page.page || oldPage.page == page.page+1 || oldPage.page == page.page+2|| oldPage.page == page.page+3 || oldPage.page == page.page+4;
        //In any other case
        }else{
          return oldPage.page == page.page-2 || oldPage.page == page.page-1 || oldPage.page == page.page || oldPage.page == page.page+1 || oldPage.page == page.page+2
        }
      })
      
      this.currentPage = page.page;
    },
    ...mapActions(['changeIsLoggedIn']),
     getState() {
      axios
        .get(
          "http://053n122.mars-e1.mars-hosting.com/api/wallet/checkSession",
          {
            params:{sid: localStorage.getItem("sid")}
          }
        )
        .then(() => {
          this.changeIsLoggedIn(true);
        }).catch(()=>{
          this.$router.push('/home');
        });
    }
  },
  mounted(){
      this.getState();
      this.getAccounts();
      this.getTransactions();
  }
}
</script>

<style scoped>
@keyframes color-change-blue-shade {
  0% {background-color: #17a2b8;}
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
@keyframes opacity {
  0% {opacity: 0;}
  100% {opacity: 0.9}
}
/* Main parts */
.transactions{
  display:flex;
  margin: 20px auto;
  min-height: 90vh;
  font-size: 0.87em;
}
.aside{
  width:14%;
  margin-left: 2%;
}
.main{
  width:80%;
  margin-right: 3%;
  display:flex;
  flex-direction: column;
}
button::-moz-focus-inner {
  border: 0;
}
button{
  border-radius: 13px;
  background-color: white;
  border: none;
  font-family: "Teko";
  font-size: 1em;
}
button:hover{
  cursor: pointer;
}
/* Inputs for date filter */
.search-date{
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.each-search-date{
  margin: 5px 15px;
}
.each-search-date span{
  display: flex;
  justify-content: center;
  position: relative;
  right: 9%;
}
.input-calendar{
  display: flex;
  align-content: center;
}
.input-calendar input {
  margin-right: 8px;
}
.far.fa-calendar-alt{
  cursor: pointer;
  position: relative;
  bottom: 2px;
}
/* Arrows on table */
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
/* Table */
.main-table {
  position: relative;
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
  background-color: #17a2b8 !important;
  height: 7%;
}
.table-data{
  height: 86%;
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
.table-shade{
  width: 100%;
  height: 700px;
  z-index: 100;
  background-color: rgb(196, 188, 188);
  position: absolute;
  opacity: 0;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation-name: opacity;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
}
.table-shade-p {
  font-size: 1.5em;
  font-weight: 600;
  width: 100%;
  height: 700px;
  z-index: 101;
  position: absolute;
  display: flex;
  justify-content: center;
  top: 200px;
}
/* Pagination */
.pagination-wrap{
  width: 100%;
  height: 7%;
  display:flex;
  justify-content: space-evenly;
}
.pages-dynamic{
  display: flex;
}
.pagination-wrap button.selected{
  background-color:#17A2B8;
  color: white;
}
/* Calendar */
.calendar-wrapper{
  position: absolute;
  top: 0%;
  left: 40%;
  z-index:105;
}
/* Accounts */
.aside .heading{
  opacity: 0.6;
  margin: 0;
}
.accounts{
  margin-top: 19px;
  display:flex;
  flex-direction: column;
}
.each-account.selected{
  background-color: #17A2B8;
  color: white;
  border: 1px solid gray;
  width: 90%;
  margin-right: 10%;
  margin-top: 1%;
}
.each-account.selected:hover{
  animation-name: color-change-blue-shade;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
}
.each-account{
  height: 80px;
  display:flex;
  justify-content: center;
  align-items: center;
  border: 1px solid gray;
  width: 90%;
  margin-right: 10%;
  margin-top: 1%;
}
.each-account p, .each-account-placeholder p {
  margin: 0;
}
.each-account:hover{
  cursor: pointer;
  animation-name: color-change-white-gray;
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
}
.each-account-placeholder{
  height: 80px;
  display:flex;
  justify-content: center;
  align-items: center;
  border: 1px solid gray;
  width: 90%;
  margin-right: 10%;
  margin-top: 1%;
  text-align: center;
}
.each-account-placeholder.selected{
  background-color: #17A2B8;
  color: white;
  border: 1px solid gray;
  width: 90%;
  margin-right: 10%;
  margin-top: 1%;
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
.reg-notice{
    position:fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 102;
    color: white;
    font-size: 3em;
}
.payment-processing-logged{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.685);
    opacity: 0.9;
    z-index: 10;
    animation-name: opacity;
    animation-duration: 0.6s;
    display: flex;
    justify-content: center;
    align-content: center;
}
</style>