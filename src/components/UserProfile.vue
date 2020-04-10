<template>
  <div class="userProfile" v-on:keyup.enter="update" >
    <div class="profile-img">
      <img v-if="url === 'placeholder'" src="../assets/placeholder-img.jpg" alt="">
      <img v-else :src="url" alt="" />
    </div>
    <div class="picEdit">
      <label for="myfile">Izaberite novu profilnu sliku</label>
      <input id="myfile" type="file" @change="photoData($event)" ref="fileInput"/>
      <p v-if="img">Nova slika: {{img.name}}</p>
      <button class = "remove-pic" v-if="img" @click = "resetFile">Uklonite dodatu sliku</button>
    </div>
    <div>
      Ime:
      <input type="text" v-model="computedName" :placeholder="user.usr_name" />
    </div>
    <div>
      Prezime:
      <input type="text" v-model="computedSurname" :placeholder="user.usr_surname" />
    </div>
    <div>
      E-mail:
      <input type="text" v-model="computedEmail" :placeholder="user.usr_email" />
    </div>
    <div>
      Šifra:
      <input type="password" v-model="computedPassword" placeholder="Nova šifra" />
    </div>
     <div class="btn">
      <button @click="update()">Potvrdite promene</button>
    </div>
    <p :class = "{'err': err, 'err-invi': !err }">{{err? err: 'Fill'}}</p>
    <p :class = "{'message': message, 'message-invi': !message }">{{message? message: 'fill'}}</p>
   
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      user:{},
      message: null,
      err:null,

      name: '',
      surname: '',
      email: '',
      password: '',
      id: localStorage.getItem("user"),
      img: null,
      url: "",

      nameChanged: false,
      surnameChanged: false,
      emailChanged: false,
      passwordChanged: false,
      imgChanged: false,

    };
  },
  computed: {
    computedName: {
      get() {
        //kada iscitava vrednost
        return this.name;
      },
      set(newVal) {
        //kada menjamo vrednost, newVal uzima iz inputa
        if(newVal !== ''){
          this.nameChanged = true;
          this.name = newVal;
        }else if(newVal === ''){
          this.nameChanged = false;
          this.name = newVal;
        }
      }
    },
    computedSurname: {
      get() {
        return this.surname;
      },
      set(newVal) {
        if(newVal !== ''){
          this.surnameChanged = true;
          this.surname = newVal;
        }else if(newVal === ''){
          this.surnameChanged = false;
          this.surname = newVal;
        }
      }
    },
    computedEmail: {
      get() {
        return this.email;
      },
      set(newVal) {
        if(newVal !== ''){
          this.emailChanged = true;
          this.email = newVal;
        }else if(newVal === ''){
          this.emailChanged = false;
          this.email = newVal;
        }
      }
    },
    computedPassword: {
      get() {
        return this.password;
      },
      set(newVal) {
        if(newVal !== ''){
          this.passwordChanged = true;
          this.password = newVal;
        }else if(newVal === ''){
          this.passwordChanged = false;
          this.password = newVal;
        }
      }
    },
    
  },
  mounted() {
    this.readPic();
    this.getUser();
    this.$root.$emit('set-selected', 'all');
  },
  methods: {
    getUser(){
      let sid= localStorage.getItem('sid')
      if(sid){
        axios.post("http://053n122.mars-e1.mars-hosting.com/api/get/getUser",
         {sid: sid})
         .then(response=>{
            this.user = response.data.user[0];
            this.$root.$emit('change-name', response.data.user[0].usr_name);
            this.$root.$emit('change-surname', response.data.user[0].usr_surname);
         })
      }
    },

   photoData(e) {
      this.img = e.target.files[0];
    },
    resetFile() {
      let input = this.$refs.fileInput;
      input.type = 'text'
      input.type = 'file'
      this.img = null;
    },
    update() {
      let formData = new FormData();

      let updateParams = {
        sid: localStorage.getItem("sid")
      };

      formData.append("sid", updateParams.sid);

      if (this.nameChanged) {
        if(this.name.length > 50){
          this.err = 'Predugačko ime.';
          return;
        }
        updateParams.usr_name = this.name;
        formData.append("usr_name", updateParams.usr_name);
      }
      if (this.surnameChanged) {
        if(this.surname.length > 50){
          this.err = 'Predugačko prezime.';
          return;
        }
        updateParams.usr_surname = this.surname;
        formData.append("usr_surname", updateParams.usr_surname);
      }
      if (this.emailChanged) {
        if(this.email.length > 50){
          this.err = 'Predugačak e-mail.';
          return;
        }
        updateParams.usr_email = this.email;
        formData.append("usr_email", updateParams.usr_email);
      }
      if (this.passwordChanged) {
        if(this.email.length > 255){
          this.err = 'Predugačka šifra.';
          return;
        }
        updateParams.usr_password = this.password;
        formData.append("usr_password", updateParams.usr_password);
      }
      if(!this.nameChanged && !this.passwordChanged && !this.emailChanged && !this.surnameChanged  && this.img === null){
        this.err = 'Nemate podatke za izmenu.';
        this.message = "";
        return;
      }

      if (this.img !== null) {
        if(!['jpg', 'jpeg', 'gif', 'png'].includes(this.img.name.substring(this.img.name.length - 3))){
          this.err = 'Slika mora da bude u png, jpg ili gif formatu.';
          this.resetFile();
          return;
        }
        updateParams.usr_img = this.img;
        formData.append("usr_img", updateParams.usr_img);
      }
      axios
        .patch(
          "http://053n122.mars-e1.mars-hosting.com/api/wallet/updateUser",
          formData, {headers : {'Content-Type': 'multipart/formdata'}}
        ).then((response)=>{
          this.err=response.data.err;
          this.message=response.data.message;
          this.readPic();
          this.getUser();
          
          this.name= null;
          this.surname= null;
          this.email= null;
          this.password= null;

          this.nameChanged= false;
          this.surnameChanged= false;
          this.emailChanged= false;
          this.passwordChanged= false;
          this.imgChanged= false;

          this.resetFile();

          this.$root.$emit('change-pic');
        }).catch(e=>{
          this.err=e.response.data.err;
          this.message = "";
        })
    },
    
    readPic() {
      axios.get("http://053n122.mars-e1.mars-hosting.com/api/wallet/getPic",
        {
          params: {sid: localStorage.getItem("sid")}
        })
        .then(res => {
          axios.get(res.data.poruka3.link)
          .then((r)=>{
            if(r.data.msg === 'placeholder'){
              this.url = r.data.msg;
            }else{
              this.url = res.data.poruka3.link;
            }
        });
      })
    }
  }
};
</script>

