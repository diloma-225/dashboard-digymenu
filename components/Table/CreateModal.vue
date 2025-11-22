<template>
    <Dialog>
        <DialogTrigger as-child>
          <Button>
            Créer une nouvelle Table
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Création de table</DialogTitle>

          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">
                Nom
              </Label>
              <Input id="name" placeholder="Ex : Table 1" class="col-span-3 focus-visible:ring-transparent" />
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


//if subCat_id is not provided, it means we are creating a dish directly in the category

//if subCat_id is provided, it means we are creating a dish in a subcategory
</script>