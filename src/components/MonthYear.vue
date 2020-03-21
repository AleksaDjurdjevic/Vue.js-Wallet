<template>
  <div class="monthYear" >
      <div class="round">
           
            <div class="divM"><h6 >{{month}}</h6></div>
            <div class="divM">
             <div class="divI ch"  @click="addMonth"> <i class="fas fa-caret-up" style="font-size:20px;" ></i></div>
            <div class="divI ch" @click="subtractMonth"><i class="fas fa-caret-down" style="font-size:20px;"></i> </div>
            </div>
        </div><!-- round -->
     <div class="round">
          <div class="divM"><h6 @click="selectMonthYear"  >{{year}}</h6></div>
          <div class="divM">
            <div class="divI ch" @click="addYear" > <i class="fas fa-caret-up" style="font-size:20px;"></i></div>
             <div class="divI ch" @click="subtractYear" ><i class="fas fa-caret-down" style="font-size:20px;" ></i> </div>
        </div>
         
      </div>  <!-- end round -->
      <div class="round ch">
             <select v-if="accounts" v-model="selectAcc" required>
                 <option v-for="acc in accounts" :key="acc.acc_id" >{{acc.acc_name}} </option>
             </select>
         </div>
          <div class="round ch"  @click="selectMonthYear">
                 prikazi statistiku parametara
          </div>
            <div class="round ch"  @click="selectYear">
                 prikazi celu statistiku racuna za odabranu god
          </div>
          <div class="round ch"  @click="selectBill">
                 prikazi celu statistiku racuna
          </div>
        
  </div><!-- end monthYear -->
</template>

<script>
import moment from  'moment'
export default {
    name:'MonthYear',
    props:['accounts'],
    data(){
        return{
            dateContext:moment(),
            selectAcc:null
        }
    },
    methods:{
        selectMonthYear(){
             let monthYear=this.year+'-'+ moment().month( this.month ).format('MM')
             let sid=localStorage.getItem('sid')
            this.$emit('selectMonthYear', {"sid":sid,"date":monthYear,"account":this.selectAcc})
        },
        selectYear(){
            let sid=localStorage.getItem('sid')
            this.$emit('selectMonthYear', {"sid":sid, "date":this.year,"account":this.selectAcc})
        },  
        selectBill(){
            let sid=localStorage.getItem('sid')
            this.$emit('selectMonthYear',{"sid":sid,"account":this.selectAcc})
        },  
       addMonth(){
         let t=this
         t.dateContext= moment(t.dateContext).add(1, 'month')
     },
       subtractMonth: function(){
          let t=this
         t.dateContext= moment(t.dateContext).subtract(1, 'month');
     },
        addYear(){
            let t=this;
            t.dateContext=moment(t.dateContext).add(1,'year')
        },
        subtractYear(){
            let t= this;
            t.dateContext=moment(t.dateContext).subtract(1,'year')
        }
        
    },computed:{
             year:function(){
                 let t=this
                 return t.dateContext.format('Y');
            },
            month:function(){
                let t=this
                 return t.dateContext.format('MMMM')
            }
            

    },
    async mounted(){
        console.log(this.year+' -god - mesec- '+ this.month)
       this.selectAcc=localStorage.getItem('setDefAcc')
        console.log(this.selectAcc+ 'Month Year')
    
    }
}
</script>

<style scoped>
    .monthYear{
        width:100%;
        box-sizing:border-box;
        display:flex;
        flex-wrap:wrap;
        margin-top:2%;

    }
    .round{
        display:flex;
        box-sizing:border-box;
        width:15%;
        min-width:109px;
        text-align:center;
        padding:2px;
        border:solid 0.1px;
        justify-content: center;
        align-items: center;
        
    
    }
    .ch:hover{
        cursor: pointer;
        background-color:rgba(241, 240, 232, 0.514);
        text-shadow: 0.5px 0.5px 0.5px #000000;
        box-shadow: 0px 1px 3px 1px #888888;

    }
    .ch:active{
        background-color:rgba(228, 228, 222, 0.514);
        text-shadow: 0.01px 0.01px 0.01px #000000;
        box-shadow: 0px 0.1px 1px 0.1px #888888;

    }
    
    .divM{
        display:flex;
        flex-direction: column;
        box-sizing:border-box;
        width:50%;
       justify-content: center;
        align-items: center;
     }

    .divI{
        box-sizing: border-box;
        width:100%;
        height:50%;
        border:solid 0.1px  #88888856;
    }
    
    .divI :hover{
        cursor:pointer;
    }
    h6{
        margin:0;
    }
    select{
        box-sizing:border-box;
        height:100%;
        width:100%;
    }
    
</style>