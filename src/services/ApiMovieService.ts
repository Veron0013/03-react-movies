import axios from "axios"
import { type MovieData } from "./types"
import { URL } from "./vars"

interface MoviesHttpResponse {
	data: MovieData
}

export const getMovies = async (query: string, page: number = 1): Promise<MovieData> => {
	const queryParam = {
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
		},
		params: {
			include_adult: false,
			language: "en-US",
			include_image_language: "en,null",
			page,
			query,
		},
	}
	const response = await axios.get<MoviesHttpResponse>(URL, queryParam)
	return response.data
}
