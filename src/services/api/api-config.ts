import * as env from "../../app/environment-variables"
import { create } from "apisauce";

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string
  header?: object
  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: env.API || "https://jsonplaceholder.typicode.com",
  timeout: 10000,
}

/**
 * GraphQL API endpoint.
 */
export const GRAPHQL_API = create({
  baseURL: 'http://localhost:3000/graphql',
  headers: {'Accept': 'application/json'}
})

