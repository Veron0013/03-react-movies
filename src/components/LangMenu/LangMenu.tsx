//import { useState, useRef, useEffect } from "react"
import css from "./LangMenu.module.css"

interface LanguageProps {
	onSelect: (langValue: string) => void
}

export default function DropdownMenu({ onSelect }: LanguageProps) {
	//const [isOpen, setIsOpen] = useState(false)
	//const menuRef = useRef<HTMLDivElement>(null)

	//const toggleMenu = () => setIsOpen((prev) => !prev)

	//// Закриття по кліку поза меню
	//useEffect(() => {
	//	const handleClickOutside = (event: MouseEvent) => {
	//		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
	//			setIsOpen(false)
	//		}
	//	}

	//	document.addEventListener("mousedown", handleClickOutside)
	//	return () => document.removeEventListener("mousedown", handleClickOutside)
	//}, [onSelect])

	function handleClick(langValue: string): void {
		onSelect(langValue)
	}

	return (
		<div className={css.menu__wrapper}>
			<ul>
				<li className={css.menu__item} onClick={() => handleClick("uk-UA")}>
					UA
				</li>
				<li className={css.menu__item} onClick={() => handleClick("uk-UA")}>
					EN
				</li>
			</ul>
		</div>
	)
}
