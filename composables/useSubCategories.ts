export default function useSubCategories(){
    const supabase = useSupabaseClient();
    const user = useUser()

    const addSubCategory = async (name:string, categoryId:string)=>{
        
        const { data, error } = await supabase
        .from('sub_categories')
        .insert([
            { name: name, category_id: categoryId, user_id: user.value.id },
        ])
        .select()

        if (error) {
            return null;
        }

        return data;
    }

    const editSubMenu = async (id:string, name:string)=>{
        
        const { data, error } = await supabase
        .from('sub_categories')
        .update({ name:  name, updated_at: new Date()})
        .eq('id', id)
        .select()

        if (error) {
            return null;
        }

        return data;

    }

    const deleteSubMenu =  async (id:string)=>{
        
        const { error } = await supabase
        .from('sub_categories')
        .delete()
        .eq('id', id)

        if (error) {
            return false;
        }

        return true;
    }

    return {
        addSubCategory,
        editSubMenu,
        deleteSubMenu
    }
}