<style scoped>
.userProfile {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 92vh;
  margin:2%;
}
.userProfile div {
  width: 30%;
  margin: 5px;
}
.profile-img img {
  border-radius: 50%;
  height: 100px;
  width: 100px;
}
.profile-img{
  display: flex;
  justify-content: center;
}
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.4s;
  transition: background-color 0.4s;
}
input[type="text"]:focus,
input[type="password"]:focus {
  border: 1px solid rgb(0, 0, 0);
  background-color: rgb(235, 233, 233);
}
input[type=file]{
  opacity: 0;
  position: absolute;
  z-index: -1;
}
button{
  display: block;
  transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
  transition-property: box-shadow, transform, color;
  transition-duration: 0.2s, 0.2s, 0.2s;
  transition-timing-function: ease, ease, ease;
  transition-delay: 0s, 0s, 0s;
  font-family: 'Oswald', sans-serif;

  cursor: pointer;
  font-size: 1.2em;
  min-width: 99px;
  font-weight: 500;
  margin: 0.6%;
  width: 50%;
  background-color: rgb(0, 0, 0);
  overflow: hidden;
  border-radius: 10px;
  padding: 3%;
  border: 0;

  box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
    0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
    0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  background-image: linear-gradient(-45deg, rgb(131, 131, 131), rgb(34, 34, 34));
  color: #e6eaef;
}
button:focus{
  outline: none;
  cursor: pointer;
}
button::-moz-focus-inner {
  border: 0;
}
h1 {
  margin-bottom: 35px;
}
.welcome{
  text-align: center;
}
label {
  font-weight: bold;
} 
.err {
  font-weight: normal;
  color:#e80000;
  text-shadow: -0.5px 0 black, 0 0.5px black, 0.5px 0 black, 0 -0.5px black;
}
.err-invi {
  font-weight: normal;
  color:#e80000;
  text-shadow: -0.5px 0 black, 0 0.5px black, 0.5px 0 black, 0 -0.5px black;
  visibility:hidden;
}
.message{
  font-weight: normal;
  color:#1db802;
  text-shadow: -0.5px 0 black, 0 0.5px black, 0.5px 0 black, 0 -0.5px black;
}
.message-invi{
  font-weight: normal;
  color:#1db802;
  text-shadow: -0.5px 0 black, 0 0.5px black, 0.5px 0 black, 0 -0.5px black;
  visibility:hidden;
}
.btn{
  display: flex;
  justify-content: center;
}
label{
  display: flex;
  justify-content: center;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s, color 0.2s;
  transition-property: box-shadow, transform, color;
  transition-duration: 0.2s, 0.2s, 0.2s;
  transition-timing-function: ease, ease, ease;
  transition-delay: 0s, 0s, 0s;

  cursor: pointer;
  font-size: 1.2em;
  min-width: 99px;
  font-weight: 500;
  margin: 0.6%;
  width: 70%;
  background-color: rgb(0, 0, 0);
  overflow: hidden;
  border-radius: 10px;
  padding-right: 5%;
  padding-left: 5%;

  box-shadow: 3px 6px 0 0 rgba(24, 68, 75, 0.979),
    0 5px 5px -1px rgba(0, 0, 0, 0.6), 0 4px 6px 1px rgba(0, 0, 0, 0.3),
    0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.1) inset;
  background-image: linear-gradient(-45deg, rgb(131, 131, 131), rgb(34, 34, 34));
  color: #e6eaef;
}
label:hover, button:hover{
  font-size: 1.2em;
  text-shadow: 2.9px 2.95px 2.95px #000000;

  box-shadow: 3px 6px 0 0 #126875, 0 12px 7px -1px rgba(0, 0, 0, 0.3),
    0 12px 20px rgba(0, 0, 0, 0.5), 0 1px 2px 1px rgba(0, 0, 0, 0) inset,
    0 18px 32px -2px rgba(255, 255, 255, 0.14) inset;
}
label:active, button:active{
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
  outline: none;
}
.remove-pic{
  width: 80%;
  font-size: 1.2em;
  padding: 0;
  margin: 0;
}
.remove-pic:hover{
  font-size: 1.2em;
}
.picEdit p{
  margin: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.picEdit{
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media screen and (min-width:410px) and (max-width:720px) {
  .userProfile div {
   width: 70%;
   margin: 3px;
}
 .btn {
   font-size:1em;
  margin-bottom: 5%;
} 
}

@media screen and (max-width:409px) {
  .userProfile div {
  width: 100%;
  margin: 5px;
}
  .btn {
   font-size:0.8em;
  margin-bottom: 5%;
} 
}

</style>