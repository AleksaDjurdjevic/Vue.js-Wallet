<template>
    <div class="payment-form">
        <h2>{{singleSaving.sav_description}}</h2>
        <div class="data">
            <p>Cilj: {{singleSaving.sav_amount + " " + singleSaving.acc_type_name}}</p>
            <p v-if = "singleSaving.sav_month_rate_payed>0" >Mesečna rata: {{singleSaving.sav_month_rate_payed}}{{" " + singleSaving.acc_type_name}}</p>
            <div v-if = "singleSaving.sav_month_rate_payed<=0"> 
                <p class = "msg">Uplatili ste mesečnu ratu!</p>
                <p class = "msg" v-if = "singleSaving.fixed_month_rate + singleSaving.sav_month_rate_payed>=0" >Sledeća mesečna rata: {{singleSaving.fixed_month_rate + singleSaving.sav_month_rate_payed}}{{" " + singleSaving.acc_type_name}}</p>
                <p class = "msg" v-else>Sve sledeće uplate nakon naredne rate će vam biti manje od {{singleSaving.fixed_month_rate + " " + singleSaving.acc_type_name}}.</p>
            </div>
        </div>
        <p>Odaberite račun sa kojeg uplaćujete:</p>
        
        <div class="accounts" v-if = "accounts.length>1">
            <div class = "each-account" 
                :class="{'each-account-selected' : account.selected}" 
                v-for = "account in accounts" 
                :key="account.acc_id"
                @click = "setAcc(account)"
            >
                <p>{{account.acc_name}}</p>
                <p>{{account.acc_amount + " " + account.acc_type_name}}</p>
            </div>
        </div>
        <p class ="no-acc" v-if= "accounts.length === 0">Nemate računa ove valute</p>
        <div class="accounts" v-if = "accounts.length===1">
            <div class="each-account-selected">
                <p>{{accounts[0].acc_name}}</p>
                <p>{{accounts[0].acc_amount + " " + accounts[0].acc_type_name}}</p>
            </div>
        </div>
        <p :class = "{'amount': acc_id!=='', 'amount-invi': acc_id===''}">Raspoloživa sredstva: <span>{{acc_amount +" "+ singleSaving.acc_type_name}}</span></p>
    
        <input type="text" v-model = "paymentValue" placeholder="Iznos uplate">
        <button v-if = "accounts.length>0" @click = "makePayment">Uplati</button>
        <button @click = "$emit('making-payment')">Povratak na štednje</button>

        <p :class = "{'error': error, 'error-invi': !error}">{{error? error: 'fill'}}</p>
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
            acc_amount: '',
            error: '',
            paymentValue: '',
            nextPayments: []
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

                if(this.accounts === undefined){
                    this.accounts = [];
                }
                else if (this.accounts.length == 1){
                    this.acc_id = this.accounts[0].acc_id;
                    this.acc_name = this.accounts[0].acc_name;
                    this.acc_amount = this.accounts[0].acc_amount;
                }else{
                    for (let i in this.accounts){
                        this.accounts[i].selected = false;
                    }
                }
            }) 
        },
        setAcc(account){
            this.acc_id = account.acc_id;
            this.acc_name = account.acc_name;
            this.error = '';
            this.acc_amount = account.acc_amount;
            for (let i in this.accounts){
                if(this.accounts[i].acc_id === account.acc_id){
                    this.accounts[i].selected = true;
                }else{
                   this.accounts[i].selected = false; 
                }
            }
        },
        makePayment(){
            if(this.acc_id == ""){
                this.error = "Izaberite račun s kojeg ćete da uplatite na štednju.";
            }else if(isNaN(Number(this.paymentValue))){
                this.error = "";
                this.error = "Količina uplate mora biti broj i bez razmaka u zapisu.";
            }else if(this.paymentValue <= 0){
                this.error = "";
                this.error = "Količina uplate mora biti pozitivan broj i veći od 0.";
            }else if(this.paymentValue === ""){
                this.error = "";
                this.error = "Unesite količinu.";
            }else{
                let currentDate = new Date();

                let year = currentDate.getFullYear().toString();
                let month = currentDate.getMonth().toString.length < 2 ? `0${currentDate.getMonth()+1}` : currentDate.getMonth()+1;
                let day = currentDate.getDate().toString.length < 2 ? `0${currentDate.getDate()}` : currentDate.getDate();
            
                let currentDateString = `${year}-${month}-${day}`;

                axios.post('http://053n122.mars-e1.mars-hosting.com/api/wallet/paymentSavings', {
                    sid: localStorage.getItem('sid'),
                    accId: this.acc_id,
                    savId: this.sav_id,
                    savPayAmount: this.paymentValue,
                    savEnd: currentDateString,
                    sav_leftover: this.singleSaving.leftover_amount
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
        font-size: 1.3em;
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
        transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
        transition: box-shadow, transform, color;
        transition-duration: 0.2s, 0.2s, 0.2s;
        transition-timing-function: ease, ease, ease;
        transition-delay: 0s, 0s, 0s;

        font-family: 'Oswald', sans-serif;
        cursor: pointer;
        font-size: 1.2em;
        font-weight: 500;
        margin: 2%;
        width: 50%;
        background-color: rgb(0, 0, 0);
        border-radius: 10px;
        border: 0;
        box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
            0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
            0 1px 2px 1px rgba(0, 0, 0, 0) inset,
            0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
        background-image: linear-gradient(
            -45deg,
            rgb(131, 131, 131),
            rgb(34, 34, 34)
        );
        color: #e6eaef;
    }
    button:hover, button:focus{
        /*  box-shadow: 0px 2px 8px 2px #888888; */
        font-size: 1.2em;
        /* text-shadow: 2.9px 2.95px 2.95px #000000;*/

        box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
            0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
            0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
    }
    button::-moz-focus-inner {
        border: 0;
    }
    button:active {
        box-shadow: 0px 1px 3px 1px #888888;
        font-size: 1.2em;
        box-shadow: 0 5px #666;
        transform: translateY(4px);

        box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
            0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
            0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
        transition: 0s;
        color: rgba(18, 104, 117, 0.616);
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    .accounts{
        width: 90%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .each-account{
        transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
        transition: box-shadow, transform, color;
        transition-duration: 0.2s, 0.2s, 0.2s;
        transition-timing-function: ease, ease, ease;
        transition-delay: 0s, 0s, 0s;

        cursor: pointer;
        box-shadow: 0px 1px 1px 1px #888888;
        
        border-radius: 20px;

        background-color: rgba(0, 0, 0, 0.5);
        background: #117a8a ;
        box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
            0 5px 5px -1px rgba(0, 0, 0, 0.644), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
            0 1px 2px 1px rgba(0, 0, 0, 0) inset,
            0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
            background-image: linear-gradient(
            -45deg  #117a8a,
            #f8f8f8
        ); 
        box-sizing: border-box;
        padding: 1%;
        color: #e6eaef;
        margin: 1%;
        min-width: 40%;
    }
    .each-account:hover{
        box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
            0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
            0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
        text-shadow: 2.9px 2.95px 2.95px black;
    }
    .each-account:active{
        box-shadow: 0px 1px 3px 1px #888888;
        box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
            0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
            0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
    }
    .each-account-selected{
        background-color: rgba(0, 0, 0, 0.5);
        background-image: linear-gradient(
            -45deg rgb(78, 75, 75),
            rgba(36, 35, 35, 0.5)
        )!important;
        border-radius: 20px;
        padding: 1%;
        /* box-shadow: 0px 1px 3px 1px #888888; */
        /* box-shadow: 0 5px #666; */
        transform: translateY(4px);

        box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
            0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
            0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
        transition: 0s;
        color: rgba(15, 201, 230, 0.911);
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    .each-account-selected:hover{
        background-color: rgba(0, 0, 0, 0.5);
        background-image: linear-gradient(
            -45deg rgb(78, 75, 75),
            rgba(36, 35, 35, 0.5)
        )!important;
        
        box-shadow: 0px 1px 3px 1px #888888;
        box-shadow: 0 5px #666;
        transform: translateY(4px);

        box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
            0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
            0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
        transition: 0s;
        color: rgba(15, 201, 230, 0.911);
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    .each-account p{
        text-align: center;
    }
    .error{
        color: #e80000;
    }
    .error-invi{
        visibility: hidden;
        color: #e80000;
    }
    .amount{
        margin: 5% 0;
        font-size: 1.3em;
    }
    .amount-invi{
        margin: 5% 0;
        font-size: 1.3em;
        visibility: hidden;
    }
    span{
        font-size:1.2em;
    }
    .msg{
      color: #1db802;  
    }
    .no-acc{
        color: #e80000;
        font-size: 1.3em;
    }

/* Responsive */
    @media (max-width: 720px){
        .payment-form{
            width:90%;
            font-size: 0.9em;
            height: 90vh;
            overflow: auto;
        }
        button{
            width: 85%;
        }
        .amount{
            text-align:center;
        }
        /* .accounts{
            font-size: 0.8em;
        } */
    }
</style>