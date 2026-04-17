import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Text,
  FormLabel,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  VStack,
  useToast,
  Badge,
  Card,
  CardBody,
  Divider,
  Flex,
  HStack,
} from "@chakra-ui/react";
import {
  changePin,
  depositMoney,
  getBalance,
  getHistory,
  withdrawMoney,
} from "../../services/transactionService";
import { useAuth } from "../../context/authContext";
import { RequestTransaction, TransactionDto } from "../../models/transaction";

const TransactionPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [type, setType] = useState("Deposit");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<TransactionDto[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const getInitialRequest = (accountNumber: string): RequestTransaction => ({
    accountNumber,
    amount: 0,
    currentPin: "",
    newPin: "",
  });
  const [request, setRequest] = useState<RequestTransaction>(
    getInitialRequest(user?.accountNumber || ""),
  );

  useEffect(() => {
    if (user) {
      setRequest(getInitialRequest(user.accountNumber));
    }
  }, [user, type]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setRequest((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "accountNumber" ? Number(value) : value,
    }));
  };

  const fetchTransactionHistory = async () => {
    if (!user) return;

    try {
      setLoadingHistory(true);

      const response = await getHistory(user.accountNumber);
      setHistory(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleHistory = async () => {
    const next = !showHistory;
    setShowHistory(next);

    if (next) {
      await fetchTransactionHistory();
    }
  };

  const handleTransaction = async () => {
    if (!user) return;

    try {
      setLoading(true);

      if (type !== "ChangePin" && type !== "Balance" && request.amount < 100) {
        toast({
          title: "Invalid Amount",
          description: "Minimum amount is 100",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      switch (type) {
        case "Deposit":
          await depositMoney(request);
          break;

        case "Withdraw":
          await withdrawMoney(request);
          break;

        case "ChangePin":
          await changePin(request);
          break;

        case "Balance":
          const bal = await getBalance(user.accountNumber, request.currentPin);
          setBalance(bal.data?.amount || null);
          break;
      }

      toast({
        title: "Success",
        description: "Transaction completed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchTransactionHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Transaction failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="80vh" p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">🏦 Bankify Transaction Dashboard</Heading>
        {balance !== null && (
          <Card bg="green.500" color="white" px={4} py={2}>
            <Text fontWeight="bold">Balance: {balance}</Text>
          </Card>
        )}
      </Flex>

      <Flex gap={8} direction={{ base: "column", md: "row" }}>
        <Card flex="1" shadow="lg" borderRadius="2xl">
          <CardBody>
            <Heading size="md" mb={4}>
              Quick Transaction
            </Heading>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Transaction Type</FormLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Deposit">Deposit</option>
                  <option value="Withdraw">Withdraw</option>
                  <option value="ChangePin">Change PIN</option>
                  <option value="Balance">Check Balance</option>
                </Select>
              </FormControl>

              {type !== "ChangePin" && type !== "Balance" && (
                <FormControl>
                  <FormLabel>Amount</FormLabel>
                  <Input
                    name="amount"
                    type="number"
                    value={request.amount || ""}
                    onChange={handleChange}
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel>PIN</FormLabel>
                <Input
                  name="currentPin"
                  type="password"
                  value={request.currentPin}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </FormControl>

              {type === "ChangePin" && (
                <FormControl>
                  <FormLabel>New PIN</FormLabel>
                  <Input
                    name="newPin"
                    type="password"
                    value={request.newPin}
                    onChange={handleChange}
                  />
                </FormControl>
              )}

              <Button
                colorScheme="blue"
                onClick={handleTransaction}
                isLoading={loading}
                size="lg"
              >
                Execute Transaction
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Card flex="2" shadow="lg" borderRadius="2xl">
          <CardBody>
            <HStack justify="space-between" mb={4}>
              <Heading size="md">Transaction History</Heading>
              <HStack>
                <Button
                  size="sm"
                  onClick={toggleHistory}
                  isLoading={loadingHistory}
                >
                  {showHistory ? "Hide History" : "View History"}
                </Button>
              </HStack>
            </HStack>

            <Divider mb={4} />

            {showHistory && (
              <Box
                maxH="38vh"
                overflowY="auto"
                overflowX="auto"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={2}
              >
                {loadingHistory ? (
                  <Text>Loading transaction history...</Text>
                ) : (
                  <Table size="sm" variant="striped">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Type</Th>
                        <Th>Amount</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {history.map((t) => (
                        <Tr key={t.transactionRef}>
                          <Td>{t.transactionRef}</Td>
                          <Td>
                            <Badge colorScheme="purple">{t.type}</Badge>
                          </Td>
                          <Td>₱{t.amount}</Td>
                          <Td>{t.createdDate}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
            )}
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
};

export default TransactionPage;
