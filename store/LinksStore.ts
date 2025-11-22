
export  const useLinksStore = defineStore('linksStore', ()=>{
    const activeLink = ref('home');

    return{
        activeLink
    }
}, {
    persist: true
})