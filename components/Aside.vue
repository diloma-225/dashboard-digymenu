<template>
    <aside class="fixed inset-y-0 left-0 z-[9999] xs:w-24 md:w-14 flex-col border-r bg-background sm:flex">
        <nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
            <X class="w-8 h-8 xs:flex md:hidden text-gray-500" @click="closeAside" />

            <TooltipProvider class="absolute z-[9999]">
              <Tooltip>
                <TooltipTrigger>
                  <nuxt-link
                  to="/"
                  class="flex items-center justify-center rounded-lg text-muted-foreground transition-colors text-white md:h-8 md:w-8 xs:h-10 xs:w-10"
                  :class="{ 'bg-primary': linksStore.activeLink === 'home' }"
                  @click.prevent="setActiveLink('home')"
                  >
                      <Home :color="linksStore.activeLink === 'home' ? '#fff' : '#000'" class="md:h-5 md:w-5 xs:h-8 xs:w-8" />
                     
                  </nuxt-link>
                </TooltipTrigger>
                <TooltipContent class="min-w-36 absolute z-[9999] left-5">
                  <span >Tableau de bord</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider class="absolute z-[9999]">
              <Tooltip>
                <TooltipTrigger>
                  <nuxt-link 
                  to="/menus"
                  class="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors md:h-8 md:w-8 xs:h-10 xs:w-10"
                  :class="{ 'bg-primary': linksStore.activeLink === 'menus' }"
                  @click.prevent="setActiveLink('menus')"
                  >
                  <IconsMenuIcon class="md:h-5 md:w-5 xs:h-8 xs:w-8" :color="linksStore.activeLink === 'menus' ? '#fff' : '#000'" />
                  
              </nuxt-link>
                </TooltipTrigger>
                <TooltipContent class="absolute z-[9999] left-5">
                  <span>Menu</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider class="absolute z-[9999]">
              <Tooltip>
                <TooltipTrigger>
                  <nuxt-link
                  to="/restaurant"
                  :class="{ 'bg-primary': linksStore.activeLink === 'restaurant' }"
                  @click.prevent="setActiveLink('restaurant')"
                  class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground md:h-8 md:w-8 xs:h-10 xs:w-10"
                  >
                      <IconsRestaurantIcon :color="linksStore.activeLink === 'restaurant' ? '#fff' : '#000'"  class="md:h-5 md:w-5 xs:h-8 xs:w-8" />
                  </nuxt-link>
                </TooltipTrigger>
                <TooltipContent class="absolute z-[9999] left-5">
                  <span>Mon Restaurant</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider class="absolute z-[9999]">
              <Tooltip>
                <TooltipTrigger>
                    <nuxt-link
                    to="/qrcode"
                    class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 xs:h-10 xs:w-10"
                    :class="{ 'bg-primary': linksStore.activeLink === 'qrcode' }"
                    @click.prevent="setActiveLink('qrcode')"
                    >
                      <IconsQrcodeIcon :color="linksStore.activeLink === 'qrcode' ? '#fff' : '#000'" class="md:h-5 md:w-5 xs:h-8 xs:w-8" />
                  </nuxt-link>
                </TooltipTrigger>
                <TooltipContent class="absolute z-[9999] left-5">
                  <span>Générateur QR CODE</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <!-- <nuxt-link
                to="/tables"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground md:h-8 md:w-8 xs:h-10 xs:w-10"
                title="Tables"
                :class="{ 'bg-primary': linksStore.activeLink === 'tables' }"
                @click.prevent="setActiveLink('tables')"
                >
                    <IconsTableIcon  :color="linksStore.activeLink === 'tables' ? '#fff' : '#000'" class="md:h-5 md:w-5 xs:h-8 xs:w-8" />
                    <span class="sr-only">Tables</span>
            </nuxt-link> -->
      
  
        </nav>
    </aside>
</template>

<script setup lang="ts">
import {
  Home,
  X,
} from 'lucide-vue-next'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import {useLinksStore} from '@/store/LinksStore';
const route = useRoute()

const linksStore = useLinksStore();

const setActiveLink = (linkId: string) => {    
  linksStore.activeLink = linkId;
}
onMounted(() => {
  updateActiveLink();
});

watch(
  () => route.path,
  updateActiveLink
);

function updateActiveLink() {
  switch (route.path) {
    case '/':
      linksStore.activeLink = 'home';
      break;
    case '/menus':
      linksStore.activeLink = 'menus';
      break;
    case '/restaurant':
      linksStore.activeLink = 'restaurant';
      break;
    case '/tables':
      linksStore.activeLink = 'tables';
      break;
    case '/qrcode':
      linksStore.activeLink = 'qrcode';
      break;
    case '/settings':
      linksStore.activeLink = 'settings';
      break;
    default:
      linksStore.activeLink = ''; // Aucun lien actif si aucune correspondance
      break;
  }
}
const emits =defineEmits(['close-aside']);
const closeAside = ()=>{
  emits('close-aside');
}

</script>

<style scoped>

</style>