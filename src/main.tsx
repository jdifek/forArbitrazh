import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './helpers/context/AuthContext.tsx'
import { DeviceProvider } from './helpers/context/DeviceContext.tsx'
import './index.css'
import { UserProfileProvider } from './helpers/context/UserProfileContext.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<UserProfileProvider>
					<DeviceProvider>
						<App />
					</DeviceProvider>
				</UserProfileProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
)
