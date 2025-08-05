import { useState } from "react"
import toastMessage, { MyToastType } from "../../services/messageService"
import LangMenu from "../LangMenu/LangMenu"
import { useLanguage } from "../LanguageContext/LanguageContext"
import styles from "./SearchBar.module.css"
import type { LangType } from "../../types/translationKeys"
import { createPortal } from "react-dom"

interface SearchBarProps {
	onSubmit: (query: string) => void
	selectTrend: () => void
}

export default function SearchBar({ selectTrend, onSubmit }: SearchBarProps) {
	const [isMenulOpen, setIsMenulOpen] = useState(false)
	const [modalPos, setModalPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

	const handleSubmit = (formData: FormData) => {
		const queryData = formData.get("query") as string

		if (!queryData.trim().length) {
			toastMessage(MyToastType.loading, translationTexts.toast_no_request)
			return
		}
		onSubmit(queryData.trim())
	}

	const { translationTexts, setLanguage } = useLanguage()

	function handleShowMenu(langValue: LangType): void {
		setIsMenulOpen(false)
		setLanguage(langValue)
	}

	const handleMenu = (e: React.MouseEvent<HTMLElement>): void => {
		const rect = e.currentTarget.getBoundingClientRect()
		setModalPos({
			top: rect.bottom + window.scrollY + 4,
			left: rect.left + window.scrollX - 16,
		})
		setIsMenulOpen(true)
	}

	const handleTranding = () => {
		selectTrend()
	}

	const handleCloseMenu = () => {
		setIsMenulOpen(false)
	}

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<a className={styles.link} href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
					{`${translationTexts.searchBar_poweredBy} TMDB`}
				</a>
				<p className={styles.lang} onClick={handleTranding}>
					{translationTexts.searchBar_Trend}
				</p>
				<p className={styles.lang} onClick={handleMenu}>
					{translationTexts.searchBar_lang}
				</p>
				{isMenulOpen &&
					createPortal(
						<LangMenu onClose={handleCloseMenu} onSelect={handleShowMenu} position={modalPos} />,
						document.body
					)}
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
