import http, { AxiosError } from 'axios';

export type DefaultResponse<T> = {
	data: T;
};

/**
 * Whenever error.message is accessed we want to se the full API error message (JSON) if it's present
 * not just some generic http status code + message
 * see https://github.com/axios/axios/issues/960 for context
 *
 * @param axios
 */
http.interceptors.response.use(undefined, function (error: AxiosError) {
	(error as any).originalMessage = error.message;
	Object.defineProperty(error, 'message', {
		get: function () {
			if (!error.response) {
				return (error as any).originalMessage;
			}
			if (typeof error.response.data.message === 'string') return error.response.data.message;
			return JSON.stringify(error.response.data.message);
		}
	});
	return Promise.reject(error);
});

export default http;
