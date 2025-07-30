import { getMovies, type ApiMovieData, type SearchParams } from "../../services/movieService"
import toastMessage, { MyToastType } from "../../services/ToastMessage"
import styles from "./SearchBar.module.css"

interface SearchBarProps {
	onSubmit: (
		queryParams: SearchParams,
		callBackFunc: (searchParams: SearchParams) => Promise<ApiMovieData>
	) => void | Promise<void>
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
	const handleSubmit = (formData: FormData) => {
		const queryData = formData.get("query") as string

		if (!queryData.trim().length) {
			toastMessage(MyToastType.loading, "Please enter your search query.")
			return
		}

		const qParams: SearchParams = {
			query: queryData.trim(),
			include_adult: true,
			page: 1,
			language: "en-US",
		}
		onSubmit(qParams, getMovies)
	}

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<a className={styles.link} href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
					Powered by TMDB
				</a>
				<form action={handleSubmit} className={styles.form}>
					<input
						className={styles.input}
						type="text"
						name="query"
						autoComplete="off"
						placeholder="Search movies..."
						autoFocus
					/>
					<button className={styles.button} type="submit">
						Search
					</button>
				</form>
			</div>
		</header>
	)
}
