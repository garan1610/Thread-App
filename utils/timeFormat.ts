export const formatTimeAgo = (date: Date) => {
    if (!date) return ''

    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    if (seconds < 60) {
        return `${seconds}s`
    } else if (minutes < 60) {
        return `${minutes}m`
    } else if (hours < 24) {
        return `${hours}h`
    } else if (days < 30) {
        return `${days}d`
    } else if (months < 12) {
        return `${months}mo`
    } else {
        return date.toLocaleDateString()
    }
}