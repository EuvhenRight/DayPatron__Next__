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

const DashboardPage = Loadable(lazy(() => import('pages/dashboard-page')));
const ProfilePersonalPage = Loadable(lazy(() => import('pages/profile-personal-page')));
const ProfileExpertisePage = Loadable(lazy(() => import('pages/profile-expertise-page')));
const ProfilePreferencesPage = Loadable(lazy(() => import('pages/profile-preferences-page')));
const ProfileAvailabilityPage = Loadable(lazy(() => import('pages/profile-availability-page')));
const ProfileAiPage = Loadable(lazy(() => import('pages/profile-ai-page')));

const MissionPage = Loadable(lazy(() => import('pages/mission-page')));
const MissionsPage = Loadable(lazy(() => import('pages/missions-page')));
const MissionChatPage = Loadable(lazy(() => import('pages/mission-chat-page')));
const MissionTimeTrackingPage = Loadable(lazy(() => import('pages/mission-time-tracking-page')));

const MyProductsPage = Loadable(lazy(() => import('pages/my-products-page')));
const CreateProductPage = Loadable(lazy(() => import('pages/create-product-page')));
const ProductPage = Loadable(lazy(() => import('pages/product-page')));

const OrdersPage = Loadable(lazy(() => import('pages/orders-page')));

const InvoicesPage = Loadable(lazy(() => import('pages/invoices-page')));
const InvoiceSettingsPage = Loadable(lazy(() => import('pages/invoice-settings-page')));

const SupportPage = Loadable(lazy(() => import('pages/support-page')));

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
          path: 'dashboard',
          element: <DashboardPage />
        },
        {
          path: 'profile',
          children: [
            {
              path: 'personal',
              element: <ProfilePersonalPage />
            },
            {
              path: 'expertise',
              element: <ProfileExpertisePage />
            },
            {
              path: 'preferences',
              element: <ProfilePreferencesPage />
            },
            {
              path: 'availability',
              element: <ProfileAvailabilityPage />
            },
            {
              path: 'ai',
              element: <ProfileAiPage />
            }
          ]
        },
        {
          path: 'missions/:missionId',
          element: <MissionPage />
        },
        {
          path: 'missions/chat',
          element: <MissionChatPage />
        },
        {
          path: 'missions/time-tracking',
          element: <MissionTimeTrackingPage />
        },
        {
          path: 'missions',
          element: <MissionsPage />
        },
        {
          path: 'solutions/my',
          element: <MyProductsPage />
        },
        {
          path: 'solutions/create',
          element: <CreateProductPage />
        },
        {
          path: 'solutions/:productId',
          element: <ProductPage />
        },
        {
          path: 'orders/my',
          element: <OrdersPage />
        },
        {
          path: 'invoices/settings',
          element: <InvoiceSettingsPage />
        },
        {
          path: 'invoices',
          element: <InvoicesPage />
        },
        {
          path: 'support',
          element: <SupportPage />
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
