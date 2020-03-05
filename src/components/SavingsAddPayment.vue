<template>
  <div class="paymentForm">
        <h2>{{singleSaving.sav_description}}</h2>
            <p class='span-details'>Cilj: {{singleSaving.sav_amount + " " + singleSaving.acc_type_name}}</p>
            <p class='span-details'>Do sad uplaceno: {{singleSaving.sav_amount_accumulated}}{{" " + singleSaving.acc_type_name}}</p>
            <p class='span-details'>Preostala kolicina novca za uplatu: {{singleSaving.leftover_amount}}{{" " + singleSaving.acc_type_name}}</p>
            <p class='span-details'>Mesecna rata za preostali period: {{singleSaving.sav_month_rate}}</p>
            
            <div class="accounts" v-if = "accounts.length>1">
                <div class="each-account" 
                    v-for = "account in accounts" 
                    :key="account.acc_id"
                    @click = "setAcc(account)"
                >
                    <p>{{account.acc_name}}</p>
                    <p>{{account.acc_amount + " " + account.acc_type_name}}</p>
                </div>
            </div>
            <div class="accounts" v-if = "accounts.length==1">
                <p>{{accounts[0].acc_name}}</p>
                <p>{{accounts[0].acc_amount + " " + accounts[0].acc_type_name}}</p>
            </div>
            <p>Izvrsi uplatu sa racuna: <strong>{{acc_name}}</strong></p>
            
        <input type="text" v-model = "paymentValue">
        <button @click = "makePayment">Uplati</button>

        <p>{{error}}</p>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            singleSaving: [],
            accounts: [],
            acc_id: '',
            acc_name: '',
            error: '',
            paymentValue: ''
        }
    },
    props: {
        savings: Array,
        sav_id: Number
    },
    methods:{
        getSingleSaving(){
            for (let i in this.savings){
                if(this.savings[i].sav_id == this.sav_id){
                    this.singleSaving = this.savings[i];
                }
            }
        },
        getAccounts(){
            axios.post(`http://053n122.mars-e1.mars-hosting.com/api/get/getAccounts/${this.singleSaving.acc_type_name.toLowerCase()}`, {sid: localStorage.getItem('sid')})
            .then(r=>{
                this.accounts = r.data.data;
                if (this.accounts.length == 1){
                    this.acc_id = this.accounts[0].acc_id;
                    this.acc_name = this.accounts[0].acc_name;
                }
            }) 
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
                    this.$emit('get-savings');
                    this.paymentValue = '';
                    this.error = '';
                    this.$emit('making-payment');
                })
            } 
        }
    },
    created(){
        this.getSingleSaving();
        this.getAccounts();
    },
}
</script>

<style>

</style>