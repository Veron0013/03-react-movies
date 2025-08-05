import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { getMovieById, getMovies, getTrandingMovies, type SearchParams } from "../../services/movieService"
import MovieGrid from "../MovieGrid/MovieGrid"
import { Toaster } from "react-hot-toast"
import { type Movie } from "../../types/movie"

import SearchBar from "../SearchBar/SearchBar"
import toastMessage, { MyToastType } from "../../services/messageService"
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessage/ErrorMessage"

import css from "./App.module.css"
import MovieModal from "../MovieModal/MovieModal"
import { useLanguage } from "../LanguageContext/LanguageContext"
import { useLocalStorage } from "@uidotdev/usehooks"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import ReactPaginate from "react-paginate"

function App() {
	const [movie_id, setMovieId] = useState(0)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isTranding, setIsTranding] = useState(false)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [storageQuery, setStorageQuery] = useLocalStorage("storageQuery", "")
	const { language, translationTexts } = useLanguage()

	const closeModal = () => {
		setIsModalOpen(false)
	}

	const { data, isLoading, isError, isSuccess } = useQuery({
		queryKey: ["searchQuery", currentPage, storageQuery, language],
		queryFn: async () => fetchQueryData(storageQuery),
		placeholderData: keepPreviousData,
		enabled: storageQuery !== "",
	})

	const {
		data: movieDetails,
		isLoading: isLoadingMovieID,
		isError: isModalError,
	} = useQuery({
		queryKey: ["searchById", movie_id, language],
		queryFn: async () => fetchMovieIdData(),
		enabled: movie_id > 0,
	})

	const {
		data: trendingMovies,
		isLoading: isTrendingLoading,
		isError: isTrendingError,
		isSuccess: isTrandingSuccess,
	} = useQuery({
		queryKey: ["trending", currentPage, storageQuery, isTranding, language],
		queryFn: async () => fetchTrandingMovies(),
		placeholderData: keepPreviousData,
		enabled: !storageQuery,
	})

	const createQueryParams = (query: string = storageQuery, page: number = currentPage): SearchParams => {
		const qParams: SearchParams = {
			query,
			include_adult: true,
			page,
			language,
		}
		return qParams
	}

	const fetchQueryData = async (query: string) => {
		const qParams: SearchParams = createQueryParams(query)
		const res = await getMovies(qParams)
		if (!res.results.length) {
			toastMessage(MyToastType.error, translationTexts.toast_bad_request)
		}
		return res
	}

	const fetchMovieIdData = async () => {
		const qParams: SearchParams = {
			movie_id,
			language,
		}
		return await getMovieById(qParams)
	}

	const fetchTrandingMovies = async () => {
		const qParams: SearchParams = {
			page: currentPage,
			language,
		}
		return await getTrandingMovies(qParams)
	}

	const handleSearch = async (query: string) => {
		setCurrentPage(1)
		setStorageQuery(query)
	}

	const handleClick = async (movie_id: number) => {
		setIsModalOpen(true)
		setMovieId(movie_id)
	}

	const handleSelectTrend = (): void => {
		setIsTranding(true)
		setStorageQuery("")
		setCurrentPage(1)
	}

	useEffect(() => {
		/// Mobile Back закриває модалку а не виходить із боаузера
		if (isModalOpen) {
			// Додаємо новий запис у історію
			window.history.pushState({ modal: true }, "")

			const handlePopState = () => {
				// Коли користувач тисне "назад"
				setIsModalOpen(false)
				setMovieId(0)
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

	//console.log(movies)
	const total_pages: number =
		(storageQuery && !isTranding && data?.total_pages) || (!storageQuery && trendingMovies?.total_pages) || 0

	const movieaData: Movie[] = (storageQuery && data?.results) || (!storageQuery && trendingMovies?.results) || []

	const varIsSucess = isSuccess || isTrandingSuccess
	const varIsLoading = isLoading || isLoadingMovieID || isTrendingLoading
	const varIsError = isError || isModalError || isTrendingError

	return (
		<>
			<Toaster />
			<SearchBar selectTrend={handleSelectTrend} onSubmit={handleSearch} />
			{total_pages > 1 && varIsSucess && (
				<ReactPaginate
					breakLabel="..."
					nextLabel=">"
					previousLabel="<"
					onPageChange={({ selected }) => {
						setCurrentPage(selected + 1)
					}}
					pageRangeDisplayed={3}
					marginPagesDisplayed={2}
					pageCount={total_pages}
					forcePage={currentPage - 1}
					containerClassName={css.pagination}
					activeClassName={css.active}
				/>
			)}
			{varIsLoading && createPortal(<Loader />, document.body)}
			{varIsError && createPortal(<ErrorMessage />, document.body)}
			{movieaData && movieaData.length > 0 && <MovieGrid movies={movieaData} onSelect={handleClick} />}
			{isModalOpen && movieDetails && <MovieModal onClose={closeModal} movie={movieDetails} />}
		</>
	)
}

export default App
