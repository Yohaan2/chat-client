import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home'
import { ChakraProvider } from '@chakra-ui/react'
function App() {
  
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Home />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
