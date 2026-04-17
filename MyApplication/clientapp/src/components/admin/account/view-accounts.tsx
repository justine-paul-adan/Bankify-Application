import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import EditAccountModal from "./edit-account-modal";
import { DeleteIcon } from "@chakra-ui/icons";
import { EditIcon } from "@chakra-ui/icons";
import { AccountDto } from "../../../models/account";
import {
  deleteAccount,
  getAllAccounts,
} from "../../../services/accountService";
import { useToast } from "@chakra-ui/react";

export default function ViewAccounts() {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const toast = useToast();
  const [pendingDelete, setPendingDelete] = useState<any>(null);
  const [deleteTimer, setDeleteTimer] = useState<any>(null);

  const fetchAccounts = async () => {
    const data = await getAllAccounts();
    setAccounts(data.data || []);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = (account: any) => {
    setPendingDelete(account);

    const timer = setTimeout(async () => {
      await deleteAccount(account.accountNumber);
      fetchAccounts();
      setPendingDelete(null);
    }, 5000); // 5 seconds

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

  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = (account: any) => {
    setSelectedAccount(account);
    onOpen();
  };

  return (
    <>
      <Table>
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
                {/* EDIT */}
                <IconButton
                  aria-label="Edit"
                  mr={2}
                  icon={<EditIcon />}
                  onClick={() => handleEdit(acc)}
                />

                {/* DELETE */}
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

      {selectedAccount && (
        <EditAccountModal
          isOpen={isOpen}
          onClose={onClose}
          account={selectedAccount}
          refresh={fetchAccounts}
        />
      )}
    </>
  );
}
