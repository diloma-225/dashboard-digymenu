
export default function useCategories() {
    const supabase = useSupabaseClient()
    const user = useUser()

    const getCategories = async (menuId:string) => {
        const { data, error } = await supabase
            .from('categories')
            .select(`
                id, name,
                sub_categories (
                  id, name,
                  items (id, name, price, image)
                ),
                items (id, name, price, image)
            `)
            .order('updated_at', { ascending: false })
            .eq('menu_id', menuId)
        if (error) {
            return null;
        }

        return data
    }

    const addCategory = async (name: string, menuId:string) => {

        const { data, error } = await supabase
        .from('categories')
        .insert([
            { 
                name: name, 
                menu_id: menuId,
                user_id: user.value.id
            },
        ])
        .select()

        if (error) {
            return null;
        }

        return data;

    }

    const editCategory = async (categoryId:string, name: string) => {
        const { data, error } = await supabase
        .from('categories')
        .update({ name: name, updated_at: new Date() })
        .eq('id', categoryId)
        .select()

        if (error) {
            return null;
        }

        return data;

    }

    const deleCategory = async (id:string)=>{
        
        const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

        if (error) {
            return false;
        }

        return true;
    }

    return{
        getCategories,
        addCategory,
        editCategory,
        deleCategory
    }
}