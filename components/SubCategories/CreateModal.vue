<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <button><PlusIcon /></button>

        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer une sous-catégorie</DialogTitle>
            <DialogDescription>
              Remplissez les détails ici. Cliquez sur "Enregistrer" lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">
                Nom
              </Label>
              <Input id="name" v-model="name" placeholder="Ex : vin-blanc" class="col-span-3 focus-visible:ring-transparent" />
              <span class="text-red-500 text-xs col-span-4">{{ errorMessage }}</span>

            </div>
          </div>
          <DialogFooter class="flex xs:gap-2">
            <Button type="submit" @click="save" class="bg-green-700 hover:bg-green-500 text-white rounded-lg">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
              Enregistrer
            </Button>
            <DialogClose as-child>
                <Button type="button" class="bg-gray-300 hover:bg-gray-400 text-black rounded-lg">
                    Annuler
                  </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
        <Toaster />
      </Dialog>
      
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusIcon } from 'lucide-vue-next';
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
    category_id : {
        type:String,
        required:true
    }
})

const name = ref('');
const isLoading = ref(false)
const errorMessage = ref('')
const {toast} = useToast()
const open =ref(false)
const emits = defineEmits(['subCatCreated'])

const {addSubCategory} = useSubCategories()

const save = async ()=>{
  isLoading.value = true
  if (name.value ==='') {
    errorMessage.value ='Le nom de la sous-catégorie est requis'
    return;
  }

  try {
    if (!props.category_id) {
      return;
    }
    const data = await addSubCategory(name.value, props.category_id)

    if (data) {
      toast(
        {
          title: 'Succès',
          description: `Donnée ajoutée avec succès`,
          duration : 1000
        }
      )
      setTimeout(() => {
        emits('subCatCreated')
        open.value = false;
        name.value = '';
      }, 1000);
    }else{
      toast(
        {
          title: 'Erreur',
          description: `Une erreur s'est produite. Veuillez réessayer`,
          duration : 1000
        }
      )
      setTimeout(() => {
        open.value = false;
        name.value = '';
      }, 1000);
    }
  } catch (error) {
    toast(
        {
          title: 'Erreur',
          description: `Une erreur s'est produite. Veuillez réessayer`,
          duration : 1000
        }
    )
    setTimeout(() => {
        open.value = false;
        name.value = '';
      }, 1000);
  }finally{
    isLoading.value = false
  }
}
</script>