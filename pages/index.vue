<template>
  <main
    class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
  >
    <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card class="sm:col-span-12 bg-green-100 border-none">
          <CardHeader class="pb-3">
            <CardTitle>Bienvenue !</CardTitle>
            <CardDescription class="max-w-lg text-balance leading-relaxed">
              Bonjour <b>{{ userInfos?.name }}</b> , voici un résumé de votre activité !
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <Card class="bg-primary bg-opacity-3 text-white border-none">
          <CardHeader class="pb-2">
            <CardDescription class="text-md text-white"
              >Nombre total de menus créés</CardDescription
            >
            <CardTitle class="text-4xl">
              {{ menusCount }}
            </CardTitle>
          </CardHeader>
          <CardContent class="relative">
            <IconsMenuIcon color="#fff" class="h-16 w-16 right-5 bottom-1 absolute" />
          </CardContent>
        </Card>
        <Card class="bg-primary bg-opacity-3 text-white border-none">
          <CardHeader class="pb-2">
            <CardDescription class="text-md text-white"
              >Nombre total de plats créés</CardDescription
            >
            <CardTitle class="text-4xl">
              {{ itemCount }}
            </CardTitle>
          </CardHeader>
          <CardContent class="relative">
            <IconsMenuIcon color="#fff" class="h-16 w-16 right-5 bottom-1 absolute" />
          </CardContent>
        </Card>

        <!--         <Card class="bg-primary bg-opacity-3 text-white border-none">
          <CardHeader class="pb-2">
            <CardDescription class="text-md text-white">Nombre de vues/consultations des menus</CardDescription>
            <CardTitle class="text-3xl">
              5,329
            </CardTitle>
          </CardHeader>
          <CardContent class="relative">
            <IconsScanViews color="#fff" class="h-16 w-16 right-5 bottom-1 absolute" />
          </CardContent>
        </Card> -->
      </div>

      <!-- <div class="pt-8 pb-20">
        <h1 class="text-md font-bold mb-5">Nombre de consultations</h1>
      <Tabs default-value="day">
     
        <TabsList>
          <TabsTrigger value="day">
            Par jour
          </TabsTrigger>
          <TabsTrigger value="week">
            Par semaine
          </TabsTrigger>
          <TabsTrigger value="month">
            Par mois
          </TabsTrigger>
        </TabsList>

        <TabsContent value="day">
          <LineChart
            :data="data"
            index="date"
            :categories="['consultations']"
            :y-formatter="(tick, i) => {
              return typeof tick === 'number'
                ? `${new Intl.NumberFormat('us').format(tick).toString()}`
                : ''
            }"
          />
        </TabsContent>

        <TabsContent value="week">
          <LineChart
            :data="dataWeek"
            index="date"
            :categories="['consultations']"
            :y-formatter="(tick, i) => {
              return typeof tick === 'number'
                ? `${new Intl.NumberFormat('us').format(tick).toString()}`
                : ''
            }"
          />
        </TabsContent>

        <TabsContent value="month">
          <LineChart
            :data="dataMonth"
            index="date"
            :categories="['consultations']"
            :y-formatter="(tick, i) => {
              return typeof tick === 'number'
                ? `${new Intl.NumberFormat('us').format(tick).toString()}`
                : ''
            }"
          />
        </TabsContent>

      </Tabs>
      </div> -->
    </div>
    <div>
      <Card class="overflow-hidden">
        <CardHeader class="flex flex-row items-start bg-muted/50">
          <div class="grid gap-0.5">
            <CardDescription>{{ formattedDate }}</CardDescription>
          </div>
        </CardHeader>
        <CardContent class="px-6 text-sm">
          <Separator class="mb-4" />
          <div class="grid gap-3">
            <div class="font-semibold">Mes Informations</div>
            <dl class="grid gap-3">
              <div class="flex items-center justify-between">
                <dt class="text-muted-foreground">Nom</dt>
                <dd>{{ userInfos?.name }}</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">{{ user.email }}</a>
                </dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">{{ userInfos?.phone }}</a>
                </dd>
              </div>
            </dl>
          </div>
          <Separator class="my-4" />
          <div class="grid gap-3">
            <div class="font-semibold">Restaurant</div>
            <dl class="grid gap-3">
              <div class="flex items-center justify-between">
                <dt class="flex items-center gap-1 text-muted-foreground">
                  <MapPin class="h-4 w-4" />
                  Localisation
                </dt>
                <dd>{{ userInfos?.address }}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
        <CardFooter
          class="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3"
        >
          <div class="text-muted-foreground">Status</div>
          <div class="text-muted-foreground">
            {{ restaurantSubscription ? "Actif" : "Inactif" }}
          </div>
        </CardFooter>
      </Card>
    </div>
  </main>
