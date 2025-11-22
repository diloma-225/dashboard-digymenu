<template>
    <Dialog>
      <DialogTrigger as-child>
          <button><Icon name="uil:trash" size="20" style="color: red" /></button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription class="text-xs text-red-500">
            Êtes-vous sûr de vouloir supprimer cette table ? Cette action est irréversible et les données associées seront définitivement perdues.
          </DialogDescription>
        </DialogHeader>
  
        <DialogFooter class="sm:justify-start gap-2">
          <DialogClose as-child>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
            <Button @click="handleDelete" type="button" variant="destructive">
                Supprimer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
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
  
  const props = defineProps({
      table: {
          type: Object,
          required: true,
      },
  })
  const handleDelete = () => {
    console.log('Deleting menu with id:', props.table.id)
  }
  </script>