import { ChakraProvider, Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/authContext';
import Header from './components/header/header';
import TransactionPage from './components/accounts/transaction-page';
import AdminDashboard from './components/admin/admin-dashboard';
import Home from './components/home/home';
import ViewAccounts from './components/admin/account/view-accounts';
import ViewUsers from './components/admin/user/view-users';

function App() {
  const { sessionExpired } = useAuth();

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <ChakraProvider>
      <Modal isOpen={sessionExpired} onClose={() => {}} closeOnEsc={false} closeOnOverlayClick={false} isCentered>
        <ModalOverlay backdropFilter="blur(6px)" />
        <ModalContent>
          <ModalHeader>Session expired</ModalHeader>
          <ModalBody>
            <Text>
              You’ve been idle for a while, so your session has expired. Reload the page to keep going.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleReload}>
              Reload page
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
