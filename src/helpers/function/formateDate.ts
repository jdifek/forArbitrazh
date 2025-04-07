export const formatDate = (isoString: string): string => {
	const date = new Date(isoString)
	return date.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}
