<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button class="justify-start"><Sheet /> Importer un fichier csv</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importez CSV</DialogTitle>
            <DialogDescription>
              Importer un fichier CSV pour ajouter plusieurs catégories en une seule fois
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="flex flex-col gap-4">
              <Label for="name" class="text-left">
                Importez votre fichier
              </Label>
              <Input id="doc" type="file" placeholder="Ex : Vin blanc" class="col-span-3 focus-visible:ring-transparent" />
            </div>
          </div>
          <DialogFooter class="flex xs:gap-2">
            <Button type="submit" class="bg-green-700 hover:bg-green-500 text-white rounded-lg">
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
import { Sheet } from 'lucide-vue-next'
</script>