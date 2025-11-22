<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <Button><PlusIcon /> Ajouter une nouvelle catégorie</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
            <DialogDescription>
              Remplissez les détails du menu ici. Cliquez sur "Enregistrer" lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">
                Nom
              </Label>
              <Input id="name" v-model="name" placeholder="Ex : Vins" class="col-span-3 focus-visible:ring-transparent" />
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
import { PlusIcon } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { Loader2 } from 'lucide-vue-next'

const isLoading = ref(false)
const { toast } = useToast()

const name = ref('')
const errorMessage = ref('')
const { addCategory } = useCategories()
const route = useRoute()
const open = ref(false)

const emits = defineEmits(['categoryAdded'])

const save = async () => {
    isLoading.value = true
    if (name.value==='') {
        errorMessage.value = 'Le nom de la catégorie est requis'
        isLoading.value = false
        return;
    }

    try {
        const data = await addCategory(name.value, route.query.id)
        if (data) {
          toast(
            {
              title: 'Catégorie ajoutée',
              description: `La catégorie ${name.value} a été ajoutée avec succès`,
            }
          )
          emits('categoryAdded')
          open.value = false;
          name.value = '';
          errorMessage.value
        }else{
          toast(
            {
              title: 'Erreur',
              description: `Une erreur s'est produite lors de l'ajout de la catégorie ${name.value}`,
            }
          )
          open.value = false;
          name.value = '';
          errorMessage.value
        }
        
    } catch (error) {
      toast(
          {
            title: 'Erreur',
            description: `Une erreur s'est produite lors de l'ajout de la catégorie ${name.value}`,
          }
        )
        open.value = false;
        name.value = ''
        errorMessage.value
    } finally {
        isLoading.value = false
    }
}


</script>