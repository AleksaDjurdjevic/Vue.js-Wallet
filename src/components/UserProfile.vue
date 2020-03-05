<template>
  <div class="userProfile">
    <div class="profile-img">
      <img :src="readPic()" alt="profilePicture" />
    </div>
    <div class="picEdit">
      <label for="myfile">Select a new profile photo:</label>
      <input type="file" @change="photoData($event)" />
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
      id: localStorage.getItem("user"),
      img: null,

      nameChanged: false,
      surnameChanged: false,
      emailChanged: false,
      passwordChanged: false,
      imgChanged: false
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
    },
    
  },
  mounted() {
    this.readPic();
  },
  methods: {
    photoData(e) {
      this.img = e.target.files[0];
      console.log('kad se klikne na dugmeeeee',this.img = e.target.files[0]);
      
      console.log("slika", this.img);
    },
    
    update() {
      let formData = new FormData();

      let updateParams = {
        sid: localStorage.getItem("sid")
      };

      formData.append("sid", updateParams.sid);

      if (this.nameChanged) {
        updateParams.usr_name = this.name;
        formData.append("usr_name", updateParams.usr_name);
      }
      if (this.surnameChanged) {
        updateParams.usr_surname = this.surname;
        formData.append("usr_surname", updateParams.usr_surname);
      }
      if (this.emailChanged) {
        updateParams.usr_email = this.email;
        formData.append("usr_email", updateParams.usr_email);
      }
      if (this.passwordChanged) {
        updateParams.usr_password = this.password;
        formData.append("usr_password", updateParams.usr_password);
      }
      if (this.img != null) {
        console.log('registrovana promena slike');
        
        updateParams.usr_img = this.img;
        formData.append("usr_img", updateParams.usr_img);
      }
      console.log("Update params", updateParams);

      axios
        .patch(
          "http://053n122.mars-e1.mars-hosting.com/api/wallet/updateUser",
          formData, {headers : {'Content-Type': 'multipart/formdata'}}
        )
        .then(res => {
          console.log(`korisnik je upisan u bazu, status: ${res.data.message}`);
        })
        .catch(err => {
          console.log(`greska pri abdejtovanju podataka ${err.message}`);
        });

      //reset params
        (this.name = ""),
        (this.surname = ""),
        (this.email = ""),
        (this.password = "");
    },
    readPic() {
      let url = "";
      url =
        "http://053n122.mars-e1.mars-hosting.com/api/wallet/getPic/" +
        this.id +
        "/avatar";
      console.log('ovo je slikaaaaa ', url)  
      return url;
    }
  }
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
.profile-img img {
  border-radius: 50%;
  height: 100px;
  width: 100px;
}
</style>