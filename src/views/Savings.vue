<template>
    <div class="savings-wrapper">
        <!-- div of whole component -->
        <!-- Left side -->
        <div class="aside">
            
            <!-- Sort -->
            <div class="sorting">
                <button @click = "addingSaving = true">Dodaj štednju</button>

                <p>Sortiraj po:</p>

                <div class="option-wrap">
                    <input type="radio" id="sort0" value = 'sav_start' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                    <label for="sort0">Datumu kreiranja</label>
                </div>
                <div class="option-wrap">
                    <input type="radio" id="sort1" value = 'sav_amount' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                    <label for="sort1">Cilju</label>
                </div>
                <div class="option-wrap">
                    <input type="radio" id="sort2" value = 'sav_amount_accumulated' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                    <label for="sort2">Uplaćenom iznosu</label>
                </div>
                <div class="option-wrap">
                    <input type="radio" id="sort3" value = 'sav_period' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                    <label for="sort3">Periodu</label>
                </div>
                <div class="option-wrap">
                    <input type="radio" id="sort4" value = 'leftover_amount' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                    <label for="sort4">Preostalom iznosu</label>
                </div>
                <div class="option-wrap">
                    <input type="radio" id="sort5" value = 'number_of_payments' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                    <label for="sort5">Uplatama</label>
                </div>
                <div class="option-wrap">
                    <input type="radio" id="sort6" value = 'sav_month_rate' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                    <label for="sort6">Mesečnoj rati</label>
                </div>

                <div class="sort-order">
                    <input type="radio" id="asc" value = "asc" v-model="sortOrder" @change = "savingSort('asc')">
                    <label for="asc">Rastuće</label>
                    <br>
                    <input type="radio" id="desc" value = "desc" v-model="sortOrder" @change = "savingSort('desc')">
                    <label for="desc">Padajuće</label>
                </div>
            </div>
        </div>
        <!-- Right side -->
        <div class="main" :key="keyChange">
            <!-- Wrapper for all savings -->
            <div class="all-savings"  v-for = "(saving, index) in savings" :key = 'saving.sav_description'>
                <div class="each-saving-white">
                    <p :class = "{hover: saving.hover}" @mouseover="displaySavingFullName(index, true)" @mouseleave="displaySavingFullName(index, false)">{{setProperSavingsNameLength(saving.sav_description, saving.hover)}}</p>
                </div>
                <div :class="'each-saving' + setClassForSavings(index)">
                    <div class="saving-status"><p>Status: <span :class="saving.sav_status">{{saving.sav_status}}</span></p></div>
                    <!-- Dashboard -->
                    <!-- V-if -->
                    <div class="data" v-if = "saving.sav_status === 'U toku'">
                        <div class="data-row">
                            <p class='p-details'>Cilj: <span>{{saving.sav_amount + " " + saving.acc_type_name}}</span></p>
                        </div>
                        <div class="data-row">
                            <p v-if = "saving.sav_month_rate - saving.payments_for_this_month>0" class='month-rate'>
                                <span class = "month-rate-first">Mesečna rata: {{saving.sav_month_rate + " " + saving.acc_type_name}}</span>
                                <span class = "month-rate-second">Preostalo za uplatu rate: {{saving.sav_month_rate-saving.payments_for_this_month + " " + saving.acc_type_name}}</span>
                            </p>
                            <p v-else class='p-done'>Uplaćeno! <span><i class="far fa-check-circle fa-2x" style = "color:#03a100;"></i></span></p>
                        </div>
                    </div>
                    <!-- V-if -->
                    <div v-if = "saving.sav_status === 'Kompletirana'" class="saving-done">
                        <p>Čestitamo, štednja uspešna! <i class="fas fa-star fa-2x" style="color: yellow; margin-left: 10px;"></i></p>
                    </div>
                    <!-- V-if -->
                    <div v-if = "saving.sav_status === 'Istekla'" class="saving-done">
                        <p>Istekao je period za štednju<i class="fas fa-exclamation-triangle fa-2x" style = "color:#e80000;margin-left: 10px;"></i></p>
                    </div>

                    <!-- Buttons -->
                    <!-- V-if -->
                    <div class="buttons" v-if = "saving.sav_status === 'U toku'">
                        <button @click = "viewDetails(saving.sav_id)">Detalji</button>
                        <button @click = "viewPayments(saving.sav_id)">Pregled uplata</button>
                        <button @click = "preparePayment(saving.sav_id)">Uplati</button>
                        <button @click = "deleteSavings(saving.sav_id)">Obriši štednju</button>
                    </div>
                    <!-- V-if -->
                    <div class="buttons" v-if = "saving.sav_status === 'Kompletirana'">
                        <button @click = "viewDetails(saving.sav_id)">Detalji</button>
                        <button @click = "viewPayments(saving.sav_id)">Pregled uplata</button>
                        <button @click = "doneSaving(saving.sav_id)">Završi štednju</button>
                        <!-- <button @click = "endSaving(saving.sav_id)">Povuci sredstva</button> -->
                    </div>
                    <!-- V-if -->
                    <div class="buttons" v-if = "saving.sav_status === 'Istekla'">
                        <button @click = "viewDetails(saving.sav_id)">Detalji</button>
                        <button @click = "viewPayments(saving.sav_id)">Pregled uplata</button>
                        <button @click = "deleteSavings(saving.sav_id)">Obriši štednju</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Conditional components -->
        <!-- Shade div -->
        <div class="payment-processing" v-if ="makingPayment || addingSaving || deletingSaving || viewingPayments || viewingDetails || endingSaving" 
            @click =    "makingPayment = false; 
                        addingSaving = false; 
                        deletingSaving = false;
                        viewingPayments = false;
                        viewingDetails = false;
                        endingSaving = false;
                        error = '';">
        </div>
        <!-- Div for making a payment -->
        <savings-add-payment v-if ="makingPayment"
            :savings = "savings"
            :sav_id = "sav_id"
            @get-savings = "getSavings"
            @making-payment = "makingPayment = false"
        />

        <!-- Div for creating a saving -->
        <savings-add  v-if ="addingSaving"
            @get-savings = "getSavings"
            @adding-saving = "addingSaving = false"
        />

        <!-- Div for deleting a saving -->
        <savings-delete v-if ="deletingSaving"
            :sav_id = "sav_id"
            :savings = "savings"
            @get-savings = "getSavings"
            @deleting-saving = "deletingSaving = false"
        />
        <!-- Div for viewing saving details-->
        <savings-view-details v-if ="viewingDetails"
            :savings = "savings"
            :sav_id = "sav_id"
            @viewing-details = "viewingDetails = false"
        />

        <!-- Div for viewing payments -->
        <savings-view-payments v-if ="viewingPayments"
            :sav_id = "sav_id"
            @get-savings = "getSavings"
            @viewing-payments = "viewingPayments = false"
        />

        <!-- Div for ending payments -->
        <savings-end v-if ="endingSaving"
            :sav_id = "sav_id"
            :savings = "savings"
            @get-savings = "getSavings"
            @ending-saving = "endingSaving = false"
        />
    </div>
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex';
import SavingsAdd from '../components/SavingsAdd.vue';
import SavingsAddPayment from '../components/SavingsAddPayment.vue';
import SavingsDelete from '../components/SavingsDelete.vue';
import SavingsViewPayments from '../components/SavingsViewPayments.vue';
import SavingsViewDetails from '../components/SavingsViewDetails.vue';
import SavingsEnd from '../components/SavingsEnd.vue';
import moment from  'moment';
export default {
    data () {
        return {
            savings: [],
            makingPayment: false,
            deletingSaving: false,
            addingSaving: false,
            viewingPayments: false,
            viewingDetails: false,
            endingSaving: false,
            sav_id: '',
            error: '',
            property: 'sav_start',
            sortOrder: 'asc',
            keyChange: 0
        }
    },
    components: {
        "savings-add": SavingsAdd,
        "savings-add-payment": SavingsAddPayment,
        "savings-delete": SavingsDelete,
        "savings-view-payments": SavingsViewPayments,
        "savings-view-details": SavingsViewDetails,
        "savings-end": SavingsEnd
    },
    computed: {
        ...mapState(['isLoggedIn'])
    },
    methods: {
        savingSort(sort){
            this.sortOrder = sort;
            
            if (this.savings !== []) {
                if(this.sortOrder === 'asc'){
                    this.savings.sort((a, b) => (a[this.property] > b[this.property]) ? 1 : -1);
                }else if(this.sortOrder === 'desc'){
                    this.savings.sort((a, b) => (a[this.property] > b[this.property]) ? -1 : 1);
                }
            }    
        },
        getSavings(){
            console.log(moment('31.02.2019'));
            
            axios.post('http://053n122.mars-e1.mars-hosting.com/api/get/getSavings', {sid: localStorage.getItem('sid')})
            .then(r=>{
                if(r.data.all_savings !== undefined){
                    this.savings = r.data.all_savings;

                    for(let i=0; i<this.savings.length; i++){
                        //Get saving status
                        let currentDate = moment();
                        let endDate = moment(this.savings[i].sav_start).add(this.savings[i].sav_period, 'months');
                        
                        if(this.savings[i].sav_end){
                            this.savings[i].sav_status = 'Kompletirana'
                        }else if(currentDate > endDate){
                            this.savings[i].sav_status = 'Istekla';
                        }else{
                            this.savings[i].sav_status = 'U toku';  
                        }
                        
                        //Get payments for this month
                        let startParts =  this.savings[i].sav_start.split('-');
                        let firstDay = startParts[2];

                        if(currentDate.date() < parseInt(firstDay)){
                            let fromDate = currentDate.month().toString().length < 2? moment(`${startParts[0]}-0${currentDate.month().toString()}-${firstDay}`) : moment(`${startParts[0]}-${currentDate.month().toString()}-${firstDay}`)
                            let toDate = (currentDate.month()+1).toString().length < 2? moment(`${startParts[0]}-0${(currentDate.month()+1).toString()}-${firstDay}`) : moment(`${startParts[0]}-${(currentDate.month()+1).toString()}-${firstDay}`)

                            this.savings[i].payments_for_this_month = 0;

                            for(let j=0; j<this.savings[i].payments.length; j++){
                                if(moment(this.savings[i].payments[j].sav_pay_date) >= fromDate && moment(this.savings[i].payments[j].sav_pay_date) < toDate){
                                    this.savings[i].payments_for_this_month += this.savings[i].payments[j].sav_pay_amount;
                                }
                            }
                            
                        }else if (currentDate.date() >= parseInt(firstDay)){
                            let fromDate = (currentDate.month()+1).toString().length < 2? moment(`${startParts[0]}-0${(currentDate.month()+1).toString()}-${firstDay}`) : moment(`${startParts[0]}-${(currentDate.month()+1).toString()}-${firstDay}`)
                            let toDate = (currentDate.month()+2).toString().length < 2? moment(`${startParts[0]}-0${(currentDate.month()+2).toString()}-${firstDay}`) : moment(`${startParts[0]}-${(currentDate.month()+2).toString()}-${firstDay}`)

                            this.savings[i].payments_for_this_month = 0;

                            for(let j=0; j<this.savings[i].payments.length; j++){
                                if(moment(this.savings[i].payments[j].sav_pay_date) >= fromDate && moment(this.savings[i].payments[j].sav_pay_date) < toDate){
                                    this.savings[i].payments_for_this_month += this.savings[i].payments[j].sav_pay_amount;
                                }
                            }
                            
                        }

                        this.savings[i].sav_month_rate = this.calculateRate(this.savings[i].leftover_amount, this.savings[i].sav_start, this.savings[i].sav_period, this.savings[i].payments_for_this_month);
                        this.savings[i].sav_next_month_rate = this.calculateRate(this.savings[i].leftover_amount, this.savings[i].sav_start, this.savings[i].sav_period-1);
                        this.savings[i].hover = false;
                        this.savings[i].sav_months_in = this.getMonthsIn(this.savings[i].sav_start, this.savings[i].sav_period) + 1;
                    }
                }
            });
        },
        calculateRate(leftover_amount, start, period, month_payments){
            if(month_payments === undefined) month_payments = 0;

            let monthsIn = this.getMonthsIn(start, period);
            let leftoverMonths = period - monthsIn;
            return Math.ceil((leftover_amount+month_payments) / leftoverMonths);
        },
        getMonthsIn(start, period){
            let currentDate = new Date();
            let startParts = start.split('-');
            let currentDay = currentDate.getDate();

            let startMonth = parseInt(startParts[1]);
            
            let monthsIn = (currentDate.getMonth() + 1) - startMonth;

            if (monthsIn<0){
                monthsIn += 12 * Math.ceil(period/12);
            }

            currentDay<parseInt(startParts[2]) ?  monthsIn-- : monthsIn;
            
            return monthsIn;
        },
        preparePayment(sav_id){
            this.sav_id = sav_id;
            this.makingPayment = true;
        },
        deleteSavings(sav_id){
            this.sav_id = sav_id;
            this.deletingSaving = true; 
        },
        viewPayments(sav_id){
            this.sav_id = sav_id;
            this.viewingPayments = true;
        },
        viewDetails(sav_id){
            this.sav_id = sav_id;
            this.viewingDetails = true;
        },
        // endSaving(sav_id){
        //     this.sav_id = sav_id;
        //     this.endingSaving = true;
        // },
        setClassForSavings(i){
            let devider = Math.floor(i/4);
            return i-4*devider+1;
        },
        setProperSavingsNameLength(s, bool){
            if(bool){
                return s
            }else {
                if(s.length>30){
                    return s.substring(30, 0) + " ...";
                }else{
                    return s;
                }
            } 
        },
        displaySavingFullName(index, applying){
            if(this.savings[index].sav_description.length>30){
                if(applying) {
                    if(this.savings[index].hover !== true){
                        this.savings[index].hover = true;
                        this.keyChange++;
                    }
                }else if (!applying){
                    if(this.savings[index].hover !== false){
                        this.savings[index].hover = false;
                        this.keyChange++;
                    }
                }
            }
        },
        doneSaving(sav_id){
            axios.post('http://053n122.mars-e1.mars-hosting.com/api/wallet/doneSaving', {
                sav_id,
                sid: localStorage.getItem('sid'),
            }).then(()=>{
                this.getSavings();
            }); 
        }
    },
    mounted(){
        this.getSavings();
        this.$root.$emit('set-selected', 2);
    }
}
</script>

