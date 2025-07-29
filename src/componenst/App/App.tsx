import { useState } from "react"
import { getMovies } from "../../services/ApiMovieService"
import { Toaster } from "react-hot-toast"
import { MyToastType, type Movie } from "../../services/types"

import SearchBar from "../searchBar/SearchBar"
import ToastMessage from "../../services/ToastMessage"
import MovieGrid from "../movieGrid/movieGrid"
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

	const handleSearsh = async (query: string) => {
		if (!query.length) {
			ToastMessage(MyToastType.loading, "Please enter your search query.")
			return
		}
		try {
			setMovies([])
			setIsLoading(true)
			setIsError(false)
			const data = await getMovies(query)
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

	return (
		<>
			<Toaster />
			<SearchBar onSubmit={handleSearsh} />
			{isLoading && <Loader />}
			{isError && <ErrorMessage />}
			{movies.length > 0 && <MovieGrid items={movies} />}
			<button onClick={openModal}>Open modal</button>
			{isModalOpen && <MovieModal onClose={closeModal} movieData={movies[4]} />}
		</>
	)
}

export default App
