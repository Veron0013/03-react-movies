import toastMessage, { MyToastType } from "../../services/messageService"
import styles from "./SearchBar.module.css"
import textes from "../../services/translation.json"

interface SearchBarProps {
	onSubmit: (query: string) => void
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
	const handleSubmit = (formData: FormData) => {
		const queryData = formData.get("query") as string

		if (!queryData.trim().length) {
			toastMessage(MyToastType.loading, "Please enter your search query.")
			return
		}
		onSubmit(queryData.trim())
	}

	const translateText = textes["uk-UA"]

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<a className={styles.link} href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
					{`${translateText.searchBar_poweredBy} TMDB`}
				</a>
				<form action={handleSubmit} className={styles.form}>
					<input
						className={styles.input}
						type="text"
						name="query"
						autoComplete="off"
						placeholder={translateText.searchBar_placeholder}
						autoFocus
					/>
					<button className={styles.button} type="submit">
						{translateText.searchBar_Button}
					</button>
				</form>
			</div>
		</header>
	)
}
