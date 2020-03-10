<template>
  <div class="view-payments">
      <p v-if= "payments.length == 0">Nema uplata</p>
      <div class="each-payment" v-for = "(payment, index) in payments" :key='index'>
        <span>{{"Iznos uplate " + payment.sav_pay_amount + " " + payment.acc_type_name}} |</span>
        <span>{{" Datum uplate " + payment.sav_pay_date}}</span>
        <span 
            @click = "deleteSinglePayment(payment.sav_pay_id, payment.acc_id, payment.sav_pay_amount)" 
            style = "font-size: 20px;"
            > X
        </span>
      </div>
      <p>{{msg}}</p>
      <p v-if = "showingCalendar == false" @click = "showingCalendar = true">Klikni za prikaz uplata po datumu</p>
      <div v-if = "showingCalendar">
        <span>Izaberi datum</span>
        <span @click = "resetPayments">Nazad</span>
        <calendar
            @selectDate = 'getPaymentsByDate'
            @showCallEmit = "showingCalendar = false"
        />
      </div>
      
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
            })
        },
        resetPayments(){
            this.showingCalendar = false;
            this.payments = this.allPayments;
        }
    },
    mounted(){
        this.getPayments();
    }
}
</script>

<style scoped>
.showingCalendar{
    margin: 15px;
}

</style>