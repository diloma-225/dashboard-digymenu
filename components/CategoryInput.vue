<template>
  <TagsInput class="px-0 gap-0 w-80" :model-value="modelValue" @update:model-value="updateSelectedCat">
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
    </div>

    <ComboboxRoot v-model="modelValue" v-model:open="open" v-model:search-term="searchTerm" class="w-full">
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Categories..." as-child>
          <TagsInputInput class="w-full px-3" :class="modelValue.length > 0 ? 'mt-2' : ''" @keydown.enter.prevent @click.prevent="()=>open=true" />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty>Catégorie introuvable.</CommandEmpty>
            <div class="p-2" v-if="showCustumCatForm">
              <Input type="text" v-model="custumCat" placeholder="Tapez votre catégorie" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm focus-visible:ring-transparent" />
              <button
              @click="() => setCustumCat(custumCat)"
                class="mt-2 w-full px-4 py-2 bg-indigo-500 text-white rounded-md"
              >
                Ajouter
              </button>
            </div>
            <CommandGroup>
              <CommandItem
                v-for="categorie in filteredCategories" :key="categorie.value" :value="categorie.label"
                @select.prevent="(ev) => {
                  if (typeof ev.detail.value === 'string') {
                    searchTerm = ''
                    modelValue.push(ev.detail.value)
                  }

                  if (filteredCategories.length === 0) {
                    open = false
                  }
                }"
              >
                {{ categorie.label }}
              </CommandItem>
              <CommandItem @select.prevent="()=>showCustumCatForm=true" value="autre">Ajouter une catégorie</CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>

<script setup lang="ts">
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'

import { UseCreatemenustore } from '~/store/createmenustore'

const menuStore = UseCreatemenustore();

const modelValue = ref<string[]>([])
const open = ref(false)
const searchTerm = ref('')

const updateSelectedCat = (value) => {
  menuStore.form.categories = value;
}

onMounted(() => {
  if (menuStore.form.categories.length > 0) {
    modelValue.value = menuStore.form.categories
  }
})

const filteredCategories = computed(() => menuStore.categories.filter(i => !modelValue.value.includes(i.label)))

const showCustumCatForm = ref(false);
const custumCat= ref('');

const setCustumCat = (value: string) => {
  if (!value) return;
  modelValue.value.push(value)
  open.value = false
  custumCat.value = ''
  showCustumCatForm.value = false;
}
</script>

<style scoped>

</style>