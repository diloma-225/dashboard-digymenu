<template>
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
          <button><Icon name="uil:trash" size="20" style="color: red" /></button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription class="text-xs text-red-500">
            Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible et les données associées seront définitivement perdues.
          </DialogDescription>
        </DialogHeader>
  
        <DialogFooter class="sm:justify-start xs:gap-2">
          <DialogClose as-child>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
            <Button @click="handleDelete" type="button" variant="destructive">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
                Supprimer
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
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog'
  import { Loader2 } from 'lucide-vue-next'
  import { useToast } from '@/components/ui/toast/use-toast'
  import Toaster from '@/components/ui/toast/Toaster.vue'
  
  const props = defineProps({
      id: {
          type: String,
          required: true,
      },
  })

  const isLoading = ref(false)
  const open = ref(false)
  const emits = defineEmits(['categoryDeleted'])

  const {toast} = useToast()
  const {deleCategory} = useCategories()

  const handleDelete = async () => {
    isLoading.value = true;

    try {
      const data = await deleCategory(props.id);
      if (data) {
        toast(
            {
              title: 'Catégorie supprimée',
              description: `La catégorie  a été supprimée avec succès`,
              duration : 1000
            }
          )
          setTimeout(() => {
            emits('categoryDeleted')
            open.value = false;
          }, 1000);
          
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
      isLoading.value = true;
    }
  }
  </script>