export const UseCreatemenustore = defineStore('createmenustore', () => { 
    const initialForm = {
        MenuName: '',
        categories: [] as string[], // Tableau de catégories
        SousCategories: [] as string[], // Tableau de sous-catégories
        PlatName: '',
        Price: '',
        image: '',
        allergenes: [],
        description: '',
    };

    const initialCategories = [
        { value: 'appetizers', label: 'Appetizers' },
        { value: 'main_courses', label: 'Main Courses' },
        { value: 'desserts', label: 'Desserts' },
        { value: 'beverages', label: 'Beverages' },
        { value: 'salads', label: 'Salads' },
    ];

    const form = ref({ ...initialForm });
    const categories = ref([...initialCategories]);

    const addCategory = (category: string): boolean => {
        const trimmedCategory = category.trim(); // Supprime les espaces en début/fin
        if (!trimmedCategory) {
            console.warn("La catégorie est vide.");
            return false; // Ajout échoué
        }
    
        // Transformation : Remplace les espaces par des underscores dans `value`
        const formattedValue = trimmedCategory.toLowerCase().replace(/\s+/g, '_');
    
        // Vérification des doublons dans `value`
        if (categories.value.some(cat => cat.value === formattedValue)) {
            console.warn("La catégorie existe déjà.");
            return false; // Ajout échoué
        }
    
        // Création de l'objet catégorie
        const newcat = { 
            value: formattedValue, // `value` avec underscores
            label: trimmedCategory // `label` original
        };
    
        categories.value.push(newcat); // Ajout de la catégorie
        return true; // Ajout réussi
    };

    const resetStore = () => {
        form.value = { ...initialForm };
        categories.value = [...initialCategories];
    };

    return {
        form,
        categories,
        addCategory,
        resetStore,
    };
}, {
    persist: true,
});
