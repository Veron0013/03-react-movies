import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { getMovieById, getTrandingMovies } from "../../services/movieService"
import { Toaster } from "react-hot-toast"
import { MyToastType, type ApiMovieData, type Movie, type SearchParams } from "../../types/movie"

import SearchBar from "../SearchBar/SearchBar"
import toastMessage from "../../services/ToastMessage"
import MovieGrid from "../MovieGrid/MovieGrid"
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessage/ErrorMessage"

import "./App.module.css"
import MovieModal from "../MovieModal/MovieModal"

function App() {
	const [movies, setMovies] = useState<Movie[]>([])
	const [movie, setMovie] = useState<Movie | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)
	const [isModalError, setIsModalError] = useState(false)

	const [isModalOpen, setIsModalOpen] = useState(false)

	const closeModal = () => {
		setIsModalOpen(false)
		setMovie(null)
	}

	const handleSearch = async (
		queryParams: SearchParams,
		callBackFunc: (searchParams: SearchParams) => Promise<ApiMovieData>,
		isTranding: boolean = false
	) => {
		if (!isTranding && !queryParams.query?.length) {
			toastMessage(MyToastType.loading, "Please enter your search query.")
			return
		}
		try {
			setMovies([])
			setMovie(null)
			setIsLoading(true)
			setIsError(false)
			const data = await callBackFunc(queryParams)
			if (!data.results.length) {
				toastMessage(MyToastType.error, "No movies found for your request.")
			}
			setMovies(data.results)
		} catch {
			setIsError(true)
		} finally {
			setIsLoading(false)
		}
	}

	const handleClick = async (movie_id: number) => {
		const qParams: SearchParams = {
			movie_id,
			language: "en-US",
		}
		try {
			setIsLoading(true)
			setIsModalError(false)
			const selectedMovie: Movie = await getMovieById(qParams)
			setMovie(selectedMovie)
			setIsModalOpen(true)
		} catch {
			console.log("first")
			setIsModalOpen(false)
			setIsModalError(true)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			const qParams: SearchParams = {
				language: "en-US",
			}
			await handleSearch(qParams, getTrandingMovies, true)
		}

		fetchData()
	}, [])

	useEffect(() => {
		if (isModalError) {
			const timer = setTimeout(() => setIsModalError(false), 3000)
			return () => clearTimeout(timer)
		}
	}, [isModalError])

	useEffect(() => {
		if (isModalOpen) {
			// Додаємо новий запис у історію
			window.history.pushState({ modal: true }, "")

			const handlePopState = () => {
				// Коли користувач тисне "назад"
				setIsModalOpen(false)
			}

			// Слухаємо назад
			window.addEventListener("popstate", handlePopState)

			// Очищення при закритті модалки
			return () => {
				window.removeEventListener("popstate", handlePopState)

				// Повертаємося назад в історії, щоб не накопичувати зайвого
				if (window.history.state?.modal) {
					window.history.back()
				}
			}
		}
	}, [isModalOpen])

	return (
		<>
			<Toaster />
			<SearchBar onSubmit={handleSearch} />
			{isLoading && createPortal(<Loader />, document.body)}
			{isError && createPortal(<ErrorMessage />, document.body)}
			{isModalError && createPortal(<ErrorMessage />, document.body)}
			{movies.length > 0 && <MovieGrid items={movies} onSelect={handleClick} />}
			{/*<button onClick={openModal}>Open modal</button>*/}
			{isModalOpen && movie && <MovieModal onClose={closeModal} movieData={movie} />}
		</>
	)
}

export default App
