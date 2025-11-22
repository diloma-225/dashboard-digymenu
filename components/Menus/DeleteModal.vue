<template>
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
          <button><Icon name="uil:trash" size="20" style="color: red" /></button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription class="text-xs text-red-500">
            Êtes-vous sûr de vouloir supprimer ce menu ? Cette action est irréversible et les données associées seront définitivement perdues.
          </DialogDescription>
        </DialogHeader>
  
        <DialogFooter class="sm:justify-start">
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

  const { toast } = useToast()
  const isLoading = ref(false)
  const {deleteMenu} = useMenus()
  const emits = defineEmits(['menuDeleted'])
  const open = ref(false)

  const handleDelete = async () => {
      try {
          isLoading.value = true
          const data = await deleteMenu(props.id)
          if (data) {
            toast({
              title: 'Menu supprimé',
              description: 'Le menu a été supprimé avec succès',
              duration : 1000
            })
            setTimeout(() => {
              emits('menuDeleted')
              open.value = false
            }, 1000);

          }else{
            toast({
              title: 'Erreur',
              description: 'Une erreur s\'est produite lors de la suppression du menu',
            })
            isLoading.value = false
            open.value = false
          }
          
          
      } catch (error) {
          toast({
              title: 'Erreur',
              description: 'Une erreur s\'est produite lors de la suppression du menu',
          })
          isLoading.value = false
      }
  }
  </script>