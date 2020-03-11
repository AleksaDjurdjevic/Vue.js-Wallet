<template>
     <div class="callendar">
        <div class="calendar-header">
           <div class="divI"> <i class="fa fa-fw fa-chevron-left" @click="subtractMonth"></i></div>
            <div class="divM"><h6>{{month + ' - ' + year}}</h6></div>
            <div class="divI" ><i class="fa fa-fw fa-chevron-right" @click="addMonth"></i> </div>
           <div class="divI" @click="showCallendarMet"> <span class="exit"> x</span></div>
        </div>
        
        <ul class="dates" >
            <li class="days" v-for="day in days" :key="day.index" >{{day}}</li>
        </ul>
        <ul class="dates">
            <li class="days emptyD" v-for="blank in firstDayOfMonth" :key="blank.index">&nbsp;</li>
            <li class="days" @click="selectDate(date)"  v-for="date in daysInMonth" :key="date.index" :class="{'current-day': date == initialDate &amp;&amp; month == initialMonth && year == initialYear}">
                <span>{{date}}</span>
           </li>
        </ul>
     
    </div>
   
</template>

<script>
import moment from  'moment'

export default {
  name: 'Callendar',
  data(){
    return{
      today:moment(),
      dateContext:moment(),
      days:['S','M','T','W','T','F','S'],
      daysNum:[],
      num:35
    }
  },

 
  methods:{
      selectDate(day){
        
          let date=this.year+'-'+ moment().month(this.month).format('MM')+'-'+day
          this.showCallendarMet()
          this.$emit('selectDate', date)


      },
      showCallendarMet(){
          this.$emit('showCallEmit',false)
      //  this.showCallendar= x;
      },
    setdaysNum(){
      for(let i=1;i<=this.num;i++){
        this.daysNum.push(i);
      }
    },
    addMonth(){
      let t=this
      t.dateContext= moment(t.dateContext).add(1, 'month')
     },
     subtractMonth: function(){
       let t=this
       t.dateContext= moment(t.dateContext).subtract(1, 'month');
     }
  },
  computed:{
    year:function(){
      let t=this;
      return t.dateContext.format('Y');
    },
    month(){
      let t=this;
      return t.dateContext.format('MMMM')
    },
    day: function(){
      let t=this;
      return t.dateContext.format('H')
    },
    min: function(){
      let t=this
      return t.dateContext.format('m')
    },
    sec: function(){
      let t=this
      return t.dateContext.format('s')
    },
    daysInMonth:function (){
      let t=this
      return t.dateContext.daysInMonth()
    },
    currentDate:function(){
      let t=this
      return t.dateContext.get('date')
    },
    firstDayOfMonth: function(){
      let t =this
      let firstDay = moment(t.dateContext).subtract((t.currentDate-1),'days')
      return firstDay.weekday()
    },
    initialDate:function(){
      let t=this
      return t.today.get('date')
    },
    initialMonth:function(){
      let t=this
      return t.today.format('MMMM')
    },
    initialYear:function(){
      let t=this
      return t.today.format('Y')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.callendar{
  box-shadow: 3px 4px 4px 5px #88888896;
  background: #fff;
  width:200px;
  line-height: 20px;
   transition:3s ;
}

h3 {
  margin: 40px 0 0;
}
h6{
  
  margin: 0 6px;
  line-height:unset ;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
i{
  padding: 0 10px;
  font-size: 13px;
}
.current-day{
  background-color: rgba(1, 241, 161, 0.301);
}

.calendar-header{
  font-weight: 500;
  display:flex;
  border: 0;
  padding: 2% 0;
  margin: 0;
}
.divI{
     box-sizing: border-box;
     width:15%;
     cursor:pointer;

}
.divM{
     box-sizing: border-box;
     width: 55%;

}
.dates{
    box-sizing: border-box;
  padding:3px 0 3px  2px;
  margin:0;
  border:solid 1px;
  font-size:0.8em;
  display:flex;
  flex-wrap:wrap;
 
  width:100%;

}

.days:nth-of-type(7n+1) {
  color: #ff0000;
   text-shadow: 10px 4px 10px #070707(211, 148, 31); 
  
}
.days{
  margin:1px;
  padding:1px;
 
  border-color:transparent;
  display: block;
  width:12.07%;    /*   14.28 */
  height:20px;
}
.days:hover{
  cursor: pointer;
  background:rgba(45, 48, 47, 0.089);
}
.dates:first-of-type .days{
  cursor: default;
}
.dates:first-of-type .days:hover{
  background: #fff;
}
.emptyD{
  border-color:transparent !important;
  background-color:white !important;
}
.exit{
    text-align: right;
   
}
</style>
