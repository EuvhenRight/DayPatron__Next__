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

const PersonalInformationPage = Loadable(lazy(() => import('pages/personal-information-page')));

const EmployersPage = Loadable(lazy(() => import('pages/employers-page')));
const CreateEmployerSection = Loadable(lazy(() => import('sections/employer/CreateEmployerSection')));
const MyEmployersSection = Loadable(lazy(() => import('sections/employer/MyEmployersSection')));
const EmployerSection = Loadable(lazy(() => import('sections/employer/EmployerSection')));

const MissionsPage = Loadable(lazy(() => import('pages/missions-page')));
const CreateMissionSection = Loadable(lazy(() => import('sections/mission/CreateMissionSection')));
const MyMissionsSection = Loadable(lazy(() => import('sections/mission/MyMissionsSection')));
const MissionSection = Loadable(lazy(() => import('sections/mission/MissionSection')));

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
          path: 'personal-information',
          element: <PersonalInformationPage />
        },
        {
          path: 'employers',
          element: <EmployersPage />,
          children: [
            {
              path: 'create',
              element: <CreateEmployerSection />
            },
            {
              path: 'my',
              element: <MyEmployersSection />
            },
            {
              path: ':id',
              element: <EmployerSection />
            }
          ]
        },
        {
          path: 'missions',
          element: <MissionsPage />,
          children: [
            {
              path: 'create',
              element: <CreateMissionSection />
            },
            {
              path: 'my',
              element: <MyMissionsSection />
            },
            {
              path: ':id',
              element: <MissionSection />
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
