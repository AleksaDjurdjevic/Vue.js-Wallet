<template>
    <div class="savings-wrapper">
        <!-- div of whole component -->
        <!-- Left side -->
        <div class="aside">
            <button @click = "addingSaving = true">Dodaj Stednju</button>
            <!-- Sort -->
            <div class="sorting">
                <input type="radio" id="sort1" value = 'sav_amount' v-model="property" @change = "savingSort">
                <label for="sort1">Po cilju</label>
                <br>
                <input type="radio" id="sort2" value = 'sav_amount_accumulated' v-model="property" @change = "savingSort">
                <label for="sort2">Po uplacenom iznosu</label>
                <br>
                <input type="radio" id="sort3" value = 'sav_period' v-model="property" @change = "savingSort">
                <label for="sort3">Po periodu</label>
                <br>
                <input type="radio" id="sort4" value = 'leftover_amount' v-model="property" @change = "savingSort">
                <label for="sort4">Po preostalom iznosu</label>
                <br>
                <input type="radio" id="sort5" value = 'number_of_payments' v-model="property" @change = "savingSort">
                <label for="sort5">Po uplatama</label>
                <br>
                <input type="radio" id="sort6" value = 'sav_month_rate' v-model="property" @change = "savingSort">
                <label for="sort6">Po mesecnoj rati</label>

                <div class="sort-order">
                    <input type="radio" id="asc" value = "asc" v-model="sortOrder" @change = "sortOrder = 'asc'">
                    <label for="asc">Od najnizeg ka najvecem</label>
                    <br>
                    <input type="radio" id="desc" value = "desc" v-model="sortOrder" @change = "sortOrder = 'desc'">
                    <label for="desc">Od najveceg ka najnizem</label>
                </div>
            </div>
        </div>
        <!-- Right side -->
        <div class="main">
            <!-- Wrapper for all savings -->
            <div class="test"  v-for = "(saving, index) in savings" :key = 'saving.sav_id'>
                <div class="test1"><p>{{saving.sav_description}}</p></div>
                <div :class="'each-saving'+(index+1)">
                    <div class="rectangle"><p>Pregled stednje</p></div>
                    <div class="data">
                        <div class="data-row">
                            <span class='span-details'>Cilj: {{saving.sav_amount + " " + saving.acc_type_name}}</span>
                            <span class='span-details'>Do sad uplaceno: {{saving.sav_amount_accumulated}}{{" " + saving.acc_type_name}}</span>
                        </div>
                        <div class="data-row">
                            <span class='span-details'>Period stednje: {{saving.sav_period}} meseci/meseca</span>
                            <span class='span-details'>Preostala kolicina novca za uplatu: {{saving.leftover_amount + " " + saving.acc_type_name}}</span>
                        </div>
                        <div class="data-row">
                            <span class='span-details'>Ukupan broj uplata: {{saving.number_of_payments}}</span>
                            <span class='span-details'>Mesecni doprinos: {{saving.sav_month_rate = calculateRate(saving.leftover_amount, saving.sav_start, saving.sav_period)}}{{" " + saving.acc_type_name}}</span>
                        </div>
                    </div>
                    <div class="buttons">
                        <button @click = "preparePayment(saving.sav_id)">Uplati na stednju</button>
                        <button @click = "viewPayments(saving.sav_id)">Pregled uplata</button>
                        <button @click = "deleteSavings(saving.sav_id)">Obrisi Stednju</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Conditional components -->
        <!-- Shade div -->
        <div class="payment-processing" v-if ="makingPayment || addingSaving || deletingSaving || viewingPayments" 
            @click =    "makingPayment = false; 
                        addingSaving = false; 
                        deletingSaving = false;
                        viewingPayments = false;
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

        <!-- Div for viewing payments -->
        <savings-view-payments v-if ="viewingPayments"
            :sav_id = "sav_id"
            @get-savings = "getSavings"
            @viewing-payments = "viewingPayments = false"
        />

        
    </div>
</template>

