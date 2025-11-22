<template>
    <main class="flex flex-col items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <MenusCreateModal @menuCreated="updateMenus" />
      <div class="flex min-h-screen w-full flex-col bg-muted/40">
        
        <div class="w-full">
          <Card>
            <CardHeader class="px-7 flex flex-row items-center justify-between">
              <div>
                <CardTitle class="mb-2">Mes Menus</CardTitle>
                <CardDescription>
                  Votre liste des menus recemmeent ajoutés
                </CardDescription>
              </div>
            </CardHeader>
            <div class="relative w-5/6 md:w-full max-w-sm md:ml-10 ml-4 items-center mb-2">
              <Input id="search" @keyup="searchMenu" v-model="searchData" type="text" placeholder="Rechercher un menu..." class="pl-10 focus-visible:ring-transparent" />
              <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <Search class="size-6 text-muted-foreground" />
              </span>
            </div>
            <div class="md:ml-10 ml-4 text-gray-200" v-if="isloading">
              Chargement...
            </div> 
            <CardContent v-else>
              <div class="w-3/6" v-if="menus.length == 0">
                <Alert class="bg-orange-100 border-none">
                  <AlertTitle>Aucun menu disponible</AlertTitle>
                  <AlertDescription class="flex">
                      creez un menu pour commencer à ajouter des catégories.
                  </AlertDescription>
                </Alert>
              </div>
              <Table v-else>
                <TableHeader>
                  <TableRow>
                    <TableHead class="sm:table-cell">
                      Nom du menu
                    </TableHead>
                    <TableHead class="text-center">
                      Date d'ajout
                    </TableHead>
                    <TableHead class="text-center">
                      Date de modification
                    </TableHead>
                    <TableHead class="text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow class="hover:bg-gray-100 hover:cursor-pointer" v-for="menu in menus" :key="menu.name">
                    <TableCell>
                      <div class="font-medium">
                        {{ menu.name }}
                      </div>
                    </TableCell>
                    <TableCell class="text-center">
                      {{ formatDate(menu.created_at) }}
                    </TableCell>
                    <TableCell class="text-center">
                      {{ formatDate(menu.updated_at) }}
                    </TableCell>
                    <TableCell class="text-center flex justify-center gap-2">
                      <DiamondPlusIcon class="w-6 h-6 text-primary" @click="router.push({path:'/category/create', query:{id:menu.id}})" />
                      <MenusEditModal @menuUpdated="updateMenus" :menu="menu" />
                      <MenusDeleteModal :id="menu.id" @menuDeleted="updateMenus" />
                    </TableCell>
                  </TableRow>
                  
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
</template>
    
<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { DiamondPlusIcon, Search } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'


definePageMeta({
  layout: 'app-layout',
})

const router = useRouter();
const supabase = useSupabaseClient()

const menus = ref([])

const {getMenus} = useMenus()
const errorMessage = ref('')

const isloading = ref(false)

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString('fr-FR');
};

const updateMenus = async () => {
  try {
    isloading.value = true
    const data = await getMenus();
    if(data){
      menus.value = data;
    }
  } catch (error) {
    errorMessage.value = 'Une erreur s\'est produite. Veuillez réessayer.'
  } finally {
    isloading.value = false
  }
}

onMounted(async () => {

  try {
    isloading.value = true
    const data = await getMenus();
    if(data){
      menus.value = data;
    }
  } catch (error) {
    errorMessage.value = 'Une erreur s\'est produite. Veuillez réessayer.'
  } finally {
    isloading.value = false
  }
})

const searchData = ref('')
const searchMenu = async () => {
  if (!searchData.value) {
    updateMenus(); // Recharge les menus si la recherche est vide
    return;
  }
  
  try {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .ilike('name', `%${searchData.value}%`); // 'ilike' pour une recherche insensible à la casse
    
    if (error) throw error;

    menus.value = data || [];
  } catch (error) {
    console.error('Erreur de recherche:', error.message);
    errorMessage.value = 'Erreur lors de la recherche.';
  }
};

</script>