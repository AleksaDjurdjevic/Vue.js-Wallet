<template>
  <div class = "savings-view-details">
      <h2>{{singleSaving.sav_description}}</h2>

      <div class="table">
          <div class="row">
              <div class="cell">Cilj</div>
              <div class="cell">{{singleSaving.sav_amount + " " + singleSaving.acc_type_name}}</div>
          </div>
          <div class="row">
                <div class="cell">Do sada uplaćeno</div>
                <div class="cell">{{singleSaving.sav_amount_accumulated + " " + singleSaving.acc_type_name}}</div>
          </div>
          <div class="row" v-if = "singleSaving.leftover_amount >= 0">
              <div class="cell">Preostalo za uplatu</div>
              <div class="cell">{{singleSaving.leftover_amount + " " + singleSaving.acc_type_name}}</div>
          </div>
          <div class="row">
              <div class="cell">Broj uplata</div>
                <div class="cell">{{singleSaving.number_of_payments}}</div>
          </div>
          <div class="row">
              <div class="cell">Period štednje</div>
              <div class="cell">{{singleSaving.sav_period + setProperWord(singleSaving.sav_period)}}</div>
          </div>
          <div class="row">
              <div class="cell">Period do kraja štednje</div>
                <div class="cell">{{singleSaving.sav_period-singleSaving.sav_months_in+1 + setProperWord(singleSaving.sav_period)}}</div>
          </div>
          <!-- Dynamic data -->
          <div class="row" v-if = "!singleSaving.sav_end && singleSaving.sav_period - singleSaving.sav_months_in !== 0">
                <div class="cell">Sledeća mesečna rata</div>
                <div class="cell">{{singleSaving.sav_next_month_rate+ " " + singleSaving.acc_type_name}}</div>
          </div>
          <!-- End of dynamic data -->
          <div class="row">
              <div class="cell">Rata se obnavlja</div>
              <div class="cell">{{parseInt(singleSaving.sav_start.slice(-2))}}. dana u mesecu</div>
          </div>
          <div class="row">
              <div class="cell">Datum početka</div>
                <div class="cell">{{formateDate(singleSaving.sav_start)}}</div>
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
                return ' meseci';
            }
            else if(p[p.length-1] == '1'){
                return ' mesec'
            }else if(["2", "3", "4"].includes(p[p.length-1])){
                return ' meseca';
            }else{
                return ' meseci';
            }
        },
        formateDate(date) {
            return date
            .split("-")
            .reverse()
            .join("/");
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
        max-height: 90vh;
        font-size: 1.4em;
        overflow: auto;
    }
    .table{
        width:75%;
        margin-right: 2%;
        display: flex;
        flex-direction: column;
    }
    .row{
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: 0;
        justify-content: space-between;
    }
    .cell{
        width: 50%;
        padding: 0.5%;
    }
    .row .cell:nth-child(1){
        background-color: #17a2b8;
        color: white;
        display: flex;
        justify-content: start;
        align-items: center;
        border-bottom: 1px solid #d3d3d3;
    }
    .row .cell:nth-child(2){
        display: flex;
        justify-content: end;
        align-items: center;
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
        .savings-view-details{
            width:90%;
            font-size: 0.9em;
            height: 90vh;
        }
        h2{
            text-align: center;
            margin: 1%;
        }
        .table{
            width: 95%;
        }
    }
</style>