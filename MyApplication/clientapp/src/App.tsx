import { ChakraProvider, Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import Header from './components/header/header';
import TransactionPage from './components/accounts/transaction-page';
import AdminDashboard from './components/admin/admin-dashboard';
import Home from './components/home/home';
import ViewAccounts from './components/admin/account/view-accounts';
import ViewUsers from './components/admin/user/view-users';

function App() {
  const { sessionExpired, user, logout } = useAuth();

  const handleReload = () => {
    window.location.reload();
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};
  return (
    <ChakraProvider>
      <Router>
        <Modal
          isOpen={sessionExpired}
          onClose={handleReload}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(6px)" />
          <ModalContent>
            <ModalHeader>Session expired</ModalHeader>
            <ModalBody>
              <Text>
                You’ve been idle for a while. Reload or logout to continue.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={handleReload} colorScheme="blue">
                Reload
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Header />

        <Box p={4}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transaction" element={<TransactionPage />} />

            {/* Account routes */}
            <Route path="/view-accounts" element={<ViewAccounts />} />

            {/* User routes */}
            <Route path="/view-users" element={<ViewUsers />} />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
