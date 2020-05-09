<template>
  <div class="delete-saving">
      <div class="">
          <p>Novac uplaćen na štednju će vam biti refundiran na račun ili račune sa kojih ste uplaćivali.</p>
            <p>Da li ste sigurni da želite da obrišete štednju?</p>
          <div class="buttons">
            <button @click = "deleteSavings">Da</button>
            <button @click = "$emit('deleting-saving')">Ne</button>
          </div>
          
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
            let paymentsToDelete = [];
            let accAndAmountToRefund = {}
            let AccountsWithMultiplePayments = [];
            for (let i in this.savings){
                if(this.savings[i].sav_id == this.sav_id){
                    for(let j in this.savings[i].payments){
                        paymentsToDelete.push(this.savings[i].payments[j].sav_pay_id);
                        if (AccountsWithMultiplePayments.includes(this.savings[i].payments[j].acc_id)){
                            accAndAmountToRefund[this.savings[i].payments[j].acc_id] += this.savings[i].payments[j].sav_pay_amount; 
                        }else{
                            AccountsWithMultiplePayments.push(this.savings[i].payments[j].acc_id);
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
    .delete-saving{
        width: 30%;
        font-size: 1.5em;
    }
    .buttons{
        display:flex;
        justify-content: space-evenly;
    }
    p{
        margin: 2%;
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
        font-size: 1.2em;
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

/* Responsive */
    @media (max-width: 720px){
        .delete-saving{
            width:90%;
            font-size: 0.9em;
        }
    }
</style>