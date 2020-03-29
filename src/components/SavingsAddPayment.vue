<template>
    <div class="payment-form">
        <h2>{{singleSaving.sav_description}}</h2>
        <div class="data">
            <p>Cilj: {{singleSaving.sav_amount + " " + singleSaving.acc_type_name}}</p>
            <p>Do sad uplaćeno: {{singleSaving.sav_amount_accumulated}}{{" " + singleSaving.acc_type_name}}</p>
            <p>Preostala količina novca za uplatu: {{singleSaving.leftover_amount}}{{" " + singleSaving.acc_type_name}}</p>
            <p>Mesečna rata za preostali period: {{singleSaving.sav_month_rate}}{{" " + singleSaving.acc_type_name}}</p>
        </div>
        <p>Odaberite račun sa kojeg uplaćujete:</p>
        
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
            <div class="each-account">
                <p>{{accounts[0].acc_name}}</p>
                <p>{{accounts[0].acc_amount + " " + accounts[0].acc_type_name}}</p>
            </div>
        </div>
        <p>Izvrši uplatu sa računa: <strong>{{acc_name}}</strong></p>
            
        <input type="text" v-model = "paymentValue" placeholder="Iznos uplate">
        <button @click = "makePayment">Uplati</button>

        <p class = "error">{{error}}</p>
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
                this.error = "Izaberite račun s kojeg ćete da uplatite na štednju.";
            }else if(isNaN(Number(this.paymentValue))){
                this.error = "";
                this.error = "Količina uplate mora biti broj.";
            }else if(this.paymentValue <= 0){
                this.error = "";
                this.error = "Količina uplate mora biti pozitivan broj i veći od 0.";
            }else if(this.paymentValue === ""){
                this.error = "";
                this.error = "Unesite količinu.";
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
                }).catch(e=>{
                    this.error = e.response.data.error; 
                });
            } 
        }
    },
    created(){
        this.getSingleSaving();
        this.getAccounts();
    },
}
</script>

<style scoped>
    .payment-form{
        display: flex;
        flex-direction: column;
        width: 40%;
        align-items: center;
        font-size: 1.2em;
    }
    h2{
        margin: 0;
        margin-top: 2%;
    }
    .data{
        width: 90%;
        display: flex;
        flex-direction: column;
        max-height: 100vh;
    }
    .data p {
        margin: 0;
        margin-bottom: 5%;
        text-align: center;
    }
    input{
        width: 50%;
    }
    @keyframes button{
        0% {background-color: rgb(234, 236, 236)}
        100%{background-color: rgb(192, 190, 190)}
    }
    @keyframes button-rev{
        0% {background-color: rgb(192, 190, 190)}
        100%{background-color: rgb(234, 236, 236)}
    }
    button{
        border-radius: 13px;
        background-color: white;
        border: none;
        font-family: "Teko";
        font-size: 1em;
        width: 30%;
        margin-top: 5%;
        animation-name: button-rev;
        animation-duration: 0.6s;
        animation-fill-mode: forwards;
    }
    button:hover, button:focus{
        cursor: pointer;
        outline: none;
        animation-name: button;
        animation-duration: 0.6s;
        animation-fill-mode: forwards;
    }
    button::-moz-focus-inner {
        border: 0;
    }
    .accounts{
        width: 90%;
        display: flex;
        justify-content: space-around;
    }
    .each-account{
        background-color: #17a2b8;
        color: white;
        font-size: 0.8em;
        width: 20%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
    }
    .each-account:hover{
        cursor: pointer;
    }
    .each-account p{
        margin: 0;
    }
    .error{
        color: #e80000;
    }
</style>