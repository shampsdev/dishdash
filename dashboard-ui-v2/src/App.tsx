import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { Sidebar } from './components/sidebar';
import { TagsPage } from './pages/tags.page';
import { MapPage } from './pages/map.page';
import { Toaster } from 'react-hot-toast';
import { SettingsPage } from './pages/settings.page';
import DashboardSidebar from './modules/dashboard-sidebar.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddPlacePage } from './pages/add-place.page';
import { DarkModeProvider } from './shared/providers/dark-mode.provider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <BrowserRouter>
          <Routes>
            <Route path={'/'} element={<Sidebar />}>
              <Route path='dashboard' element={<DashboardSidebar />}>
                <Route path=':id' element={<DashboardPage />} />
              </Route>
              <Route path='tags' element={<TagsPage />} />
              <Route path='map' element={<MapPage />} />
              <Route path='add-place' element={<AddPlacePage />} />
              <Route path='settings' element={<SettingsPage />} />
            </Route>
          </Routes>
          <Toaster
            toastOptions={{
              position: 'top-right',
              className: 'bg-background',
              icon: null,
              iconTheme: {
                primary: 'black',
                secondary: 'white',
              },
            }}
          />
        </BrowserRouter>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}

export default App;
