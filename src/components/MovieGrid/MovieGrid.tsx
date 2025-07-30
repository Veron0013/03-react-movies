import { isAdultGenre } from "../../services/ApiMovieService"
import { type Movie } from "../../types/movies"
import { ADULT_ALERT, PIC_URL } from "../../services/vars"
import css from "./MovieGrid.module.css"

interface MovieListProps {
	onSelect: (movieId: number) => void
	items: Movie[]
}

export default function MovieGrid({ items, onSelect }: MovieListProps) {
	const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
		const movie_id: number = Number(e.currentTarget.id)
		return onSelect(movie_id)
	}

	return (
		<div>
			<ul className={css.grid}>
				{items.map((item: Movie) => {
					const showAdultBadge = item.genre_ids ? isAdultGenre(item.genre_ids, item.adult || false) : false

					return (
						<li key={item.id} id={item.id.toString()} onClick={handleClick}>
							<div className={css.card}>
								{showAdultBadge && <img className={css.adult} src={ADULT_ALERT} alt="18+ Alert" loading="lazy" />}
								<img className={css.image} src={`${PIC_URL}${item.poster_path}`} alt={item.title} loading="lazy" />
								<h2 className={css.title}>{item.title}</h2>
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
