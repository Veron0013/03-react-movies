import { toast } from "react-hot-toast"
import { MyToastType } from "./types"

export default function ToastMessage(toastType: MyToastType, text: string) {
	const toastProps = {
		duration: 3000,
		position: "top-right",
	}

	return toast[toastType](text, toastProps)
}
