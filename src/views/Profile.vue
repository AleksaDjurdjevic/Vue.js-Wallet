<template>
  <div class="profil">
    <UserProfile />
  </div>
</template>

<script>
import UserProfile from '@/components/UserProfile';
export default {
  components: {
    UserProfile
  }
}
</script>

<style scoped>
  .profil{
    display: flex;
    justify-content: center;
  }
</style>