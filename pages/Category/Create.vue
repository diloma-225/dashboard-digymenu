<template>
  <main
    class="flex flex-col items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 min-h-screen overflow-y-auto"
  >
    <div class="flex justify-start w-5/6">
      <button
        class="border-2 border-gray-700 p-2 rounded-full"
        @click="() => $router.back()"
      >
        <MoveLeftIcon />
      </button>
    </div>
    <div class="flex xs:flex-col md:flex-row gap-4">
      <CategoriesCreateModal @categoryAdded="updateCategory" />
      <CategoriesImportModal />
    </div>
    <div v-if="isLoading" class="text-gray-200">Chargement...</div>
    <div class="md:w-5/6 xs:w-full flex flex-col gap-2" v-else>
      <div class="xs:w-full md:w-2/6" v-if="categories.length === 0">
        <CategoriesEmpty />
      </div>
      <Card
        class="md:w-5/6 xs:w-full"
        v-for="category in categories"
        :key="category.id"
        v-else
      >
        <CardHeader>
          <Collapsible v-model:open="category.isOpen" class="space-y-2">
            <div class="flex items-center justify-between space-x-4 px-4">
              <CollapsibleTrigger as-child>
                <h4 class="text-md flex gap-3 font-semibold cursor-pointer">
                  {{ category.name }}
                  <ChevronDown
                    class="w-6 h-6"
                    :class="category.isOpen ? 'transform rotate-180' : ''"
                  />
                </h4>
                <div class="flex gap-3">
                  <SubCategoriesCreateModal
                    :category_id="category.id"
                    @subCatCreated="updateCategory"
                  />
                  <CategoriesEditModal
                    :cat="category"
                    @category-edited="updateCategory"
                  />
                  <CategoriesDeleteModal
                    :id="category.id"
                    @categoryDeleted="updateCategory"
                  />
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent class="space-y-4 px-4">
              <!-- Iterate over subcategories of the category -->
              <div
                v-for="(subcategory, subIndex) in category.sub_categories"
                :key="subcategory.id"
              >
                <div class="rounded-md border px-4 py-3 text-sm">
                  <div class="flex justify-between">
                    <h5 class="font-semibold my-2">{{ subcategory.name }}</h5>
                    <div class="flex gap-3">
                      <SubCategoriesEditModal
                        :subcat="subcategory"
                        @subCatEdited="updateCategory"
                      />
                      <SubCategoriesDeleteModal
                        :id="subcategory.id"
                        @sub-cat-deleted="updateCategory"
                      />
                    </div>
                  </div>
                  <!-- Subcategory name -->

                  <!-- Display dishes inside subcategory -->
                  <div
                    v-for="(dish, dishIndex) in subcategory.items"
                    :key="dish.id"
                    class="pl-4 border mb-3 p-2 flex gap-3 rounded hover:cursor-pointer relative"
                  >
                    <img
                      :src="loadImageFromStorage(dish)"
                      width="100"
                      class="rounded"
                      alt=""
                    />
                    <div class="flex flex-col gap-3">
                      <p>{{ dish.name }}</p>
                      <p class="font-semibold">{{ dish.price }} FCFA</p>
                    </div>
                    <div class="absolute right-0 pr-3">
                      <Icon
                        name="uil:edit"
                        size="20"
                        style="color: orange"
                        @click="router.push(`/items/${dish.id}/edit`)"
                      />
                      <PlatsDeleteModal :id="dish.id" @item-deleted="updateCategory" />
                    </div>
                  </div>
                  <PlatsCreateModal
                    :sub-cat_id="subcategory.id"
                    @item-created="updateCategory"
                  />
                </div>
              </div>

              <!-- Display dishes directly in the category (not in a subcategory) -->
              <div
                v-for="(dish, dishIndex) in category.items"
                :key="dish.id"
                class="pl-4 border mb-3 p-2 flex gap-3 rounded hover:cursor-pointer relative"
              >
                <img
                  :src="loadImageFromStorage(dish)"
                  width="100"
                  class="rounded"
                  alt=""
                />
                <div class="flex flex-col gap-3">
                  <p>{{ dish.name }}</p>
                  <p class="font-semibold">{{ dish.price }} FCFA</p>
                </div>
                <div class="absolute right-0 pr-3">
                  <Icon
                    name="uil:edit"
                    size="20"
                    style="color: orange"
                    @click="router.push(`/items/${dish.id}/edit`)"
                  />
                  <PlatsDeleteModal :id="dish.id" @item-deleted="updateCategory" />
                </div>
              </div>
              <PlatsCreateModal
                :category_id="category.id"
                @item-created="updateCategory"
              />
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  ChevronDown,
  ChevronDownSquare,
  ImportIcon,
  MoveLeftIcon,
  PlusCircle,
  PlusIcon,
  Sheet,
} from "lucide-vue-next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Category, Subcategory, Dish } from "~/types";

definePageMeta({
  layout: "app-layout",
});

const router = useRouter();
const route = useRoute();
const { getCategories } = useCategories();
const supabase = useSupabaseClient();

const categories = ref([]);
const isOpen = ref(false);
const isLoading = ref(false);

const updateCategory = async () => {
  const menuId = route.query.id;
  if (!menuId) {
    return;
  }
  categories.value = await getCategories(menuId);

  categories.value.forEach((category: Category) => {
    category.isOpen = true;
  });
};

onMounted(async () => {
  const menuId = route.query.id;

  if (!menuId) {
    return;
  }
  try {
    isLoading.value = true;

    const data = await getCategories(menuId);

    if (data) {
      categories.value = data;
      // Adding `isOpen` for categories and subcategories
      categories.value.forEach((category: Category) => {
        category.isOpen = false;
      });
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
});

const loadImageFromStorage = (item) => {
  if (item) {
    // Si le logo n'a pas de prévisualisation, on charge l'image depuis Storage
    const { data } = supabase.storage.from("images").getPublicUrl(`${item.image}`);

    if (item.image) {
      return data.publicUrl;
    } else {
      return "/images/dish.jpg";
    }
  }
  return "/images/dish.jpg";
};
</script>

<style scoped></style>
