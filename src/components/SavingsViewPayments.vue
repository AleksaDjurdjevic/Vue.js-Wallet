<template>
  <div class="view-payments">
    <p v-if= "payments.length === 0">Nema uplata</p>
    <div class="each-payment" v-for = "(payment, index) in payments" :key='index'>
        <div class = "each-info"><span>{{"Iznos uplate: " + payment.sav_pay_amount + " " + payment.acc_type_name}}</span></div>
        <div class = "each-info"><span>{{"Datum uplate: " + payment.sav_pay_date}}</span></div>
        <div class = "each-info"><span>{{"Račun sa kog je uplaćeno: " + payment.acc_name}}</span></div>
        <div class = "each-info"><span
            @click = "deleteSinglePayment(payment.sav_pay_id, payment.acc_id, payment.sav_pay_amount)" 
        > 
            Obriši 
        </span></div>
    </div>
    <p class="click-for-calendar" v-if = "showingCalendar === false" @click = "showingCalendar = true">Klikni za prikaz uplata po datumu</p>
    <div class = "show-calendar" v-if = "showingCalendar">
        <p>Izaberi datum</p>
        <calendar
            @selectDate = 'getPaymentsByDate'
            @showCallEmit = "showingCalendar = false"
        />
        <button @click = "getPayments(); showingCalendar = false">Poništi pretragu po datumu</button>
    </div>
    <p class = "message">{{msg}}</p>   
  </div>
</template>

<script>
import Callendar from '../components/Callendar.vue';
import axios from 'axios';
export default {

    data(){
        return {
            showingCalendar: false,
            payments: [],
            allPayments: [],
            msg: ''
        }
    },
    components: {
        'calendar': Callendar
    },
    props: {
       sav_id: Number,
    },
    methods: {
        getPayments(){
            axios.post("http://053n122.mars-e1.mars-hosting.com/api/get/getSavingsPayments", {
                sid: localStorage.getItem('sid'),
                savId: this.sav_id
            }).then(r=>{
                this.payments = r.data.payments;
                this.allPayments = r.data.payments;
            })
        },
        getPaymentsByDate(date){
            let dateParts = date.split("-");
            if (dateParts[2].length === 1){
                dateParts[2] = "0" + dateParts[2];
            }
            date = dateParts.join("-");
            
            this.payments = this.allPayments;

            let filteredPayments = this.payments.filter(function(payment){
                return payment.sav_pay_date === date;
            })
            
            this.payments = filteredPayments;
        },
        deleteSinglePayment(sav_pay_id, acc_id, sav_pay_amount){
            axios.post("http://053n122.mars-e1.mars-hosting.com/api/delete/deleteSavingsPayment", {
                sid: localStorage.getItem('sid'),
                sav_pay_id,
                acc_id,
                sav_pay_amount
            }).then(r=>{
                this.msg = r.data.msg;
                this.getPayments();
                this.$emit("get-savings");
            }).catch(e=>{
                this.msg = e.response.data.error; 
            });
        }
    },
    mounted(){
        this.getPayments();
    }
}
</script>

<style scoped>
    .view-payments{
        width: 55%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1.2em;
    }
    .each-payment{
        box-sizing: border-box;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
    }
    .each-info:nth-of-type(4):hover{
        cursor: pointer;
        color: #17a2b8;
    }
    .each-payment:hover{
        animation-name: button;
        animation-duration: 0.6s;
        animation-fill-mode: forwards;
    }
    .show-calendar{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    @keyframes button{
        0% {background-color: white}
        100%{background-color: rgb(192, 190, 190)}
    }
    @keyframes button-blue{
        0% {background-color: white}
        100%{background-color: #17a2b8; color: white}
    }
    button{
        background-color: lightgray;
        border-radius: 10px;
        border: none;
        font-family: "Teko";
        font-size: 1em;
        width: 85%;
    }
    button:hover, button:focus{
        cursor: pointer;
        outline: none;
        animation-name: button-blue;
        animation-duration: 0.4s;
        animation-fill-mode: forwards;
    }
    button::-moz-focus-inner {
        border: 0;
    }
    .click-for-calendar:hover{
        cursor: pointer;
        border-radius: 10px;
        animation-name: button-blue;
        animation-duration: 0.4s;
        animation-fill-mode: forwards;
    }
    .click-for-calendar{
        background-color: lightgray;
        border-radius: 10px;
        margin-top: 10%;
    }
    .message{
        color: #1db802;
    }
</style>