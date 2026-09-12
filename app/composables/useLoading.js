export const useLoading = () => {
  const loading = useState('loading', () => false)

  const start = () => {
    loading.value = true
  }

  const stop = () => {
    loading.value = false
  }

  return {
    loading,
    start,
    stop
  }
}
