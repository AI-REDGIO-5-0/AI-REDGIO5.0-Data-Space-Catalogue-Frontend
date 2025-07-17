<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: false,
        default: '',
    },
    user: {
        type: String,
        required: false,
        default: '',
    },
});
const {data: session} = useAuth()
console.log(session.value?.user?.sub, props.user);
const owned = computed(() => {
    if (session.value?.user?.sub === props.user) return true;
    return false;
});

</script>

<template>
    <div class="flex flex-row gap-1 p-2 justify-between">
        <span class="flex flex-col gap-0.5 items-start justify-center">
        <h3 class="text-base font-semibold whitespace-nowrap">
            {{ title }}
        </h3>
        <h4 v-if="info" class="text-sm text-gray-400">
            {{ info }}
        </h4>
    </span>
    <span v-if="owned" class="flex flex-col text-xs text-gray-500 justify-center" >
        <h4>
            Owned by you
        </h4>
    </span>
    </div>
    
</template>
