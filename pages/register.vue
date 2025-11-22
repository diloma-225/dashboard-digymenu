<template>
  <main class="w-full min-h-screen flex items-center justify-center px-4 py-5">
    <div
      class="w-full md:w-4/6 rounded-lg md:rounded-l-lg h-auto flex flex-col md:flex-row gap-5 shadow-lg bg-white"
    >
      <!-- Section image -->
      <div
        class="image-section rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-3/6 h-48 md:h-auto bg-gray-200"
      >
        <!-- Placeholder pour l'image -->
      </div>

      <!-- Section formulaire -->
      <div class="w-full md:w-3/6 p-5 box-border pt-0">
        <img src="/logo.png" class="w-24 mx-auto my-5" alt="" />
        <h1 class="text-2xl md:text-3xl font-bold my-2 text-center md:text-left">
          Créez votre Restaurant
        </h1>
        <p class="text-sm md:text-xs text-center md:text-left">
          Vous avez déjà un compte ?
          <nuxt-link class="underline text-primary font-semibold" to="/login"
            >Connectez-vous</nuxt-link
          >
        </p>
        <Separator class="my-2" />
        <!-- Informations sur le restaurant -->
        <h3 class="text-lg my-2 text-center md:text-left">
          Informations sur le restaurant
        </h3>
        <div class="row flex flex-col gap-2">
          <Label>Nom du restaurant</Label>
          <Input
            class="focus-visible:ring-transparent"
            v-model="form.restaurantName"
            placeholder="Entrez le nom du restaurant..."
          ></Input>
        </div>
        <Separator class="my-2" />
        <!-- Informations sur le propriétaire -->
        <h3 class="text-lg my-2 text-center md:text-left">
          Informations sur le propriétaire
        </h3>
        <div class="row flex flex-col gap-2 my-2">
          <Label>Nom du propriétaire</Label>
          <Input
            class="focus-visible:ring-transparent"
            v-model="form.username"
            placeholder="Entrez le nom du propriétaire..."
          ></Input>
        </div>
        <div class="row flex flex-col gap-2 my-2">
          <Label>Email du propriétaire</Label>
          <Input
            class="focus-visible:ring-transparent"
            v-model="form.email"
            placeholder="Entrez l'email du propriétaire..."
          ></Input>
        </div>
        <div class="row flex flex-col gap-2">
          <Label for="phone">Numéro de téléphone (+225)</Label>
          <Input
            id="phone"
            class="focus-visible:ring-transparent"
            v-model="form.phone"
            v-maska="'##-##-##-##-##'"
            placeholder="00 00 00 00 00"
          />
        </div>
        <span class="text-sm text-red-500">{{ errorMessage }}</span>
        <!-- Section du bouton Enregistrer -->
        <div class="mt-2 flex items-center justify-start">
          <Button
            class="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-md text-white shadow-lg"
            @click="signUp"
          >
            <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
    <Toaster />
  </main>
</template>

<script setup>
import { vMaska } from "maska/vue";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import Toaster from "@/components/ui/toast/Toaster.vue";
const { toast } = useToast();

const { translateError } = useErrorTranslator();

const supabase = useSupabaseClient();
const errorMessage = ref("");

const form = ref({
  restaurantName: "",
  username: "",
  email: "",
  phone: "",
});
const isLoading = ref(false);
const signUp = async () => {
  try {
    // Activer le chargement
    isLoading.value = true;

    // Valider les données du formulaire avant l'envoi
    if (
      !form.value.email ||
      !form.value.username ||
      !form.value.phone ||
      !form.value.restaurantName
    ) {
      errorMessage.value = "Tous les champs sont obligatoires.";
      return; // Arrêter l'exécution en cas d'erreur
    }

    // Insérer dans la table 'pending_registrations'
    const { error: insertError } = await supabase.from("pending_registrations").insert({
      email: form.value.email,
      name: form.value.username,
      phone: form.value.phone,
      restaurant_name: form.value.restaurantName, // Correction de la faute
    });

    if (insertError) {
      // Gestion spécifique de l'erreur d'insertion
      errorMessage.value = translateError(insertError);
      return; // Arrêter l'exécution en cas d'erreur
    }

    // Envoi de l'OTP pour l'inscription
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: form.value.email,
    });

    if (otpError) {
      // Gestion spécifique de l'erreur d'envoi de l'OTP
      errorMessage.value = translateError(otpError);
      return;
    }

    form.value = {}; // Réinitialiser le formulaire
    toast({
      title: "Inscription réussie",
      description: "Veuillez vérifier votre email pour continuer.",
    });
  } catch (error) {
    // Gestion globale des erreurs
    console.error("Une erreur s'est produite :", error);
    errorMessage.value = error.message || "Une erreur inattendue s'est produite.";
  } finally {
    // Désactiver le chargement
    isLoading.value = false;
  }
};
</script>

<style scoped>
.image-section {
  background-image: url("/images/form-cover.jpg");
  background-size: cover;
  background-position: center;
}

main {
  background: url("/images/bg-form.jpg");
  background-size: cover;
}
.container {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
</style>
