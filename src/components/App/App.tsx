import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useLocalStorage } from "@uidotdev/usehooks"
import {
	getMovieById,
	getMovies,
	getTrandingMovies,
	type ApiMovieData,
	type SearchParams,
} from "../../services/movieService"
import { Toaster } from "react-hot-toast"
import { type Movie } from "../../types/movie"

import SearchBar from "../SearchBar/SearchBar"
import toastMessage, { MyToastType } from "../../services/messageService"
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
	const [isShowMore, setShowMore] = useState(false)
	const [isPagination, setPaginaion] = useState(false)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [storageQuery, setStorageQuery] = useLocalStorage("storageQuery", "")

	const closeModal = () => {
		setIsModalOpen(false)
		setMovie(null)
	}

	const createQueryParams = (query: string, page: number = currentPage): SearchParams => {
		const qParams: SearchParams = {
			query,
			include_adult: true,
			page,
			language: "en-US",
		}
		return qParams
	}

	const handleSearch = async (query: string) => {
		setMovies([])
		setPaginaion(false)
		setStorageQuery(query)
		const qParams: SearchParams = createQueryParams(query)
		await renderMovies(qParams, getMovies)
	}

	const handleShowMore = async () => {
		setPaginaion(true)
		setShowMore(false)
		const nextPage: number = currentPage + 1
		setCurrentPage(nextPage)
		await renderMovies(createQueryParams(storageQuery, nextPage), getMovies)
	}

	//рендер списку
	const renderMovies = async (
		queryParams: SearchParams,
		callBackFunc: (searchParams: SearchParams) => Promise<ApiMovieData>,
		trendingData: boolean = false
	) => {
		try {
			setMovie(null)
			setIsLoading(true)
			setIsError(false)
			const data = await callBackFunc(queryParams)
			if (!data.results.length) {
				toastMessage(MyToastType.error, "No movies found for your request.")
			}
			if (isPagination) {
				setMovies((prev) => [...prev, ...data.results])
			} else {
				setMovies(data.results)
			}
			setShowMore((!trendingData && currentPage < data.total_pages) || false)
			//console.log(data, trendingData)
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

	///завантаження трендів при старті
	useEffect(() => {
		const fetchData = async () => {
			const qParams: SearchParams = {
				language: "en-US",
			}
			await renderMovies(qParams, getTrandingMovies, true)
		}

		fetchData()
	}, [])

	///modal error
	useEffect(() => {
		if (isModalError) {
			const timer = setTimeout(() => setIsModalError(false), 3000)
			return () => clearTimeout(timer)
		}
	}, [isModalError])

	useEffect(() => {
		/// Mobile Back закриває модалку а не виходить із боаузера
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
			{movies.length > 0 && <MovieGrid movies={movies} onSelect={handleClick} />}
			{isShowMore && <button onClick={handleShowMore}>Show more</button>}
			{isModalOpen && movie && <MovieModal onClose={closeModal} movie={movie} />}
		</>
	)
}

export default App
