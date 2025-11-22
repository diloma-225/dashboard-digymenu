<template>
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
          <button><Icon name="uil:trash" size="20" style="color: red" /></button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription class="text-xs text-red-500">
            Êtes-vous sûr de vouloir supprimer cette sous-catégorie ? Cette action est irréversible et les données associées seront définitivement perdues.
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
      <Toaster />
    </Dialog>
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
  import { useToast } from '@/components/ui/toast/use-toast'
  import Toaster from '@/components/ui/toast/Toaster.vue'
  import { Loader2 } from 'lucide-vue-next'
  
  const props = defineProps({
      id: {
          type: String,
          required: true,
      },
  })

  const {toast} = useToast()
  const isLoading = ref(false)
  const open = ref(false)
  const emits = defineEmits(['subCatDeleted'])
  const {deleteSubMenu} = useSubCategories()

  const handleDelete = async () => {
    if (!props.id) {
      return;
    }

    try {
      isLoading.value = true;
      const response = await deleteSubMenu(props.id);
      if (response) {
        toast(
          {
            title: 'Succès',
            description: `Suppression éffectuée avec succès`,
            duration : 1000
          }
        )
        setTimeout(() => {
          emits('subCatDeleted')
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
      isLoading.value = false;
    }
  }
  </script>