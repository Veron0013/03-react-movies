import { useEffect, useState } from "react"
import { getTandingMovies } from "../../services/ApiMovieService"
import { Toaster } from "react-hot-toast"
import { MyToastType, type Movie, type MovieData, type SearchParams } from "../../services/types"

import SearchBar from "../searchBar/SearchBar"
import ToastMessage from "../../services/ToastMessage"
import MovieGrid from "../movieGrid/MovieGrid"
import Loader from "../loader/Loader"
import ErrorMessage from "../errorMessage/ErrorMessage"

import "./App.module.css"
import MovieModal from "../movieModal/MovieModal"

function App() {
	const [movies, setMovies] = useState<Movie[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const openModal = () => setIsModalOpen(true)
	const closeModal = () => setIsModalOpen(false)

	const handleSearch = async (
		queryParams: SearchParams,
		callBackFunc: (searchParams: SearchParams) => Promise<MovieData>,
		isTranding: boolean = false
	) => {
		if (!isTranding && !queryParams.query?.length) {
			ToastMessage(MyToastType.loading, "Please enter your search query.")
			return
		}
		try {
			setMovies([])
			setIsLoading(true)
			setIsError(false)
			const data = await callBackFunc(queryParams)
			if (!data.results.length) {
				ToastMessage(MyToastType.error, "No movies found for your request.")
			}
			setMovies(data.results)
		} catch {
			setIsError(true)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			const qParams: SearchParams = {
				language: "en-US",
			}
			console.log("first")
			await handleSearch(qParams, getTandingMovies, true)
		}

		fetchData()
	}, [])

	const handleClick = (movieId: string) => {
		console.log(movieId)
	}

	return (
		<>
			<Toaster />
			<SearchBar onSubmit={handleSearch} />
			{isLoading && <Loader />}
			{isError && <ErrorMessage />}
			{movies.length > 0 && <MovieGrid items={movies} onSelect={handleClick} />}
			<button onClick={openModal}>Open modal</button>
			{isModalOpen && <MovieModal onClose={closeModal} movieData={movies[4]} />}
		</>
	)
}

export default App
