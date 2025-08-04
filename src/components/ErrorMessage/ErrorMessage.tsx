import css from "./ErrorMessage.module.css"
import { useLanguage } from "../LanguageContext/LanguageContext"

export default function ErrorMessage() {
	const { translationTexts } = useLanguage()
	return (
		<div>
			<p className={css.text}>{translationTexts.error_main_text}</p>
		</div>
	)
}
