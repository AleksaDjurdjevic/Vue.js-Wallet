<template>
    <div class="add-savings-form">
        <h2>Dodaj novu štednju</h2>
        <label for="new-sav-desc">Dodaj naziv/kratak opis štednje</label>
            <input id = "new-sav-desc" type="text" v-model = "newSavDesc">
        <label for="new-sav-amount">Željena količina novca</label>
            <input id = "new-sav-amount" type="number" v-model = "newSavAmount">
        <label for="new-sav-period">Period za koji želite da uštedite (u mesecima)</label>
            <input id = "new-sav-period" type="number" v-model = "newSavPeriod">

        <select class="add-accounts" v-model = "type">
            <option disabled value="">Izaberite valutu štednje:</option>
            <option v-for = "eachType in accounts" 
            :value = "eachType.acc_type_id" 
            :key="eachType.acc_type_id">
                {{eachType.acc_type_name}}</option>
        </select>

        <button @click = "addSaving">Kreiraj</button>
        <button @click = "$emit('adding-saving')">Povratak na štednje</button>

        <p class = "message">{{error}}</p>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data (){
        return {
            newSavDesc: '',
            newSavAmount: '',
            newSavPeriod: '',
            error: '',
            accounts: '',
            type: ''
        }
    },
    methods: {
        getAccounts(){
            axios.get(`http://053n122.mars-e1.mars-hosting.com/api/get/getAllAccountTypes`)
            .then(r=>{
                this.accounts = r.data.data;
            })
        },
        addSaving(){
            this.error = "";
            if(this.newSavDesc == ""){
                this.error = "Izaberite naziv/opis štednje.";

            }else if(this.newSavDesc.length > 55){
                this.error = "Naziv/opis štednje je predugačak.";
                this.newSavDesc = "";

            }else if(this.newSavPeriod == ""){
                this.error = "Unesite period štednje.";

            }else if(this.newSavPeriod <= 0){
                this.error = "Period štednje mora biti pozitivan broj i veći od 0.";

            }else if(isNaN(Number(this.newSavPeriod))){
                this.error = "Period mora biti broj.";

            }else if(this.newSavAmount == ""){
                this.error = "Unesite željenu količinu.";
                
            }else if(this.newSavAmount <= 0){
                this.error = "Željena količina mora biti pozitivan broj i veći od 0.";

            }else if(this.type ===''){
                this.error = "Unesite valutu štednje.";

            }else{
                axios.post('http://053n122.mars-e1.mars-hosting.com/api/wallet/addSavings', {
                    sid: localStorage.getItem('sid'),
                    savAmount: this.newSavAmount,
                    savDescription: this.newSavDesc,
                    savPeriod: this.newSavPeriod,
                    accTypeId: this.type
                }).then(()=>{
                    this.newSavAmount = "";
                    this.newSavDesc = "";
                    this.newSavPeriod = "";
                    this.$emit('adding-saving');
                    this.$emit('get-savings');
                })
            } 
        }
    },
    mounted(){
        this.getAccounts(); 
    }
}
</script>

<style scoped>
    @keyframes button{
        0% {background-color: rgb(234, 236, 236)}
        100%{background-color: rgb(192, 190, 190)}
    }
    @keyframes button-rev{
        0% {background-color: rgb(192, 190, 190)}
        100%{background-color: rgb(234, 236, 236)}
    }
    .add-savings-form{
        font-size: 1.5em;
        display: flex;
        flex-direction: column;
        width: 30%;
        align-items: center;
    }
    input, select{
        width: 80%;
        margin-bottom: 1%;
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
        margin: 4%;
        width: 72%;
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
    .message{
        color: #e80000;
        text-align: center;
    }
    .add-accounts{
        font-family: 'Oswald', sans-serif;
    }
</style>