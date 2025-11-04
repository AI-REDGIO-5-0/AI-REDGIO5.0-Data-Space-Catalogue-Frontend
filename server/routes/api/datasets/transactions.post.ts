import { getToken } from '#auth';

const {
    public: { apiBaseUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const body = await readBody(event);
    //TODO we will retrieve the user space url so we can start the process of acquire metadata and download dataset in the local minio
    return $fetch(`${apiBaseUrl}/api/cloud-catalog/transaction`, {
        method: 'POST',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
