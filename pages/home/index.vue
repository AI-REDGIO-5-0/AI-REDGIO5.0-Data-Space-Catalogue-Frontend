<script setup lang="ts">
// const R = useRamda();
import dayjs from 'dayjs';
import { values } from 'ramda';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const { data: session} = useAuth();
const incoming = ref([
    {
        date: '',
        id: '',
        amount: '',
        type: 'Incoming',
    },
]);
const outgoing = ref([
    {
        date: '',
        id: '',
        amount: '',
        type: 'Outgoing',
    },
]);

const { data: allDatasets } = useAsyncData<Record<string, any>>(() =>
    $fetch('/api/datasets/get-all'),
);


const datasetsTransformed = computed(() => {
    if (!allDatasets.value?.length) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return allDatasets.value.map((result: Record<string, any>) => ({
        id: result?.id,
        title: result?.title,
        description: result?.description,
        keywords: result?.keywords,
        downloadUrl: result?.downloadUrl,
        publisher: result?.publisher,
        assetId: result?.assetId
    }));
});

const sort = ref({
    column: 'date',
    direction: 'desc',
});

const currentBalance = ref(null);

const monthlyIncome = ref(0);
const monthlyOutcome = ref(0);

const isHovered = ref();

const transactionsData = computed(() => [...outgoing.value, ...incoming.value]);

//cards info data


const transactionsColumns: any = [
    {
        key: 'date',
        label: 'Date',
        sortable: true,
        direction: 'desc',
        class: 'w-1/5',
    },
    // {
    //     key: 'fromTo',
    //     label: 'Buyer / Seller',
    //     sortable: true,
    //     class: 'w-1/4',
    // },
    {
        key: 'type',
        label: 'Type',
        sortable: true,
        class: 'text-center w-1/5',
    },
    {
        key: 'amount',
        label: 'Amount(EUR)',
        sortable: true,
        class: 'text-center w-1/5',
    },
    {
        key: 'id',
        label: 'Transaction ID',
        sortable: true,
        class: 'w-1/5',
    },
];
const page = ref<number>(1);
const pageCount = 10;

const selected = ref<any>(undefined);

const assetOfferingDetails = ref<any>({
    title: '',
    description: '',
    keywords: [],
    downloadUrl: '',
    publisher: '',
    assetId: '',
    accessPolicy:{}
});

const selectedPage = ref(1);

const monetizationDetails = ref<Partial<any>>({
    type: 'one-off',
    // price: 0,
    license: '',
    // contractTerms: '',
    termDate: '',
    startDate: '',
    accessPolicy:{}
});

const submitStatus = ref();

const handleDatasetSelection = (dataset: any) => {

    selected.value = dataset;
    assetOfferingDetails.value.title = selected?.value.title;
    assetOfferingDetails.value.description = selected?.value.description;
    assetOfferingDetails.value.keywords = selected?.value.keywords;
    assetOfferingDetails.value.downloadUrl = selected?.value.downloadUrl;
    assetOfferingDetails.value.publisher = selected?.value.publisher;
    assetOfferingDetails.value.assetId = selected?.value.assetId;
    selectedPage.value = 2;
};

const handlePageSelectionBackwards = (value: number) => {
    selectedPage.value = value;
    // submitError.value = false;
    // submitSuccess.value = false;
};

const changeStep = async (stepNum: number) => {
    selectedPage.value = stepNum;
};

const submitAll = async () => {
    submitStatus.value = 'pending';

    let transactionsBody = {
        version: selected.value.version,
        seller: assetOfferingDetails.value.publisher,
        buyer: session.value?.user?.sub, //TODO Change to actual use id
        assetTitle: assetOfferingDetails.value.title,
        assetId: assetOfferingDetails.value.assetId,
        // price: Number.parseInt(selected.value.price),
        sector: selected.value.manufacturingDomain,
    }

    let body = {
        ...selected.value,
        orgName:session.value?.user?.orgName
    };

    try {
        await $fetch(`/api/datasets/buy-asset`, {
            method: 'post',
            body,
        });
        submitStatus.value = 'success';
        await $fetch('/api/datasets/transactions', {
            method: 'post',
            body: transactionsBody,
        })
        await delay(3);
        submitStatus.value = ''
        selectedPage.value = 1
        router.push({ name: 'home' });

    } catch (error) {
        submitStatus.value = 'error';
    }

    return selected.value = undefined;
};

const searchQuery = ref('');
const sortField = ref<'title' | 'createdAt' | 'publisher'>('createdAt');
const sortDirection = ref<'asc' | 'desc'>('desc');
const sortOptions = [
    { label: 'Title', value: 'title' },
    { label: 'Created At', value: 'createdAt' },
    { label: 'Publisher', value: 'publisher' }
]

const filteredSortedDatasets = computed(() => {
    if (!allDatasets.value?.length) return [];

    let results = allDatasets.value;


    // Filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        results = results.filter((dataset: any) =>
            dataset.title?.toLowerCase().includes(query) ||
            dataset.description?.toLowerCase().includes(query) ||
            dataset.keywords?.join(',').toLowerCase().includes(query)
        );
    }

    // Sort
    results = [...results as any].sort((a, b) => {
        const valA = a[sortField.value];
        const valB = b[sortField.value];

        if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1;
        return 0;
    });

    return results.map((result: any) => ({
        ...result
    }));
});

</script>

<template>
    <PageContainer>
        <div class="w-full h-full">

            <div v-show="selectedPage === 1" class="flex flex-wrap justify-start mt-8 w-full">
                <UCard class="ml-2 mr-2 mb-8 w-full sm:w-[48%] md:w-[32%] lg:w-full">
                    <p class="text-lg  font-bold">Dataset list</p>
                    <div class="text-center flex felx-1">
                        <UIcon name="i-heroicons-information-circle" class="h-7 w-7" aria-hidden="true" />
                        <p class="mt-0.5"> Please select a dataset below to see the details </p>
                    </div>
                </UCard>
                <UCard class="ml-2 mr-2 mb-8 w-full sm:w-[48%] md:w-[32%] lg:w-full">
                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
                        <!-- Nuxt UI Input -->
                        <UInput v-model="searchQuery" placeholder="Search by title, description or keywords..."
                            icon="i-heroicons-magnifying-glass" class="w-full sm:flex-1" />

                        <!-- Nuxt UI Select for sort field -->
                        <USelect v-model="sortField" :options="sortOptions" option-attribute="label" placeholder="Sort by" class="w-full sm:w-40" />

                        <!-- Sort toggle button -->
                        <UButton color="gray" variant="outline"
                            @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'" class="w-full sm:w-auto">
                            <UIcon :name="sortDirection === 'asc' ? 'i-heroicons-arrow-up' : 'i-heroicons-arrow-down'"
                                class="mr-1" />
                            {{ sortDirection === 'asc' ? 'Asc' : 'Desc' }}
                        </UButton>
                    </div>

                    <DatasetList :datasets-transformed="filteredSortedDatasets" @select-dataset="handleDatasetSelection"
                        @change-page="changeStep" />
                </UCard>
            </div>
            <Preview v-if="selectedPage === 2 && selected?.title" :monetization-details="selected"
                :asset-offering-details="assetOfferingDetails" :submit-status="submitStatus"
                @handle-page-selection-backwards="handlePageSelectionBackwards" @submit-all="submitAll" />
        </div>
    </PageContainer>
</template>
