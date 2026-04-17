import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, ChevronRightIcon } from "@chakra-ui/icons";
import EditAccountModal from "./edit-account-modal";
import { AccountDto } from "../../../models/account";
import {
  deleteAccount,
  getAllAccounts,
} from "../../../services/accountService";
import { useNavigate } from "react-router-dom";

export default function ViewAccounts() {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const toast = useToast();
  const navigate = useNavigate();

  const [pendingDelete, setPendingDelete] = useState<AccountDto | null>(null);
  const [deleteTimer, setDeleteTimer] = useState<any>(null);

  const fetchAccounts = async () => {
    const data = await getAllAccounts();
    setAccounts(data.data || []);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = (account: AccountDto) => {
    setPendingDelete(account);

    const timer = setTimeout(async () => {
      await deleteAccount(account.accountNumber);
      fetchAccounts();
      setPendingDelete(null);
    }, 5000);

    setDeleteTimer(timer);

    toast({
      title: "Account marked for deletion",
      description: (
        <Button size="sm" colorScheme="blue" onClick={handleUndo}>
          Undo
        </Button>
      ),
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleUndo = () => {
    if (deleteTimer) {
      clearTimeout(deleteTimer);
    }
    setPendingDelete(null);

    toast({
      title: "Delete cancelled",
      status: "success",
      duration: 2000,
    });
  };

  const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = (account: AccountDto) => {
    setSelectedAccount(account);
    onOpen();
  };

  return (
    <Box p={6}>
      <VStack align="start" spacing={6}>
        {/* ✅ Breadcrumb */}
        <Breadcrumb
          fontSize="sm"
          color="gray.500"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/")}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/admin/dashboard")}>
              Admin Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Accounts</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading size="md">Accounts</Heading>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Account Number</Th>
              <Th>Email</Th>
              <Th>Available Balance</Th>
              <Th>Last Name</Th>
              <Th>First Name</Th>
              <Th>Middle Name</Th>
              <Th>Status</Th>
              <Th>Location</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {accounts.map((acc) => (
              <Tr key={acc.accountNumber}>
                <Td>{acc.accountNumber}</Td>
                <Td>{acc.email}</Td>
                <Td>{acc.availableBalance}</Td>
                <Td>{acc.lastName}</Td>
                <Td>{acc.firstName}</Td>
                <Td>{acc.middleName}</Td>
                <Td>{acc.status}</Td>
                <Td>{acc.location}</Td>

                <Td>
                  <IconButton
                    aria-label="Edit"
                    mr={2}
                    icon={<EditIcon />}
                    onClick={() => handleEdit(acc)}
                  />

                  <IconButton
                    aria-label="Delete"
                    colorScheme="red"
                    onClick={() => handleDelete(acc)}
                    icon={<DeleteIcon />}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>

      {selectedAccount && (
        <EditAccountModal
          isOpen={isOpen}
          onClose={onClose}
          account={selectedAccount}
          refresh={fetchAccounts}
        />
      )}
    </Box>
  );
}