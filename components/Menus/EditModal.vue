<template>
    <Dialog @update:open="handleCloseModal" v-model:open="open">
        <DialogTrigger as-child>
            <button><Icon name="uil:edit" size="20" style="color: orange" /></button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le menu</DialogTitle>
            <DialogDescription>
                Modifiez les informations du menu ci-dessous. Cliquez sur "Enregistrer" pour valider les modifications.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">
                Nom
              </Label>
              <Input id="name" v-model="name" placeholder="Ex : Boissons" class="col-span-3 focus-visible:ring-transparent" />
              <span class="text-red-500 text-xs col-span-4">{{ errorMessage }}</span>
            </div>
          </div>
          <DialogFooter>
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
    </Dialog>
    <Toaster />  
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
import { Loader2 } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'

const props = defineProps({
    menu: {
        type: Object,
        required: true
    }
})

const emits = defineEmits(['menuUpdated'])

const { toast } = useToast()

const {editMenu} = useMenus()

const errorMessage = ref('')

const name = ref(props.menu.name);
const isLoading = ref(false);
const open = ref(false)

watch(() => props.menu.name, (newValue) => {
    name.value = newValue;
});

const handleCloseModal = (isOpen: boolean) => {
    if (!isOpen) {
        name.value = props.menu.name; 
    }
};

const handleEdit = async () => {
  if(name.value === '') {
    errorMessage.value = 'Le nom du menu est requis.'
    return
  }
  
  try {
    isLoading.value = true
    const data = await editMenu(props.menu.id, name.value)
    if(data) {
      toast({
        title: 'Menu modifié',
        description: 'Le menu a été modifié avec succès.',
        duration:1000
      })
      setTimeout(() => {
        emits('menuUpdated');
        open.value = false 
      }, 1000);
      //Ajouter setTime Out
    
    } else {
      toast({
        title: 'Erreur',
        description: 'Veuillez réessayer',
      })
      open.value = false
    }
  } catch (error) {
    console.error(error)
  }finally {
    isLoading.value = false
  }
    
}
</script>