</template>
<script setup>
import { LineChart } from "@/components/ui/chart-line";
import { MapPin } from "lucide-vue-next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { is_subscription_valid } from "~/composables/useUser";

definePageMeta({
  layout: "app-layout",
});

const user = useUser();

const userInfos = ref(null);

const menusCount = ref(0);
const itemCount = ref(0);

const currentDate = new Date();
const options = { year: "numeric", month: "long", day: "numeric" };
const formattedDate = `Date: ${currentDate.toLocaleDateString("fr-FR", options)}`;
const restaurantSubscription = ref(false);

const data = [
  {
    date: "2023-01-01",
    consultations: 204,
  },
  {
    date: "2023-01-02",
    consultations: 196,
  },
  {
    date: "2023-01-03",
    consultations: 196,
  },
  {
    date: "2023-01-04",
    consultations: 400,
  },
  {
    date: "2023-01-05",
    consultations: 188,
  },
  {
    date: "2023-01-06",
    consultations: 179,
  },
  {
    date: "2023-01-07",
    consultations: 500,
  },
];
const dataWeek = [
  {
    date: "2023-01-01",
    consultations: 204,
  },
  {
    date: "2023-01-02",
    consultations: 196,
  },
  {
    date: "2023-01-03",
    consultations: 196,
  },
  {
    date: "2023-01-04",
    consultations: 400,
  },
  {
    date: "2023-01-05",
    consultations: 188,
  },
  {
    date: "2023-01-06",
    consultations: 179,
  },
  {
    date: "2023-01-07",
    consultations: 500,
  },
];
const dataMonth = [
  {
    date: "2023-01-01",
    consultations: 204,
  },
  {
    date: "2023-01-02",
    consultations: 196,
  },
  {
    date: "2023-01-03",
    consultations: 196,
  },
  {
    date: "2023-01-04",
    consultations: 400,
  },
  {
    date: "2023-01-05",
    consultations: 188,
  },
  {
    date: "2023-01-06",
    consultations: 179,
  },
  {
    date: "2023-01-07",
    consultations: 500,
  },
];

const supabase = useSupabaseClient();
onMounted(async () => {
  const { data, errorGetProfil } = await supabase
    .from("profiles")
    .select("plan_id, name, phone")
    .eq("user_id", user.value.id);
  userInfos.value = data[0];

  let { data: restaurants, errorGetRestaurantAdress } = await supabase
    .from("restaurants")
    .select("address")
    .eq("user_id", user.value.id)
    .single();
  userInfos.value = { ...userInfos.value, ...restaurants };

  const { count, error } = await supabase
    .from("menus")
    .select("user_id", { count: "exact" }) // Sélectionner un seul champ pour minimiser les données retournées
    .eq("user_id", user.value.id);

  if (count) {
    menusCount.value = count;
  }

  const { data: itemsData, error: itemsError, count: itemsCountValue } = await supabase
    .from("items")
    .select("user_id", { count: "exact" }) // Sélectionner un seul champ pour minimiser les données retournées
    .eq("user_id", user.value.id);

  if (itemsCountValue !== undefined) {
    itemCount.value = itemsCountValue;
  }

  restaurantSubscription.value = await is_subscription_valid();
});
</script>
<style></style>
