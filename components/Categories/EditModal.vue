<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <button><Icon name="uil:edit" size="20" style="color: orange" /></button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
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
    cat: {
        type: Object,
        required: true
    }
})

const name = ref(props.cat.name)

watch(() => props.cat.name, (newValue) => {
    name.value = newValue;
});
const isLoading = ref(false)
const open = ref(false)
const emits = defineEmits(['categoryEdited'])
const {toast} = useToast()

const {editCategory} = useCategories()


const handleEdit = async ()=>
{
    isLoading.value = true
    try {
      const data = await editCategory(props.cat.id, name.value)
      if (data) {
        toast(
            {
              title: 'Catégorie éditée',
              description: `La catégorie  a été éditée avec succès`,
            }
        )
        open.value =false;
        emits('categoryEdited')
      }else{
        toast(
            {
              title: 'Erreur',
              description: `Une erreur s'est produite`,
            }
        )
        open.value =false;
      }
    } catch (error) {
      toast(
        {
          title: 'Erreur',
          description: `Une erreur s'est produite`,
        }
      )
      open.value =false;
    }finally{
      isLoading.value = false
    }
}
</script>