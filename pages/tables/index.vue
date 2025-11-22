<template>
    <main class="flex flex-col items-center min-h-screen">
        <div class="xs:w-full md:w-4/6">
          <Card>
            <CardHeader class="px-7 flex flex-row items-center justify-between">
              <div>
                  <CardTitle class="mb-2">Mes tables</CardTitle>
                  <CardDescription>
                      <TableCreateModal />
                  </CardDescription>
              </div>
            </CardHeader>

            <div class="px-7">
              <Alert class="xs:w-5/6 md:w-3/6 mb-2 bg-red-100 border-none">
                  <AlertTitle>Aucune table disponible</AlertTitle>
                  <AlertDescription>
                      Aucune table n'est encore créée
                  </AlertDescription>
              </Alert>
            </div>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="hidden sm:table-cell">
                      Nom de la table
                    </TableHead>
                    <TableHead class="hidden sm:table-cell">
                      Date de création
                    </TableHead>
                    <TableHead class="hidden sm:table-cell">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow class="hover:bg-gray-100 hover:cursor-pointer" v-for="table in tables" :key="table.id">
                    <TableCell>
                      <div class="font-medium">
                        {{ table.name }}
                      </div>
                    </TableCell>
                    <TableCell class="text-left">
                      {{ table.created_at }}
                    </TableCell>
                    <TableCell class="text-center flex justify-start gap-2">
                      <TableEditModal :table="table" />
                      <TableDeleteModal :table="table" />
                      
                    </TableCell>
                  </TableRow>
                  
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
    </main>
</template>

<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

definePageMeta({
    layout: 'app-layout',
})

interface Table {
    id: number;
    name: string;
    created_at: string;
}

const tables = ref<Table[]>([]);

const getTables = async () => {
    return [{
        id: 1,
        name: 'Table 1',
        created_at: '2021-10-10'
    }, {
        id: 2,
        name: 'Table 2',
        created_at: '2021-10-10'
    }]
}

onMounted(async () => {
    const data =  await getTables();
    tables.value = data;
});
</script>

<style scoped>

</style>