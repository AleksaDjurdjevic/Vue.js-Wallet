<template>
        <div class="addSavingsForm">
            <h2>Dodaj novu stednju</h2>
            <label for="newSavDesc">Dodaj naziv/opis stednje</label>
                <input id = "newSavDesc" type="text" v-model = "newSavDesc">
            <label for="newSavAmount">Zeljena kolicina novca</label>
                <input id = "newSavAmount" type="number" v-model = "newSavAmount">
            <label for="newSavPeriod">Period za koji zelite da ustedite</label>
                <input id = "newSavPeriod" type="number" v-model = "newSavPeriod">
            <button @click = "addSaving">Kreiraj</button>

            <select class="add-accounts" v-model = "type">
                <option disabled value="">Izaberite tip racuna:</option>
                <option v-for = "eachType in accounts" 
                :value = "eachType.acc_type_id" 
                :key="eachType.acc_type_id">
                    {{eachType.acc_type_name}}</option>
            </select>

            <p>{{error}}</p>
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
                this.error = "Izaberite naziv/opis stednje.";
            }else if(this.newSavPeriod == ""){
                this.error = "Unesite period stednje.";
            }else if(isNaN(Number(this.newSavPeriod))){
                this.error = "Period mora biti broj.";
            }else if(this.newSavAmount == ""){
                this.error = "Unesite zeljenu kolicinu.";
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

<style>

</style>