<template>
    <main class="w-5/6 md:w-3/6 mx-auto flex flex-col min-h-screen py-5">
      <!-- Titre principal -->
      <div class="w-full mb-2">
        <h1 class="text-2xl font-bold">Complétez votre profil</h1>
      </div>
  
      <!-- Instructions -->
      <div class="w-full md:w-4/6 mb-3">
        <p class="text-xs text-gray-600">
          Veuillez définir un mot de passe sécurisé pour finaliser la création de votre compte.
        </p>
      </div>
      <Separator class="bg-gray-200" />
      <!-- Section Mot de passe -->
      <div class="w-full md:w-4/6 flex flex-col p-5 gap-4">
        <div>
          <h2 class="text-lg font-medium">Créer un mot de passe</h2>
          <p class="text-xs text-gray-600">Choisissez un mot de passe fort et facile à retenir.</p>
        </div>
  
        <div class="relative w-full max-w-sm flex flex-col gap-4">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <Input
              id="newPassword"
              type="password"
              v-model="password"
              placeholder="Entrez un nouveau mot de passe"
              class="focus-visible:ring-transparent mt-1"
            />
            <span class="text-xs text-red-500">{{errorMessage}}</span>
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <Input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              placeholder="Confirmez le mot de passe"
              class="focus-visible:ring-transparent mt-1"
            />
          </div>
        </div>
      </div>
  
      <Separator class="bg-gray-200" />
  
      <!-- Bouton d'enregistrement -->
      <div class="w-full md:w-4/6 flex p-5">
        <Button class="bg-orange-500 hover:bg-orange-400 w-full md:w-auto" @click="savePassword">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
            Enregistrer le mot de passe
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

const supabase = useSupabaseClient()
const user = useUser();
const { translateError } = useErrorTranslator();
const {toast} = useToast();
const router = useRouter();

const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading= ref(false);

const savePassword = async () => {
    if (password.value.length < 8) {
        errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères.';
        return;
    }
    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Les mots de passe ne correspondent pas.';
        return;
    }
    errorMessage.value = '';

    try {
        isLoading.value = true;

        if (!user.value?.email) {
            throw new Error('Aucun utilisateur connecté.');
        }

            const { data, error } = await supabase.auth.updateUser({
                email: user.value.email,
                password: password.value,
            })

        if (error) {
            errorMessage.value = translateError(error);
        }

        const { data: pendingData, error: fetchError } = await supabase
            .from('pending_registrations')
            .select('*')
            .eq('email', user.value.email)
            .single();

        if (fetchError || !pendingData) {
            errorMessage.value = `Erreur lors de la récupération des données : ${fetchError?.message || 'Aucune donnée trouvée.'}`;
            return;
        }

        // Insérer les détails dans `profiles`
        const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert([
                {
                    user_id: user.value.id, // ID utilisateur
                    name: pendingData.name, // Nom récupéré de pending_registrations
                    created_at: new Date(), // Date actuelle
                    phone: pendingData.phone, // Téléphone récupéré de pending_registrations
                    plan_id: '35557afc-2071-40fc-a31c-91c2406e82df', // Plan par défaut ou spécifique que vous définissez ici
                    subscription_start: new Date(), // Date de début d'abonnement (actuelle)
                    subscription_end: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Ajoute 1 mois à la date de début
                }
            ])
            .select();

        if (insertError) {
            errorMessage.value = `Erreur lors de l'insertion dans profiles : ${insertError.message}`;
            return;
        }

        const { data: insertRestauData, error: insertRestauError } = await supabase
            .from('restaurants')
            .insert([
                {
                    user_id: user.value.id, // ID utilisateur
                    name: pendingData.restaurant_name, // Nom récupéré de pending_registrations
                    created_at: new Date(), // Date actuelle
                    phone: pendingData.phone,
                }
            ])
            .select();

            if (insertRestauError) {
                console.log(insertRestauError);
            }

        const { error: deleteError } = await supabase
            .from('pending_registrations')
            .delete()
            .eq('email', user.value.email);

        if (deleteError) {
            errorMessage.value = `Erreur lors de la suppression des données temporaires : ${deleteError.message}`;
            return;
        }

        // Réinitialisation et message de succès
        errorMessage.value = '';
        password.value = '';
        confirmPassword.value = '';
        toast({
            title: 'Inscription réussie',
            description: 'Veuillez vérifier votre email pour continuer.',
        });
        setTimeout(() => {
            router.push('/');
        }, 3000);
       
    } catch (error) {
        
    } finally {
        isLoading.value = false;
    }


};

</script>

<style scoped>

</style>