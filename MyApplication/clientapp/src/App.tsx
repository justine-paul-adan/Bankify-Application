import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from './components/header/header';
import TransactionPage from './components/accounts/transaction-page';
import AdminDashboard from './components/admin/admin-dashboard';
import Home from './components/home/home';
import ViewAccounts from './components/admin/account/view-accounts';
import ViewUsers from './components/admin/user/view-users';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Header />

        <Box p={4}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transaction" element={<TransactionPage />} />

            // Account routes
            <Route path="/view-accounts" element={<ViewAccounts />} />

            // User routes
            <Route path="/view-users" element={<ViewUsers />} />

            // Admin routes
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
