import { getToken } from '#auth';
const {
    public: { apiBaseUrl },
    catalogName,
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    const query = getQuery(event);

    return await $fetch(`${apiBaseUrl}/api/provider/${query.id}`, {
        method:'DELETE',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

});
