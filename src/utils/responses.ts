export const json = (data: Record<string | number, unknown>, init?: ResponseInit) => {
    return new Response(JSON.stringify(data, null, 2), {
        status: 200,
        ...init,
        headers: {
            ...init?.headers,
            'content-type': 'application/json',
        },
    });
};
