import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/material-icons';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/home';
import { SignIn } from './pages/signin';
import { SignUp } from './pages/signup';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/auth/login' element={<SignIn />} />
      <Route path='/auth/signup' element={<SignUp />} />
    </Routes>
  );
};

export default App;
