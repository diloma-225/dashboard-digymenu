<template>
  <main class="w-full min-h-screen flex items-center justify-center px-4">
    <div
      class="w-full md:w-4/6 rounded-lg md:rounded-l-lg h-auto md:h-[85vh] flex flex-col md:flex-row gap-5 shadow-lg bg-white"
    >
      <!-- Section image -->
      <div
        class="image-section rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-3/6 h-48 md:h-auto bg-gray-200"
      >
        <!-- Placeholder pour l'image -->
      </div>
      <!-- Section formulaire -->
      <div class="w-full md:w-3/6 p-5 flex flex-col justify-center">
        <h1 class="text-2xl md:text-3xl font-bold my-2 text-center md:text-left">
          Connexion
        </h1>
        <div class="row flex flex-col gap-2 my-2">
          <Label>Email</Label>
          <Input
            placeholder="Email"
            v-model="form.email"
            class="focus-visible:ring-transparent"
          ></Input>
          <span class="text-red-500">{{ errorMessage }}</span>
        </div>
        <div class="row flex flex-col gap-2 my-2">
          <Label>Password</Label>
          <Input
            type="password"
            v-model="form.password"
            placeholder="Mot de passe"
            class="focus-visible:ring-transparent"
          ></Input>
        </div>
        <div class="my-2 flex items-center justify-between">
          <Button class="bg-green-600 hover:bg-green-500" @click="login">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
            Connexion
          </Button>
          <nuxt-link to="/forgot-password" class="text-xs underline">
            Mot de passe oublié ?
          </nuxt-link>
        </div>
        <Separator class="my-4" label="Or" />
        <p class="text-sm md:text-xs text-center mb-4">
          vous n'avez pas de compte ?
          <nuxt-link class="underline text-primary font-semibold" to="/register"
            >Créez un restaurant</nuxt-link
          >
        </p>
        <img src="/logo.png" class="w-24 mx-auto" alt="logo digymenu" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
const supabase = useSupabaseClient();

const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const isLoading = ref(false);

const { translateError } = useErrorTranslator();
const errorMessage = ref(null);

const login = async () => {
  isLoading.value = true;
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
    });
    if (error) {
      //throw error
      errorMessage.value = translateError(error);
    }
    const user = useUser();
    user.value = await fetchCurrentUser();
    router.push("/");
  } catch (error) {
    console.error("error");
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    router.push("/");
  }
});
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
