<template>
    <div class="savings-wrapper">
        <!-- div of whole component -->
        <!-- Left side -->
        <div class="aside">
            <div class="add-saving">
                <button @click = "addingSaving = true">Dodaj Štednju</button>
            </div>
            <!-- Sort -->
            <div class="sorting">
                <input type="radio" id="sort1" value = 'sav_amount' v-model="property" @change = "savingSort" @click = "savingSort">
                <label for="sort1">Po cilju</label>
                <br>
                <input type="radio" id="sort2" value = 'sav_amount_accumulated' v-model="property" @change = "savingSort" @click = "savingSort">
                <label for="sort2">Po uplaćenom iznosu</label>
                <br>
                <input type="radio" id="sort3" value = 'sav_period' v-model="property" @change = "savingSort" @click = "savingSort">
                <label for="sort3">Po periodu</label>
                <br>
                <input type="radio" id="sort4" value = 'leftover_amount' v-model="property" @change = "savingSort" @click = "savingSort">
                <label for="sort4">Po preostalom iznosu</label>
                <br>
                <input type="radio" id="sort5" value = 'number_of_payments' v-model="property" @change = "savingSort" @click = "savingSort">
                <label for="sort5">Po uplatama</label>
                <br>
                <input type="radio" id="sort6" value = 'sav_month_rate' v-model="property" @change = "savingSort" @click = "savingSort">
                <label for="sort6">Po mesečnoj rati</label>

                <div class="sort-order">
                    <input type="radio" id="asc" value = "asc" v-model="sortOrder" @change = "sortOrder = 'asc'">
                    <label for="asc">Od najnižeg ka najvećem</label>
                    <br>
                    <input type="radio" id="desc" value = "desc" v-model="sortOrder" @change = "sortOrder = 'desc'">
                    <label for="desc">Od najvećeg ka najnižem</label>
                </div>
            </div>
        </div>
        <!-- Right side -->
        <div class="main">
            <!-- Wrapper for all savings -->
            <div class="test"  v-for = "(saving, index) in savings" :key = 'index'>
                <div class="test1"><p>{{setProperSavingsNameLength(saving.sav_description)}}</p></div>
                <div :class="'each-saving' + setClassForSavings(index+1)">
                    <div class="rectangle"><p>Pregled štednje</p></div>
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
                        <button @click = "deleteSavings(saving.sav_id)">Obriši Štednju</button>
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
            property: null,
            sortOrder: 'asc'
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
        savingSort(){
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
        setProperSavingsNameLength(s){
            if(s.length>17){
                return s.substring(17, 0) + "...";
            }else{
                return s;
            } 
        }
    },
    mounted(){
        this.getSavings();
    }
}
</script>

<style scoped>
p{
    margin: 0;
}
.test{
    width: 95%;
    height: 190px;
    position: relative;
    margin-bottom: 1%;
}
.test1 p{
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
.test1{
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
.rectangle{
    width: 25%;
    height: 25%;
    background-color: white;
    position: absolute;
    top:30%;
    border-radius: 0 3px 3px 0;
    display:flex;
    justify-content: center;
}
.rectangle p{
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
.buttons{
    position: absolute;
    top: 72%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}
.buttons button{
    border-radius: 13px;
    background-color: white;
    border: none;
    font-family: "Teko";
    font-size: 1em;
}
@keyframes button{
    0% {background-color: white}
    100%{background-color: rgb(234, 236, 236)}
}
button:active, button:focus, button:hover{
    outline: none;
    cursor: pointer;
}
button::-moz-focus-inner {
    border: 0;
}
button{
    border-radius: 13px;
    background-color: white;
    border: none;
    font-family: "Teko";
    font-size: 1em;
    animation-name: button-rev;
    animation-duration: 0.6s;
    animation-fill-mode: forwards;
}
button:hover{
    animation-name: button;
    animation-duration: 0.6s;
    animation-fill-mode: forwards;
}
/* Old css */
.savings-wrapper{
    display:flex;
    margin: 0 auto;
    padding-top: 0.5%;
    background: radial-gradient(36% 51% at 36% 50%, #eaecec 0%, #CACACA 100%) repeat 50% 50% / 100% 100%;
    min-height: 92vh;
    box-sizing: border-box;
    padding-bottom: 10%;
    font-size: 0.82em;
}
.aside{
    width:14%;
    margin-left: 2%;
}
.aside .add-saving{
    width:80%;
    height: 50px;
    margin: 0 auto;
}
.add-saving button{
    width: 100%;
    height: 100%;
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
    top: 25%;
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
</style>