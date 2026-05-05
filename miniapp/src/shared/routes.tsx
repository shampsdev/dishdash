import { Route, Routes, useLocation } from 'react-router-dom';

import { HomePage } from '@/pages/home.page';
import { ErrorLayout } from '@/shared/layouts/error.layout';
import { LobbyPage } from '@/pages/swipes/lobby.page';
import { SettingsPage } from '@/pages/swipes/settings.page';

import { VersionLayout } from '@/shared/layouts/version.layout';
import { SwipesLayout } from '@/shared/layouts/swipes.layout';
import { MatchCard } from '@/modules/swipes/match/match-card';
import { SwipesPage } from '@/pages/swipes/swipes.page';
import { ServerRouteProvider } from './providers/server-route.provider';
import { useEffect } from 'react';
import { LoadingLayout } from '@/shared/layouts/loading.layout';
import { ResultPage } from '@/pages/swipes/result.page';
import { useTheme } from './hooks/useTheme';
import { MapPage } from '@/pages/map.page';
import { SafeAreaLayout } from './layouts/safe-area.layout';
import { NavigationBar } from '@/modules/navigation-bar/navigation-bar';
import { SavedPage } from '@/pages/saved.page';
import { HistoryPage } from '@/pages/history.page';
import { CollectionsPage } from '@/pages/collections/collections.page';
import { CollectionPage } from '@/pages/collections/collection.page';
import { CardPage } from '@/pages/card.page';
import {
  hapticFeedback,
  swipeBehavior,
  viewport
} from '@telegram-apps/sdk-react';
import { AdminPage } from '@/pages/admin.page';

export const AppRoutes = () => {
  useTheme();

  const location = useLocation();
  useEffect(() => {
    console.info('[location]', location);
  }, [location]);

  const onNavigationClick = () => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
  };

  useEffect(() => {
    if (!swipeBehavior.isSupported() || !swipeBehavior.isMounted()) return;

    swipeBehavior.disableVertical();
    return () => {
      swipeBehavior.enableVertical();
    };
  }, []);

  useEffect(() => {
    if (viewport.requestFullscreen.isAvailable()) {
      viewport.requestFullscreen();
    }
  }, []);

  return (
    <Routes>
      <Route element={<VersionLayout />}>
        <Route element={<SafeAreaLayout />}>
          <Route element={<NavigationBar onClick={onNavigationClick} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/card/:cardId" element={<CardPage />} />
          <Route path="/collections/:id" element={<CollectionPage />} />
          <Route path="/:id" element={<SwipesLayout />}>
            <Route path="" element={<ServerRouteProvider />}>
              <Route path="" element={<LoadingLayout />}>
                <Route path="" element={<ErrorLayout />}>
                  <Route path="match" element={<MatchCard />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="lobby" element={<LobbyPage />} />
                  <Route path="swiping" element={<SwipesPage />} />
                  <Route path="results" element={<ResultPage />} />
                  <Route path="results/:cardId" element={<CardPage />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:id" element={<MapPage />} />
      </Route>
    </Routes>
  );
};
