<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <button><Icon name="uil:edit" size="20" style="color: orange" /></button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la sous-catégorie</DialogTitle>
            <DialogDescription>
                Modifiez les informations ci-dessous. Cliquez sur "Modifier" pour valider les modifications.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">
                Nom
              </Label>
              <Input id="name" v-model="name" placeholder="Ex : Boissons" class="col-span-3 focus-visible:ring-transparent" />
            </div>
          </div>
          <DialogFooter class="flex xs:gap-2">
            <Button type="submit" @click="handleEdit" class="bg-orange-500 hover:bg-orange-500 text-white rounded-lg">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
              Modifier
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
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
  subcat: {
        type: Object,
        required: true
    }
})

const isLoading = ref(false)
const open = ref(false)
const name =ref(props.subcat.name)
watch(()=>props.subcat.name, (newValue)=>{
  name.value = newValue;
})

const {toast} = useToast()
const {editSubMenu} = useSubCategories()
const emits = defineEmits(["subCatEdited"])

const handleEdit = async ()=>{
  
  if (name.value=='') {
    return;
  }
  
   try {
    isLoading.value = true
    const data = await editSubMenu(props.subcat.id, name.value)
    if (data) {
      toast(
        {
          title: 'Succès',
          description: `Modification éffectuée avec succès`,
          duration : 1000
        }
      )
      setTimeout(() => {
        emits('subCatEdited')
        open.value = false;
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
      }, 1000);
  }finally{
    isLoading.value = false
  } 
}
</script>