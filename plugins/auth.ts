import { useUser, fetchCurrentUser, isProfileComplete, is_subscription_valid } from "~/composables/useUser"

export default defineNuxtPlugin(async () => {
   const user = useUser();
   const router = useRouter()
   if (user.value !== null) return;
   user.value = await fetchCurrentUser();

  if (user.value) {
    await isProfileComplete();
    await is_subscription_valid(); // Vérifier si l'abonnement est valide.
  }

})