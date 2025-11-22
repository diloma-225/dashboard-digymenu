<template>
    <Dialog v-model:open="open" @update:open="handleClodeModal" class="overflow-y-auto">
        <DialogTrigger as-child>
          <Button >
            Créer un nouvel item
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Création d'item</DialogTitle>

          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">
                Nom
              </Label>
              <Input id="name" v-model="form.name" placeholder="Ex : Le pinot noir" class="col-span-3 focus-visible:ring-transparent" />
              <span class="text-red-500 text-xs col-span-4">{{ errorMessage.name }}</span>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">
                Prix
              </Label>
              <Input id="name" type="number" required v-model="form.price" class="col-span-3 focus-visible:ring-transparent" />
              <span class="text-red-500 text-xs col-span-4">{{ errorMessage.price }}</span>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="image" class="text-right">
                Image
              </Label>
              <Input id="image" type="file" @change="(e:Event)=>handleImage(e)" class="col-span-3 focus-visible:ring-transparent" />
              <span class="text-red-500 text-xs col-span-4">{{ errorMessage.image }}</span>

            </div>
            <div class="flex justify-center">
              <Card class="w-1/4 flex items-center justify-center" v-if="previewImage">
                <img :src="previewImage"  alt="Image plat" />    
              </Card>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label >Description</Label>
              <Textarea placeholder="Entrer une description" v-model="form.description" class="col-span-3 border focus-visible:ring-transparent" />
            </div>

          </div>
          <DialogFooter class="flex xs:gap-2">
            <Button type="submit" @click="save" class="bg-green-700 hover:bg-green-500 text-white rounded-lg">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
              Enregistrer
            </Button>
            <DialogClose as-child>
                <Button type="button" class="bg-gray-300 hover:bg-gray-400 text-black rounded-lg">
                    Annuler
                  </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Card
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
  category_id :{
    type:String,
    required:false
  },
  subCat_id : {
    type:String,
    required:false
  }
})

const form = ref({
  name:'',
  price:0,
  description:'',
  image: null as File | null
})

const resetForm = ()=>{
  form.value = {
    name:'',
    price:0,
    description:'',
    image: null as File | null
  }

  errorMessage.value = {
    name:'',
    price:'',
    image:''
  }
}

const handleClodeModal = ()=>{
  resetForm();
  
}

const {toast} = useToast()
const isLoading = ref(false)
const open = ref(false)
const emits = defineEmits(['itemCreated'])
const previewImage = ref<string|null>(null)
const errorMessage = ref({
  name:'',
  price:'',
  image:''
})
const {addItem} = useItems()

const handleImage = (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0];
  if (file && file.type.match('image.*')) {
    const maxSize = 5 * 1024 * 1024; // 5 Mo en octets
    const requiredWidth = 1024;
    const requiredHeight = 684;

    // Vérification de la taille du fichier
    if (file.size > maxSize) {
      errorMessage.value.image = `L'image est trop grande. Veuillez télécharger une image de moins de 5 Mo.`
      return;
    }

    // Créer un objet Image pour vérifier les dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width !== requiredWidth || img.height !== requiredHeight) {
        errorMessage.value.image = `L'image doit avoir une taille de ${requiredWidth}x${requiredHeight} pixels.`
        return;
      }

      // Si l'image respecte les dimensions et la taille du fichier, on la charge dans la prévisualisation et le formulaire
      previewImage.value = URL.createObjectURL(file);
      form.value.image = file;
    };
    
    // Créer une URL pour l'image et la charger
    img.src = URL.createObjectURL(file);
  }
};


const save =  async ()=>{
  if (form.value.name == '') {
    errorMessage.value.name = 'Le champs name est obligatoire'
    return;
  }else{
    errorMessage.value.name = ''
  }
  if (form.value.price <= 0) {
    errorMessage.value.price = 'Le champs price est obligatoire'
    return;
  }else{
    errorMessage.value.price = ''
  }

  try {
    isLoading.value = true

    const data = await addItem(form.value, props.category_id, props.subCat_id);

    if(data){
      toast({
        title: 'Succès',
        description: 'Item créé avec succès',
        duration:1000
      });

      setTimeout(() => {
        emits('itemCreated')
        open.value = false;
        resetForm()
      }, 1000);
    }else{
      toast(
        {
          title: 'Erreur',
          description: `Une erreur s'est produite. Veuillez réessayer`,
          duration : 1000
        }
      )
      setTimeout(() => {
        open.value = false;
        resetForm()
      }, 1000);
    }

  } catch (error) {
    toast(
        {
          title: 'Erreur',
          description: `Une erreur s'est produite. Veuillez réessayer`,
          duration : 1000
        }
      )
      setTimeout(() => {
        open.value = false;
        resetForm()
      }, 1000);
  }finally{
    isLoading.value = false
  }
  
}

</script>