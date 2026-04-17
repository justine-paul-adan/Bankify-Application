import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Skeleton,
  Button,
  Flex,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/bankifyUserService";
import { getAllAccounts } from "../../services/accountService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { BankifyUserDto } from "../../models/bankifyUser";
import { AccountDto } from "../../models/account";
import CreateAccountModal from "./account/create-account-modal";
import CreateUserModal from "./user/create-user-modal";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<BankifyUserDto[]>([]);
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const navigate = useNavigate();
  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "Admin")) {
      navigate("/");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [u, a] = await Promise.all([getAllUsers(), getAllAccounts()]);
        setUsers(u.data || []);
        setAccounts(a.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: "Jan", users: 10 },
    { name: "Feb", users: 25 },
    { name: "Mar", users: 40 },
    { name: "Apr", users: users.length + 27 },
  ];

  return (
    <Box p={6}>
      <VStack align="start" spacing={8}>
        <Heading>Admin Dashboard</Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
          <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Flex justify="space-between" align="center">
              <StatLabel>Total Users</StatLabel>
              <Flex justify="flex-end" align="center">
                <Button
                  size="xs"
                  colorScheme="blue"
                  onClick={() => navigate("/view-users")}
                  isDisabled={users.length === 0}
                  mr={2}
                >
                  View
                </Button>
                <Button
                  size="xs"
                  colorScheme="green"
                  onClick={() => setOpenCreateUser(true)}
                >
                  Add User
                </Button>
              </Flex>
            </Flex>

            <Skeleton isLoaded={!loading}>
              <StatNumber>{users.length}</StatNumber>
            </Skeleton>

            <StatHelpText>All registered users</StatHelpText>
          </Stat>

          <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Flex justify="space-between" align="center">
              <StatLabel>Total Accounts</StatLabel>
              <Flex justify="flex-end" align="center">
                <Button
                  size="xs"
                  colorScheme="blue"
                  onClick={() => navigate("/view-accounts")}
                  isDisabled={accounts.length === 0}
                  mr={2}
                >
                  View
                </Button>
                <Button
                  size="xs"
                  colorScheme="green"
                  onClick={() => setOpenCreateAccount(true)}
                >
                  Add Account
                </Button>
              </Flex>
            </Flex>

            <Skeleton isLoaded={!loading}>
              <StatNumber>{accounts.length}</StatNumber>
            </Skeleton>

            <StatHelpText>All created accounts</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Card w="100%" shadow="md" borderRadius="lg">
          <CardBody>
            <Heading size="md" mb={4}>
              Overview
            </Heading>

            <Skeleton isLoaded={!loading} minH="200px">
              <Box h="250px" w="100%">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3182CE"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Skeleton>
          </CardBody>
        </Card>
      </VStack>

      {openCreateAccount && (
        <CreateAccountModal
          isOpen={openCreateAccount}
          onClose={() => setOpenCreateAccount(false)}
        />
      )}

      {openCreateUser && (
        <CreateUserModal
          isOpen={openCreateUser}
          onClose={() => setOpenCreateUser(false)}
        />
      )}
    </Box>
  );
}
