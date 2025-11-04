<script setup lang="ts">
import { Preview } from '#components';
import dayjs from 'dayjs';
import {licenses} from '~/constants'

const props = defineProps({
    assetOfferingDetails: {
        type: Object as PropType<Record<string, any>>,
        required: true,
    },
    monetizationDetails: {
        type: Object as PropType<Record<string, any>>,
        required: true,
    },
    submitStatus: {
        type: String,
        required: true,
    },
});
const keywords = (keywords: any) =>{
    return keywords[0].split(',')
}

const getLicenseName = (licenseId: any) => {
    // Find the license object by id
    const license = licenses.find(item => item.id === Number.parseInt(licenseId));
    return license?.name;
}

const emit = defineEmits(['handlePageSelectionBackwards', 'submitAll']);
</script>

<template>
    <div class="h-full text-gray-700 space-y-8 m-5">
        <UCard>
            <template #header>
                <SubHeading
                    title="Dataset Description - Preview"
                    info='The details about the dataset'
                />
            </template>
            <div class="flex flex-col gap-8">
                <div class="flex gap-2 flex-col">
                    <span class="text-sm font-semibold text-gray-400">{{ $t('title') }}</span>
                    <span>{{ monetizationDetails?.title }}</span>
                </div>
                <div class="flex gap-2 flex-col">
                    <span class="text-sm font-semibold text-gray-400">{{ $t('description') }}</span>
                    <span>{{ monetizationDetails?.description }}</span>
                </div>
                
                <div class="flex gap-2 flex-col">
                    <span class="text-sm font-semibold text-gray-400">{{ $t('keywords') }}</span>
                    <div class="flex items-center gap-2">
                        <div
                            v-for="keyword in keywords(monetizationDetails.keywords)"
                            :key="keyword"
                            class="bg-gray-100 text-gray-500 p-1 rounded-md"
                        >
                            {{ keyword }}
                        </div>
                    </div>
                </div>
            </div>
        </UCard>

        <UCard>
            <template #header>
                <SubHeading
                    title="License and Contract - Preview"
                    info='The license that specifies how you should use this dataset and for which period it is available through the Data Space Catalogue'
                />
            </template>
            <div class="flex flex-col gap-8">
                <div class="flex items-start gap-8">
                    <!-- <div class="flex gap-2 flex-col">
                        <span class="text-sm font-semibold text-gray-400">{{
                            $t('data.designer.monetizationMethod')
                        }}</span>
                        <span>{{ $t('data.designer.oneOffSale') }}</span>
                    </div> -->
                    <!-- <div class="flex gap-2 flex-col">
                        <span class="text-sm font-semibold text-gray-400">{{ $t('data.designer.oneOffPrice') }}</span>
                        <span>{{
                            monetizationDetails.price + ' EUR'
                        }}</span>
                    </div> -->
                    <div class="flex gap-2 flex-col">
                        <span class="text-sm font-semibold text-gray-400">{{ $t('license') }}</span>
                        <span>{{ getLicenseName(monetizationDetails.license) }}</span>
                    </div>
                    <div class="flex gap-2 flex-col">
                        <span class="text-sm font-semibold text-gray-400">{{ $t('policy') }}</span>
                        <span>{{ monetizationDetails.accessPolicy.policyData.title }}</span>
                    </div>
                    <div class="flex gap-2 flex-col">
                        <span class="text-sm font-semibold text-gray-400">{{ $t('startDate') }}</span>
                        <span>{{ dayjs(monetizationDetails.contractTerms.startDate).format('DD MMMM YYYY') }}</span>
                    </div>
                    <div class="flex gap-2 flex-col">
                        <span class="text-sm font-semibold text-gray-400">{{ $t('termDate') }}</span>
                        <span>{{ dayjs(monetizationDetails.contractTerms.termDate).format('DD MMMM YYYY') }}</span>
                    </div>
                    
                </div>
            </div>   
            
            <div class="w-full flex justify-between items-center mt-8">
                <UButton size="md" color="gray" variant="outline" @click="emit('handlePageSelectionBackwards', 1)">
                    {{ $t('back') }}
                </UButton>
                <div class="flex items-center gap-4 w-full justify-end">
                    <UAlert
                        v-show="submitStatus === 'error'"
                        icon="mingcute:alert-line"
                        color="red"
                        variant="subtle"
                        :description="$t('data.designer.errorInSubmitAsset')"
                        class="w-full max-w-xl"
                    />
                    <UAlert
                        v-show="submitStatus === 'success'"
                        icon="mingcute:alert-line"
                        color="green"
                        variant="subtle"
                        :description="$t('data.designer.assetSubmitted')"
                        class="w-full max-w-xl"
                    />
                    <UButton
                        :disabled="submitStatus === 'pending' || submitStatus === 'success'"
                        class="px-4 py-2 w-32 block"
                        @click="emit('submitAll')"
                    >
                        <UIcon v-if="submitStatus === 'pending'" name="svg-spinners:270-ring-with-bg" />
                        <span v-else> {{ $t('submit') }}</span>
                    </UButton>
                </div>
            </div>
        </UCard>
    </div>
</template>
