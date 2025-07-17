import { getToken } from '#auth';

const {
    public: { API_BASE_URL },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const query = getQuery(event);

    const result: Record<string, any> = await $fetch(`${API_BASE_URL}/api/provider/${query.id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return result;
});
