import axios, { AxiosError, AxiosResponse, Method } from 'axios'
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
  if (!error.response!.data) {
    error.response!.data = unknownError(error.response!.status || -9_999);
  };

  let problem = error.response!.data as ProblemDetailsRfc7807;

  if (!problem.title || !problem.detail || !problem.status) {
    // spread unknown error into problem
    Object.assign(problem, unknownError(error.response?.status || -9_999));
  }

  toastsBus.emit({
    options: {
      severity: 'error',
      detail: problem.detail,
      summary: problem.title,
      life: 5000,
    }
  });

  return Promise.reject(error);
}

/**
 * Create a reactive fetch using axios and vueuse
 * @param url The url to fetch
 * @param method The http method to use
 * @returns An object containing the reactive fetcher
 */
const useReactiveApiFetcher = <T>(url: string) => {
  const instance = axios.create({
    baseURL: axios.defaults.baseURL + url
  })
  instance.interceptors.response.use(fulfilledInterceptor, rejectedInterceptor)

  const fetchAxios = useAxios<T>(instance)

  return {
    execute: async (url: string, method: Method = 'GET', payload: any = undefined): Promise<{ success: boolean, data: T | undefined }> => {
      try {
        await fetchAxios.execute(url, { method: method, data: payload })
        return {
          success: true,
          data: fetchAxios.data.value as T
        }
      } catch (error) {
        // Try to handle the error gracefully if it is a problem-detail
        const axioserror = error as AxiosError
        if (axioserror.response?.data) {
          fetchAxios.error.value = axioserror.response.data as ProblemDetailsRfc7807
          return {
            success: false,
            data: undefined
          }
        }
        throw error
      }
    },
    data: fetchAxios.data,
    error: fetchAxios.error,
    isFinished: fetchAxios.isFinished,
    isLoading: fetchAxios.isLoading,
  }
}

export default useReactiveApiFetcher