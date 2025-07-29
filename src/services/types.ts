export enum MyToastType {
	success = "success",
	error = "error",
	loading = "loading",
	custom = "custom",
}

export interface dataFromForm {
	type: MyToastType
	stringData: string
}

export interface Movie {
	adult?: boolean // за замовчуванням true
	backdrop_path?: string
	genre_ids?: number[]
	id: string // за замовчуванням 0
	original_language?: string
	original_title?: string
	overview?: string
	popularity?: number // за замовчуванням 0
	poster_path?: string
	release_date?: string
	title?: string
	video?: boolean // за замовчуванням true
	vote_average?: number // за замовчуванням 0
	vote_count?: number // за замовчуванням 0
}

export interface MovieData {
	page: number
	results: Movie[]
	total_pages: number
	total_results: number
}
