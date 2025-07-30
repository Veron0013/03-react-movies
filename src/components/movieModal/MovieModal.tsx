import { createPortal } from "react-dom"
import { useEffect } from "react"
import type { Movie } from "../../types/movies"
import { PIC_URL, FLAG_URL, ADULT_ALERT } from "../../services/Vars"
import css from "./MovieModal.module.css"
import { isAdultGenre } from "../../services/ApiMovieService"

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

	//lang flag
	const locale = new Intl.Locale(movieData.original_language as string)
	const maximizedLocale = locale.maximize()

	const originaLanguage: string = !maximizedLocale.region ? "US" : maximizedLocale.region.toLocaleUpperCase()

	//18+
	const showAdultBadge: boolean = isAdultGenre(movieData.genres?.map((g) => g.id) ?? [], movieData.adult ?? false)

	//no image
	const backdropPath: string = movieData.backdrop_path ?? movieData.poster_path ?? ""

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

	const formatDigits = (num: number): string => {
		const formatted = new Intl.NumberFormat("fr-FR", {
			style: "decimal",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(num)

		return `${formatted} USD`
	}

	console.log(movieData, showAdultBadge)

	return createPortal(
		<div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
			<div className={css.modal}>
				<button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
					&times;
				</button>
				{showAdultBadge && <img src={ADULT_ALERT} alt="18+ Alert" className={css.adult} />}
				<img src={`${PIC_URL}${backdropPath}`} alt={movieData.title} className={css.image} />
				<div className={css.content}>
					<h2>{movieData.title}</h2>
					<p className={css.overview}>{movieData.overview}</p>
					<div className={css.content_wrapper}>
						<div className={css.movieData}>
							<p>
								<strong>Genres: </strong>
								{!movieData.genres?.length ? "Not described" : movieData.genres?.map((g) => g.name).join(", ")}
							</p>
							<p>
								<strong>Release Date:</strong> {movieData.release_date}
							</p>
							<p>
								<strong>Original language: </strong>
								<img
									alt={movieData.original_language}
									title={movieData.original_language}
									src={`${FLAG_URL}${originaLanguage}.svg`}
									width="20px"
								/>
							</p>
							<p>
								<strong>Budget: </strong>
								{movieData.budget && movieData.budget > 0 ? formatDigits(movieData.budget) : "No budget reported"}
							</p>
							<p>
								<strong>Revenue: </strong>
								{movieData.revenue && movieData.revenue > 0 ? formatDigits(movieData.revenue) : "No revenue reported"}
							</p>
							<p>
								<strong>Rating:</strong> {movieData.vote_average?.toFixed(2)}
							</p>
							<p>
								<strong>Popularity:</strong> {movieData.popularity?.toFixed(2)}
							</p>
							<p>
								<strong>Votes:</strong> {movieData.vote_count?.toFixed(2)}
							</p>
						</div>
						<div className={css.movieData}>
							<strong>Production:</strong>
							{movieData.production_companies?.length && (
								<ul className={css.production_companies}>
									{movieData.production_companies.map((el) => (
										<li key={el.id}>
											{el.logo_path && (
												<img className={css.logo_path} src={`${PIC_URL}${el.logo_path}`} alt={el.name} />
											)}
											<p>{el.name}</p>
											<img alt={el.origin_country} src={`${FLAG_URL}${el.origin_country}.svg`} width="20px" />
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>,
		document.body
	)
}
