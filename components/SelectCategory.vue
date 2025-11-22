<template>
  <Select v-model="modelValue">
    <SelectTrigger class="w-80">
      <SelectValue placeholder="Selectionner une Catégorie" class="focus-visible:ring-transparent" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Categories</SelectLabel>
        <SelectItem v-for="categorie in categories" :value="categorie.name" :key="categorie.id">
          {{ categorie.name }}
        </SelectItem>
        <button
        v-if="route.name === 'Plats-Create'"
              @click="() => setCustumCat(custumCat)"
                class="mt-2 w-full px-4 py-2 bg-indigo-500 text-white rounded-md"
              >
                Ajouter
              </button>
        
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { UseCreatemenustore } from '~/store/createmenustore';

const menuStore = UseCreatemenustore();

const modelValue = ref('')

const route = useRoute();

const props = defineProps({
  itemCategory: {
    type: String,
    required: true
  }
})

const categories = ref([]);


// Fonction pour simuler le fetch de toutes les catégories
const fetchCategories = async () => {
    // Simule la récupération des catégories
    categories.value = [
    {
        id: 1,
        name: 'Catégorie 1'
    },
    {
        id: 2,
        name: 'Catégorie 2'
    }
    ];
};

onMounted(() => {
  fetchCategories(); // Récupère toutes les catégories
  modelValue.value = props.itemCategory;
})
const selectedCategory = computed(() => {
  return categories.value.find(category => category.id === modelValue.value);
});
</script>