<style scoped>
p{
    margin: 0;
}
.all-savings{
    width: 95%;
    height: 190px;
    position: relative;
    margin-bottom: 1%;
}
.each-saving-white p{
    font-size: 1.8em;
    width: 20%;
    position: relative;
    top: 10%;
    left: 2%;
    height: 80%;
    display:flex;
    justify-content: center;
    align-items: center;
    word-break: break-all;
    /* overflow: auto; */
}
.each-saving-white .hover{
    font-size: 1.8em;
    width: 40%;
    position: relative;
    top: 10%;
    left: 2%;
    height: 80%;
    display:flex;
    justify-content: center;
    align-items: center;
    z-index: 60;
    background-color:white;
    border-radius: 20px;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-sizing: border-box;
    padding: 1%;
}
.each-saving-white .saving-fullname{
    font-size: 1.8em;
    width: 20%;
    position: relative;
    top: 10%;
    left: 2%;
    height: 80%;
    display:flex;
    justify-content: center;
    align-items: center;
    word-break: break-all;
    /* overflow: auto; */
}
.each-saving-white{
    width: 80%;
    height: 80%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: white;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.each-saving1{
    width: 80%;
    height: 80%;
    position: absolute;
    top: 0;
    right: 0;
    background: radial-gradient(100% 100% at 0% 0%, #82c4e3 100%, #67b7dc 100%) repeat 50% 50% / 100% 100%;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.each-saving2{
    width: 80%;
    height: 80%;
    position: absolute;
    top: 0;
    right: 0;
    background: radial-gradient(100% 100% at 0% 0%, #82a7e3 100%, #6794dc 100%) repeat 50% 50% / 100% 100%;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.each-saving3{
    width: 80%;
    height: 80%;
    position: absolute;
    top: 0;
    right: 0;
    background: radial-gradient(100% 100% at 0% 0%, #828ae3 100%, #6771dc 100%) repeat 50% 50% / 100% 100%;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.each-saving4{
    width: 80%;
    height: 80%;
    position: absolute;
    top: 0;
    right: 0;
    background: radial-gradient(100% 100% at 0% 0%, #5cbecd 100%, #17a2b8 100%) repeat 50% 50% / 100% 100%;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.saving-status{
    width: 25%;
    min-height: 25%;
    background-color: white;
    position: absolute;
    top:30%;
    border-radius: 0 13px 13px 0;
    display:flex;
    justify-content: center;
}
.saving-status p{
    font-size: 1.2em;
    width: 100%;
    height: 80%;
    word-break: break-all; 
    word-wrap: break-word;
    text-align: center;
    margin: 0;
}
/* Status */
.saving-status span.Kompletirana{
    display: inline-block;
    font-size: 1.2em;
    color: #03a100;
    text-shadow: -0.2px 0 black, 0 0.2px black, 0.2px 0 black, 0 -0.2px black;
}
.saving-status span.U.toku{
    display: inline-block;
    font-size: 1.2em;
    color: orange;
    text-shadow: -0.2px 0 black, 0 0.2px black, 0.2px 0 black, 0 -0.2px black;
}
.saving-status span.Istekla{
    display: inline-block;
    font-size: 1.2em;
    color: #e80000;
    text-shadow: -0.2px 0 black, 0 0.2px black, 0.2px 0 black, 0 -0.2px black;
}
.data{
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    width: 72%;
    height: 70%;
    line-height: 75%;
    display: flex;
    flex-direction: row;
}
.data-row{
    display: flex;
    align-items: center;
    font-size: 2.2em;
    justify-content: center;
}
.data-row p span{
    font-size: 1.1em;
    display: inline-block;
    margin-left: 5px;
}
.data-row:nth-child(1){
    width: 40%
}
.data-row:nth-child(2){
    width: 60%
}
/* Buttons inside a saving */
.buttons{
    position: absolute;
    top: 72%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}
.buttons button{
    transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
    transition-property: box-shadow, transform, color;
    transition-duration: 0.2s, 0.2s, 0.2s;
    transition-timing-function: ease, ease, ease;
    transition-delay: 0s, 0s, 0s;
    font-family: 'Oswald', sans-serif;

    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    background-color: rgb(0, 0, 0);
    overflow: hidden;
    border-radius: 10px;

    min-width: 12%;
    box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
        0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
        0 1px 2px 1px rgba(0, 0, 0, 0) inset,
        0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
    background-image: linear-gradient(-45deg, rgb(131, 131, 131), white);
    color: black;
}
.buttons button:hover{
  text-shadow: 2.9px 2.95px 2.95px rgb(131, 131, 131);

  box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
    0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
.buttons button:active{
  box-shadow: 0px 1px 3px 1px #888888;
  box-shadow: 0 5px #666;
  transform: translateY(4px);

  box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
    0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
    0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  transition: 0s;
  color: rgba(18, 104, 117, 0.616);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
  outline: none;
}
/* Universal button style */
button:active, button:focus, button:hover{
    outline: none;
    cursor: pointer;
}
button::-moz-focus-inner {
    border: 0;
}
button{
    border-radius: 13px;
    border: none;
    font-family: "Oswald";
    font-size: 1em;
}
/* aside button style */
.sorting button{
    transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
    transition-property: box-shadow, transform, color;
    transition-duration: 0.2s, 0.2s, 0.2s;
    transition-timing-function: ease, ease, ease;
    transition-delay: 0s, 0s, 0s;
    font-family: 'Oswald', sans-serif;
    font-size: 1.2em;
    cursor: pointer;

    font-weight: 500;
    background-color: rgb(0, 0, 0);
    overflow: hidden;
    border-radius: 10px;

    box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
        0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
        0 1px 2px 1px rgba(0, 0, 0, 0) inset,
        0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
    background-image: linear-gradient(-45deg, rgb(131, 131, 131), rgb(34, 34, 34));
    color: #e6eaef;
}
.sorting button:hover{
  text-shadow: 2.9px 2.95px 2.95px #000000;

  box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
    0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
.sorting button:active{
  box-shadow: 0px 1px 3px 1px #888888;
  box-shadow: 0 5px #666;
  transform: translateY(4px);

  box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
    0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
    0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  transition: 0s;
  color: rgba(18, 104, 117, 0.616);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
  outline: none;
}
/* Old css */
.savings-wrapper{
    display:flex;
    margin: 0 auto;
    padding-top: 0.5%;
    background: radial-gradient(36% 51% at 36% 50%, #eaecec 0%, #CACACA 100%) repeat 50% 50% / 100% 100%;
    min-height: 92vh;
    box-sizing: border-box;
    padding-bottom: 3%;
    font-size: 0.82em;
}
.aside{
    width:14%;
    margin-left: 2%;
}
.aside .add-saving{
    width:80%;
    top: 14%;
    position: sticky;
}
.main{
    width:80%;
    margin-right: 4%;
}
.p-details{
    display: flex;
    font-weight: 100;
    height: 100%;
    line-height: 1.1em;
    align-items: center;
}
.month-rate{
    display: flex;
    font-weight: 100;
    height: 100%;
    line-height: 1.1em;
    align-items: center;
    flex-direction: column;
}
.month-date span {
    display:flex;
}
.month-rate .month-rate-first{
    height:70%;
    display:flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding-bottom: 1%;
}
.month-rate .month-rate-second{
    height:30%;
    display:flex;
    font-size: 0.5em;
    align-items: center;
}
.p-done{
    display: flex;
    height: 100%;
    line-height: 1.1em;
    align-items: center;
}
@keyframes opacity{
    0% {opacity:0;}
    100% {opacity: 0.6;}
}
.payment-processing{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: black;
    opacity: 0.6;
    z-index: 10000;
    animation-name: opacity;
    animation-duration: 0.6s;
    display: flex;
    justify-content: center;
    align-content: center;
}
.payment-form, .add-savings-form, .delete-saving, .view-payments, .savings-view-details {
    background: radial-gradient(36% 51% at 36% 50%, #eaecec 0%, #CACACA 100%) repeat 50% 50% / 100% 100%;
    position: fixed;
    z-index: 10001;
    top: 15%;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 20px;
}
.sort-order{
    margin-top: 30px;
}
.sorting{
    position: sticky;
    top: 15%;
}
.sorting button{
    display: block;
    position: relative;
    margin-bottom: 18%;
    min-height: 45px;
    width: 80%;
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
    background-color: black;
    opacity: 0.6;
    z-index: 10;
    animation-name: opacity;
    animation-duration: 0.6s;
    display: flex;
    justify-content: center;
    align-content: center;
}
/* Saving done */
.saving-done{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    width: 72%;
    height: 70%;
    line-height: 150%;
}
.saving-done p {
    font-size: 2em;
    display:flex;
    align-items: center;
}
/* Responsive */
@media (max-width: 720px){
    .aside{
        width: 96%;
        margin: 2%;
    }
    .aside button{
        margin: 1% auto 5% auto;
    }
    .sorting .option-wrap{
        display:inline-block;
    }
    .sort-order{
        display: flex;
        justify-content: center;
    }
    .main{
        width: 96%;
        margin: 2%;
        display:flex;
        flex-direction: column;
        align-items: center;
    }
    .savings-wrapper{
        flex-direction: column;
    }
    .all-savings{
        margin-bottom: 12%;
        height: 150px;
    }
    .saving-status{
        top: 9%;
        font-size: 0.7em;
    }
    .data{
        font-size: 0.6em;
        flex-direction: column;
    }
    .saving-done{
        font-size: 0.6em;
    }
    .data-row:nth-child(1), .data-row:nth-child(2){
        width: auto;
        margin-top: 2%;
    }
    .saving-done p {
        display:flex;
        align-items: center;
        width: 80%;
        position: absolute;
        top: 13%;
    }
    .each-saving-white{
        width: 100%;
        height: 80%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: white;
        border-radius: 15px;
        box-sizing: border-box;
        -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    }
    .each-saving-white p{
        font-size: 1.8em;
        width: 96%;
        position: relative;
        top: 1%;
        left: 2%;
        height: 20%;
        display:flex;
        justify-content: center;
        align-items: center;
        word-break: break-all;
    }
    .each-saving1, .each-saving2, .each-saving3, .each-saving4{
        width: 100%;
        height: 80%;
        top: unset;
        bottom: 0;
    }
    .buttons{
        top: unset;
        bottom: 5%;
        height: 30%;
    }
    .buttons button{
        font-size: 0.8em;
        width: 20%;
    }
    .month-rate{
        font-size: 0.8em;
    }
    .month-date span {
        display:flex;
    }
    .month-rate .month-rate-second{
        font-size: 0.8em;
    }
    .payment-form, .add-savings-form, .delete-saving, .view-payments, .savings-view-details {
        top: 7%;
    }
    .sort-order{
        margin-top: 5%;
    }
}
</style>