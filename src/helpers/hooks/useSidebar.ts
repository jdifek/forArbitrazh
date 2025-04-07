import { useState } from 'react'

const useSidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

	return { isSidebarOpen, setIsSidebarOpen }
}

export default useSidebar
