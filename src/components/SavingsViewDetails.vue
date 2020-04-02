<template>
  <div class = "savings-view-details">
      <h2>{{singleSaving.sav_description}}</h2>

      <div class="table">
          <div class="column">
              <div class="cell">Cilj</div>
              <div class="cell">Do sada uplaćeno</div>
              <div class="cell">Preostalo za uplatu</div>
              <div class="cell">Broj uplata</div>
              <div class="cell">Period štednje</div>
              <div class="cell" v-if = "singleSaving.sav_month_rate_payed>0" >Mesečna rata</div>
              <div class="cell" v-else-if = "singleSaving.fixed_month_rate + singleSaving.sav_month_rate_payed>=0" >Sledeća mesečna rata</div>
              <div class="cell" v-else >Sledeće rate ispod</div>
              <div class="cell">Rata se obnavlja</div>
          </div>
          <div class="column">
              <div class="cell">{{singleSaving.sav_amount + " " + singleSaving.acc_type_name}}</div>
              <div class="cell">{{singleSaving.sav_amount_accumulated + " " + singleSaving.acc_type_name}}</div>
              <div class="cell">{{singleSaving.leftover_amount + " " + singleSaving.acc_type_name}}</div>
              <div class="cell">{{singleSaving.number_of_payments}}</div>
              <div class="cell">{{setProperWord(singleSaving.sav_period)}}</div>
              <!-- Dynamic data -->
              <div v-if = "singleSaving.sav_month_rate_payed>0" class="cell">{{singleSaving.sav_month_rate_payed + " " + singleSaving.acc_type_name}}</div>
              <div class="cell" v-else-if = "singleSaving.fixed_month_rate + singleSaving.sav_month_rate_payed>=0" >{{singleSaving.fixed_month_rate + singleSaving.sav_month_rate_payed}}{{" " + singleSaving.acc_type_name}}</div>
              <div class="cell" v-else>{{singleSaving.fixed_month_rate + " " + singleSaving.acc_type_name}}</div>
              <div class="cell">{{parseInt(singleSaving.sav_start.slice(-2))}}. dana u mesecu</div>
          </div>
      </div>

      <button @click = "$emit('viewing-details')">Povratak na štednje</button>
  </div>
</template>

<script>
export default {
    data(){
        return {
           singleSaving: [] 
        }
    },
    props:{
        savings: Array,
        sav_id: Number
    },
    methods:{
        getSingleSaving(){
            for (let i in this.savings){
                if(this.savings[i].sav_id === this.sav_id){
                    this.singleSaving = this.savings[i];
                }
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
                return p + ' meseci';
            }
        }
    },
    created(){
        this.getSingleSaving();
    }
}
</script>

<style scoped>
    .savings-view-details{
        width: 45%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1.2em;
        min-height: 50vh;
        font-size: 1.4em;
    }
    .table{
        width:75%;
        display: flex;
    }
    .cell{
        padding: 1%;
    }
    .column{
        width:50%;
        height: 100%;
    }
    .column:nth-child(1){
        background-color: #17a2b8;
        color: white;
    }
    .column:nth-child(1) .cell{
        border-bottom: 1px solid lightgray;
    }
    .column:nth-child(2){
        text-align: end;
    }
    .column:nth-child(2) .cell{
        border-bottom: 1px solid #17a2b8;
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
</style>