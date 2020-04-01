<template>
    <div class="savings-wrapper">
        <!-- div of whole component -->
        <!-- Left side -->
        <div class="aside">
            
            <!-- Sort -->
            <div class="sorting">
                <button @click = "addingSaving = true">Dodaj štednju</button>

                <input type="radio" id="sort0" value = 'sav_start' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                <label for="sort0">Po datumu kreiranja</label>
                <br>
                <input type="radio" id="sort1" value = 'sav_amount' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                <label for="sort1">Po cilju</label>
                <br>
                <input type="radio" id="sort2" value = 'sav_amount_accumulated' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                <label for="sort2">Po uplaćenom iznosu</label>
                <br>
                <input type="radio" id="sort3" value = 'sav_period' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                <label for="sort3">Po periodu</label>
                <br>
                <input type="radio" id="sort4" value = 'leftover_amount' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                <label for="sort4">Po preostalom iznosu</label>
                <br>
                <input type="radio" id="sort5" value = 'number_of_payments' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                <label for="sort5">Po uplatama</label>
                <br>
                <input type="radio" id="sort6" value = 'sav_month_rate' v-model="property" @change = "savingSort(sortOrder)" @click = "savingSort(sortOrder)">
                <label for="sort6">Po mesečnoj rati</label>

                <div class="sort-order">
                    <input type="radio" id="asc" value = "asc" v-model="sortOrder" @change = "savingSort('asc')">
                    <label for="asc">Rastuće</label>
                    <br>
                    <input type="radio" id="desc" value = "desc" v-model="sortOrder" @change = "savingSort('desc')">
                    <label for="desc">Padajuće</label>
                </div>
            </div>
        </div>
        <!-- Right side -->
        <div class="main" :key="keyChange">
            <!-- Wrapper for all savings -->
            <div class="all-savings"  v-for = "(saving, index) in savings" :key = 'saving.sav_description'>
                <div class="each-saving-white">
                    <p :class = "{hover: saving.hover}" @mouseover="displaySavingFullName(index, true)" @mouseleave="displaySavingFullName(index, false)">{{setProperSavingsNameLength(saving.sav_description, saving.hover)}}</p>
                </div>
                <div :class="'each-saving' + setClassForSavings(index+1)">
                    <div class="saving-status"><p>Status :</p></div>
                    <div class="data">
                        <div class="data-row">
                            <span class='span-details'>Cilj: {{saving.sav_amount + " " + saving.acc_type_name}}</span>
                            <span class='span-details'>Do sad uplaćeno: {{saving.sav_amount_accumulated}}{{" " + saving.acc_type_name}}</span>
                        </div>
                        <div class="data-row">
                            <span class='span-details'>Period štednje: {{saving.sav_period +" "+ setProperWord(saving.sav_period)}} </span>
                            <span class='span-details'>Preostala količina novca za uplatu: {{saving.leftover_amount + " " + saving.acc_type_name}}</span>
                        </div>
                        <div class="data-row">
                            <span class='span-details'>Ukupan broj uplata: {{saving.number_of_payments}}</span>
                            <span class='span-details'>Mesečni doprinos: {{saving.sav_month_rate = calculateRate(saving.leftover_amount, saving.sav_start, saving.sav_period)}}{{" " + saving.acc_type_name}}</span>
                        </div>
                    </div>
                    <div class="buttons">
                        <button @click = "preparePayment(saving.sav_id)">Uplati na štednju</button>
                        <button @click = "viewPayments(saving.sav_id)">Pregled uplata</button>
                        <button @click = "deleteSavings(saving.sav_id)">Obriši štednju</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Conditional components -->
        <!-- Shade div -->
        <div class="payment-processing" v-if ="makingPayment || addingSaving || deletingSaving || viewingPayments" 
            @click =    "makingPayment = false; 
                        addingSaving = false; 
                        deletingSaving = false;
                        viewingPayments = false;
                        error = '';">
        </div>
        <!-- Div for making a payment -->
        <savings-add-payment v-if ="makingPayment"
            :savings = "savings"
            :sav_id = "sav_id"
            @get-savings = "getSavings"
            @making-payment = "makingPayment = false"
        />

        <!-- Div for creating a saving -->
        <savings-add  v-if ="addingSaving"
            @get-savings = "getSavings"
            @adding-saving = "addingSaving = false"
        />

        <!-- Div for deleting a saving -->
        <savings-delete v-if ="deletingSaving"
            :sav_id = "sav_id"
            :savings = "savings"
            @get-savings = "getSavings"
            @deleting-saving = "deletingSaving = false"
        />

        <!-- Div for viewing payments -->
        <savings-view-payments v-if ="viewingPayments"
            :sav_id = "sav_id"
            @get-savings = "getSavings"
            @viewing-payments = "viewingPayments = false"
        />
    </div>
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex';
import SavingsAdd from '../components/SavingsAdd.vue';
import SavingsAddPayment from '../components/SavingsAddPayment.vue';
import SavingsDelete from '../components/SavingsDelete.vue';
import SavingsViewPayments from '../components/SavingsViewPayments.vue';
export default {
    data () {
        return {
            savings: [],
            makingPayment: false,
            deletingSaving: false,
            addingSaving: false,
            viewingPayments: false,
            sav_id: '',
            error: '',
            property: 'sav_start',
            sortOrder: 'asc',
            keyChange: 0
        }
    },
    components: {
        "savings-add": SavingsAdd,
        "savings-add-payment": SavingsAddPayment,
        "savings-delete": SavingsDelete,
        "savings-view-payments": SavingsViewPayments
    },
    computed: {
        ...mapState(['isLoggedIn'])
    },
    methods: {
        savingSort(sort){
            this.sortOrder = sort;
            
            if (this.savings !== []) {
                if(this.sortOrder === 'asc'){
                    this.savings.sort((a, b) => (a[this.property] > b[this.property]) ? 1 : -1);
                }else if(this.sortOrder === 'desc'){
                    this.savings.sort((a, b) => (a[this.property] > b[this.property]) ? -1 : 1);
                }
            }    
        },
        getSavings(){
            axios.post('http://053n122.mars-e1.mars-hosting.com/api/get/getSavings', {sid: localStorage.getItem('sid')})
            .then(r=>{
                if(r.data.all_savings !== undefined){
                    this.savings = r.data.all_savings;
                    for(let i=0; i<this.savings.length; i++){
                        this.savings[i].hover = false;
                    }
                }
                
            });
        },
        calculateRate(leftover_amount, start, period){
            let currentDate = new Date();
            let startParts = start.split('-');
            let startMonth = parseInt(startParts[1]);
            let monthsLeft = (currentDate.getMonth() + 1) - startMonth;
            if (monthsLeft<0){
                monthsLeft += 12;
            }
            let leftoverMonths = period - monthsLeft;
            
            return Math.ceil(leftover_amount / leftoverMonths);

        },
        preparePayment(sav_id){
            this.sav_id = sav_id;
            this.makingPayment = true;
        },
        deleteSavings(sav_id){
            this.sav_id = sav_id;
            this.deletingSaving = true; 
        },
        viewPayments(sav_id){
            this.sav_id = sav_id;
            this.viewingPayments = true;
        },
        setClassForSavings(i){
            if(i<5){
                return i;
            }else{
                let devider = Math.floor(i/4);
                return i-4*devider;
            }
        },
        setProperWord(p){
            p = p.toString().split("");
            if(    (p[p.length-1] === "1" && p[p.length-2] === "1")
                || (p[p.length-1] === "2" && p[p.length-2] === "1") 
                || (p[p.length-1] === "3" && p[p.length-2] === "1")
                || (p[p.length-1] === "4" && p[p.length-2] === "1"))
            {
                return 'meseci';
            }
            else if(p[p.length-1] == '1'){
                return 'mesec'
            }else if(["2", "3", "4"].includes(p[p.length-1])){
                return 'meseca';
            }else{
                return 'meseci'
            }
        },
        setProperSavingsNameLength(s, bool){
            if(bool){
                return s
            }else {
                if(s.length>17){
                    return s.substring(17, 0) + " ...";
                }else{
                    return s;
                }
            } 
        },
        displaySavingFullName(index, applying){
            if(this.savings[index].sav_description.length>17){
                if(applying) {
                    if(this.savings[index].hover !== true){
                        this.savings[index].hover = true;
                        this.keyChange++;
                    }
                }else if (!applying){
                    if(this.savings[index].hover !== false){
                        this.savings[index].hover = false;
                        this.keyChange++;
                    }
                }
            }
        }
    },
    mounted(){
        this.getSavings();
        this.$root.$emit('set-selected', 2);
    }
}
</script>

