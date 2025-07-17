import { getToken } from '#auth';

const {
    public: { API_BASE_URL },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    const data = await $fetch(`${API_BASE_URL}/api/cloud-catalog`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
    console.log(data)
    return data;
})
