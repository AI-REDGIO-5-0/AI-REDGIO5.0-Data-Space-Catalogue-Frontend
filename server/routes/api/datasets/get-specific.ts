import { getToken } from '#auth';

const {
    public: { apiBaseUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const query = getQuery(event);

    const result: Record<string, any> = await $fetch(`${apiBaseUrl}/api/provider/${query.id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return result;
});
