const usePagination = (totalPages: number, currentPage: number) => {
	const getPaginationRange = () => {
		const maxVisiblePages = 5
		const pages: (number | string)[] = []

		if (totalPages <= maxVisiblePages + 1) {
			// Если страниц 6 или меньше, показываем все
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			// Показывает 5 страниц вокруг текущей + многоточие + последнюю
			const halfRange = Math.floor(maxVisiblePages / 2)
			let startPage = Math.max(1, currentPage - halfRange)
			let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)

			// Корректирует, если слишком близко к началу или концу
			if (endPage - startPage + 1 < maxVisiblePages) {
				if (currentPage <= halfRange + 1) {
					endPage = maxVisiblePages
				} else {
					startPage = totalPages - maxVisiblePages
					endPage = totalPages - 1
				}
			}

			// Добавляет страницы
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i)
			}

			// Добавляет многоточие и последнюю страницу, если нужно
			if (endPage < totalPages - 1) {
				pages.push('...')
			}
			if (endPage < totalPages) {
				pages.push(totalPages)
			}

			// Добавляет первую страницу и многоточие в начало, если нужно
			if (startPage > 1) {
				pages.unshift('...')
				pages.unshift(1)
			}
		}

		return pages
	}

	return getPaginationRange()
}

export default usePagination
