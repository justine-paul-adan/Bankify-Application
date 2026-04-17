import { useState } from "react";
import {
  Button,
  Input,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { CreateAccountDto } from "../../../models/account";
import { createAccount } from "../../../services/accountService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateAccountModal({ isOpen, onClose }: Props) {
  const [account, setAccount] = useState<CreateAccountDto>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    location: "",
    phoneNumber: "",
    availableBalance: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAccount({
      ...account,
      [name]: name === "availableBalance" ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await createAccount(account);
      alert("Account created successfully");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error creating account");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Account</ModalHeader>

        <ModalBody>
          <VStack spacing={4}>
            <Input name="firstName" placeholder="First Name" onChange={handleChange} />
            <Input name="middleName" placeholder="Middle Name" onChange={handleChange} />
            <Input name="lastName" placeholder="Last Name" onChange={handleChange} />

            <Input name="email" placeholder="Email" onChange={handleChange} />
            <Input name="location" placeholder="Location" onChange={handleChange} />
            <Input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />

            <Input
              name="availableBalance"
              type="number"
              placeholder="Initial Balance"
              onChange={handleChange}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}