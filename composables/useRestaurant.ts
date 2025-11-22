import type { Restaurant } from '../types';


export default function useRestaurant() {
    const supabase = useSupabaseClient();
    const user = useUser();

    const fetchUserRestaurant = async () : Promise<Restaurant|null> => {

        if (user.value) {
            let { data, error } = await supabase
            .from('restaurants')
            .select('id, name, description, address, created_at, logo, cover, color_code')
            .eq('user_id', user.value.id)
            .single();

            if (error) {
                return null;
            }

            return data;
        }
        return null;
    };

    const updateRestaurant = async (restaurant: Restaurant) => {
        if (!user.value) return; // Sécurité : on arrête si l'utilisateur n'est pas connecté
    
        try {
            // 1️⃣ Récupérer les infos actuelles du restaurant
            const restaurantInfos = await fetchUserRestaurant();
            if (!restaurantInfos) return;
    
            restaurant.id = restaurantInfos.id;
    
            // 2️⃣ Mise à jour des champs texte uniquement
            const { error: updateError } = await supabase
                .from('restaurants')
                .update({
                    name: restaurant.name,
                    description: restaurant.description,
                    address: restaurant.address
                })
                .eq('id', restaurant.id);
    
            if (updateError) {
                console.error("Erreur lors de la mise à jour du restaurant:", updateError.message);
                return null;
            }
    
            // 3️⃣ Gestion de l'upload du logo
            if (restaurant.logo && restaurant.logo !== restaurantInfos.logo) {
                
                if (restaurantInfos.logo) {
                    // Supprimer l'ancien logo
                    const oldLogoPath = restaurantInfos.logo.split('/').pop(); // Récupérer le nom du fichier
                    await supabase.storage.from('logos').remove([`${restaurantInfos.logo}`]);
                    
                }
                // Upload du nouveau logo
                const { data: logoData, error: logoError } = await supabase.storage
                    .from('logos')
                    .upload(`${Date.now()}.png`, restaurant.logo);
    
                if (logoError) {
                    console.error("Erreur lors de l'upload du logo:", logoError.message);
                } else {
                    // Mise à jour de l'URL du logo dans la table `restaurants`
                    await supabase
                        .from('restaurants')
                        .update({ logo: logoData.path })
                        .eq('id', restaurant.id);
                }
            }
    
             // 4️⃣ Gestion de l'upload de la cover
            if (restaurant.cover && restaurant.cover !== restaurantInfos.cover) {
                if (restaurantInfos.cover) {
                    // Supprimer l'ancienne cover
                    const oldCoverPath = restaurantInfos.cover.split('/').pop(); // Récupérer le nom du fichier
                    await supabase.storage.from('covers').remove([`${restaurantInfos.cover}`]);
                }
                // Upload de la nouvelle cover
                const { data: coverData, error: coverError } = await supabase.storage
                    .from('covers')
                    .upload(`${Date.now()}.png`, restaurant.cover);
    
                if (coverError) {
                    console.error("Erreur lors de l'upload de la cover:", coverError.message);
                } else {
                    // Mise à jour de l'URL de la cover dans la table `restaurants`
                    await supabase
                        .from('restaurants')
                        .update({ cover: coverData.path })
                        .eq('id', restaurant.id);
                }
            } 
    
            return true; // Succès
        } catch (err) {
            console.error("Une erreur s'est produite :", err);
            return null;
        }
    };


    return {
        fetchUserRestaurant,
        updateRestaurant,
    };
}