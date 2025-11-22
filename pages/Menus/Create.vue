<template>
    <main class="flex flex-col items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 min-h-screen">

      <div class="flex flex-col gap-4">
        <Label >Nom du menu</Label>
        <Input v-model="menuStore.form.MenuName" placeholder="Entrer le nom du menu" class="w-80 focus-visible:ring-transparent" />
      </div>
      <div class="flex flex-col gap-4">
        <Label >Catégories</Label>
        <CategoryInput  />
      </div>


      <div class="flex flex-col gap-4">
        <Label>Sous-Catégories</Label>  
        <SousCategoryInput />
      </div>
      <div>
        <Button @click.prevent="router.push('/plats/create')">Ajouter des plats</Button>
      </div>
    </main>
</template>

<script setup lang="ts">
import { UseCreatemenustore } from '~/store/createmenustore'
definePageMeta({
  layout: 'app-layout',
})

const menuStore = UseCreatemenustore();

const router = useRouter()

</script>

<style scoped>

</style>