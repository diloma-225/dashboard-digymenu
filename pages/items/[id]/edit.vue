    <template>
        <main class="flex flex-col items-center  min-h-screen pb-2">
            <div class="flex justify-start w-5/6 my-5">
                <button class="border-2  border-gray-700 p-2 rounded-full" @click="() => $router.back()">
                    <IconsArrowBackIcon size="24" />  
                </button>
            </div>

            <div class="form " v-if="item">
                <div class="row flex xs:flex-col md:flex-row gap-4">
                    <div class="flex flex-col gap-4">
                        <Label >Nom de l'item</Label>
                        <Input v-model="item.name"  placeholder="Nom..." class="w-80 focus-visible:ring-transparent" />
                    </div>
                    <div class="flex flex-col gap-4 mb-3">
                        <Label >Prix</Label>
                        <Input v-model="item.price" type="number" placeholder="Entrer une description" class="w-80 focus-visible:ring-transparent" />
                    </div>
                </div>
                
                <div class="row flex xs:flex-col md:flex-row gap-4 mb-3">
                    <div class="flex flex-col gap-4">
                        <Label >Reduction (en %)</Label>
                        <Input v-model="item.discount"  @blur="checkDiscount" type="number" placeholder="Entrer une description" class="w-80 focus-visible:ring-transparent" />
                    </div>
                    <div class="flex flex-col gap-4">
                        <Label >Description</Label>
                        <Textarea v-model="item.description" placeholder="Entrer une description" class="w-80 focus-visible:ring-transparent" />
                    </div>
                </div>
                <div class="row flex xs:flex-col md:flex-row gap-4 mb-3">
                    <div class="flex flex-col gap-4">
                        <Label for="picture">Image</Label>
                        <Input id="picture"  @change="(e:Event)=>handleFile(e)" class="w-80 focus-visible:ring-transparent" type="file" />
                        <div v-if="previewImage !==''" class="relative">
                            <img :src="previewImage" width="100px"  alt="Image plat" />
                            <Button class="my-2 bg-red-600 hover:bg-red-500" @click="handleDeleteImage">
                                <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isDeletingImage" />
                                Spp. image
                            </Button>
                        </div>
                          
                    </div>
                    <div class="flex flex-col justify-start gap-4">
                        <Label>Allergènes</Label>
                        <PlatsAllergeneInput v-model:itemAllergens="itemAllergens" 
                        @update:itemAllergens="updateAllergens"  />
                    </div>
                </div>
                <div class="row flex xs:flex-col md:flex-row justify-start mb-3">
                    <div class="flex flex-col gap-4">
                        <Label >Disponible</Label>
                        <Switch :checked="item.is_active"  @update:checked="handleSwitchChange" id="airplane-mode" />
                    </div>
                </div>
                <div class="row flex justify-start">
                    <div class="flex gap-4">
                        <Button class="bg-green-700 hover:bg-green-500" @click="handleEdit"> 
                            <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
                            Enregistrer</Button>
                    </div>

                </div>
            </div>

            <Toaster />
        </main>
    </template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
    import { Textarea } from '@/components/ui/textarea'
    import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    } from '@/components/ui/select'
    import {
  Card
} from '@/components/ui/card'
    import { Loader2 } from 'lucide-vue-next'
    import { Switch } from '@/components/ui/switch'
    import { useToast } from '@/components/ui/toast/use-toast'
    import Toaster from '@/components/ui/toast/Toaster.vue'

    definePageMeta({
        layout: 'app-layout',
    })

    const route = useRoute();
    const user = useUser()

    const {toast} = useToast();
    const {getItem, editItem, deleteItemImage} = useItems()
    const isLoading = ref(false)
    const previewImage = ref('')
    const itemAllergens = ref<string[]>([])
    const errorMessage = ref({
        name:'',
        price:''
    })

    const supabase = useSupabaseClient()

    const handleSwitchChange = (e:Event)=>{
        item.value.is_active = !item.value?.is_active;
    }
    const item = ref<{ id: string; name: string; price: number; category_id: string; sub_category_id: string, discount:number, image:string, is_active:boolean } | null>(null); // Item sélectionné

    const fileToUpload = ref(null);
    
    const handleFile = (e:Event)=>{
        const file = (e.target as HTMLInputElement)?.files?.[0];
        if (file && file.type.match('image.*')) {
            previewImage.value = URL.createObjectURL(file);
            fileToUpload.value= file;
        }
    }


    const loadImageFromStorage = async () => {

        
        if (item.value) {
            // Si le logo n'a pas de prévisualisation, on charge l'image depuis Storage
            const { data } = supabase
                .storage
                .from('images')
                .getPublicUrl(`${item.value.image}`)
            
            
            if (item.value.image) {
                previewImage.value =  data.publicUrl;
                
            }else{
                previewImage.value =  ''
            }
            
        }
    }

    const checkDiscount = () => {
        if (item.value?.discount === '' || item.value?.discount === null) {
            item.value.discount = 0; // Remet une valeur par défaut
        }
    };

    const existingAllergens = ref<Array<{ id: string, label: string }>>([]);    const itemId = route.params.id
    const allergens = ref<Array<{ id: string; label: string }>>([])

    onMounted(async () => {
        await loadItemInfos()
        await fetchItemAllergens() 
        await fecthAllAllergens()
    })


    const handleEdit = async ()=>{

        
        if (item.value && item.value.name == '') {
            errorMessage.value.name = 'Le champs name est obligatoire'
            return;
        }else{
            errorMessage.value.name = ''
        }
        if (item.value && item.value.price == 0) {
            errorMessage.value.price = 'Le champs price est obligatoire'
            return;
        }else{
            errorMessage.value.price = ''
            errorMessage.value.name = ''
        }
        if (fileToUpload.value !=null) {
            item.value.image = fileToUpload.value
        }

         try {
            isLoading.value = true
            const data = await editItem(item.value)
            if (data) {
                const allergen_updated  = await syncAllergens();
                
                if (allergen_updated) {
                    toast({
                        title: 'Succès',
                        description: 'Item modifié avec succès',
                        duration:1000
                    });
                    setTimeout(async () => {
                        await loadItemInfos()
                    }, 1000);
                }else{
                    toast({
                        title: 'Erreur',
                        description: `Une erreur s'est produite. Veuillez réessayer`,
                        duration:1000
                    });
                }
                
            }
        } catch (error) {
            toast({
                    title: 'Erreur',
                    description: `Une erreur s'est produite. Veuillez réessayer`,
                    duration:1000
            });
        }finally{
            isLoading.value = false
            await loadItemInfos()
        }  
    }

    const isDeletingImage = ref(false)
 
    const handleDeleteImage = async ()=>{
        const itemId = route.params.id
        const inputElement = document.getElementById('picture') as HTMLInputElement;
        if (!itemId) {
            return;
        }
        if (!item.value?.image) {
            previewImage.value = '';
            inputElement.value = ''
            return;
        }
        try {
            isDeletingImage.value = true
            const response = await deleteItemImage(itemId);
            
            if (response) {
                await loadItemInfos()
                await loadImageFromStorage()
            }
        } catch (error) {
            
        }finally{
            isDeletingImage.value = false
        }
        
    }

    const loadItemInfos = async ()=>{
        const itemId = route.params.id;
        
        if (itemId) {
            const data = await getItem(itemId);
            if (data) {
                item.value = data;                
                await loadImageFromStorage()
            }
        }
    }

    const fetchItemAllergens = async () => {
        const { data, error } = await supabase
            .from('allergene_item')
            .select('allergene_id, allergenes(label)')
            .eq('item_id', itemId)

        if (error) console.error(error)
        else existingAllergens.value = data.map(a => ({
            id: a.allergene_id,
            label: a.allergenes.label
        }))
    }

    const syncAllergens = async () => {
        const currentLabels = existingAllergens.value.map(a => a.label);
        let hasChanges = false;

        if (existingAllergens.value.length === 0) {
            hasChanges = true;
        }

        // Ajout des nouveaux allergènes qui n'existent pas encore
        for (const label of itemAllergens.value) {
            if (!currentLabels.includes(label)) {
                const allergen = allergens.value.find(a => a.label === label);
                if (allergen) {
                    const added = await addAllergenToItem(allergen.id);
                    if (added) hasChanges = true;
                }
            }
        }

        // Suppression des allergènes qui ne sont plus dans itemAllergens
        for (const allergen of existingAllergens.value) {
            if (!itemAllergens.value.includes(allergen.label)) {
                const removed = await removeAllergenFromItem(allergen.id);
                if (removed) hasChanges = true;
            }
        }
        // Si aucun changement n'a été détecté et qu'il n'y a pas d'allergènes, retourner false
        return hasChanges;
    };


    const addAllergenToItem = async (allergenId: string): Promise<boolean> => {
        const { error } = await supabase.from('allergene_item').insert([
            { item_id: itemId, allergene_id: allergenId, user_id: user.value?.id}
        ])
        return !error;
    }

    const removeAllergenFromItem = async (allergenId:string) => {
    const { error } = await supabase
        .from('allergene_item')
        .delete()
        .match({ item_id: itemId, allergene_id: allergenId, user_id:user.value.id })

        return !error;
    }
    const updateAllergens = (newAllergens: string[])=>{
        itemAllergens.value = newAllergens
    }

    const fecthAllAllergens = async()=>{
        

        const { data: allergenData, error: allergenError } = await supabase
        .from('allergenes')
        .select('*')

        if (allergenError) {
        console.error('Erreur lors de la récupération des allergènes :', allergenError)
        } else {
            allergens.value = allergenData as Array<{ id: string; label: string }>
        }
    }

</script>

<style scoped>

</style>