<template>
  <div class="view-payments">
      <p v-if= "payments === []">Jos uvek niste izvrsili uplatu za ovu stednju</p>
      <div class="each-payment" v-for = "(payment, index) in payments" :key='index'>
        <span>{{"Iznos uplate " + payment.sav_pay_amount + " " + acc_type_name}} |</span>
        <span>{{" Datum uplate " + payment.sav_pay_date}}</span>
      </div>
      <calendar 
        @selectDate = 'getDate'
      />
  </div>
</template>

<script>
import Callendar from '../components/Callendar.vue';
export default {
    data(){
        return {
            payments: [],
            acc_type_name: ''
        }
    },
    components: {
        'calendar': Callendar
    },
    props: {
       sav_id: Number,
       savings: Array
   },
   methods: {
       getPayments(){
           for(let i in this.savings){
               if(this.savings[i].sav_id == this.sav_id){
                   this.payments = this.savings[i].payments;
                   this.acc_type_name = this.savings[i].acc_type_name;
               }
           }  
       },
       getDate(date){
           return date;
       }
   },
   mounted(){
       this.getPayments();
   }
}
</script>

<style>

</style>