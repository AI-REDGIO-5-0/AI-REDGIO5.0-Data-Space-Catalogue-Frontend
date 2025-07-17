<script setup lang="ts">
import dayjs from 'dayjs';
import {sectors} from '~/constants/sectors';

const props = defineProps({
    datasetsTransformed: {
        type: Array<any>,
        required: true,
    },
});

const transactionsColumns: any = [
    {
        key: 'description',
        label: 'Description',
        class: 'text-center w-1/3',
    },
    {
        key: 'date',
        label: 'Date',
        class: 'text-center w-1/3',
    },
    {
        key: 'manufacturingDomain',
        label: 'Domain',
        class: 'text-center w-1/3',
    }
];

const emit = defineEmits(['selectDataset']);
const keywords = (keywords: any) =>{
    return keywords[0].split(',')
}
const domain = (domain: any) => {
    const sector = sectors.filter((item: any) => {
        if(Number.parseInt(domain) === item.id) return item.name;
    })
    return sector.length > 0 ? sector[0].name : 'Unknown Domain';    
}

</script>

<template>
    <div class="flex flex-wrap justify-start gap-x-4 gap-y-4 ml-2 mr-2 text-gray-700">
        <UCard class="w-full sm:w-[48%] md:w-[48%] lg:w-[48%] h-auto flex flex-col cursor-pointer justify-between"
            v-for="dataset in datasetsTransformed" :key="dataset.id" @click="() => emit('selectDataset', dataset)">
            <template #header>
                <SubHeading :title="dataset.title" :info="dataset.description" :user="dataset.publisher" />
            </template>
            <div class="justify-between flex">
                <Placeholder class=" w-1/3 ">
                    <div v-for="keyword in keywords(dataset.keywords)" :key="keyword" class="inline-block mr-2 bg-gray-100 text-gray-500 p-1 rounded-md">
                        {{ keyword }}

                    </div>
                <!-- {{ dataset.keywords.length > 0
                    ? keywords(dataset.keywords)
                    : 'No keywords available'}} -->
            </Placeholder>

            <Placeholder class=" w-1/3 flex-1">
                {{ dataset.createdAt
                    ? dayjs(dataset.createdAt).format('DD/MM/YYYY')
                    : 'No creation date available'}}
            </Placeholder>

            <Placeholder class=" w-1/3 flex-1">
                {{ domain(dataset.manufacturingDomain) }}
            </Placeholder>
            </div>
        </UCard>
    </div>
</template>
