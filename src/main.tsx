import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./components/App/App.tsx"
import { LanguageProvider } from "./components/LanguageContext/LanguageContext.tsx"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<LanguageProvider>
			<App />
		</LanguageProvider>
	</StrictMode>
)
