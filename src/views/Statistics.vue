<template>
  <div class="statistics">
    <div class="statisticsRow">
      <MonthYear v-bind:accounts="accounts" v-on:selectMonthYear="changeParamsForChart($event)" />
    </div>
    <h1 v-if="message">{{message}}</h1>
    <h1 v-else-if="selectAcc">Statistika transakcija za račun "{{selectAcc}}"</h1>
    <div class="statisticsRow">
      <ChartXY class="chart" />
      <ChartCircle class="chart" />
    </div>
  </div>
</template>

<script>
import ChartXY from "@/components/ChartXY.vue";
import ChartCircle from "@/components/ChartCircle.vue";
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
      selectAcc:null
    };
  },
   mounted() {
     this.getAccounts();
    this.selectAcc=localStorage.getItem('setDefAcc')
    this.getParamsForChartStatists((this.defAccV!==null)?this.defAccV.acc_name:localStorage.getItem('setDefAcc'));
     
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
            for(let i=0; i<this.accounts.length;i++)
            console.log(this.accounts[i].acc_name +" all accounts from statistic");
          });
      }
    },
    getParamsForChartStatists(acc_name) {
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
          console.log(this.paramsForChart[0]);
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
  background-color:#bebebe79;
 /*   background-color:aliceblue; */
}
.statisticsRow {
  display: flex;
}
.chart {
  box-sizing: border-box;
  width: 50%;
}
h1{
  text-align: center;
  margin-top:1%;
}
</style>