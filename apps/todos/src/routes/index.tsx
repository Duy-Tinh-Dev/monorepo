import { ROUTES } from '@/constants';
import { HomePage } from '@/pages/home';
import { InboxPage } from '@/pages/inbox';
import { SignIn } from '@/pages/signin';
import { SignUp } from '@/pages/signup';
import { ProjectPage } from '@/pages/projects';
import { DefaultLayout } from '@/layouts/default-layout';

export const publicRoutes = [
  {
    key: 0,
    path: ROUTES.signin,
    element: <SignIn />,
  },
  {
    key: 1,
    path: ROUTES.signup,
    element: <SignUp />,
  },
];

export const privateRoutes = [
  {
    key: 0,
    path: ROUTES.home,
    element: <HomePage />,
  },
   {
    key: 1,
    path: ROUTES.inbox,
    element: <InboxPage />,
    layout: <DefaultLayout />,
  },
  {
    key: 2,
    path: ROUTES.project,
    element: <ProjectPage />,
    layout: <DefaultLayout />,
  },        
];
