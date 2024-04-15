import axios, { AxiosError, type AxiosResponse, type Method } from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import type { ProblemDetailsRfc7807 } from '@/types/ProblemDetailsRfc7807';
import { httpStatusToText } from '@/utils/httpStatusToText';
import toastsBus from '@/utils/toasting';

axios.defaults.baseURL = 'https://localhost:7107'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const unknownError = (status: number): ProblemDetailsRfc7807 => {
  return {
    title: 'Something went wrong',
    detail: httpStatusToText(status),
    status: status,
    errors: {},
    instance: '',
    type: ''
  }
};

/* 
 * Axios: Any status code that lie within the range of 2xx cause this function to trigger
 */
const fulfilledInterceptor = (response: AxiosResponse) => {
  return response;
}

/* 
 * Axios: Any status codes that falls outside the range of 2xx cause this function to trigger
 */
const rejectedInterceptor = (error: AxiosError) => {
  if (!error.response)
    error.response = {} as AxiosResponse;

  if (!error.response.data) {
    error.response.data = unknownError(error.response.status || -9_999);
  }

  const problem = error.response.data as ProblemDetailsRfc7807;

  if (!problem.title || !problem.detail || !problem.status) {
    // spread unknown error into problem
    Object.assign(problem, unknownError(error.response.status || -9_999));
  }

  toastsBus.emit({
    options: {
      severity: 'error',
      summary: problem.title,
      detail: problem.detail,
      life: 5000,
    }
  });

  return Promise.reject(error);
}

type FetchResult<T> = Promise<{ success: boolean, data: T | undefined }>;
type FetchAxiosType<T> = ReturnType<typeof useAxios<T>>

/**
 * Execute a fetch using axios and vueuse
 * @param fetchAxios The reactive fetcher
 * @param url The url to fetch
 * @param method The http method to use, optional, default is GET
 * @param payload The payload to send, optional, default is undefined
 * @returns An object containing the success status and the data if successful
 */
const executeFetch = async <T>(fetchAxios: FetchAxiosType<T>,
  url: string,
  method: Method = 'GET',
  payload: any = undefined)
  : Promise<FetchResult<T>> => {
  try {
    await fetchAxios.execute(url, { method: method, data: payload })
    return {
      success: true,
      data: fetchAxios.data.value as T
    }
  } catch (error) {
    // Try to handle the error gracefully if it is a problem-detail
    fetchAxios.error.value = (error as AxiosError)?.response?.data as ProblemDetailsRfc7807 || undefined
    if (fetchAxios.error.value) {
      return {
        success: false,
        data: undefined
      }
    }
    throw error
  }
}

/**
 * Create a reactive fetch using axios and vueuse
 * @param url The url to fetch
 * @param method The http method to use, optional, default is GET
 * @returns An object containing the reactive fetcher
 */
const useReactiveApiFetcher = <T>(url: string) => {
  const instance = axios.create({
    baseURL: axios.defaults.baseURL + url
  })
  instance.interceptors.response.use(fulfilledInterceptor, rejectedInterceptor)

  const fetchAxios = useAxios<T>(instance)

  return {
    execute: (url: string, method: Method = 'GET', payload: any = undefined) =>
      executeFetch(fetchAxios, url, method, payload),
    data: fetchAxios.data,
    error: fetchAxios.error,
    isFinished: fetchAxios.isFinished,
    isLoading: fetchAxios.isLoading,
  }
}

export default useReactiveApiFetcher