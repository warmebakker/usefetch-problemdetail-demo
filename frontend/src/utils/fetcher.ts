import { type UseFetchOptions, useFetch, BeforeFetchContext, useEventBus } from '@vueuse/core'
import type { MaybeRefOrGetter, Ref } from 'vue';
import { toastKey } from '@/utils/event-keys';

export interface ProblemDetailsRfc7807 {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    errors: Record<string, string[]>;
}

const toastsBus = useEventBus(toastKey);

const fetchAndHandleError = (error: Ref<any>,
    excludeErrors: number[],
    executeFetch: () => Promise<any>) => {
    return async () => {
        await executeFetch();
        if (error.value && !excludeErrors.includes(error.value.status)) {
            // Do something with the error
            toastsBus.emit({
                options: {
                    severity: 'error',
                    detail: error.value.detail,
                    summary: error.value.title,
                    life: 5000,
                }
            });
        }
    }
}

const statusToText = (status: number): string => {
    switch (status) {
        case 204: return "No content";
        case 400: return "Bad request, please check your input";
        case 401: return "Unauthorized to access this resource";
        case 403: return "Forbidden to access this resource";
        case 404: return "Resource not found";
        case 405: return "Method not allowed";
        case 500: return "Internal server error";
        default: return "The interwebs might be broken";
    }
}

const unknownError = (status: number): ProblemDetailsRfc7807 => {
    return {
        title: 'Something went wrong',
        detail: statusToText(status),
        status: status,
        errors: {},
        instance: '',
        type: ''
    }
};

/*
 * Custom fetcher error handler to process the expected ProblemResult data format
*/
const fetcherErrorHandler = (ctx: { data: any, response: Response | null, error: any }) => {
    // No data, e.g. 404 Not Found
    if (!ctx.data) {
        ctx.error = unknownError(ctx.response?.status || -9_999);
        return ctx;
    }

    // ProblemResult, e.g. 400 validation error or 500 Server Error
    if (ctx.data.type && ctx.data.title && ctx.data.status)
        ctx.error = ctx.data as ProblemDetailsRfc7807;
    else
        // No ProblemResult, e.g. 404 with whats not found data
        ctx.error = unknownError(ctx.response?.status || -9_999)

    return ctx
}

/*
* Adds additional headers to fetch requests
*/
const addHeaders = (ctx: BeforeFetchContext) => {
    ctx.options.headers = {
        ...ctx.options.headers,
        'X-Requested-With': 'XmlHttpRequest', // Do not redirect on 401's
    }
    return ctx
}

const fetchOptions: UseFetchOptions = {
    immediate: false,
    updateDataOnError: false, // is this a bug? 'Data' DOES gets nulled on error
    beforeFetch: (ctx) => addHeaders(ctx),
    onFetchError: (ctx) => fetcherErrorHandler(ctx),
}

/* 
 * Build a useFetch reactive fetcher for GET requests
 */
export function makeFetcherGetJson<T>(url: MaybeRefOrGetter<string>, excludeErrors: number[] = []) {
    const { data, error, isFinished, isFetching, execute: executeFetch }
        = useFetch(url, fetchOptions)
            .get()
            .json<T>();

    return {
        execute: fetchAndHandleError(error, excludeErrors, executeFetch),
        data, error, isFinished, isFetching
    };
}

/* 
 * Build a useFetch reactive fetcher for POST requests 
 */
export function makeFetchePost<TPayload, TReturn>(url: MaybeRefOrGetter<string> | string,
    payload: MaybeRefOrGetter<TPayload>, excludeErrors: number[] = []) {
    const { data, error, isFinished, isFetching, execute: executeFetch } = useFetch<TReturn | ProblemDetailsRfc7807>(url, fetchOptions)
        .post(payload)
        .json<TReturn | ProblemDetailsRfc7807>();

    return {
        execute: fetchAndHandleError(error, excludeErrors, executeFetch),
        data, error, isFinished, isFetching
    };
}

/* 
 * Build a useFetch reactive fetcher for PUT requests 
 */
export function makeFetchePut<TPayload, TReturn>(url: MaybeRefOrGetter<string> | string,
    payload: MaybeRefOrGetter<TPayload>, excludeErrors: number[] = []) {
    const { data, error, isFinished, isFetching, execute: executeFetch } = useFetch<TReturn | ProblemDetailsRfc7807>(url, fetchOptions)
        .put(payload)
        .json<TReturn | ProblemDetailsRfc7807>();

    return {
        execute: fetchAndHandleError(error, excludeErrors, executeFetch),
        data, error, isFinished, isFetching
    };
}