<template>
  <div class="chartVue" ref="chartdiv"></div>
</template>

<script>
//import {mapGetters} from 'vuex'
import { mapState } from "vuex";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default {
  name: "ChartCircle",
  props:['setParamsForChartTrue'],

  data() {
    return {
     chart:null,
     
      defParamsForChart:[{
                      "tip_transakcije": "Ime Računa",
                      "iznos": 195550
                  }, {
                      "tip_transakcije": "Rashod",
                      "iznos": 135455
                  }, {
                      "tip_transakcije": "Prihod",
                      "iznos": 148050
                  }, {
                      "tip_transakcije": "Štednja",
                      "iznos": 130200
                  }]
    };
  },
  computed: {
    ...mapState(["paramsForChart"])
    // ...mapGetters(['getDeffAcc'])
  },
  methods: {
   
    crearteChart(dataForChart) {
       this.chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart);

     this.chart.paddingRight = 20;
      this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
console.log(dataForChart + "dataForChart-------------------------------")
      this.chart.data = (dataForChart != '' )?dataForChart:   this.defParamsForChart;

      
     // this.chart.radius = am4core.percent(70);
    //  this.chart.innerRadius = am4core.percent(40);

 this.chart.radius = am4core.percent(74);
   this.chart.innerRadius = am4core.percent(36);
      


      this.chart.startAngle = 0;
      this.chart.endAngle = 360;

      var series = this.chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "iznos";
      series.dataFields.category = "tip_transakcije";

      series.slices.template.cornerRadius = 6;
      series.slices.template.innerCornerRadius = 4;
    
     //series.slices.template.fillOpacity =0.5;
    //series.slices.template.draggable = true;
      series.slices.template.inert = true;
      series.alignLabels = false;
    
      series.slices.template.stroke = am4core.color("#4a2abb");
      series.slices.template.strokeWidth = 4;
      series.slices.template.strokeOpacity = 0.09;
      

     // series.slices.template.fill = am4core.getCurrentThemes()
     // series.slices.template.fill = am4core.color("rgba(8, 8, 8, 0.404)")

      series.hiddenState.properties.startAngle = 90;
      series.hiddenState.properties.endAngle = 90;

      this.chart.legend = new am4charts.Legend();
    }
  },
  mounted() {
   this.crearteChart(this.paramsForChart);
  },
  watch:{
      paramsForChart(setNewValue){
        if(setNewValue)
          this.crearteChart(this.paramsForChart);
      }
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chartVue {
  width: 100%;
  height: 400px;
}
</style>