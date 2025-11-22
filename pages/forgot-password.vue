<template>
    <main class="w-5/6 md:w-3/6 mx-auto flex flex-col min-h-screen py-5">
        <div class="my-5 cursor-pointer" @click="$router.back()">
          <ArrowLeft />
        </div>
        <!-- Titre principal -->
        <div class="w-full mb-2">
          <h1 class="text-2xl font-bold">Réinitialiser votre mot de passe</h1>
        </div>
    
        <!-- Instructions -->
        <div class="w-full md:w-4/6 mb-3">
          <p class="text-xs text-gray-600">
            Veuillez entrer votre adresse email pour recevoir un lien de réinitialisation de votre mot de passe.          
          </p>
        </div>
        <Separator class="bg-gray-200" />
        <!-- Section Mot de passe -->
        <div class="w-full md:w-4/6 flex flex-col p-5 gap-4">
          <div>
            <h2 class="text-lg font-medium">Entrez votre email</h2>
          </div>

          <div class="relative w-full max-w-sm">
            <Input id="email" type="text" v-model="email" placeholder="Email..." class="pl-10 focus-visible:ring-transparent" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
              <Mail />
            </span>
          </div>
          <span class="text-xs text-red-500">{{errorMessage}}</span>
        </div>
    
        <Separator class="bg-gray-200" />
    
        <!-- Bouton d'enregistrement -->
        <div class="w-full md:w-4/6 flex p-5">
          <Button class="bg-orange-500 hover:bg-orange-400 w-full md:w-auto" @click="sendResetPasswordLink">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
              Envoyer le lien de réinitialisation
          </Button>
        </div>
        <Toaster />
      </main>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { Mail, ArrowLeft } from 'lucide-vue-next';

const isLoading= ref(false);

const email = ref('');

const supabase = useSupabaseClient();
const {toast} = useToast();
const errorMessage = ref('');

const sendResetPasswordLink = async () => {
    
    if (email.value !== '') {
      isLoading.value = true;
      try {
      
        let { data, error } = await supabase.auth.resetPasswordForEmail(email.value)

          toast({
            title: 'Email envoyé',
            description: 'Un email de confirmation a été envoyé à votre adresse email.',
          });
          email.value = '';
          if (error) {
            errorMessage.value = 'Une erreur s\'est produite lors de l\'envoi de l\'email de réinitialisation.';
          }
      } catch (error) {
        toast({
            title: 'Erreur',
            description: 'Une erreur s\'est produite lors de l\'envoi de l\'email de réinitialisation.',
          });
      } finally {
          isLoading.value = false;
      }
    }else{
        errorMessage.value = 'Veuillez entrer votre adresse email';
    }

}
</script>

<style scoped>

</style>