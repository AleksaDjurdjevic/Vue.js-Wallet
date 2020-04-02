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
            <option disabled value="">Izaberite tip štednje:</option>
            <option v-for = "eachType in accounts" 
            :value = "eachType.acc_type_id" 
            :key="eachType.acc_type_id">
                {{eachType.acc_type_name}}</option>
        </select>

        <button @click = "addSaving">Kreiraj</button>

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
                this.error = "Unesite tip štednje.";

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
        border-radius: 13px;
        background-color: white;
        border: none;
        font-family: "Oswald";
        font-size: 1em;
        width: 30%;
        margin-top: 5%;
        animation-name: button-rev;
        animation-duration: 0.6s;
        animation-fill-mode: forwards;
    }
    button:hover, button:focus{
        cursor: pointer;
        outline: none;
        animation-name: button;
        animation-duration: 0.6s;
        animation-fill-mode: forwards;
    }
    button::-moz-focus-inner {
        border: 0;
    }
    .message{
        color: #e80000;
        text-align: center;
    }
</style>