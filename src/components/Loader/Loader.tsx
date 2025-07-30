import css from "./Loader.module.css"
import { Bars } from "react-loader-spinner"

export default function Loader() {
	return (
		<div className={css.wrapper}>
			<Bars height="60" width="60" color="#004182" ariaLabel="movies-loading" />
			<span className={css.text}>Loading movies, please wait...</span>
		</div>
	)
}
