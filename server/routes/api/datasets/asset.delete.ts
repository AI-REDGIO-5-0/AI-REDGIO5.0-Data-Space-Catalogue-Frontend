import { getToken } from '#auth';
const {
    public: { API_BASE_URL },
    catalogName,
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    const query = getQuery(event);

    return await $fetch(`${API_BASE_URL}/api/provider/${query.id}`, {
        method:'DELETE',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

});
