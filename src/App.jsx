import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home'
import { ChakraProvider } from '@chakra-ui/react'
import AuthProvider from './Guard/AuthProvider'
function App() {
  
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
