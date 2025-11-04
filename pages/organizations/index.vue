<script setup lang="ts">
const R = useRamda();
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { sectors } from '~/constants'
import { countries } from '~/interfaces/countries';
import { useRamda } from '~/constants/ramda';
const { t } = useI18n();

const allSizes = [{ id: 1, name: 'Micro (1–9 employees)' }, { id: 2, name: 'Small (10–49 employees)' }, { id: 3, name: 'Medium (50–249 employees)' }, { id: 4, name: 'Large (250+ employees)' }]
const allCategories = [
      { id: 1, name: 'Non-Governmental Organization (NGO)' },
      { id: 2, name: 'For-Profit Organization' },
      { id: 3, name: 'Academic Institution / University' },
      { id: 4, name: 'Research Institution' },
      { id: 5, name: 'Government Agency / Public Institution' },
      { id: 6, name: 'Didactic Factory / Training Organization / Living Lab' },
      { id: 7, name: 'Industry Association / Consortium' },
    ];
const sort = ref({
    column: 'date',
    direction: 'desc',
});

const { data: organizationsData } = await useLazyFetch<any[]>(`/api/organizations/get-all`, {
    method: 'GET',
});

const trustLevels = ref<Record<string, number>>({});


const organizationsColumns: any = [
    {
        key: 'name',
        label: 'Name',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/7',
    },
    {
        key: 'date',
        label: 'Date',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/7',
    },
    {
        key: 'sector',
        label: 'Sector',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/7',
    },
    {
        key: 'country',
        label: 'Country',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/7',
    },
    {
        key: 'size',
        label: 'Size',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/7',
    },
    {
        key: 'category',
        label: 'Category',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/7',
    },
    {
        key: 'trust',
        label: 'Trust Level',
        sortable: true,
        direction: 'desc',
        class: 'w-1/7',
    },

];
const page = ref<number>(1);
const pageCount = 10;

const organizationsRows = computed(() => {
    return !R.isNil(organizationsData.value)
        ? organizationsData.value.slice((page.value - 1) * pageCount, page.value * pageCount)
        : [];
});

const findSector = (sector: any) => {
    return sectors.find((item) => item.id === Number.parseInt(sector))?.name
}

const findSize = (size: any) => {
    return allSizes.find((item) => item.id === Number.parseInt(size))?.name
}

const findCategory = (category: any) => {
    return allCategories.find((item) => item.id === Number.parseInt(category))?.name
}

const findCountry = (country: any) => {
    return countries.find((item) => item.id === Number.parseInt(country))?.name
}

const trustOptions = [
    { id: 1, label: 'Very High' },
    { id: 2, label: 'High' },
    { id: 3, label: 'Medium' },
    { id: 4, label: 'Low' },
    { id: 5, label: 'Very Low' },
];


const handleTrustLevelChange = async (orgId: string, value: number) => {
    trustLevels.value[orgId] = value;

    try {
        await $fetch('/api/organizations/trustLevel', {
            method: 'POST',
            body: {
                targetOrgId: orgId,
                level: value,
            },
        });
    } catch (err) {
        console.error('Failed to update trust level:', err);
    }
};

// initialize trustLevels from orgs
watch(organizationsData, (data) => {
    if (data) {
        trustLevels.value = {};
        data.forEach((org) => {
            if (org.trustLevel !== undefined && org.trustLevel !== null) {
                trustLevels.value[org.id] = org.trustLevel;
            }
        });
    }
});
</script>

<template>
    <PageContainer>
        <div class="w-full h-full">
            <!-- organizations -->
            <div class="flex flex-col w-full mt-8">
                <UCard class=" m-4">
                    <template #header>
                        <SubHeading :title="$t('organizations.organizations')" />
                    </template>
                    <UTable :columns="organizationsColumns" :rows="organizationsRows" :sort="sort">
                        <template #date-data="{ row }">
                            <div class="text-center">
                                <span>{{ dayjs(row.date).format('DD/MM/YYYY') }}</span>
                            </div>
                        </template>
                        <template #assetTitle-data="{ row }">
                            <div class="text-center">
                                {{ row.assetTitle }}
                            </div>
                        </template>
                        <template #size-data="{ row }">
                            <div class="text-center">
                                <span>{{ findSize(row.size) }}</span>
                            </div>
                        </template>

                        <!-- <template #price-data="{ row }">
                            <div class="text-center">
                                <span>{{ !R.isNil(row?.price) ? row.price.toFixed(2) : 0 }}</span>
                            </div>
                        </template> -->
                        <template #sector-data="{ row }">
                            <div class="text-center">
                                <span>{{ findSector(row.sector) }}</span>
                            </div>
                        </template>
                        <template #category-data="{ row }">
                            <div class="text-center">
                                <span>{{ findCategory(row.category) }}</span>
                            </div>
                        </template>
                        <template #country-data="{ row }">
                            <div class="text-center">
                                <span>{{ findCountry(row.country) }}</span>
                            </div>
                        </template>
                        <template #trust-data="{ row }">
                            <div class="text-center">
                                <span>
                                    <USelect :model-value="trustLevels[row.id]" :options="trustOptions"
                                        option-attribute="label" value-attribute="id" placeholder="Trust Level"
                                        class="w-full sm:w-40"
                                        @update:modelValue="value => handleTrustLevelChange(row.id, value)" />
                                </span>
                            </div>
                        </template>
                        <!-- <template #id-data="{ row }">
                            <div @mouseover="isHovered = row.id" @mouseleave="isHovered = null">
                                 <UTooltip arrow :text="row.id">
                                    {{ truncateId(row.id, 10) }}
                                </UTooltip> 
                                {{ row.id }}
                            </div>
                        </template> -->
                    </UTable>
                    <!-- Display the pagination only if the total number of organizations is larger than the page count -->
                    <div v-if="organizationsData && organizationsData?.length > pageCount"
                        class="flex justify-end mt-2">
                        <UPagination v-model="page" :page-count="pageCount" :total="organizationsData?.length"
                            :active-button="{ variant: 'outline' }" />
                    </div>
                </UCard>
            </div>
        </div>
    </PageContainer>
</template>
