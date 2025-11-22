<template>
  <div id="app-layout">
    <div class="flex min-h-screen w-full flex-col bg-muted/40">
      <Aside v-if="isAsideOpen" @close-aside="switchAside" />
      <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header
          class="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
        >
          <div class="md:hidden">
            <Button @click="switchAside" class="m-4 xs:flex md:hidden">
              <Menu />
            </Button>
          </div>
          <Breadcrumb class="xs:hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as-child>
                  <nuxt-link to="/">Dashboard</nuxt-link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink as-child>
                  <nuxt-link :to="route.path" class="capitalize">{{
                    route.name == "index" ? "Home" : route.name
                  }}</nuxt-link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button class="rounded-full bg-gray-500 p-2">
                <CircleUser class="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="cursor-pointer">
                <nuxt-link to="/profil">Profil</nuxt-link>
              </DropdownMenuItem>
              <DropdownMenuItem class="cursor-pointer" @click.prevent="handleLogout">
                <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="isLoading" />
                Déconnexion
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { CircleUser, Menu } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const isAsideOpen = ref(true);
const switchAside = () => {
  isAsideOpen.value = !isAsideOpen.value;
};

const isLoading = ref(false);

const handleLogout = async () => {
  isLoading.value = true;
  try {
    await logout();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
    router.push("/login");
  }
};

useSeoMeta({
  title: "Dashboard - EpiqHub | Gestion de Menus Digitalisés",
  ogTitle: "Dashboard - EpiqHub | Gestion de Menus Digitalisés",
  ogImage: "/images/epiqHub.png",
});
</script>

<style scoped></style>
