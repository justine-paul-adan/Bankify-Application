import { Center, DeleteIcon, EditIcon, IconButton, Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/icons";
import { BankifyUserDto } from "../../../models/bankifyUser";
import { deleteUser, getAllUsers } from "../../../services/bankifyUserService";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EditUserModal from "./edit-user-modal";

export default function ViewUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<BankifyUserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BankifyUserDto | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role === "User") navigate("/");
    fetchUsers();
  }, []);

  const handleDelete = async (userRef: string) => {
    setLoading(true);
    await deleteUser(userRef);
    await fetchUsers();
  };

  if (loading) {
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  const handleEdit = (user: BankifyUserDto) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>User Ref</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Account Number</Th>
            <Th>Phone Number</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {users.map((user) => (
            <Tr key={user.userRef}>
              <Td>{user.userRef}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>{user.accountNumber}</Td>
              <Td>{user.phoneNumber}</Td>

              <Td>
                <IconButton
                  aria-label="Edit"
                  mr={2}
                  icon={<EditIcon />}
                  onClick={() => handleEdit(user)}
                />

                <IconButton
                  aria-label="Delete"
                  colorScheme="red"
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(user.userRef)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedUser && (
        <EditUserModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          user={selectedUser}
          refresh={fetchUsers}
        />
      )}
    </>
  );
}
