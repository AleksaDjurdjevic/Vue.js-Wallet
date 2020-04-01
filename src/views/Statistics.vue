<template>
  <div class="statistics">
    <div class="statistics2" v-if="selectAcc === 'null' || selectAcc ===null">
      <h2>
          Nemate pristup statistici jer nemate ni jedan račun.
          <br />Pravljenjem računa imaćete pristup statistici.
        </h2>
    </div>
    <div class="statisticsRow">
      <MonthYear v-bind:accounts="accounts" v-on:selectMonthYear="changeParamsForChart($event)" />
    </div>
    <h1 v-if="message">{{message}}</h1>
    <h1 v-else-if=" selectAcc !== 'null' && selectAcc !== null "> Statistika transakcija za račun: {{ selectAcc }}</h1>
    <div class="statisticsRow">
      <ChartXY class="chart" />
      <ChartCircle class="chart" />
    </div>
  </div>
</template>

<script>
import ChartXY from "@/components/ChartXY.vue";
import ChartCircle from "@/components/ChartCircle2.vue";
import MonthYear from "@/components/MonthYear.vue";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "Statistics",
  components: {
    ChartXY: ChartXY,
    ChartCircle: ChartCircle,
    MonthYear: MonthYear
  },
  data() {
    return {
      showChart: false,
      accName: "",
      accounts: [],
      paramsForChart:[],
      message:'',
      selectAcc: null
    };
  },
   mounted() {
     this.getAccounts();
    this.selectAcc=localStorage.getItem('setDefAcc')
    this.getParamsForChartStatists((this.defAccV!==null)?this.defAccV.acc_name:localStorage.getItem('setDefAcc'));
     this.$root.$emit('set-selected', 3);
  },
  methods: {
    getAccounts() {
      let sid = localStorage.getItem("sid");
      if (sid) {
        axios
          .post(
            "http://053n122.mars-e1.mars-hosting.com/api/get/getAccounts/all",
            { sid: sid }
          )
          .then(response => {
            this.accounts = response.data.data;
          });
      }
    },
    getParamsForChartStatists(acc_name) {
      if(acc_name==='null') return;
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/wallet/statistics", {
          sid: localStorage.getItem("sid"),
          account: acc_name
        })
        .then(response => {
          this.setParamsForChart(response.data.transactions);
          this.showChart = true;
        });
    },
    changeParamsForChart(params){
      axios
        .post("http://053n122.mars-e1.mars-hosting.com/api/get/variousStatisticsForChart", params
         
        )
        .then(response => {
          this.setParamsForChart(response.data.transactions);
          this.paramsForChart=response.data.transactions;
          this.showChart = true;
          this.message=response.data.message
        });
    },
    setParamsForChart(params) {
      this.$store.dispatch("paramsForChartAct", params);
    },
    refreshChart(newValue) {
      this.showChart = false;
      this.getParamsForChartStatists(newValue);
      this.showChart = true;
    }
  },
  watch: {
    paramsForChart(newValue, oldValue) {
      if (oldValue.acc_name !== undefined) {
        this.refreshChart(newValue);
      }
    }
  },
  computed: {
    ...mapState(["defAccV"])
  }
};
</script>

<style  scoped>
.statistics{
  padding: 0 0 0 0;
  background-color:#bebebe79;
 /*   background-color:aliceblue; */
  background-image: linear-gradient(#bebebebb,#FFFFFF, #bebebebb);
  position: relative;
}
.statistics2{
  padding: 0 0 0 0;
  box-sizing: border-box;
  position: absolute;
  min-width: 100%;
  height: 100%;
  background: #00000085;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  overflow: hidden;
}
.statistics2 p,
.statistics2 h2 {
  font-weight: normal;
  color: rgb(255, 255, 255);
  text-shadow: 4px 4px 4px #000000;
}


.statisticsRow {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.chart {
  box-sizing: border-box;
  width: 50%;
  min-width:300px;
}
h1{
  font-weight: normal;
  text-align: center;
  margin-top:1%;
}
</style>