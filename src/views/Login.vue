<template>
  <div class="login">
    <LogIn /> 
 
  </div>  
</template>

<script>
import LogIn from '@/components/LogIn';
export default {
  components: {
    LogIn
  }, 
}
</script>

<style>
  .login{
    margin-top: 50px;
    background-color:azure; 
  }
</style>