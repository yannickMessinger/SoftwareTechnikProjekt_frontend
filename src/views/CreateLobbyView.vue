<template>
  <Header text="World of eMobility" :displayHomebutton="true"></Header>
  <h1>Create Lobby</h1>

  <div class="container">
    <div class="content">
      <div class="head">
        <p><b>Lobby erstellen</b></p>
      </div>

      <div class="formWrapper">
      <form action="" method="" class>
        <div class="field-wrap">
        <label for="first_name"> <b>Lobby-Name</b></label>
          <input type="text" name="first_name" value="" />
        </div>

        <div class="field-wrap">
          <label for="last_name"><b>Karte</b></label>
          <input type="text" name="last_name" value="" />
        </div>

        <div class="field-wrap">
          <label for="last_name"><b>Passwort</b></label>
          <input type="text" name="last_name" value="" />
        </div>


        <div class="buttonBox">

        <div class="button1">
        <BasicButton
          class="sec btn blue"
          display="erstellen"
          :btn_click="createLobby"
        />
      </div>

        <div class="button2">
        <BasicButton
          class="ter btn grey"
          display="Abbrechen"
          :btn_click="
            () => {
              router.push('/');
            }
          "
        />
      </div>
      </div>
       
      </form>

    </div>

      
    
    </div>
  </div>
</template>

<script setup lang="ts">
import BasicButton from "../components/Buttons/BasicButton.vue";
import Header from "../components/Header.vue";
import router from "../router/router";

function createLobby() {
  //Lobby ertellen hier hin
  router.push("/");
}
</script>

<style>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-top: 20vh;
  height: 25em;
  
   
}

.content {
  border-radius: 15px;
  border: 1px solid black;
  display: grid; 
  grid-template-columns: 1fr 2fr; 
  grid-template-rows: 0.5fr 2fr 1fr; 
  gap: 0px 0px; 
  grid-template-areas: 
    "Header Header"
    "Form Form"
    ". Button";
  height: 70%;
  width:29em;
}

.head {
  border-top-left-radius:15px; 
  border-top-right-radius:15px;
  font-style: italic;
  justify-content: space-between;
  border-bottom: 1px solid black;
 
  grid-area: Header;
  padding-left: 1em;
  height: 3em;
}

form {
 
  width: 100%;
  padding-left: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 50%;
}

input{
  background-color: white;
}

.field-wrap {
  width: 100%;
  margin-bottom: 15px;
  display: flex;
}

.field-wrap label {
  
  width:30%;
}

.field-wrap input {
  width: 70%;
  flex-grow: 1;
  
}
label {
  margin-right: 20px;
  width: 40%;
}
.buttonBox {
  display: grid; 
  grid-template-columns: 1fr 0.5fr 0.5fr; 
  grid-template-rows: 25%; 
  gap: 10px 10px; 
  grid-template-areas: 
    ". button1 button2";

  width: 100%;
  height:3em;
  padding-top: 20px;
 
  grid-area:Button;
}

.button1 { 
  grid-area: button1; 
}
.button2 { 
  grid-area: button2; 
}

.formWrapper{
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 400px;
 
  grid-area: Form;
}

</style>
