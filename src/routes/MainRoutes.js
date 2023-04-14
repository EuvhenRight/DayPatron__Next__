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

const ProfilePage = Loadable(lazy(() => import('pages/profile-page')));
const UserTabPersonal = Loadable(lazy(() => import('sections/profiles/TabPersonal')));
const UserTabPayment = Loadable(lazy(() => import('sections/profiles/TabPayment')));
const UserTabPassword = Loadable(lazy(() => import('sections/profiles/TabPassword')));
const UserTabSettings = Loadable(lazy(() => import('sections/profiles/TabSettings')));

const RatesPage = Loadable(lazy(() => import('pages/rates-page')));
const AvailabilityPage = Loadable(lazy(() => import('pages/availability-page')));
const VacancySearchPage = Loadable(lazy(() => import('pages/vacancy-search-page')));
const VacancyApplicationsPage = Loadable(lazy(() => import('pages/vacancy-applications-page')));

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
          path: 'contractor',
          children: [
            {
              path: 'profile',
              element: <ProfilePage />,
              children: [
                {
                  path: 'personal',
                  element: <UserTabPersonal />
                },
                {
                  path: 'payment',
                  element: <UserTabPayment />
                },
                {
                  path: 'password',
                  element: <UserTabPassword />
                },
                {
                  path: 'settings',
                  element: <UserTabSettings />
                }
              ]
            },
            {
              path: 'rates',
              element: <RatesPage />
            },
            {
              path: 'availability',
              element: <AvailabilityPage />
            }
          ]
        },
        {
          path: 'vacancies',
          children: [
            {
              path: 'search',
              element: <VacancySearchPage />
            },
            {
              path: 'applications',
              element: <VacancyApplicationsPage />
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
