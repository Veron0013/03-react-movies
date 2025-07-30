import { createPortal } from "react-dom"
import { useEffect } from "react"
import type { Movie } from "../../types/movie"
import { PIC_URL, FLAG_URL, ADULT_ALERT } from "../../services/vars"
import css from "./MovieModal.module.css"
import { isAdultGenre } from "../../services/movieService"

interface MovieModalProps {
	movie: Movie
	onClose: () => void
}

export default function MovieModal({ onClose, movie }: MovieModalProps) {
	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	//lang flag
	const locale = new Intl.Locale(movie.original_language as string)
	const maximizedLocale = locale.maximize()

	const originaLanguage: string = !maximizedLocale.region ? "US" : maximizedLocale.region.toLocaleUpperCase()

	//18+
	const showAdultBadge: boolean = isAdultGenre(movie.genres?.map((g) => g.id) ?? [], movie.adult ?? false)

	//no image
	const backdropPath: string = movie.backdrop_path ?? movie.poster_path ?? ""

	//show producers
	const showProduction: boolean = movie.production_companies !== undefined && movie.production_companies.length > 0

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

	//console.log(movie, movie.production_companies?.length)

	return createPortal(
		<div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
			<div className={css.modal}>
				<button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
					&times;
				</button>
				{showAdultBadge && <img src={ADULT_ALERT} alt="18+ Alert" className={css.adult} />}
				<img src={`${PIC_URL}${backdropPath}`} alt={movie.title} className={css.image} />
				<div className={css.content}>
					<h2>{movie.title}</h2>
					<p className={css.overview}>{movie.overview}</p>
					<div className={css.content_wrapper}>
						<div className={css.movie}>
							<p>
								<strong>Genres: </strong>
								{!movie.genres?.length ? "Not described" : movie.genres?.map((g) => g.name).join(", ")}
							</p>
							<p>
								<strong>Release Date:</strong> {movie.release_date}
							</p>
							<p>
								<strong>Original language: </strong>
								<img
									alt={movie.original_language}
									title={movie.original_language}
									src={`${FLAG_URL}${originaLanguage}.svg`}
									width="20px"
								/>
							</p>
							<p>
								<strong>Budget: </strong>
								{movie.budget && movie.budget > 0 ? formatDigits(movie.budget) : "No budget reported"}
							</p>
							<p>
								<strong>Revenue: </strong>
								{movie.revenue && movie.revenue > 0 ? formatDigits(movie.revenue) : "No revenue reported"}
							</p>
							<p>
								<strong>Rating:</strong> {movie.vote_average?.toFixed(2)}
							</p>
							<p>
								<strong>Popularity:</strong> {movie.popularity?.toFixed(2)}
							</p>
							<p>
								<strong>Votes:</strong> {movie.vote_count?.toFixed(2)}
							</p>
						</div>
						{showProduction && (
							<div className={css.movie}>
								<strong>Production:</strong>
								<ul className={css.production_companies}>
									{movie.production_companies?.map((el) => (
										<li key={el.id}>
											{el.logo_path && (
												<img className={css.logo_path} src={`${PIC_URL}${el.logo_path}`} alt={el.name} />
											)}
											<p>{el.name}</p>
											<img alt={el.origin_country} src={`${FLAG_URL}${el.origin_country}.svg`} width="20px" />
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>,
		document.body
	)
}
