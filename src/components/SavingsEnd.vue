<template>
<div class="delete-saving" :key="key">
    <p>Izaberite račun na koji želite da podignete sredstva</p>
    <div class="accounts" v-if = "accounts.length>1">
        <div class = "each-account" 
            :class="{'each-account-selected' : account.selected}" 
            v-for = "account in accounts" 
            :key="account.acc_id"
            @click = "setAcc(account)"
        >
            <p>{{account.acc_name}}</p>
            <p>{{account.acc_amount + " " + account.acc_type_name}}</p>
        </div>
    </div>
    <div class="accounts" v-if = "accounts.length===1">
        <div class="each-account-selected">
            <p>{{accounts[0].acc_name}}</p>
            <p>{{accounts[0].acc_amount + " " + accounts[0].acc_type_name}}</p>
        </div>acc_name
    </div>
    <div class="buttons">
        <button @click = "endingSaving">Potvrdite</button>
        <button @click = "$emit('ending-saving')">Povratak na štednje</button>
    </div>
    <p class="error">{{error}}</p>
</div>
</template>

<script>
import axios from 'axios';
export default {
    data () {
        return {
            singleSaving: [],
            accounts: [],
            acc_id: '',
            key: 0,
            error: ''
        }
    },
    props: {
        sav_id: Number,
        savings: Array
    },
    methods: {
        endingSaving(){
            if(this.acc_id === ''){
                this.error = "Izaberite račun.";
            }else{
                axios.post('http://053n122.mars-e1.mars-hosting.com/api/wallet/endSaving', {
                    sav_id: this.sav_id,
                    sav_amountPlus: this.singleSaving.sav_amount_accumulated,
                    acc_id: this.acc_id,
                    sid: localStorage.getItem('sid'),
                }).then(()=>{
                    this.$emit("get-savings");
                    this.$emit('ending-saving');
                }).catch(()=>{
                    this.error = "Izaberite račun.";
                    this.$emit('ending-saving');
                });
            }  
        },
        getSingleSaving(){
            for (let i in this.savings){
                if(this.savings[i].sav_id == this.sav_id){
                    this.singleSaving = this.savings[i];
                }
            }
        },
        getAccounts(){
            axios.post(`http://053n122.mars-e1.mars-hosting.com/api/get/getAccounts/${this.singleSaving.acc_type_name.toLowerCase()}`, {sid: localStorage.getItem('sid')})
            .then(r=>{
                this.accounts = r.data.data;
                if (this.accounts.length == 1){
                    this.acc_id = this.accounts[0].acc_id;
                }else{
                    for (let i in this.accounts){
                        this.accounts[i].selected = false;
                    }
                }
            }) 
        },
        setAcc(account){
            this.acc_id = account.acc_id;
            for (let i in this.accounts){
                if(this.accounts[i].acc_id === account.acc_id){
                    this.accounts[i].selected = true;
                }else{
                   this.accounts[i].selected = false; 
                }
            }
            this.key++;
        }
    },
    created(){
        this.getSingleSaving();
        this.getAccounts();
    },
}
</script>

<style scoped>
    .delete-saving{
        width: 50%;
        font-size: 1.5em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .delete-saving p:nth-child(1){
        margin-bottom: 5%;
    }
    .buttons{
        width: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 5%;
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
    .accounts{
        width: 90%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .each-account{
        transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
        transition: box-shadow, transform, color;
        transition-duration: 0.2s, 0.2s, 0.2s;
        transition-timing-function: ease, ease, ease;
        transition-delay: 0s, 0s, 0s;

        cursor: pointer;
        box-shadow: 0px 1px 1px 1px #888888;
        
        border-radius: 20px;

        background-color: rgba(0, 0, 0, 0.5);
        background: #117a8a ;
        box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
            0 5px 5px -1px rgba(0, 0, 0, 0.644), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
            0 1px 2px 1px rgba(0, 0, 0, 0) inset,
            0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
            background-image: linear-gradient(
            -45deg  #117a8a,
            #f8f8f8
        ); 
        box-sizing: border-box;
        padding: 1%;
        color: #e6eaef;
        margin: 1%;
    }
    .each-account:hover{
        box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
            0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
            0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
        text-shadow: 2.9px 2.95px 2.95px black;
    }
    .each-account:active{
        box-shadow: 0px 1px 3px 1px #888888;
        box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
            0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
            0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
    }
    .each-account-selected{
        background-color: rgba(0, 0, 0, 0.5);
        background-image: linear-gradient(
            -45deg rgb(78, 75, 75),
            rgba(36, 35, 35, 0.5)
        )!important;
        border-radius: 20px;
        padding: 1%;
        transform: translateY(4px);

        box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
            0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
            0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
        transition: 0s;
        color: rgba(15, 201, 230, 0.911);
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    .each-account-selected:hover{
        background-color: rgba(0, 0, 0, 0.5);
        background-image: linear-gradient(
            -45deg rgb(78, 75, 75),
            rgba(36, 35, 35, 0.5)
        )!important;
        
        box-shadow: 0px 1px 3px 1px #888888;
        box-shadow: 0 5px #666;
        transform: translateY(4px);

        box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
            0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
            0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
        transition: 0s;
        color: rgba(15, 201, 230, 0.911);
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    .each-account p{
        text-align: center;
    }
    .error{
        color: #e80000;
    }
</style>