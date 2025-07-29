import { type Movie } from "../../services/types"
import { PIC_URL } from "../../services/vars"
import css from "./MovieGrid.module.css"

interface MovieListProps {
	onSelect: (movieId: string) => void
	items: Movie[]
}

export default function MovieGrid({ items, onSelect }: MovieListProps) {
	const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
		return onSelect(e.currentTarget.id)
	}

	return (
		<div>
			<ul className={css.grid}>
				{items.map((item: Movie) => (
					<li key={item.id} id={item.id} onClick={handleClick}>
						<div className={css.card}>
							<img className={css.image} src={`${PIC_URL}${item.poster_path}`} alt={item.title} loading="lazy" />
							<h2 className={css.title}>{item.title}</h2>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
