<template>
  <div class="userProfile">
    <div class="profile-img">
        <img v-bind:src="imgUrl" alt="profilePicture">
    </div>  
    <div>
      Ime:
      <input type="text" v-model="computedName" v-bind:placeholder="name" />
    </div>
    <div>
      Prezime:
      <input type="text" v-model="computedSurname" v-bind:placeholder="surname" />
    </div>
    <div>
      E-mail:
      <input type="text" v-model="computedEmail" v-bind:placeholder="email" />
    </div>
    <div>
      Šifra
      <input type="password" v-model="computedPassword" v-bind:placeholder="password" />
    </div>
    <div>
        <button type="submit" @click="update()">Potvrdi</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      name: null,
      surname: null,
      email: null,
      password: null,
      imgUrl: null,

      nameChanged: false,
      surnameChanged: false,
      emailChanged: false,
      passwordChanged: false,  
    }
  },
  computed: {
    computedName: {
      get() {
        //kada iscitava vrednost
        return this.name;
      },
      set(newVal) {
        //kada menjamo vrednost, newVal uzima iz inputa
        this.nameChanged = true;
        this.name = newVal;
      }
    },
    computedSurname: {
      get() {
        return this.surname;
      },
      set(newVal) {
        this.surnameChanged = true;
        this.surname = newVal;
      }
    },
    computedEmail: {
      get() {
        return this.email;
      },
      set(newVal) {
        this.emailChanged = true;
        this.email = newVal;
      }
    },
    computedPassword: {
      get() {
        return this.password;
      },
      set(newVal) {
        this.passwordChanged = true;
        this.password = newVal;
      }
    }
  },
  methods: {
    update() {
      let updateParams = {
        sid: localStorage.getItem("sid")
      };

      if (this.nameChanged) {
        updateParams.usr_name = this.name;
      }
      if (this.surnameChanged) {
        updateParams.usr_surname = this.surname;
      }
      if (this.emailChanged) {
        updateParams.usr_email = this.email;
      }
      if (this.passwordChanged) {
        updateParams.usr_password = this.password;
      }
      console.log("Update params", updateParams);

      //komunikacija sa api-jem
      axios
        .patch("http://053n122.mars-e1.mars-hosting.com/api/wallet/updateUser", {
          sid: updateParams.sid,
          usr_username: updateParams.usr_name,
          usr_surname: updateParams.usr_surname,
          usr_email: updateParams.usr_email,          
          usr_password: updateParams.usr_password,
        })
        .then(res => {
          console.log("korisnik je upisan u bazu", res);
          this.name = res.data.info[0].usr_name;
          this.imgUrl = res.data.info[0].usr_img;  
        })
        .catch(err => {
          console.log(err, "greska pri abdejtovanju podataka");
        });

        //reset params
        (this.name = ""),
        (this.surname = ""),
        (this.email = ""),
        (this.password = "")
    }
  },

};
</script>

<style>
.userProfile {
  /*ovo obrisati, ove margine */
  margin-top: 60px;
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.userProfile div {
  width: 30%;
  margin: 5px;
}
.profile-img{
    height: 100px;
    width: 100px;
}
</style>