<script>
import axios from 'axios';
import SavingsAdd from '../components/SavingsAdd.vue';
import SavingsAddPayment from '../components/SavingsAddPayment.vue';
import SavingsDelete from '../components/SavingsDelete.vue';
import SavingsViewPayments from '../components/SavingsViewPayments.vue';
export default {
    data () {
        return {
            savings: [],
            makingPayment: false,
            deletingSaving: false,
            addingSaving: false,
            viewingPayments: false,
            sav_id: '',
            error: '',
            property: null,
            sortOrder: 'asc'
        }
    },
    components: {
        "savings-add": SavingsAdd,
        "savings-add-payment": SavingsAddPayment,
        "savings-delete": SavingsDelete,
        "savings-view-payments": SavingsViewPayments
    },
    methods: {
        savingSort(){
            if (this.savings !== []) {
                if(this.sortOrder == 'asc'){
                    this.savings.sort((a, b) => (a[this.property] > b[this.property]) ? 1 : -1);
                }else if(this.sortOrder == 'desc'){
                    this.savings.sort((a, b) => (a[this.property] > b[this.property]) ? -1 : 1);
                }
            } 
        },
        getSavings(){
            axios.post('http://053n122.mars-e1.mars-hosting.com/api/get/getSavings', {sid: localStorage.getItem('sid')})
            .then(r=>{
                this.savings = r.data.all_savings;
            })
        },
        calculateRate(leftover_amount, start, period){
            let currentDate = new Date();
            let startParts = start.split('-');
            let startMonth = parseInt(startParts[1]);
            let monthsLeft = (currentDate.getMonth() + 1) - startMonth;
            if (monthsLeft<0){
                monthsLeft += 12;
            }
            let leftoverMonths = period - monthsLeft;
            
            return Math.ceil(leftover_amount / leftoverMonths);

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
        }
    },
    mounted(){
        this.getSavings();
    }
}
</script>

<style scoped>
.test{
    width: 95%;
    height: 190px;
    position: relative;
    margin-bottom: 1%;
}
.test1 p{
    font-size: 31px;
    width: 20%;
    position: relative;
    top: 10%;
    left: 2%;
    height: 80%;
    display:flex;
    justify-content: center;
    align-items: center;
    word-break: break-all; 
    word-wrap: break-word;
}
.test1{
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
.rectangle{
    width: 25%;
    height: 25%;
    background-color: white;
    position: absolute;
    top:30%;
    border-radius: 0 3px 3px 0;
    display:flex;
    justify-content: center;
}
.rectangle p{
    font-size: 22px;
    width: 80%;
    height: 80%;
    word-break: break-all; 
    word-wrap: break-word;
    text-align: center;
}
.data{
    position: absolute;
    top: 5%;
    right: 0;
    color: white;
    width: 65%;
    height: 50%;
    line-height: 75%;
}
.buttons{
    position: absolute;
    top: 72%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}
.buttons button{
    border-radius: 13px;
    background-color: white;
    border: none;
}
button:active, button:focus{
    outline:none;
}
/* Old css */
.savings-wrapper{
    display:flex;
    margin: 0 auto;
    padding-top: 0.5%;
    background: radial-gradient(36% 51% at 36% 50%, #eaecec 0%, #CACACA 100%) repeat 50% 50% / 100% 100%;
    min-height: 100vh;
}
.aside{
    width:14%;
    margin-left: 2%;
}
.main{
    width:80%;
    margin-right: 3%;
}
.each-savings{
    margin: 50px;
}
.span-details{
    display: inline-block;
    margin: 5px;
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
.paymentForm, .addSavingsForm, .delete-saving, .view-payments {
    display:flex;
    background-color: #FAFBFC;
    margin: 100px auto;
    position: absolute;
    z-index: 10001;
    top: 100px;
    left: 600px;
    flex-direction: column;
}
.accounts{
    display: flex;
    justify-content: space-evenly;
}
.each-account{
    margin: 10px;
}
.sort-order{
    margin-top: 30px;
}

</style>