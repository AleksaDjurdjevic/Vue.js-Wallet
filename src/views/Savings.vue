<template>
    <div class="savings-wrapper">
        <!-- div cele komponente -->
        <div class="wrap">
            <button @click = "addingSaving = true">Dodaj Stednju</button>
            <div class="each-savings" v-for = "saving in savings" :key = 'saving.sav_id'>
                <h2>{{saving.sav_description}}</h2>
                <span class='span-details'>Cilj: {{saving.sav_amount + " " + saving.acc_type_name}}</span>
                <span class='span-details'>Do sad uplaceno: {{saving.sav_amount_accumulated}}{{" " + saving.acc_type_name}}</span>
                <span class='span-details'>Period stednje: {{saving.sav_period}} meseci/meseca</span>
                <span class='span-details'>Preostala kolicina novca za uplatu: {{saving.leftover_amount + " " + saving.acc_type_name}}</span>
                <span class='span-details'>Ukupan broj uplata: {{saving.number_of_payments}}</span>
                <span class='span-details'>Mesecni doprinos: {{saving.sav_month_rate = calculateRate(saving.leftover_amount, saving.sav_start, saving.sav_period)}}{{" " + saving.acc_type_name}}</span> <br>
                
                <button @click = "preparePayment(saving.sav_id)">Uplati na stednju</button>
                <button @click = "deleteSavings(saving.sav_id)">Obrisi Stednju</button>
                <button @click = "viewPayments(saving.sav_id)">Pregled uplata</button>
            </div>
        </div>
        
        <!-- Shade div -->
        <div class="payment-processing" v-if ="makingPayment || addingSaving || deletingSaving || viewingPayments" 
            @click =    "makingPayment = false; 
                        addingSaving = false; 
                        deletingSaving = false;
                        viewingPayments = false;
                        error = '';">
        </div>
        <!-- Div pri uplati na stednju -->
        <savings-add-payment v-if ="makingPayment"
            :savings = "savings"
            :sav_id = "sav_id"
            @get-savings = "getSavings"
            @making-payment = "makingPayment = false"
        />

        <!-- Div pri kreiranju stednje -->
        <savings-add  v-if ="addingSaving"
            @get-savings = "getSavings"
            @adding-saving = "addingSaving = false"
        />

        <!-- Div pri brisanju stednje -->
        <savings-delete v-if ="deletingSaving"
            :sav_id = "sav_id"
            :savings = "savings"
            @get-savings = "getSavings"
            @deleting-saving = "deletingSaving = false"
        />

        <!-- Div pri pregledu uplata -->
        <savings-view-payments v-if ="viewingPayments"
            :sav_id = "sav_id"
            :savings = "savings"
            @get-savings = "getSavings"
            @viewing-payments = "viewingPayments = false"
        />

        <!-- Sort -->
        <input type="radio" id="sort1" value = 'sav_amount' v-model="property" @change = "savingSort('desc')">
        <label for="sort1">Po cilju</label>
        <br>
        <input type="radio" id="sort2" value = 'sav_amount_accumulated' v-model="property" @change = "savingSort('desc')">
        <label for="sort2">Po uplacenom iznosu</label>
        <br>
        <input type="radio" id="sort3" value = 'sav_period' v-model="property" @change = "savingSort('desc')">
        <label for="sort3">Po periodu</label>
        <br>
        <input type="radio" id="sort4" value = 'leftover_amount' v-model="property" @change = "savingSort('desc')">
        <label for="sort4">Po preostalom iznosu</label>
        <br>
        <input type="radio" id="sort5" value = 'number_of_payments' v-model="property" @change = "savingSort('desc')">
        <label for="sort5">Po uplatama</label>
        <br>
        <input type="radio" id="sort6" value = 'sav_month_rate' v-model="property" @change = "savingSort('desc')">
        <label for="sort6">Po mesecnoj rati</label>
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
            property: null
        }
    },
    components: {
        "savings-add": SavingsAdd,
        "savings-add-payment": SavingsAddPayment,
        "savings-delete": SavingsDelete,
        "savings-view-payments": SavingsViewPayments
    },
    methods: {
        savingSort(a){
            if (this.savings !== []) {
                if(a == 'asc'){
                    this.savings.sort((a, b) => (a[this.property] > b[this.property]) ? 1 : -1);
                }else if(a == 'desc'){
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
.savings-wrapper{
    position: relative;
    min-width: 100vh;
    min-height: 100vh;
}
.each-savings{
    margin: 50px;
}
.wrap{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

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
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: black;
    opacity: 0.6;
    z-index: 1;
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
    z-index: 2;
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

</style>