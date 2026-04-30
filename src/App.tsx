import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { DecisionProvider } from './context/DecisionContext';
import DecisionDetail from './pages/DecisionDetail';
import Decisions from './pages/Decisions';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <DecisionProvider>
        <Routes>
          <Route element={<AppLayout />} path="/">
            <Route element={<Decisions />} index />
            <Route element={<Decisions />} path="decisions" />
            <Route element={<DecisionDetail />} path="decisions/:decisionId" />
            <Route element={<Navigate replace to="/" />} path="about" />
            <Route element={<NotFound />} path="*" />
          </Route>
        </Routes>
      </DecisionProvider>
    </BrowserRouter>
  );
}
