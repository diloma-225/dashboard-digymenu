<template>
    <main class="flex flex-col min-h-screen">
        <Separator class="bg-gray-200" />
      
        <!-- Section Thème -->
        <div class="flex flex-col md:flex-row p-5 md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold">Thème</h1>
            <p class="text-sm">Personnalisez l'apparence générale de votre tableau de bord selon vos préférences.</p>
          </div>
          <Select defaultValue="system" desabled>
            <SelectTrigger class="sm:w-full md:w-[180px]">
              <SelectValue placeholder="Sélectionner un thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="system">
                  <span class="flex gap-3"><MonitorCog /> Système</span>
                </SelectItem>
<!--                 <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem> -->
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      
        <Separator class="bg-gray-200" />

        <div class="flex flex-col md:flex-row p-5 md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold">Couleur principale du menu</h1>
            <p class="text-sm">Choisissez la couleur dominante pour l'affichage du menu de votre restaurant.</p>
          </div>
          <card class="p-2 flex flex-col gap-2">
            <div class="row flex flex-wrap gap-3">
                <div
                v-for="color in colors"
                :key="color"
                :style="{ backgroundColor: `#${color}` }"
                class="w-8 h-8 rounded-lg cursor-pointer"
                @click="setColor(color)"
                ></div>
                <div class="relative xs:w-4/6 md:w-2/6 items-center">
                    <Input id="color" v-model="primaryColor" type="text" placeholder="0000" class="pl-10 focus-visible:ring-transparent" />
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                        <Hash />
                    </span>
                </div>
            </div>
            
        </card>
        </div>
      
        <Separator class="bg-gray-200" />
      
        <!-- Section Profil -->
        <div class="flex flex-col p-5 gap-2">
          <h1 class="text-2xl font-bold">Profil</h1>
          <p>Gérez vos informations personnelles</p>
        </div>
      
        <Separator class="bg-gray-200" />
      
        <!-- Section Nom -->
        <div class="w-full md:w-4/6 flex flex-col md:flex-row p-5 justify-between gap-4">
          <div>
            <h2 class="text-xl">Nom</h2>
            <p class="text-sm text-gray-600">Saisissez votre nom complet</p>
          </div>
          <div class="relative w-full max-w-sm">
            <Input id="username" v-model="infos.name" type="text" placeholder="Nom..." class="pl-10 focus-visible:ring-transparent" />
            <span class="absolute start-0 top-0 inset-y-3 flex items-center justify-center px-2">
              <User />
            </span>
          </div>
        </div>
      
        <Separator class="bg-gray-200" />
      
        <!-- Section Email -->
        <div class="w-full md:w-4/6 flex flex-col md:flex-row p-5 justify-between gap-4">
          <div>
            <h2 class="text-xl">Email</h2>
            <p class="text-sm text-gray-600">Entrez l'adresse email associée à votre compte.</p>
          </div>
          <div class="relative w-full max-w-sm">
            <Input id="email" type="text" v-model="infos.email" placeholder="Email..." class="pl-10 focus-visible:ring-transparent" />
            <span class="absolute start-0 top-0 inset-y-5 flex items-center justify-center px-2">
              <Mail />
            </span>
          </div>
        </div>

        <Separator class="bg-gray-200" />
      
        <!-- Section Email -->
        <div class="w-full md:w-4/6 flex flex-col md:flex-row p-5 justify-between gap-4">
          <div>
            <h2 class="text-xl">Phone</h2>
            <p class="text-sm text-gray-600">Entrez l'adresse email associée à votre compte.</p>
          </div>
          <div class="relative w-full max-w-sm">
            <Input id="phone" v-model="infos.phone" class="pl-10 focus-visible:ring-transparent" v-maska="'##-##-##-##-##'" placeholder="00-00-00-00-00" />
            <span class="absolute start-0 top-0 inset-y-5 flex items-center justify-center px-2">
              <Phone />
            </span>
          </div>
        </div>
        
        <div class="w-full md:w-4/6 flex pl-5">
          <span class="text-xs text-red-500">{{errorMessage}}</span>
        </div>
        <div class="w-full md:w-4/6 flex p-5">
          <Button class="bg-orange-500 hover:bg-orange-400 w-full md:w-auto" @click="updateInfos">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
            Enregistrer les modifications
          </Button>
        </div>
      
        <Separator class="bg-gray-200" />
      
        <!-- Section Mot de passe -->
        <div class="w-full md:w-4/6 flex flex-col md:flex-row p-5 justify-between gap-4">
          <div>
            <h2 class="text-lg">Mot de passe</h2>
            <p class="text-sm text-gray-600">Confirmez votre mot de passe actuel avant d'en définir un nouveau.</p>
          </div>
          <div class="relative w-full max-w-sm flex flex-col gap-2">
            <Input id="curentPassword" v-model="currentPassword" type="password" placeholder="Mot de passe actuel..." class="focus-visible:ring-transparent" />
            <Input id="newPassword" v-model="newPassword" type="password" placeholder="Nouveau mot de passe..." class="focus-visible:ring-transparent" />
          </div>
        </div>
        <div class="w-full md:w-4/6 flex pl-5">
          <span class="text-xs text-red-500">{{message}}</span>
        </div>
      
        <!-- Bouton d'enregistrement -->
        <div class="w-full md:w-4/6 flex p-5">
          <Button class="bg-orange-500 hover:bg-orange-400 w-full md:w-auto" @click="updatePassword">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="ChangePasswordLoading" />
            Modifier le mot de passe
          </Button>
        </div>
        <Toaster />
      </main>
      
