<template>
  <div class="savings-wrapper">
      <div class="each-savings" v-for = "(saving, index) in savings" :key = 'index'>
        <p>Opis: {{saving.sav_description}}</p>
        <p>Zeljena suma: {{saving.sav_amount}}</p>
        <p>Do sad uplaceno: {{saving.sav_amount - saving.leftover_amount}}</p>
        <p>Period stednje: {{saving.sav_period}} meseci/meseca</p>
        <p>Preostala kolicina novca za uplatu: {{saving.leftover_amount}}</p>
        <p>Ukupan broj uplata: {{saving.number_of_payments}}</p>
        <p>Mesecna rata: {{calculateRate(saving.leftover_amount, saving.sav_start, saving.sav_period)}}</p>

        <button>Pogledaj detalje placanja</button><br><br>
        <label for="input">Uplatite novac za stednju.</label><br>
        <input type="text" id = "input" v-model = "paymentValues[index]"><br>
        <button @click = "makePayment(index)">Potvrdite transakciju</button>

        <p>{{errorMsg[index]}}</p>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    data () {
        return {
            errorMsg: [],
            savings: [],
            paymentValues: []
            
        }
    },
    methods: {
        getSavings(){
            axios.get('http://053n122.mars-e1.mars-hosting.com/api/wallet/getSavings', {params :{sid: localStorage.getItem('sid')}})
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
        makePayment(i){
            if(this.paymentValues[i] == ''){
                this.errorMsg[i] = "Please enter a number.";
            }
            if(isNaN(Number(this.paymentValues[i]))){
                this.errorMsg[i] = "Amount must be a number.";
            }else{
                this.errorMsg[i] = "";
            }
        }
    },
    mounted(){
        this.getSavings();
    }
}
</script>

<style scoped>

.each-savings{
    margin: 50px;
}
.savings-wrapper{
    display: flex;
    flex-wrap: wrap;
}

</style>