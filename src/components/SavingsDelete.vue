<template>
  <div class="delete-saving">
      <div class="">
          <p>Da li ste sigurni da zelite da obrisete stednju?</p>
          <p>Novac uplacen na stednju ce vam biti refundiran na racun ili racune sa kojih ste uplacivali.</p>
          <button @click = "deleteSavings">Da</button>
          <button @click = "$emit('deleting-saving')">Ne</button>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    props: {
        sav_id: Number,
        savings: Array
    },
    methods: {
        deleteSavings(){
            let paymentsToDelete = []; // koje sve uplate da obrisem (sav_pay_id)
            let accAndAmountToRefund = {} // objekat koji sadrzi id racuna i kolicinu koju treba da refundiram
            let repeatedAccs = []; // niz racuna koji se ponavljaju u iteraciji kroz uplate
            for (let i in this.savings){ // pristupam objektu svih stednji usera
                if(this.savings[i].sav_id == this.sav_id){ /* ako je sav_id u tom pojedinacnom objektu 
                jednak sav_id objektu na koji je kliknut, te uplate mi trebaju*/
                    for(let j in this.savings[i].payments){ //za svaku uplatu..
                        paymentsToDelete.push(this.savings[i].payments[j].sav_pay_id); //izvuci id uplata koji su za brisanje
                        if (repeatedAccs.includes(this.savings[i].payments[j].acc_id)){ //ako je neki racun vec obavio uplatu pre ove
                                                                                        //Samo azuriraj kolicinu novca za refundaciju
                            accAndAmountToRefund[this.savings[i].payments[j].acc_id] += this.savings[i].payments[j].sav_pay_amount; 
                        }else{
                            repeatedAccs.push(this.savings[i].payments[j].acc_id);//ako nije, dodaj novi "acc_id: amount" u "accAndAmountToRefund"
                            accAndAmountToRefund[this.savings[i].payments[j].acc_id] = this.savings[i].payments[j].sav_pay_amount;
                        }
                    }
                }
            }
            axios.post('http://053n122.mars-e1.mars-hosting.com/api/delete/deleteSavings', {
                sav_id: this.sav_id,
                sid: localStorage.getItem('sid'),
                accAndAmountToRefund,
                paymentsToDelete
            }).then(()=>{
                this.$emit("get-savings");
                this.$emit('deleting-saving');
            });
        }
    }
}
</script>

<style scoped>

</style>