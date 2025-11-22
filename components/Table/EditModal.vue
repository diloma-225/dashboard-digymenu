<template>
    <Dialog>
        <DialogTrigger as-child>
            <button><Icon name="uil:edit" size="20" style="color: orange" /></button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modification de Table</DialogTitle>
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
            <Button type="submit" class="bg-orange-500 hover:bg-orange-500 text-white rounded-lg">
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

const props = defineProps({
    table: {
        type: Object,
        required: true
    }
})

const name =computed(()=>props.table.name)
</script>