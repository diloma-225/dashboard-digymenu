<template>
  <TagsInput class="px-0 gap-0 w-80" :model-value="modelValue" @update:model-value="updateSubCat">
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
    </div>

    <ComboboxRoot v-model="modelValue" v-model:open="open" v-model:search-term="searchTerm" class="w-full">
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Sous-catégories..." as-child>
          <TagsInputInput class="w-full px-3" :class="modelValue.length > 0 ? 'mt-2' : ''" @keydown.enter.prevent @click="openSuggestions" />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
          <div class="p-2">
            <Input type="text" v-model="SubCatModel" placeholder="Tapez votre catégorie" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm focus-visible:ring-transparent" />
            <button
            @click="() => setCategory(SubCatModel)"
              class="mt-2 w-full px-4 py-2 bg-indigo-500 text-white rounded-md"
            >
              Enregistrer
            </button>
          </div>
            <CommandGroup>

            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>

<script setup lang="ts">
import { CommandGroup, CommandList } from '@/components/ui/command'

import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { UseCreatemenustore } from '~/store/createmenustore'

const menuStore = UseCreatemenustore();

const modelValue = ref<string[]>([])
const open = ref(false)
const searchTerm = ref('')

const SubCatModel =  ref('');
const openSuggestions = () => {
  open.value = true;
}

const setCategory = (value: string) => {
  if (!value) return;
  modelValue.value.push(value)
  open.value = false
  SubCatModel.value = ''
}

onMounted(() => {
  if (menuStore.form.SousCategories.length > 0) {
    modelValue.value = menuStore.form.SousCategories
  }
})

const updateSubCat = (value) => {
  menuStore.form.SousCategories = value;
}
</script>

<style scoped>

</style>