<template>
  <div class="view-payments">
      <p v-if= "payments.length == 0">Nema uplata</p>
      <div class="each-payment" v-for = "(payment, index) in payments" :key='index'>
        <span>{{"Iznos uplate " + payment.sav_pay_amount + " " + payment.acc_type_name}} |</span>
        <span>{{" Datum uplate " + payment.sav_pay_date}}</span>
      </div>
      <p v-if = "showingCalendar == false" @click = "showingCalendar = true">Klikni za prikaz uplata po datumu</p>
      <div v-if = "showingCalendar">
        <span>Izaberi datum</span>
        <span @click = "this.showingCalendar =  false">Nazad</span>
        <calendar
            @selectDate = 'getPaymentsByDate'
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
            })
        },
        getPaymentsByDate(date){

            let dateParts = date.split("-");
            if (dateParts[2].length === 1){
                dateParts[2] = "0" + dateParts[2];
            }
            date = dateParts.join("-");
        
            this.getPayments();
            
            for (let i = 0; i<this.payments.length; i++){
                if (this.payments[i].sav_pay_date !== date){
                    this.payments.splice(i, 1);
                    i = i - 1;                
                }
            }
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