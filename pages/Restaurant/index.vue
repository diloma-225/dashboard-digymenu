<template>
  <main class="flex flex-col items-center min-h-screen">
    <Card class="xs:w-full md:w-3/6 mb-3">
      <CardHeader>
        <CardTitle class="flex xs:flex-col md:flex-row justify-between xs:gap-3"
          >Informations sur le restaurant
          <Button @click="previewRestaurant" v-if="restaurant.name"
            >Prévusialiser votre page</Button
          ></CardTitle
        >
      </CardHeader>
      <CardContent>
        <form class="flex flex-col space-y-4">
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Nom du restaurant</Label>
              <Input
                id="name"
                v-model="restaurant.name"
                class="focus-visible:ring-transparent"
                placeholder="Entrez le nom du restaurant"
              />
            </div>
          </div>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="address">Adresse du restaurant</Label>
              <Input
                id="address"
                v-model="restaurant.address"
                placeholder="Entrez l'adresse du restaurant"
                class="focus-visible:ring-transparent"
              />
            </div>
          </div>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="address">Description</Label>
              <Input
                id="address"
                v-model="restaurant.description"
                placeholder="Description du restaurant"
                class="focus-visible:ring-transparent"
              />
            </div>
          </div>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="logo">Logo du restaurant (500x500)</Label>
              <Input
                id="logo"
                type="file"
                @change="(e:Event)=>{handleFileUpload(e,'logo')}"
              />
            </div>
            <Card class="w-1/2" v-if="restaurant.logo || previewLogo">
              <img :src="previewLogo" alt="Logo du restaurant" />
            </Card>
            <Button
              class="w-1/2 my-2 bg-red-600 hover:bg-red-500"
              @click.prevent="handleDeleteImage('logo')"
              v-if="restaurant.logo || previewLogo"
            >
              <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isDeletingLogo" />
              Supp. image
            </Button>
          </div>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="cover">Image de couverture du restaurant (1600x400)</Label>
              <Input
                id="cover"
                type="file"
                @change="(e:Event)=>{handleFileUpload(e,'cover')}"
              />
            </div>
            <Card class="w-1/2" v-if="restaurant.cover || previewCover">
              <img :src="previewCover" alt="Image de couverture" />
            </Card>
            <Button
              class="w-1/2 my-2 bg-red-600 hover:bg-red-500"
              @click.prevent="handleDeleteImage('cover')"
              v-if="restaurant.cover || previewCover"
            >
              <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isDeletingCover" />
              Supp. image
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <Button class="bg-green-500 hover:bg-green-500" @click="saveChanges">
          <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
          Sauvegarder
        </Button>
      </CardFooter>
    </Card>
    <Card class="xs:w-full md:w-3/6">
      <CardHeader>
        <CardTitle>Informations sur le propriétaire</CardTitle>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col space-y-4">
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="owner-name">Nom du propriétaire</Label>
              <Input
                id="owner-name"
                v-model="userInfos.name"
                disabled
                placeholder="Entrez le nom du propriétaire"
                class="focus-visible:ring-transparent"
              />
            </div>
          </div>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="owner-email">Email du propriétaire</Label>
              <Input
                id="owner-email"
                v-model="userInfos.email"
                disabled
                type="email"
                placeholder="Entrez l'email du propriétaire"
                class="focus-visible:ring-transparent"
              />
            </div>
          </div>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="phone">Numéro de téléphone</Label>
              <Input
                disabled
                id="phone"
                class="focus-visible:ring-transparent"
                v-maska="'##-##-##-##-##'"
                v-model="userInfos.phone"
                placeholder="00-00-00-00-00"
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
    <Toaster />
  </main>
</template>

<script setup lang="ts">
import { vMaska } from "maska/vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/types";
import { getUserProfile } from "~/composables/useUser";
import { Loader2 } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { routerKey } from "vue-router";

definePageMeta({
  layout: "app-layout",
});

const { toast } = useToast();

const isLoading = ref(false);
const isDeletingLogo = ref(false);
const isDeletingCover = ref(false);

const restaurant = ref<any>({
  name: "",
  address: "",
  logo: "",
  cover: "",
  description: "",
  coverUrl: null,
  logoUrl: null,
});

const userInfos = ref({
  name: "",
  phone: "",
  plan_id: "",
  email: "",
});

const user = useUser();

const { fetchUserRestaurant, updateRestaurant } = useRestaurant();

const logoFile = ref<File | null>(null);
const coverFile = ref<File | null>(null);

const handleFileUpload = (event: Event, type: "logo" | "cover") => {
  const file = (event.target as HTMLInputElement)?.files?.[0]; // Récupère le fichier
  if (file && file.type.match("image.*")) {
    // Vérifie si le fichier est une image
    if (type == "logo") {
      previewLogo.value = URL.createObjectURL(file);
      logoFile.value = file;
    } else if (type === "cover") {
      previewCover.value = URL.createObjectURL(file);
      coverFile.value = file;
    }
  }
};

const supabase = useSupabaseClient();

const previewLogo = ref("");
const previewCover = ref("");

