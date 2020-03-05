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

  data() {
    return {
     
    };
  },
  computed: {
    ...mapState(["paramsForChart"])
    // ...mapGetters(['getDeffAcc'])
  },
  methods: {
   
    crearteChart(dataForChart) {
      let chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart);

      chart.paddingRight = 20;
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = dataForChart;

      chart.radius = am4core.percent(70);
      chart.innerRadius = am4core.percent(40);
      chart.startAngle = 0;
      chart.endAngle = 360;

      var series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "iznos";
      series.dataFields.category = "tip_transakcije";

      series.slices.template.cornerRadius = 10;
      series.slices.template.innerCornerRadius = 7;
      series.slices.template.draggable = true;
      series.slices.template.inert = true;
      series.alignLabels = false;

      // series.slices.template.fill = am4core.getCurrentThemes()
      // series.slices.template.fill = am4core.color("rgba(8, 8, 8, 0.404)")

      series.hiddenState.properties.startAngle = 90;
      series.hiddenState.properties.endAngle = 90;

      chart.legend = new am4charts.Legend();
    }
  },
  mounted() {
   this.crearteChart(this.paramsForChart);
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
  box-sizing: border-box;
  width: 95%;
  height: 500px;
  color: rgba(8, 8, 8, 0.404);
}
</style>