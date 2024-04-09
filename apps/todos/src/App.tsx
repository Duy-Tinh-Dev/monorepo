import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/material-icons';
import { Route, Routes } from 'react-router-dom';
import { AuthLayout } from './layouts/auth-layout';
import { DefaultLayout } from './layouts/default-layout';
import { privateRoutes, publicRoutes } from './routes';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        {privateRoutes.map((route) => (
          <Route key={route.key} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route element={<AuthLayout />}>
        {publicRoutes.map((route) => (
          <Route key={route.key} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
};

export default App;
