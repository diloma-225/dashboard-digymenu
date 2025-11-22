import type { User } from '@supabase/supabase-js'; 



// Store utilisateur (global)
const user = ref(null);

// Définition du store utilisateur
export function useUser() {
    return useState<User | null>("user", () => null); // Initialisation avec null pour indiquer qu'il n'y a pas d'utilisateur par défaut
  }
  

// Fonction pour récupérer l'utilisateur courant depuis Supabase
export async function fetchCurrentUser() {
    const supabase = useSupabaseClient();
  try {
    const { data: { user: currentUser }, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      return null;
    }

    return currentUser; // Retourne les données utilisateur récupérées
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération de l'utilisateur :", error);
    return null;
  }
}

// Fonction pour déconnecter l'utilisateur
export async function logout() {
    const supabase = useSupabaseClient();
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur lors de la déconnexion :", error);
      throw error;
    }

    // Réinitialise l'utilisateur dans le store
    const userState = useUser();
    userState.value = null;
  } catch (error) {
    console.error("Erreur inattendue lors de la déconnexion :", error);
    throw error;
  }
}

export async function isProfileComplete() {
  const supabase = useSupabaseClient();
    const userState = useUser();
   const router = useRouter();

    if (userState.value?.email){
      try {
        // Vérification de l'existence de l'email dans 'pending_registrations'
          const { data, error } = await supabase
            .from('pending_registrations')
            .select('*')
            .eq('email', userState.value.email)
            .single();
      
            if (error) {
              if (error.code === 'PGRST116') {
                const nextRoute = router.currentRoute.value.fullPath; // Chemin actuel sollicité par l'utilisateur
                router.push(nextRoute); // Redirige l'utilisateur vers le chemin actuel
              } else {
                console.error("Erreur lors de la requête Supabase :", error.message);
                // Vous pouvez gérer d'autres erreurs ici si nécessaire
              }
              return; // Arrête l'exécution ici
            }
      
          if (data) {
            // Si l'email existe dans 'pending_registrations', redirection vers /complete-profile
            console.log("Email trouvé dans 'pending_registrations', redirection en cours...");
            router.push('/complete-profile');
          } else {
            router.push('/');
          }
      } catch (err) {
        console.error("Erreur système lors de la vérification :", err);
      }
    } 
   
}

export async function is_subscription_valid() {
  const supabase = useSupabaseClient();
  const userState = useUser();
  const router = useRouter()
  
  try {
    // Appel RPC pour vérifier la validité de l'abonnement
    const { data, error } = await supabase
      .rpc('check_user_subscription_validity', {
        profile_user_id: userState.value.id,
      });

    if (error) {
      // Gérer l'erreur ici
      console.error('Error checking subscription:', error.message);
      return false;
    }
    
    if (!data) {
      setTimeout(() => {
        router.push('/subscription-end')
      }, 100);
    }else{
      return true;
    }

    

  } catch (err) {
    // Gestion des erreurs réseau ou autres erreurs d'exécution
    console.error('Unexpected error:', err);
    return false;
  }
}




export async function getUserProfile() : Promise<any> {
  const supabase = useSupabaseClient();
  const user = useUser();
  try {
    if (!user.value?.id) {
      return null;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('plan_id, name, phone')
      .eq('user_id', user.value?.id)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération du profil utilisateur :", error);
    return null;
  }
}

