import toastMessage, { MyToastType } from "../../services/messageService"
import { useLanguage } from "../LanguageContext/LanguageContext"
import styles from "./SearchBar.module.css"

interface SearchBarProps {
	onSubmit: (query: string) => void
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
	const handleSubmit = (formData: FormData) => {
		const queryData = formData.get("query") as string

		if (!queryData.trim().length) {
			toastMessage(MyToastType.loading, translationTexts.toast_no_request)
			return
		}
		onSubmit(queryData.trim())
	}

	const { translationTexts } = useLanguage()

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<a className={styles.link} href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
					{`${translationTexts.searchBar_poweredBy} TMDB`}
				</a>
				<form action={handleSubmit} className={styles.form}>
					<input
						className={styles.input}
						type="text"
						name="query"
						autoComplete="off"
						placeholder={translationTexts.searchBar_placeholder}
						autoFocus
					/>
					<button className={styles.button} type="submit">
						{translationTexts.searchBar_Button}
					</button>
				</form>
			</div>
		</header>
	)
}
