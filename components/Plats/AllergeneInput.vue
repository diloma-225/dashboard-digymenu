<template>
  <!-- Input tag pour la sélection et affichage des allergènes -->
  <TagsInput class="px-0 gap-0 w-80" :model-value="modelValue">
    <!-- Affichage des tags (allergènes) sélectionnés -->
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem
        v-for="item in modelValue"
        :key="item"
        :value="item"
      >
        <TagsInputItemText>{{ item }}</TagsInputItemText>
        <!-- Bouton de suppression de tag -->
        <TagsInputItemDelete @click="removeTag(item)" />
      </TagsInputItem>
    </div>

    <!-- Combobox pour ajouter un nouvel allergène -->
    <ComboboxRoot
      v-model="modelValue"
      v-model:open="open"
      v-model:search-term="searchTerm"
      class="w-full"
    >
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Ajouter un allergène..." as-child>
          <TagsInputInput
            class="w-full px-3"
            :class="modelValue.length > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none 
              data-[state=open]:animate-in data-[state=closed]:animate-out 
              data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
              data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
              data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 
              data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty />
            <CommandGroup>
              <CommandItem
                v-for="allergen in filteredAllergens"
                :key="allergen.id"
                :value="allergen.label"
                @select.prevent="(ev) => {
                  if (typeof ev.detail.value === 'string') {
                    searchTerm = ''
                    modelValue.push(ev.detail.value)
                  }
                  if (filteredAllergens.length === 0) {
                    open = false
                  }
                }"
              >
                {{ allergen.label }}
              </CommandItem>
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

const props = defineProps({
  itemAllergens:{
    type: Array,
    required:true
  }
})

const emit = defineEmits(['update:itemAllergens'])

const supabase = useSupabaseClient()
const route = useRoute()

// Liste complète des allergènes récupérée depuis la table "allergenes"
const allergens = ref<Array<{ id: number; label: string }>>([])

// Liste des allergènes sélectionnés pour l'item (initialisée par défaut avec ceux déjà enregistrés)
const modelValue = ref([])



watch(modelValue, (newValue)=>{
  emit("update:itemAllergens", newValue);
})

// Contrôle l'ouverture du combobox et le terme de recherche
const open = ref(false)
const searchTerm = ref('')

// Récupérer les allergènes et les allergènes déjà associés à l'item lors du montage du composant
onMounted(async () => {

  const itemId = route.params.id

  const { data: allergenData, error: allergenError } = await supabase
    .from('allergenes')
    .select('*')
  
  if (allergenError) {
    console.error('Erreur lors de la récupération des allergènes :', allergenError)
  } else {
    allergens.value = allergenData as Array<{ id: number; label: string }>
  }

  const { data: dishAllergenData, error: dishError } = await supabase
    .from('allergene_item')
    .select(`*, allergene: allergene_id (id, label)`)
    .eq('item_id', itemId)
  
  if (dishError) {
    console.error("Erreur lors de la récupération des allergènes de l'item :", dishError)
  } else if (dishAllergenData) {
    // On initialise modelValue avec les labels des allergènes déjà enregistrés
    modelValue.value = dishAllergenData.map((item: any) => item.allergene.label)
  }

})
// Filtrer la liste des allergènes pour n'afficher que ceux non encore sélectionnés
const filteredAllergens = computed(() => 
  allergens.value.filter(allergen => !modelValue.value.includes(allergen.label))
)

// Fonction pour supprimer un tag de la sélection
const removeTag = (tag: string) => {
  modelValue.value = modelValue.value.filter(item => item !== tag)
}


</script>
