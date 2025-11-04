<script setup lang="ts">
const R = useRamda();
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import {licenses, sectors} from '~/constants'
import { useRamda } from '~/constants/ramda';
const { t } = useI18n();
const {data: session} = useAuth()


const sort = ref({
    column: 'date',
    direction: 'desc',
});

const currentBalance = ref(null);

const monthlyIncome = ref(0);
const monthlyOutcome = ref(0);

const isHovered = ref();
const { data: transactionsData } = await useLazyFetch(`/api/datasets/get-all-transactions`, {
    method: 'GET',
    query:{id:session.value?.user?.sub}
});

const transactionsColumns: any = [
    {
        key: 'assetTitle',
        label: 'Title',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/6',
    },
    {
        key: 'date',
        label: 'Date',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/6',
    },
    {
        key: 'sector',
        label: 'Sector',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/6',
    },
    {
        key: 'organization',
        label: 'Organization',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/6',
    },
    {
        key: 'type',
        label: 'Type',
        sortable: true,
        direction: 'desc',
        class: 'text-center w-1/6',
    },
    // {
    //     key: 'price',
    //     label: 'Amount(EUR)',
    //     sortable: true,
    //     direction: 'desc',
    //     class: 'w-1/5',
    // },

];
const page = ref<number>(1);
const pageCount = 10;

const transactionsRows = computed(() => {
    return !R.isNil(transactionsData.value)
        ? transactionsData.value.slice((page.value - 1) * pageCount, page.value * pageCount)
        : [];
});


const findSector = (sector: any) => {
    return sectors.find((item) => item.id === Number.parseInt(sector))?.name
}

</script>

<template>
    <PageContainer>
        <div class="w-full h-full">
            <!-- Transactions -->
            <div class="flex flex-col w-full mt-8">
                <UCard class=" m-4">
                    <template #header>
                        <SubHeading :title="$t('data.wallet.transactions.title')" />
                    </template>
                    <UTable :columns="transactionsColumns" :rows="transactionsRows" :sort="sort">
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
                        <template #type-data="{ row }">
                            <div class="text-center">
                                <span :class="[
                                    'rounded-md px-4 py-1 font-medium',
                                    row.type === 'Incoming'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800',
                                ]">{{ row.type }}
                                </span>
                            </div>
                        </template>
                        <template #organization-data="{ row }">
                            <div class="text-center">
                                <span>{{ row.organization }}</span>
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
                        <template #id-data="{ row }">
                            <div @mouseover="isHovered = row.id" @mouseleave="isHovered = null">
                                <!-- <UTooltip arrow :text="row.id">
                                    {{ truncateId(row.id, 10) }}
                                </UTooltip> -->
                                {{ row.id }}
                            </div>
                        </template>
                    </UTable>
                    <!-- Display the pagination only if the total number of transactions is larger than the page count -->
                    <div v-if="transactionsData && transactionsData?.length > pageCount" class="flex justify-end mt-2">
                        <UPagination v-model="page" :page-count="pageCount" :total="transactionsData?.length"
                            :active-button="{ variant: 'outline' }" />
                    </div>
                </UCard>
            </div>
        </div>
    </PageContainer>
</template>
