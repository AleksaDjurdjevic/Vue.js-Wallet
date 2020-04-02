<template>
  <div class="view-payments">
    <div class="all-payments" v-if= "showingCalendar === false">
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
    </div>
    <p class = "no-payments" v-if= "payments.length === 0">{{date === '' ? placeholder : 'Nema uplata za: ' + date}}</p>
    <button class="visible-buttons" v-if = "showingCalendar === false" @click = "msg = ''; showingCalendar = true; date = ''; getPayments()">Klikni za prikaz uplata po datumu</button>
    <button v-if = "date !== ''" class="visible-buttons" @click = "getPayments(); showingCalendar = false; date = ''; msg = ''">Poništi pretragu po datumu</button>
    <div class = "show-calendar" v-if = "showingCalendar">
        <p>Izaberite datum</p>
        <calendar
            @selectDate = 'getPaymentsByDate'
            @showCallEmit = "showingCalendar = false"
        />
        <button @click = "showingCalendar = false;">Nazad na pregled uplata</button>
    </div>
    <button class="visible-buttons" @click = "$emit('viewing-payments')">Povratak na štednje</button>
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
            msg: '',
            date: '',
            placeholder: 'Nema uplata za ovu štednju.'
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
            this.date = date;

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
        justify-content: center;
        align-items: center;
        font-size: 1.2em;
        min-height: 40vh;
    }
    .all-payments{
        width: 100%;
        margin-bottom: 5%;
    }
    .each-payment{
        box-sizing: border-box;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        border-bottom: 1px solid #17a2b8;
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
    .show-calendar p{
        font-size: 1.5em;
    }
    .show-calendar button{
        width: 100%;
        margin: 10% 0;
    }
    @keyframes button{
        0% {background-color: radial-gradient(36% 51% at 36% 50%, #eaecec 0%, #CACACA 100%) repeat 50% 50% / 100% 100%;}
        100%{background-color: rgb(192, 190, 190)}
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
        margin: 0.6%;
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
    .visible-buttons{
        margin: 2% 0;
    }
    .message{
        color: #1db802;
    }
    .no-payments{
        font-size: 1.5em;
    }
</style>