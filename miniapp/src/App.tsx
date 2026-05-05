import { AuthProvider } from './shared/providers/auth.provider';
import { API_URL } from './shared/constants';
import { SocketProvider } from './shared/providers/socket.provider';
import { AppRoutes } from './shared/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  console.info(API_URL);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