const loadImageFromStorage = async () => {
  if (restaurant.value.logo) {
    // Si le logo n'a pas de prévisualisation, on charge l'image depuis Storage
    const { data } = supabase.storage
      .from("logos")
      .getPublicUrl(`${restaurant.value.logo}`);

    if (data) {
      previewLogo.value = data.publicUrl;
    } else {
      previewLogo.value = "";
    }
  }

  if (restaurant.value.cover) {
    const { data } = supabase.storage
      .from("covers")
      .getPublicUrl(`${restaurant.value.cover}`);

    if (data) {
      previewCover.value = data.publicUrl;
    } else {
      previewCover.value = "";
    }
  }
};

const saveChanges = async () => {
  if (logoFile.value) {
    restaurant.value.logo = logoFile.value;
  }
  if (coverFile.value) {
    restaurant.value.cover = coverFile.value;
  }

  try {
    isLoading.value = true;
    await updateRestaurant(restaurant.value);
    toast({
      title: "Succès",
      description: "Les modifications ont été enregistrées avec succès.",
    });
    const data = await fetchUserRestaurant();
    if (data) {
      restaurant.value = data;
      await loadImageFromStorage();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadRestaurantInfos();

  userInfos.value = await getUserProfile();
  userInfos.value.email = user.value?.email || "";
});

const handleDeleteImage = async (type: "logo" | "cover") => {
  const inputElement = document.getElementById(`${type}`) as HTMLInputElement;

  if (type === "logo") {
    if (restaurant.value.logo && !logoFile.value) {
      try {
        isDeletingLogo.value = true;
        const response = await deleteRestaurantLogo(restaurant.value.id);
        if (response) {
          await loadRestaurantInfos();
        }
      } catch (error) {
      } finally {
        isDeletingLogo.value = false;
      }
    } else {
      previewLogo.value = "";
      inputElement.value = "";
      const data = await fetchUserRestaurant();
      if (data) {
        restaurant.value = data;
        await loadImageFromStorage();
      }
      return;
    }
  }

  if (type === "cover") {
    if (restaurant.value.cover && !coverFile.value) {
      try {
        isDeletingCover.value = true;
        const response = await deleteRestaurantCover(restaurant.value.id);
        if (response) {
          await loadRestaurantInfos();
        }
      } catch (error) {
      } finally {
        isDeletingCover.value = false;
      }
    } else {
      previewCover.value = "";
      inputElement.value = "";
      const data = await fetchUserRestaurant();
      if (data) {
        restaurant.value = data;
        await loadImageFromStorage();
      }
      return;
    }
  }
};

const deleteRestaurantLogo = async (id: string) => {
  if (!id) {
    console.error("ID invalide pour la suppression.");
    return false;
  }

  const { data, error } = await supabase.from("restaurants").select("logo").eq("id", id);

  if (error || !data || !data.length) {
    console.error("Erreur lors de la récupération du logo :", error?.message);
    return false;
  }

  const { error: imageError } = await supabase.storage
    .from("logos")
    .remove([data[0].logo]);

  if (imageError) {
    console.error("Erreur lors de la suppression de l'image:", imageError.message);
    return false;
  }

  // Mettre à jour la base de données
  const { error: updateError } = await supabase
    .from("restaurants")
    .update({ logo: null })
    .eq("id", id);

  if (updateError) {
    console.error("Erreur lors de la mise à jour du restaurant :", updateError.message);
    return false;
  }

  // Mettre à jour l'interface utilisateur
  restaurant.value.logo = null;
  previewLogo.value = ""; // Réinitialiser la prévisualisation
  await loadRestaurantInfos(); // Recharger les infos du restaurant

  return true;
};
const deleteRestaurantCover = async (id: string) => {
  if (!id) {
    console.error("ID invalide pour la suppression.");
    return false;
  }

  const { data, error } = await supabase.from("restaurants").select("cover").eq("id", id);

  if (error || !data || !data.length) {
    console.error("Erreur lors de la récupération du logo :", error?.message);
    return false;
  }

  const { error: imageError } = await supabase.storage
    .from("covers")
    .remove([data[0].cover]);

  if (imageError) {
    console.error("Erreur lors de la suppression de l'image:", imageError.message);
    return false;
  }

  // Mettre à jour la base de données
  const { error: updateError } = await supabase
    .from("restaurants")
    .update({ cover: null })
    .eq("id", id);

  if (updateError) {
    console.error("Erreur lors de la mise à jour du restaurant :", updateError.message);
    return false;
  }

  // Mettre à jour l'interface utilisateur
  restaurant.value.cover = null;
  previewCover.value = ""; // Réinitialiser la prévisualisation
  await loadRestaurantInfos(); // Recharger les infos du restaurant

  return true;
};

const loadRestaurantInfos = async () => {
  try {
    const data = await fetchUserRestaurant();
    if (data) {
      restaurant.value = data;
      await loadImageFromStorage();
    }
  } catch (error) {}
};

const router = useRouter();
const config = useRuntimeConfig();
const previewRestaurant = async () => {
  if (restaurant.value.name) {
    await navigateTo(
      `${config.public.restaurantPageUrl}/${restaurant.value.name.replace(/\s+/g, "-")}`,
      {
        external: true,
        open: {
          target: "_blank",
        },
      }
    );
  }
};
</script>

<style scoped></style>
