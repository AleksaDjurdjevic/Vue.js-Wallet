<template>
    <div class="savings-wrapper">
        <!-- div cele komponente -->
        <div class="wrap">
            <button @click = "addingSaving = true">Dodaj Stednju</button>
            <div class="each-savings" v-for = "saving in savings" :key = 'saving.sav_id'>
                <h2>{{saving.sav_description}}</h2>
                <span class='span-details'>Cilj: {{saving.sav_amount}} RSD</span>
                <span class='span-details'>Do sad uplaceno: {{saving.sav_amount - saving.leftover_amount}} RSD</span>
                <span class='span-details'>Period stednje: {{saving.sav_period}} meseci/meseca</span>
                <span class='span-details'>Preostala kolicina novca za uplatu: {{saving.leftover_amount}} RSD</span>
                <span class='span-details'>Ukupan broj uplata: {{saving.number_of_payments}}</span>
                <span class='span-details'>Mesecni doprinos: {{calculateRate(saving.leftover_amount, saving.sav_start, saving.sav_period)}} RSD</span> <br>

                <button @click = "preparePayment(saving.sav_id)">Uplati na stednju</button>
            </div>
        </div>
        
        <!-- Shade div -->
        <div class="payment-processing" v-if ="makingPayment || addingSaving" @click = "makingPayment = false; addingSaving = false; error = '';">
        </div>
        <!-- Div pri uplati na stednju -->
        <div class="paymentForm" v-if ="makingPayment">
            <h2>{{singleSaving.sav_description}}</h2>
                <p class='span-details'>Cilj: {{singleSaving.sav_amount}} RSD</p>
                <p class='span-details'>Do sad uplaceno: {{singleSaving.sav_amount - singleSaving.leftover_amount}} RSD</p>
                <p class='span-details'>Preostala kolicina novca za uplatu: {{singleSaving.leftover_amount}} RSD</p>
                <p class='span-details'>Mesecna rata za preostali period: {{calculateRate(singleSaving.leftover_amount, singleSaving.sav_start, singleSaving.sav_period)}} RSD</p>
                
                <div class="accounts">
                    <div class="each-account" 
                        v-for = "account in accounts" 
                        :key="account.acc_id"
                        @click = "setAcc(account)"
                    >
                        <p>{{account.acc_name}}</p>
                        <p>{{account.acc_amount}}</p>
                    </div>
                </div>
                <p>Make a payment using <strong>{{acc_name}}</strong></p>
                
            <input type="text" v-model = "paymentValue">
            <button @click = "makePayment">Uplati</button>

            <p>{{error}}</p>
        </div>
        <!-- Div pri kreiranju stednje -->
        <div class="addSavingsForm" v-if ="addingSaving">
            <h2>Dodaj novu stednju</h2>
            <label for="newSavDesc">Dodaj naziv/opis stednje</label>
                <input id = "newSavDesc" type="text" v-model = "newSavDesc">
            <label for="newSavAmount">Zeljena kolicina novca</label>
                <input id = "newSavAmount" type="number" v-model = "newSavAmount">
            <label for="newSavPeriod">Period za koji zelite da ustedite</label>
                <input id = "newSavPeriod" type="number" v-model = "newSavPeriod">
            <button @click = "addSaving">Kreiraj</button>

            <p>{{error}}</p>
        </div>
        <button @click = "savingSort('sav_amount', 'desc')">Po cilju</button>
        <button @click = "savingSort('sav_amount', 'desc')">Po uplacenom iznosu</button>
        <button @click = "savingSort('sav_amount', 'desc')">Po periodu</button>
        <button @click = "savingSort('sav_amount', 'desc')">Po preostalom iznosu</button>
        <button @click = "savingSort('sav_amount', 'desc')">Po uplatama</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data () {
        return {
            savings: [],
            makingPayment: false,
            paymentValue: '',
            sav_id: '',
            singleSaving: [],
            accounts: [],
            acc_id: '',
            acc_name: '',
            error: '',
            addingSaving: false,
            newSavDesc: '',
            newSavAmount: '',
            newSavPeriod: ''
        }
    },
    methods: {
        savingSort(property, a){
            if (this.savings !== []) {
                if(a == 'asc'){
                    this.savings.sort((a, b) => (a[property] > b[property]) ? 1 : -1);
                }else if(a == 'desc'){
                    this.savings.sort((a, b) => (a[property] > b[property]) ? -1 : 1);
                }
            }
        },
        getSavings(){
            axios.post('http://053n122.mars-e1.mars-hosting.com/api/wallet/getSavings', {sid: localStorage.getItem('sid')})
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
            this.makingPayment = !this.makingPayment;
            this.getSingleSaving();
            axios.post('http://053n122.mars-e1.mars-hosting.com/api/wallet/getAccounts', {sid: localStorage.getItem('sid')})
            .then(r=>{
                this.accounts = r.data.data;
            })
        },
        getSingleSaving(){
            for (let i in this.savings){
                if(this.savings[i].sav_id == this.sav_id){
                    this.singleSaving = this.savings[i];
                }
            }
        },
        setAcc(account){
            this.acc_id = account.acc_id;
            this.acc_name = account.acc_name;
            this.error = '';
        },
        makePayment(){
            if(this.acc_id == ""){
                this.error = "Izaberi racun s kojeg ces da uplatis na stednju"
            }else if(isNaN(Number(this.paymentValue))){
                this.error = ""
                this.error = "Kolicina uplate mora biti broj"
            }else{
                axios.post('http://053n122.mars-e1.mars-hosting.com/api/wallet/paymentSavings', {
                    sid: localStorage.getItem('sid'),
                    accId: this.acc_id,
                    savId: this.sav_id,
                    savPayAmount: this.paymentValue
                }).then(r=>{
                    this.error = r.data.msg;
                    this.getSavings();
                    this.getSingleSaving();
                    this.paymentValue = '';
                    this.makingPayment = false;
                })
            } 
        },
        addSaving(){
            if(this.newSavDesc == ""){
                this.error = "Izaberite naziv/opis stednje.";
            }else if(this.newSavPeriod == ""){
                this.error = "Unesite period stednje.";
            }else if(isNaN(Number(this.newSavPeriod))){
                this.error = "Period mora biti broj.";
            }else if(this.newSavAmount == ""){
                this.error = "Unesite zeljenu kolicinu.";
            }else{
                axios.post('http://053n122.mars-e1.mars-hosting.com/api/wallet/addSavings', {
                    sid: localStorage.getItem('sid'),
                    savAmount: this.newSavAmount,
                    savDescription: this.newSavDesc,
                    savPeriod: this.newSavPeriod
                }).then(r=>{
                    this.error = r.data.msg;
                    this.getSavings();
                })
            } 
        }
    },
    mounted(){
        localStorage.setItem('sid', 'lufHZBnH3zIl17uiXlOfcIp7MOhrNZ0k');
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
.paymentForm, .addSavingsForm {
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