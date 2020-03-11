<template>
  <div class="ChartXY" ref="chartdiv"></div>
</template>

<script>
import { mapState } from "vuex"
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
//import * as $amchartsdark from "@amcharts/amcharts4/amcharts";

am4core.useTheme(am4themes_animated);

export default {
  name: "ChartXY",
  props:['showChart'],
  data() {
    return {
     
    };
  },
  computed:{
      ...mapState(["paramsForChart"])
  },
  methods: {
    crearteChart(dataForChart) {
     

          let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart3D);

          chart.paddingBottom = 30;
          chart.angle = 35;
          chart.paddingRight = 20;
          chart.hiddenState.properties.opacity = 0;

          
          // Add data
          chart.data = dataForChart;

          // Create axes
          var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "tip_transakcije";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 20;
          categoryAxis.renderer.inside = true;
          categoryAxis.renderer.grid.template.disabled = true;
          categoryAxis.getCellEndPosition = columnTemplate;

          let labelTemplate = categoryAxis.renderer.labels.template;
          labelTemplate.rotation = -90;
          labelTemplate.horizontalCenter = "left";
          labelTemplate.verticalCenter = "middle";
          labelTemplate.dy = 10; // moves it a bit down;
          labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

          var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.renderer.grid.template.disabled = true;

          // Create series
          var series = chart.series.push(new am4charts.ConeSeries());
          series.dataFields.valueY = "iznos";
          series.dataFields.categoryX = "tip_transakcije";

          var columnTemplate = series.columns.template;
          columnTemplate.adapter.add("fill", function(fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
          });

          columnTemplate.adapter.add("stroke", function(stroke, target) {
            return chart.colors.getIndex(target.dataItem.index);
          });

          // end am4core.ready()

          chart.legend = new am4charts.Legend();
          series.columns.template.showTooltipOn = "always";
       
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
.ChartXY {
  width: 50%;
  height: 500px;
  color: rgba(238, 14, 14, 0.945);
  padding: 20px;
}
</style>