<style scoped>
p{
    margin: 0;
}
.all-savings{
    width: 95%;
    height: 190px;
    position: relative;
    margin-bottom: 1%;
}
.each-saving-white p{
    font-size: 1.8em;
    width: 20%;
    position: relative;
    top: 10%;
    left: 2%;
    height: 80%;
    display:flex;
    justify-content: center;
    align-items: center;
    word-break: break-all;
    /* overflow: auto; */
}
.each-saving-white .hover{
    font-size: 1.8em;
    width: 40%;
    position: relative;
    top: 10%;
    left: 2%;
    height: 80%;
    display:flex;
    justify-content: center;
    align-items: center;
    z-index: 60;
    background-color:white;
    border-radius: 20px;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-sizing: border-box;
    padding: 1%;
}
.each-saving-white .saving-fullname{
    font-size: 1.8em;
    width: 20%;
    position: relative;
    top: 10%;
    left: 2%;
    height: 80%;
    display:flex;
    justify-content: center;
    align-items: center;
    word-break: break-all;
    /* overflow: auto; */
}
.each-saving-white{
    width: 80%;
    height: 80%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: white;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.each-saving1{
    width: 80%;
    height: 80%;
    position: absolute;
    top: 0;
    right: 0;
    background: radial-gradient(100% 100% at 0% 0%, #82c4e3 100%, #67b7dc 100%) repeat 50% 50% / 100% 100%;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.each-saving2{
    width: 80%;
    height: 80%;
    position: absolute;
    top: 0;
    right: 0;
    background: radial-gradient(100% 100% at 0% 0%, #82a7e3 100%, #6794dc 100%) repeat 50% 50% / 100% 100%;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.each-saving3{
    width: 80%;
    height: 80%;
    position: absolute;
    top: 0;
    right: 0;
    background: radial-gradient(100% 100% at 0% 0%, #828ae3 100%, #6771dc 100%) repeat 50% 50% / 100% 100%;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.each-saving4{
    width: 80%;
    height: 80%;
    position: absolute;
    top: 0;
    right: 0;
    background: radial-gradient(100% 100% at 0% 0%, #5cbecd 100%, #17a2b8 100%) repeat 50% 50% / 100% 100%;
    border-radius: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 42px -18px rgba(0,0,0,0.75);
}
.saving-status{
    width: 25%;
    height: 25%;
    background-color: white;
    position: absolute;
    top:30%;
    border-radius: 0 13px 13px 0;
    display:flex;
    justify-content: center;
}
.saving-status p{
    font-size: 1.2em;
    width: 80%;
    height: 80%;
    word-break: break-all; 
    word-wrap: break-word;
    text-align: center;
    margin: 0;
    margin-top: 2%;
}
.data{
    position: absolute;
    top: 5%;
    right: 0;
    color: white;
    width: 65%;
    height: 50%;
    line-height: 75%;
}
.data div{
    display: flex;
    justify-content: space-around;
}
/* Buttons inside a saving */
.buttons{
    position: absolute;
    top: 72%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}
.buttons button{
    transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
    transition-property: box-shadow, transform, color;
    transition-duration: 0.2s, 0.2s, 0.2s;
    transition-timing-function: ease, ease, ease;
    transition-delay: 0s, 0s, 0s;
    font-family: 'Teko', sans-serif;

    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    background-color: rgb(0, 0, 0);
    overflow: hidden;
    border-radius: 10px;

    box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
        0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
        0 1px 2px 1px rgba(0, 0, 0, 0) inset,
        0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
    background-image: linear-gradient(-45deg, rgb(131, 131, 131), rgb(34, 34, 34));
    color: #e6eaef;
}
.buttons button:hover{
  text-shadow: 2.9px 2.95px 2.95px #000000;

  box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
    0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
.buttons button:active{
  box-shadow: 0px 1px 3px 1px #888888;
  box-shadow: 0 5px #666;
  transform: translateY(4px);

  box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
    0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
    0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  transition: 0s;
  color: rgba(18, 104, 117, 0.616);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
  outline: none;
}
/* Universal button style */
button:active, button:focus, button:hover{
    outline: none;
    cursor: pointer;
}
button::-moz-focus-inner {
    border: 0;
}
button{
    border-radius: 13px;
    border: none;
    font-family: "Teko";
    font-size: 1em;
}
/* aside button style */
.sorting button{
    transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
    transition-property: box-shadow, transform, color;
    transition-duration: 0.2s, 0.2s, 0.2s;
    transition-timing-function: ease, ease, ease;
    transition-delay: 0s, 0s, 0s;
    font-family: 'Teko', sans-serif;
    font-size: 1.2em;
    cursor: pointer;

    font-weight: 500;
    background-color: rgb(0, 0, 0);
    overflow: hidden;
    border-radius: 10px;

    box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
        0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
        0 1px 2px 1px rgba(0, 0, 0, 0) inset,
        0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
    background-image: linear-gradient(-45deg, rgb(131, 131, 131), rgb(34, 34, 34));
    color: #e6eaef;
}
.sorting button:hover{
  text-shadow: 2.9px 2.95px 2.95px #000000;

  box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
    0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
.sorting button:active{
  box-shadow: 0px 1px 3px 1px #888888;
  box-shadow: 0 5px #666;
  transform: translateY(4px);

  box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
    0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
    0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  transition: 0s;
  color: rgba(18, 104, 117, 0.616);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
  outline: none;
}
/* Old css */
.savings-wrapper{
    display:flex;
    margin: 0 auto;
    padding-top: 0.5%;
    background: radial-gradient(36% 51% at 36% 50%, #eaecec 0%, #CACACA 100%) repeat 50% 50% / 100% 100%;
    min-height: 92vh;
    box-sizing: border-box;
    padding-bottom: 3%;
    font-size: 0.82em;
}
.aside{
    width:14%;
    margin-left: 2%;
}
.aside .add-saving{
    width:80%;
    top: 14%;
    position: sticky;
}
.main{
    width:80%;
    margin-right: 3%;
}
.span-details{
    display: inline-block;
    margin: 5px;
}
@keyframes opacity{
    0% {opacity:0;}
    100% {opacity: 0.6;}
}
.payment-processing{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: black;
    opacity: 0.6;
    z-index: 10000;
    animation-name: opacity;
    animation-duration: 0.6s;
    display: flex;
    justify-content: center;
    align-content: center;
}
.payment-form, .add-savings-form, .delete-saving, .view-payments {
    background-color: #FAFBFC;
    position: fixed;
    z-index: 10001;
    top: 15%;
    left: 50%;
    transform: translate(-50%, 0);
}
.sort-order{
    margin-top: 30px;
}
.sorting{
    position: sticky;
    top: 15%;
}
.sorting button{
    display: block;
    position: relative;
    margin-bottom: 18%;
    height: 45px;
    width: 80%;
}
.reg-notice{
    position:fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 102;
    color: white;
    font-size: 3em;
}
.payment-processing-logged{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: black;
    opacity: 0.6;
    z-index: 10;
    animation-name: opacity;
    animation-duration: 0.6s;
    display: flex;
    justify-content: center;
    align-content: center;
}
/* button {
  box-shadow: 0 3px 0 0 #367f14, 0 4px 4px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3), 0 1px 2px 1px rgba(0, 0, 0, 0) inset, 0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  background-color: #52C11F;
  background-image: linear-gradient(-45deg, #52C11F, #7ccc14);
  color: #E6EAEF;
  transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
    transition-property: box-shadow, transform, color;
    transition-duration: 0.2s, 0.2s, 0.2s;
    transition-timing-function: ease, ease, ease;
    transition-delay: 0s, 0s, 0s;
}
button:hover {
  box-shadow: 0 3px 0 0 #367f14, 0 6px 4px -1px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset, 0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
button:active {
  box-shadow: 0 0px 0 0 #2d6911, 0 3px 0 0 rgba(0, 0, 0, 0), 0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset, 0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  color: #367f14;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
} */
</style>