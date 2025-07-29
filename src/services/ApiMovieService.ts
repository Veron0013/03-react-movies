import axios from "axios"
import { type ApiMovieData, type Movie, type SearchParams } from "./types"
import { URL, TRANDING_URL, DETAILS_URL } from "./vars"

interface QueryParams {
	headers: {
		accept: "application/json"
		Authorization: string
	}
	params: SearchParams
}

export const getMovies = async (searchParams: SearchParams): Promise<ApiMovieData> => {
	return await getApiData(URL, createQueryParams(searchParams))
}

export const getTandingMovies = async (searchParams: SearchParams): Promise<ApiMovieData> => {
	return await getApiData(TRANDING_URL, createQueryParams(searchParams))
}

export const getMovieById = async (searchParams: SearchParams): Promise<Movie> => {
	return await getApiData(`${DETAILS_URL}${searchParams.movie_id}`, createQueryParams(searchParams))
}

const createQueryParams = (searchParams: SearchParams): QueryParams => ({
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
	},
	params: { ...searchParams },
})

const getApiData = async <T>(url: string, queryParams: QueryParams): Promise<T> => {
	const response = await axios.get<T>(url, queryParams)
	return response.data
}
