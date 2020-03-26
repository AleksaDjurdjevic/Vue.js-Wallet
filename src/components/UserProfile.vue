<template>
  <div class="userProfile">
    <div class="profile-img">
      <img v-if="url === null" src="../assets/placeholder-img.jpg" alt="">
      <img v-else :src="url" alt="profilePicture" />
    </div>
    <div class="picEdit">
      <label for="myfile">Izaberite novu profilnu sliku:</label>
      <input type="file" @change="photoData($event)" />
    </div>
    <div>
      Ime:
      <input type="text" v-model="computedName" placeholder="Novo ime" />
    </div>
    <div>
      Prezime:
      <input type="text" v-model="computedSurname" placeholder="Novo prezime" />
    </div>
    <div>
      E-mail:
      <input type="text" v-model="computedEmail" placeholder="Nova E-mail adresa" />
    </div>
    <div>
      Šifra
      <input type="password" v-model="computedPassword" placeholder="Nova sifra" />
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
        updateParams.usr_img = this.img;
        formData.append("usr_img", updateParams.usr_img);
      }
      axios
        .patch(
          "http://053n122.mars-e1.mars-hosting.com/api/wallet/updateUser",
          formData, {headers : {'Content-Type': 'multipart/formdata'}}
        ).then(()=>{
          this.readPic();
          this.$root.$emit('change-pic');
        })
    },
    
    readPic() {
      //ako nema slika
      axios.get("http://053n122.mars-e1.mars-hosting.com/api/wallet/getPic",
        {
          params: {sid: localStorage.getItem("sid")}
        })
        .then(res => {
          axios.get(res.data.poruka3.link)
          .then(()=>{
            this.url = res.data.poruka3.link;
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
  margin-top: 4%;
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
 input[type="text"],
 input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button{
  width: 30%;
  background-color: #17a2b8;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #17a3b8c9;
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
</style>