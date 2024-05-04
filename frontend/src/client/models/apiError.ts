import { AxiosRequestConfig, AxiosResponse } from "axios"

export class ApiError extends Error {
    public readonly url: string | undefined
    public readonly status: number
    public readonly statusText: string
    public readonly body: unknown
    public readonly request: AxiosRequestConfig

    constructor (request: AxiosRequestConfig, response: AxiosResponse, message: string) {
        super(message)

        this.name = "ApiError"
        this.url = response.config.url
        this.status = response.status
        this.statusText = response?.statusText
        this.body = response.data
        this.request = request
    }
}
