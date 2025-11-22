
export default function useMenus() {
    const supabase = useSupabaseClient();
    const user = useUser();


    const getMenus = async () => {
        let { data: Restaurant, error:restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('user_id', user.value.id)
        .single();

        if (restaurantError) {
            console.error("Erreur lors de la récupération du restaurant :", restaurantError);
            return null;
        }


        let { data: menus, error } = await supabase
        .from('menus')
        .select('*')
        .order('updated_at', { ascending: false })
        .eq('restaurant_id', Restaurant.id);

        if (menus) {
            return menus;
        }
    }

    const addMenu = async (menu:string) => {
            
            let { data: Restaurant, error:restaurantError } = await supabase
            .from('restaurants')
            .select('id')
            .eq('user_id', user.value.id)
            .single();

            if (Restaurant) {
                const { data, error } = await supabase
                .from('menus')
                .insert([
                    { 
                        name: menu, 
                        restaurant_id: Restaurant.id, 
                        user_id: user.value.id ,
                        created_at: new Date(),

                    },
                ])
                .select()

                if (error) {
                    console.error("Erreur lors de l'ajout du menu :", error);
                    return null;
                }

                return data;
            }
        


    }

    const editMenu = async (id:string, name:string) => {
        const { data, error } = await supabase
        .from('menus')
        .update({ name: name, updated_at: new Date() })
        .eq('id', id)
        .select()

        if (error) {
            console.error("Erreur lors de la modification du menu :", error);
            return null;
        }

        return data
    }

    const deleteMenu = async (id:string) => {
        const { data, error } = await supabase
        .from('menus')
        .delete()
        .eq('id', id)
        .select()

        if (error) {
            console.error("Erreur lors de la suppression du menu :", error);
            return null;
        }

        return data
    }

    return {
        getMenus,
        addMenu,
        editMenu,
        deleteMenu
    }
}