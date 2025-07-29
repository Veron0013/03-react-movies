import axios from "axios"
import { type MovieData, type SearchParams } from "./types"
import { URL, TRANDING_URL } from "./vars"

interface QueryParams {
	headers: {
		accept: "application/json"
		Authorization: string
	}
	params: SearchParams
}

export const getMovies = async (searchParams: SearchParams): Promise<MovieData> => {
	return await getApiData(URL, createQueryParams(searchParams))
}

export const getTandingMovies = async (searchParams: SearchParams): Promise<MovieData> => {
	return await getApiData(TRANDING_URL, createQueryParams(searchParams))
}

const createQueryParams = (searchParams: SearchParams): QueryParams => ({
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
	},
	params: { ...searchParams },
})

const getApiData = async (url: string, queryParams: QueryParams) => {
	const response = await axios.get<MovieData>(url, queryParams)
	return response.data
}
