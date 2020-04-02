<template>
  <div class="monthYear">
    <div class="round">
      <div class="divM ch" @click="selectMonthYear">
        <h6>{{month}}</h6>
      </div>
      <div class="divM">
        <div class="divI ch chUP " @click="addMonth">
          <i class="fas fa-caret-up" style="font-size:20px;"></i>
        </div>
        <div class="divI ch chUP" @click="subtractMonth">
          <i class="fas fa-caret-down" style="font-size:20px;"></i>
        </div>
      </div>
    </div>
    <!-- round -->
    <div class="round">
      <div class="divM ch" @click="selectYear">
        <h6>{{year}}</h6>
      </div>
      <div class="divM">
        <div class="divI ch chUP" @click="addYear">
          <i class="fas fa-caret-up" style="font-size:20px;"></i>
        </div>
        <div class="divI ch chUP" @click="subtractYear">
          <i class="fas fa-caret-down" style="font-size:20px;"></i>
        </div>
      </div>
    </div>
    <!-- end round -->
    <div class="round">
      <select class="ch" v-if="accounts" v-model="selectAcc" required @change="selectBill">
        <option class="ch"  v-for="acc in accounts" :key="acc.acc_id">{{acc.acc_name}}</option>
      </select>
    </div>
    <!--         <div class="round ch"  @click="selectMonthYear">
                 prikazi statistiku parametara
          </div>
            <div class="round ch"  @click="selectYear">
                 prikazi celu statistiku racuna za odabranu god
          </div>
          <div class="round ch"  @click="selectBill">
                 prikazi celu statistiku racuna
          </div>
    -->
  </div>
  <!-- end monthYear -->
</template>

<script>
import moment from "moment";
export default {
  name: "MonthYear",
  props: ["accounts"],
  data() {
    return {
      dateContext: moment(),
      selectAcc: null
    };
  },
  methods: {
    selectMonthYear() {
      let monthYear =
        this.year +
        "-" +
        moment()
          .month(this.month)
          .format("MM");
      let sid = localStorage.getItem("sid");
      this.$emit("selectMonthYear", {
        sid: sid,
        date: monthYear,
        account: this.selectAcc
      });
    },
    selectYear() {
      let sid = localStorage.getItem("sid");
      this.$emit("selectMonthYear", {
        sid: sid,
        date: this.year,
        account: this.selectAcc
      });
    },
    selectBill() {
      let sid = localStorage.getItem("sid");
      this.$emit("selectMonthYear", { sid: sid, account: this.selectAcc });
    },
    addMonth() {
      let t = this;
      t.dateContext = moment(t.dateContext).add(1, "month");
    },
    subtractMonth: function() {
      let t = this;
      t.dateContext = moment(t.dateContext).subtract(1, "month");
    },
    addYear() {
      let t = this;
      t.dateContext = moment(t.dateContext).add(1, "year");
    },
    subtractYear() {
      let t = this;
      t.dateContext = moment(t.dateContext).subtract(1, "year");
    }
  },
  computed: {
    year: function() {
      let t = this;
      return t.dateContext.format("Y");
    },
    month: function() {
      let t = this;
      return t.dateContext.format("MMMM");
    }
  },
  async mounted() {
    this.selectAcc = localStorage.getItem("setDefAcc");
  }
};
</script>

<style scoped>
.monthYear {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  

  /*      background:#120aff;
        color:rgb(255, 255, 255);     

  border: solid 2px #5e5a5aa4;

  justify-content: space-around;
  justify-content: center;
  box-shadow: 1px 1.1px 1px 1.1px #888888;    */
}
.round {
  font-size:1.2em;
  display: flex;
  box-sizing: border-box;
  width: 16.66%;
  min-width: 109px;
  text-align: center;
  padding: 5px;
   text-shadow: 0.8px 0.8px 0.8px #000000;
  justify-content: center;
  align-items: center;
   flex-wrap: wrap;
}
.ch {
  
  transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
  transition-property: box-shadow, transform, color;
  transition-duration: 0.2s, 0.2s, 0.2s;
  transition-timing-function: ease, ease, ease;
  transition-delay: 0s, 0s, 0s;
  border: none;
  outline: none;
  cursor: pointer;
  padding: initial;

  box-shadow: 0px 2px 0 0 rgba(24, 68, 75, 0.616),
    0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
    0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  background-image: linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0.5),
    rgb(78, 75, 75)
  );
  color: #e6eaef;
}
.ch:hover {
  cursor: pointer;
  background-color: rgba(241, 240, 232, 0.514);
  text-shadow: 0.5px 0.5px 0.5px #000000;
  box-shadow: 0px 1px 3px 1px #888888;
 
  text-shadow: 2px 2px 2px #000000;
  box-shadow: 1px 3px 0 0 #126875, 0 7px 5px -1px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
.chUP:first-of-type{
 box-shadow: 0px 1px 0 0 rgba(24, 68, 75, 0.377),
     0 3px 1px -1px rgba(0, 0, 0, 0.514), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
    0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  background-image: linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0.5),
    rgb(78, 75, 75)
  );
}
.chUP:hover{
    
  text-shadow: 2px 2px 2px #000000;
  box-shadow: 0px 1px 0 0 #126875, 0 7px 5px -1px rgba(0, 0, 0, 0.3),
  3px  2px 2px 2px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;

}
.ch:active {
  background-color: rgba(228, 228, 222, 0.514);
  text-shadow: 0.01px 0.01px 0.01px #000000;
  box-shadow: 0px 0.1px 1px 0.1px #888888;

  text-shadow: 0.3px 0.3px 0.3px #000000;
  box-shadow: 0 0px 0 0 rgba(18, 104, 117, 0.616), 0 3px 0 0 rgba(0, 0, 0, 0),
    0 4px 16px rgba(0, 0, 0, 0), 0 1px 2px 1px rgba(0, 0, 0, 0.5) inset,
    0 -18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  transition: 0s;
  color: rgba(18, 104, 117, 0.616);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);

}

.divM {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 50%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.divI {
  box-sizing: border-box;
  width: 100%;
  min-height: 50%;
  border: solid 0.1px #88888856;
}

.divI :hover {
  cursor: pointer;
}
h6 {
  margin: 0;
}
select {
  font-family: "Oswald", sans-serif !important;
  font-size:1.1em;
  box-sizing: border-box;
  text-align:center;
  height: 100%;
  width: 100%;
}
select option{
    text-align:center;
    background:rgb(60, 61, 61);
}

</style>