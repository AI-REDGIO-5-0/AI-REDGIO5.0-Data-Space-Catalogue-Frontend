import { getToken } from '#auth';

const {
    public: { apiBaseUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    const data = await $fetch(`${apiBaseUrl}/api/cloud-catalog/organizations`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
    return data;
})
