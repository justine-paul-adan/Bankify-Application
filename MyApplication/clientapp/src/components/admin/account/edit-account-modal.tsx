import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { AccountDto } from "../../../models/account";
import { updateAccount } from "../../../services/accountService";

export default function EditAccountModal({
  isOpen,
  onClose,
  account,
  refresh,
}: any) {
  const [currentAccount, setCurrentAccount] = useState<AccountDto>({
    accountNumber: account?.accountNumber ?? 0,
    firstName: account?.firstName ?? "",
    middleName: account?.middleName ?? "",
    lastName: account?.lastName ?? "",
    email: account?.email ?? "",
    location: account?.location ?? "",
    phoneNumber: account?.phoneNumber ?? "",
    availableBalance: account?.availableBalance ?? 0,
    status: account?.status ?? "Active",
  });
  useEffect(() => {
    if (account) {
      setCurrentAccount(account);
    }
  }, [account]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setCurrentAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateAccount(currentAccount);
      refresh();
      onClose();
    } catch (error: any) {
      console.error(
        "Update failed",
        error?.response?.data || error?.message || error,
      );
      alert(
        `Update failed: ${error?.response?.data || error?.message || "Unknown error"}`,
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Edit Account</ModalHeader>

        <ModalBody>
          <VStack spacing={3}>
            <Input
              name="firstName"
              value={currentAccount.firstName}
              onChange={handleChange}
            />

            <Input
              name="middleName"
              value={currentAccount.middleName}
              onChange={handleChange}
            />

            <Input
              name="lastName"
              value={currentAccount.lastName}
              onChange={handleChange}
            />

            <Input
              name="email"
              value={currentAccount.email}
              onChange={handleChange}
            />

            <Input
              name="location"
              value={currentAccount.location}
              onChange={handleChange}
            />

            <Input
              name="phoneNumber"
              value={currentAccount.phoneNumber}
              onChange={handleChange}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>

          <Button colorScheme="blue" onClick={handleUpdate}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
