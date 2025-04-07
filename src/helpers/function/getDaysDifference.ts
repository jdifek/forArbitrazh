export const getDaysDifference = (
	start: Date | null,
	end: Date | null
): number => {
	if (!start || !end) return 31 // По умолчанию 31 день
	const diffInMs = Math.abs(end.getTime() - start.getTime())
	return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1
}
