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

const ProfileExperiencePage = Loadable(lazy(() => import('pages/profile-experience-page')));
const ProfileEducationPage = Loadable(lazy(() => import('pages/profile-education-page')));
const ProfileCertificationPage = Loadable(lazy(() => import('pages/profile-certification-page')));

const ProfilePreferencesPage = Loadable(lazy(() => import('pages/profile-preferences-page')));
const ProfileAvailabilityPage = Loadable(lazy(() => import('pages/profile-availability-page')));
const ProfileAiPage = Loadable(lazy(() => import('pages/profile-ai-page')));

const MissionPage = Loadable(lazy(() => import('pages/mission-page')));
const MissionsPage = Loadable(lazy(() => import('pages/missions-page')));
const MissionTimeTrackingPage = Loadable(lazy(() => import('pages/mission-time-tracking-page')));

const MyProductsPage = Loadable(lazy(() => import('pages/my-products-page')));
const CreateProductPage = Loadable(lazy(() => import('pages/create-product-page')));
const ProductPage = Loadable(lazy(() => import('pages/product-page')));

const OrdersPage = Loadable(lazy(() => import('pages/orders-page')));
const ContractorProductServiceOrderPage = Loadable(lazy(() => import('pages/contractor-product-service-order-page')));
const ContractorMissionServiceOrderPage = Loadable(lazy(() => import('pages/contractor-mission-service-order-page')));
const ContractorSubscriptionServiceOrderPage = Loadable(lazy(() => import('pages/contractor-subscription-service-order-page')));
const SubscriptionOrderTermsPage = Loadable(lazy(() => import('pages/subscription-order-terms-page')));

const MessagingPage = Loadable(lazy(() => import('pages/messaging-page')));

const InvoicesPage = Loadable(lazy(() => import('pages/invoices-page')));
const InvoiceSettingsPage = Loadable(lazy(() => import('pages/invoice-settings-page')));

const SupportPage = Loadable(lazy(() => import('pages/support-page')));

const SubscriptionOfferingPage = Loadable(lazy(() => import('pages/subscription-offering-page')));

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
              path: 'experience',
              element: <ProfileExperiencePage />
            },
            {
              path: 'education',
              element: <ProfileEducationPage />
            },
            {
              path: 'certification',
              element: <ProfileCertificationPage />
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
              element: <ProfileAiPage />,
              children: [
                {
                  path: ':tabGroupId',
                  element: <></>,
                  children: [
                    {
                      path: ':tabGroupItemIndex',
                      element: <></>
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: 'missions/:missionId',
          element: <MissionPage />
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
          path: 'orders/solution-orders/:orderId/talent-service-order',
          element: <ContractorProductServiceOrderPage />
        },
        {
          path: 'orders/mission-orders/:orderId/talent-service-order',
          element: <ContractorMissionServiceOrderPage />
        },
        {
          path: 'orders/subscription-orders/:orderId/talent-service-order',
          element: <ContractorSubscriptionServiceOrderPage />
        },
        {
          path: 'orders/subscription-orders/:orderId/terms',
          element: <SubscriptionOrderTermsPage />
        },
        {
          path: 'orders',
          element: <OrdersPage />
        },
        {
          path: 'messaging',
          element: <MessagingPage />
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
        },
        {
          path: 'subscriptions/plans',
          element: <SubscriptionOfferingPage />
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
