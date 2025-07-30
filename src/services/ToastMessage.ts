import { toast, type ToastPosition } from "react-hot-toast"
import { MyToastType } from "../types/movie"

interface ToastProps {
	duration: number
	position: ToastPosition
}

export default function toastMessage(toastType: MyToastType, text: string) {
	const toastProps: ToastProps = {
		duration: 3000,
		position: "top-right",
	}

	return toast[toastType](text, toastProps)
}
