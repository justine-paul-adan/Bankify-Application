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
import { CreateBankifyUserDto } from "../../../models/bankifyUser";
import { createUser } from "../../../services/bankifyUserService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateUserModal({ isOpen, onClose }: Props) {
  const [user, setUser] = useState<CreateBankifyUserDto>({
    email: "",
    password: "",
    phoneNumber: "",
    accountNumber: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      await createUser(user);
      alert("User created successfully");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error creating user");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create User</ModalHeader>

        <ModalBody>
          <VStack spacing={4}>
            <Input name="email" placeholder="Email" onChange={handleChange} />
            <Input name="role" placeholder="Role" onChange={handleChange} />
            <Input name="accountNumber" placeholder="Account Number" onChange={handleChange} />
            <Input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
            <Input name="password" placeholder="Password" type="password" onChange={handleChange} />
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