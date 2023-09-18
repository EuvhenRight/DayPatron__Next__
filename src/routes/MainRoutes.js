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
const MissionOverviewTabContent = Loadable(lazy(() => import('sections/mission/MissionOverviewTabContent')));
const MissionContractorMatchesTabContent = Loadable(lazy(() => import('sections/mission/MissionContractorMatchesTabContent')));

const ProductsPage = Loadable(lazy(() => import('pages/products-page')));
const ProductPage = Loadable(lazy(() => import('pages/product-page')));

const OrdersPage = Loadable(lazy(() => import('pages/orders-page')));
const ProductOrderPage = Loadable(lazy(() => import('pages/product-order-page')));
const MissionOrderPage = Loadable(lazy(() => import('pages/mission-order-page')));

const CreateMissionOrderPage = Loadable(lazy(() => import('pages/create-mission-order-page')));

const InvoicesPage = Loadable(lazy(() => import('pages/invoices-page')));
const InvoiceSettingsPage = Loadable(lazy(() => import('pages/invoice-settings-page')));
const InvoicesBilling = Loadable(lazy(() => import('pages/billing-page')));
const BillingInfoSection = Loadable(lazy(() => import('sections/billing/BillingInfoSection')));

const MissionMatchesPage = Loadable(lazy(() => import('pages/mission-matches-page')));

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
          path: 'personal-information',
          element: <PersonalInformationPage />
        },
        {
          path: 'companies',
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
          path: 'missions/orders/create',
          element: <CreateMissionOrderPage />
        },
        {
          path: 'missions/matches',
          element: <MissionMatchesPage />
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
              path: ':missionId',
              element: <MissionSection />,
              children: [
                {
                  path: 'overview',
                  element: <MissionOverviewTabContent />
                },
                {
                  path: 'matches',
                  element: <MissionContractorMatchesTabContent />,
                  children: [
                    {
                      path: ':contractorId',
                      element: <></>,
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
                }
              ]
            }
          ]
        },
        {
          path: 'solutions/:productId',
          element: <ProductPage />
        },
        {
          path: 'solutions',
          element: <ProductsPage />
        },
        {
          path: 'orders/solution/:productOrderId',
          element: <ProductOrderPage />
        },
        {
          path: 'orders/mission/:missionOrderId',
          element: <MissionOrderPage />
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
          path: 'billing',
          element: <InvoicesBilling />
        },
        {
          path: 'billinginfo/:id',
          element: <BillingInfoSection />
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
