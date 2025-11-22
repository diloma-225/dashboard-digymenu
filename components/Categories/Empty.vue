<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-vue-next'
</script>

<template>
  <Alert>
    <Icon name="uil:folder-plus" size="24" style="color: #4caf50" />
    <AlertTitle>Aucune catégorie disponible</AlertTitle>
    <AlertDescription>
        Ce menu ne contient pas encore de catégories. Cliquez sur le bouton "Ajouter" pour en créer une nouvelle.
    </AlertDescription>
  </Alert>
</template>