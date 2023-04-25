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
const TabProfilePersonal = Loadable(lazy(() => import('sections/profile/TabProfilePersonal')));
const TabProfileExpertise = Loadable(lazy(() => import('sections/profile/TabProfileExpertise')));

const PreferencePage = Loadable(lazy(() => import('pages/preference-page')));
const TabPreferenceRate = Loadable(lazy(() => import('sections/preference/TabPreferenceRate')));
const TabPreferenceAvailability = Loadable(lazy(() => import('sections/preference/TabPreferenceAvailability')));
const TabPreferenceWorkplace = Loadable(lazy(() => import('sections/preference/TabPreferenceWorkplace')));
const TabPreferenceTravel = Loadable(lazy(() => import('sections/preference/TabPreferenceTravel')));

const MissionPage = Loadable(lazy(() => import('pages/mission-page')));
const TabMissionSearch = Loadable(lazy(() => import('sections/mission/TabMissionSearch')));
const TabMissionPending = Loadable(lazy(() => import('sections/mission/TabMissionPending')));
const TabMissionHistory = Loadable(lazy(() => import('sections/mission/TabMissionHistory')));

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
                  element: <TabProfilePersonal />
                },
                {
                  path: 'expertise',
                  element: <TabProfileExpertise />
                }
              ]
            },
            {
              path: 'preferences',
              element: <PreferencePage />,
              children: [
                {
                  path: 'rate',
                  element: <TabPreferenceRate />
                },
                {
                  path: 'availability',
                  element: <TabPreferenceAvailability />
                },
                {
                  path: 'workplace',
                  element: <TabPreferenceWorkplace/>
                },
                {
                  path: 'travel',
                  element: <TabPreferenceTravel />
                }
              ]
            }
          ]
        },
        {
          path: 'missions',
          element: <MissionPage />,
          children: [
            {
              path: 'search',
              element: <TabMissionSearch />
            },
            {
              path: 'pending',
              element: <TabMissionPending />
            },
            {
              path: 'history',
              element: <TabMissionHistory />
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
