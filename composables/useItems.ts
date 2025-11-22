export default function useItems(){
    const supabase = useSupabaseClient()
    const user = useUser()

    const getItem = async (id:string)=>{
        
        let { data: item, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single()

        if (error) {
            console.error("Erreur lors de la récupération de l'élément:", error.message);
            return null;
        }
    
        if (!item) {
            console.warn("Élément introuvable.");
            return null;
        }

        return item;
    }

    const addItem = async (itemData, catId, subcatId)=>{

        if (!itemData.name || !itemData.price) {
            return;
        }

        if (catId && subcatId) {
            return;
        }
        const menuId = ref(null);
        const categoryId = catId || null;
        const subCategoryId = subcatId || null;
        const description = itemData.description?.trim() != '' ? itemData.description : null;

        // Récupérer le menu_id en fonction de category ou sub_category
    if (categoryId) {
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('menu_id')
            .eq('id', categoryId)
            .single();

        if (categoryError) {
            console.error("Erreur lors de la récupération du menu_id:", categoryError.message);
            return null;
        }

        menuId.value = categoryData?.menu_id;
        
    } else if (subCategoryId) {
        const { data: subCategoryData, error: subCategoryError } = await supabase
            .from('sub_categories')
            .select('category_id')
            .eq('id', subCategoryId)
            .single();

        if (subCategoryError) {
            console.error("Erreur lors de la récupération de category_id:", subCategoryError.message);
            return null;
        }

        let categoryId = subCategoryData?.category_id || null;

        if (categoryId) {
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('menu_id')
                .eq('id', categoryId)
                .single();

            if (categoryError) {
                console.error("Erreur lors de la récupération du menu_id:", categoryError.message);
                return null;
            }

            menuId.value = categoryData?.menu_id || null;
        }
    }


        
         const { data, error } = await supabase
                .from('items')
                .insert([
                    { 
                        name: itemData.name, 
                        price: itemData.price,
                        description: description,
                        category_id: categoryId,
                        sub_category_id : subCategoryId,
                        menu_id: menuId.value,
                        user_id:  user.value?.id,
                        is_active:true,
                        discount:0
                    },
                ])
                .select()

        if (error) {
            console.error("Erreur lors de l'ajout de l'élément:", error.message);
            return null;
        }

        if (data && itemData.image) {
            const { data: imageData, error: imageError } = await supabase.storage
                .from('images')
                .upload(`${Date.now()}.png`, itemData.image);
            if (imageError) {
                console.error("Erreur lors de l'upload du logo:", imageError.message);
                return null;
            }else{
                const { data:updateItemData, error :errorUpdateItemDate } = await supabase
                    .from('items')
                    .update({ image: imageData.path })
                    .eq('id', data[0].id)
                    .select()
            }
            
        }

        return data;
       
    }

    const editItem = async (item) => {
        if (!item.name || !item.price) {
            return false;
        }
    
        // Mise à jour des informations de l'item
        const { data, error } = await supabase
            .from('items')
            .update({ 
                name: item.name,
                price: item.price,
                discount: item.discount,
                description: item.description,
                is_active: item.is_active
            })
            .eq('id', item.id)
            .select();
    
        if (error || !data || data.length === 0) {
            return false;
        }
    
        // Vérification de l'image avant traitement
        if (item.image && item.image.type && item.image.type.match('image.*')) {
            const oldImagePath = data[0].image;
    
            // Suppression de l'ancienne image si elle existe
            if (oldImagePath) {
                await supabase.storage.from('images').remove([oldImagePath]);
            }
    
            // Upload de la nouvelle image
            const { data: imageData, error: imageError } = await supabase.storage
                .from('images')
                .upload(`${Date.now()}.png`, item.image);
    
            if (imageError) {
                return false;
            }
    
            // Mise à jour de l'image dans la table items
            await supabase
                .from('items')
                .update({ image: imageData.path })
                .eq('id', item.id);
        }
        
        return true;
    };
    

    const deleteItem = async (id: string) => {
        // Vérifier si l'ID est valide
        if (!id) {
            console.error("ID invalide pour la suppression.");
            return false;
        }
    
        // Récupérer l'élément avec son image
        const { data, error } = await supabase
            .from('items')
            .select('id, image')
            .eq('id', id)
            .maybeSingle(); // Récupère un seul élément ou null
    
        if (error) {
            console.error("Erreur lors de la récupération de l'élément:", error.message);
            return false;
        }
    
        if (!data) {
            console.warn("Élément introuvable.");
            return false;
        }
    

         const { error: deleteError } = await supabase
         .from('items')
         .delete()
         .eq('id', data.id);
 
        if (deleteError) {
            console.error("Erreur lors de la suppression de l'élément:", deleteError.message);
            return false;
        }


        if (data.image) {
            const { error: imageError } = await supabase.storage
                .from('images')
                .remove([data.image]);
    
            if (imageError) {
                console.error("Erreur lors de la suppression de l'image:", imageError.message);
                return false;
            }
        }
    
    
        return true;
    };

    const deleteItemImage = async (itemId:string)=>{
        if (!itemId) {
            console.error("ID invalide pour la suppression.");
            return;
        }

        // Récupérer l'élément avec son image
        const { data, error } = await supabase
            .from('items')
            .select('id, image')
            .eq('id', itemId)
            .maybeSingle(); // Récupère un seul élément ou null
    
        if (error) {
            console.error("Erreur lors de la récupération de l'élément:", error.message);
            return false;
        }
    
        if (!data) {
            console.warn("Élément introuvable.");
            return false;
        }
    
        // Supprimer d'abord l'image si elle existe
        if (data.image) {
            const { error: imageError } = await supabase.storage
                .from('images')
                .remove([data.image]);
    
            if (imageError) {
                console.error("Erreur lors de la suppression de l'image:", imageError.message);
                return false;
            }else{
                
                const { data, error } = await supabase
                    .from('items')
                    .update({ 
                        image: null,
                    })
                    .eq('id', itemId)
                    .select();
                    if (data) {
                        return true;
                    }
               
            }
        }
    }
    

    return{
        addItem,
        deleteItem,
        getItem,
        editItem,
        deleteItemImage
    }
}