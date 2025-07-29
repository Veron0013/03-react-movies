import { createPortal } from "react-dom"
import { useEffect } from "react"
import type { Movie } from "../../services/types"
import { PIC_URL, FLAG_URL } from "../../services/vars"
import css from "./MovieModal.module.css"

interface ModalProps {
	movieData: Movie
	onClose: () => void
}

export default function MovieModal({ onClose, movieData }: ModalProps) {
	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	const locale = new Intl.Locale(movieData.original_language as string)
	const maximizedLocale = locale.maximize()

	const original_language = !maximizedLocale.region ? "US" : maximizedLocale.region.toLocaleUpperCase()

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose()
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		document.body.style.overflow = "hidden"

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
			document.body.style.overflow = ""
		}
	}, [onClose])

	return createPortal(
		<div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
			<div className={css.modal}>
				<button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
					&times;
				</button>
				<img src={`${PIC_URL}${movieData.backdrop_path}`} alt={movieData.title} className={css.image} />
				<div className={css.content}>
					<h2>{movieData.title}</h2>
					<p>{movieData.overview}</p>
					<p>
						<strong>Release Date:</strong> {movieData.release_date}
					</p>
					<p>
						<strong>Rating:</strong> {movieData.popularity?.toFixed(2)}
					</p>
					<p>
						<strong>Original language: </strong>
						<img
							alt={movieData.original_language}
							title={movieData.original_language}
							src={`${FLAG_URL}${original_language}.svg`}
							width="20px"
						/>
					</p>
				</div>
			</div>
		</div>,
		document.body
	)
}
