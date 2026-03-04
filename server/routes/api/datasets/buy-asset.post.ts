import { getToken } from '#auth';

const {
    public: { apiConsumerUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const body = await readBody(event);
    
    const returnValue = $fetch(`http://${token?.url}:3000/api/consumer/retrieve/${body.assetId}`, {
        method: 'POST',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return returnValue
});
