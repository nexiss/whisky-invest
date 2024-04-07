import { createBrowserRouter } from 'react-router-dom';

import { DealsPage } from './pages/DealsPage';
import { HomePage } from './pages/HomePage';
import { PitchesPage } from './pages/PitchesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <div>404 not found</div>,
  },
  {
    path: '/home',
    element: <HomePage />,
    errorElement: <div>404 not found</div>,
  },
  {
    path: '/pitches',
    element: <PitchesPage />,
    errorElement: <div>404 not found</div>,
  },
  {
    path: '/deals',
    element: <DealsPage />,
    errorElement: <div>404 not found</div>,
  },
]);
