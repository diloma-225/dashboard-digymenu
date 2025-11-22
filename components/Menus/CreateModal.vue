<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button >
            Créer un nouveau menu
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau menu</DialogTitle>
            <DialogDescription>
              Remplissez les détails du menu ici. Cliquez sur "Enregistrer" lorsque vous avez terminé.
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
          <DialogFooter class="flex gap-2">
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
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { Loader2 } from 'lucide-vue-next'

const { toast } = useToast()

const {addMenu} = useMenus()

const name = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const emits = defineEmits(['menuCreated'])

const open = ref(false)

const save = async () => {
  if(name.value === '') {
    errorMessage.value = 'Le nom du menu est requis.'
    return
  }

  try {
    isLoading.value = true
    const data = await addMenu(name.value)
    name.value = ''
    if(data) {
      toast({
        title: 'Succès',
        description: 'Menu créé avec succès',
      });
      emits('menuCreated')
      open.value = false
    } else {
      toast({
        title: 'Erreur',
        description: 'Veuillez réessayer',
      })
      open.value = false
    }
  } catch (error) {
    toast({
      title: 'Erreur',
      description: 'Veuillez réessayer',
    })
  } finally {
    isLoading.value = false
  }
  
}

</script>