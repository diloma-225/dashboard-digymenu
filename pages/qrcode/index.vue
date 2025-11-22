<template>
  <main
    class="flex md:justify-center xs:items-center md:items-start xs:flex-col md:flex-row py-2 gap-5 min-h-screen"
  >
    <!--         <Card class="xs:w-5/6 md:w-3/6 min-h-4/6">
            <CardHeader>
                <CardTitle>Restaurant QR Generators</CardTitle>
            </CardHeader>
            <CardContent>
                <form class="flex flex-col space-y-4">
                    <div class="grid items-center w-full gap-4">
                        <div class="flex flex-col space-y-1.5">
                            <Label for="name">SELECT QR STYLE</Label>
                            <div class="flex gap-2">
                                <Card class="w-1/2">
                                    <img src="/images/logo.png" alt="Logo du restaurant" />    
                                </Card>
                                <Card class="w-1/2">
                                    <img src="/images/logo.png" alt="Logo du restaurant" />    
                                </Card>
                                <Card class="w-1/2">
                                    <img src="/images/logo.png" alt="Logo du restaurant" />    
                                </Card>
                                <Card class="w-1/2">
                                    <img src="/images/logo.png" alt="Logo du restaurant" />    
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div class="grid items-center w-full gap-4">
                        <div class="flex flex-col space-y-1.5">
                            <Label for="address">SELECT QR COLOR</Label>
                            <span>Color 1</span>
                            <card class="p-2 flex flex-col gap-2">
                                <div class="row flex flex-wrap gap-3">
                                    <div
                                    v-for="color in colors"
                                    :key="color"
                                    :style="{ backgroundColor: `#${color}` }"
                                    class="w-8 h-8 rounded-lg cursor-pointer"
                                    @click="setColor('color1', color)"
                                    ></div>
                                    <div class="relative xs:w-4/6 md:w-2/6 items-center">
                                        <Input id="search" v-model="color1" type="text" placeholder="0000" class="pl-10 focus-visible:ring-transparent" />
                                        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                                            <Hash />
                                        </span>
                                    </div>
                                </div>
                                
                            </card>
                            <span>Color 2</span>
                            <card class="p-2 flex flex-col gap-2">
                                <div class="row flex flex-wrap gap-3">
                                    <div
                                    v-for="color in colors"
                                    :key="color"
                                    :style="{ backgroundColor: `#${color}` }"
                                    class="w-8 h-8 rounded-lg cursor-pointer"
                                    @click="setColor('color2', color)"
                                    ></div>
                                    <div class="relative xs:w-4/6 md:w-2/6 items-center">
                                        <Input id="search" v-model="color2" type="text" placeholder="0000" class="pl-10 focus-visible:ring-transparent" />
                                        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                                            <Hash />
                                        </span>
                                    </div>
                                </div>
                                
                            </card>
                        </div>
                    </div>
                    
                </form>
            </CardContent>
            <CardFooter class="flex justify-between px-6 pb-6">
                <Button class="bg-green-500 hover:bg-green-500">Sauvegarder</Button>
            </CardFooter>
        </Card> -->
    <Card class="xs:w-5/6 md:w-2/6 h-3/6">
      <CardHeader>
        <CardTitle>QR Downloader</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-5">
        <Card class="flex flex-col items-center justify-center p-2">
          <img :src="qrcodeUrl" alt="" />
        </Card>
        <Button @click="download">Télécharger</Button>
      </CardContent>
    </Card>
  </main>
</template>

<script setup lang="ts">
import { Hash } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

definePageMeta({
  layout: "app-layout",
});
const qrcodeUrl = ref("");
const colors = [
  "FF6900",
  "FCB900",
  "7BDCB5",
  "00D084",
  "8ED1FC",
  "0693E3",
  "ABB8C3",
  "EB144C",
  "F78DA7",
  "9900EF",
];

const color1 = ref("0000");
const color2 = ref("0000");

const setColor = (colorField: "color1" | "color2", color: string) => {
  switch (colorField) {
    case "color1":
      color1.value = color;
      break;
    case "color2":
      color2.value = color;
      break;
    default:
      break;
  }

  /*     colorInputs[colorField]= color; */
};

const supabase = useSupabaseClient();
const user = useUser();

onMounted(async () => {
  if (!user.value?.id) {
    return;
  }
  try {
    let { data: restaurant, error } = await supabase
      .from("restaurants")
      .select("name")
      .eq("user_id", user.value.id);

    if (restaurant) {
      await loadQrcode(restaurant[0].name.replace(/\s+/g, "-"));
    }
  } catch (error) {}
});

const loadQrcode = async (name: string) => {
  const config = useRuntimeConfig();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "insomnia/10.2.0",
      Authorization: "Bearer aa907170-a473-11ec-9c83-5d7e192f7cf1",
    },
    body: `{"size":500,"colorDark":"rgb(0,0,0)","logo":"scan_me.png","eye_outer":"eyeOuter0","eye_inner":"eyeInner0","qrData":"pattern0","backgroundColor":"rgb(255,255,255)","transparentBkg":false,"qrCategory":"url","text":"${config.public.restaurantPageUrl}/${name}"}`,
  };

  fetch("https://api.qrtiger.com/api/qr/static", options)
    .then((response) => response.json())
    .then((response) => (qrcodeUrl.value = response.url))
    .catch((err) => console.error(err));
};

const download = () => {
  if (!qrcodeUrl.value) return;

  // Créer un élément <a> temporaire pour le téléchargement
  const link = document.createElement("a");
  link.href = qrcodeUrl.value;
  link.download = "qrcode.png"; // Nom du fichier à télécharger

  // Ajouter et simuler un clic sur le lien
  document.body.appendChild(link);
  link.click();

  // Nettoyage
  document.body.removeChild(link);
};
</script>

<style scoped></style>
