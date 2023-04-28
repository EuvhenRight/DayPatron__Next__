import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

const ProfilePersonalPage = Loadable(lazy(() => import('pages/profile-personal-page')));
const ProfileExpertisePage = Loadable(lazy(() => import('pages/profile-expertise-page')));

const PreferenceRatePage = Loadable(lazy(() => import('pages/preference-rate-page')));
const PreferenceAvailabilityPage = Loadable(lazy(() => import('pages/preference-availability-page')));
const PreferenceWorkplacePage = Loadable(lazy(() => import('pages/preference-workplace-page')));
const PreferenceTravelPage = Loadable(lazy(() => import('pages/preference-travel-page')));

const MissionSearchPage = Loadable(lazy(() => import('pages/mission-search-page')));
const MissionPendingPage = Loadable(lazy(() => import('pages/mission-pending-page')));
const MissionHistoryPage = Loadable(lazy(() => import('pages/mission-history-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'employer',
          children: [
            {
              path: 'details',
              element: <EmployerDetailsPage />
            },
            {
              path: 'users',
              element: <EmployerUsersPage />
            }
          ]
        },
        {
          path: 'mission',
          children: [
            {
              path: 'create',
              element: <MissionCreatePage />
            },
            {
              path: 'pending',
              element: <MissionPendingPage />
            },
            {
              path: 'filled',
              element: <MissionPendingPage />
            },
            {
              path: 'closed',
              element: <MissionClosedPage />
            }
          ]
        }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;