</template>

<script setup lang="ts">
import { MonitorCog, User, Mail, Phone } from 'lucide-vue-next';
import { Hash } from 'lucide-vue-next';
import {getUserProfile, fetchCurrentUser} from '@/composables/useUser'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'

import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

definePageMeta({
    layout:'app-layout'
})

const primaryColor = ref('0056b3');
const user = useUser()
const supabase = useSupabaseClient()
const isLoading = ref(false)
const ChangePasswordLoading = ref(false)
const {toast} = useToast()

const {fetchUserRestaurant} = useRestaurant()

const infos = ref({
  email:'',
  name:'',
  phone:''
})

const errorMessage= ref('');


const colors =  [
    '0056b3',
    'FF6900', 
    'FCB900', 
    '7BDCB5', 
    '00D084',
    '8ED1FC', 
]

const setColor = (color: string) => {
  primaryColor.value = color;
}

onMounted(async () => {
  const data = await fetchUserRestaurant();
  if (data) {
    primaryColor.value = data.color_code.replace('#', '')
  }
  const userInfos = await getUserProfile()
  if (userInfos && user.value?.email) {
    infos.value =  userInfos
    infos.value.email = user.value?.email
  }
})

const updateInfos = async () => {
  // Vérifie si tous les champs sont remplis
  if (!infos.value.email || !infos.value.name || !infos.value.phone) {
    errorMessage.value = 'Tous les champs sont requis';
    return;
  }

  try {
    isLoading.value = true
    // Récupère les données de l'utilisateur actuel
    const oldData = await getUserProfile();

    if (oldData) {
      // Si le nom a changé, mets à jour
      if (infos.value.name !== oldData.name) {
        const { data, error } = await supabase
          .from('profiles')
          .update({ name: infos.value.name })
          .eq('user_id', user.value?.id)
          .select();

        if (error) {
          errorMessage.value = "Erreur lors de la mise à jour du nom.";
          return;
        }
        toast({
            title: 'Modification de nom réussie',
        });
      }

      // Si le téléphone a changé, mets à jour
      if (infos.value.phone !== oldData.phone) {
        const { data, error } = await supabase
          .from('profiles')
          .update({ phone: infos.value.phone })
          .eq('user_id', user.value?.id)
          .select();

        if (error) {
          errorMessage.value = "Erreur lors de la mise à jour du téléphone.";
          return;
        }
        toast({
            title: 'Modification de numéro de téléphone réussie',
        });
      }

      
    }

    const restaurantData = await fetchUserRestaurant();
    
    if (primaryColor.value != restaurantData?.color_code) {
      const { error: updateError } = await supabase
                .from('restaurants')
                .update({
                  color_code: '#'+primaryColor.value,
                })
                .eq('id', restaurantData.id);
        if (updateError) {
          toast({
            title: 'Erreur. Veuillez reéssayer',
          });
        }
        toast({
            title: 'la couleur dominante a été modifiée avec succès !',
        });

    }

    // Si l'email a changé, mets à jour
    if (infos.value.email !== user.value?.email) {
      const { error: updateError } = await supabase.auth.updateUser({
        email: infos.value.email
      });

      if (updateError) {
        errorMessage.value = "Erreur lors de la mise à jour de l'email.";
        return;
      }

      toast({
            title: 'Modification de l\'adresse mail réussie',
        });
    }

  } catch (error) {
    console.error("Erreur lors de la récupération des informations :", error);
    errorMessage.value = "Une erreur est survenue, veuillez réessayer.";
  }finally{
    await fetchCurrentUser()
    await getUserProfile()
    isLoading.value = false
  }
};



const currentPassword = ref("");
const newPassword = ref("");
const message = ref("");

const updatePassword = async () => {
  // Récupérer l'utilisateur actuel
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    message.value = "Utilisateur non authentifié.";
    return;
  }

  try {
    ChangePasswordLoading.value = true
    // Vérifier le mot de passe actuel en essayant une nouvelle connexion
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword.value
    });

    if (signInError) {
      message.value = "Mot de passe actuel incorrect.";
      return;
    }

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value
    });

    if (updateError) {
      message.value = "Erreur lors de la mise à jour du mot de passe.";
    } else {
      toast({
          title: 'Mot de passe mis à jour avec succès !',
      });
    }
    
  } catch (error) {
    message.value = "Une erreur est survenue, veuillez réessayer.";
  }finally{
    currentPassword.value = ''
    newPassword.value = ''
    message.value = ''
    ChangePasswordLoading.value = false
  }
 
};
</script>

<style scoped>

</style>