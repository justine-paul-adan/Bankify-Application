import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, VStack, FormControl, FormLabel, Text, HStack, useToast, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BankifyUserDto, UpdateBankifyUserDto } from "../../../models/bankifyUser";
import { updateUser } from "../../../services/bankifyUserService";
import {
  FaIdBadge,
  FaEnvelope,
  FaUserTag,
  FaHashtag,
  FaLock,
  FaPhone,
} from "react-icons/fa";
import { RiContactsLine } from "react-icons/ri";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: BankifyUserDto;
  refresh: () => void;
}

export default function EditUserModal({ isOpen, onClose, user, refresh }: Props) {
  const [errors, setErrors] = useState<Partial<UpdateBankifyUserDto>>({});
  const toast = useToast();

  const [currentUser, setCurrentUser] = useState<UpdateBankifyUserDto>({
    userRef: user?.userRef ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "",
    password: "",
    newPassword: "",
    phoneNumber: user?.phoneNumber ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const errs: Partial<UpdateBankifyUserDto> = {};

    if (!currentUser.email) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(currentUser.email)) {
      errs.email = "Invalid email format";
    }

    if (!currentUser.password) {
      errs.password = "Current password is required";
    }

    if (!currentUser.newPassword) {
      errs.newPassword = "New password is required";
    }

    if (!currentUser.phoneNumber) {
      errs.phoneNumber = "Phone number is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      const response = await updateUser(currentUser);
      toast({
        title: "Success",
        description: "User updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      refresh();
      onClose();
    }
    catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast({
        title: "Update failed",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });

      console.error("Update failed", error);
    }
  };

  const hasChanges =
    currentUser.email !== (user?.email ?? "") ||
    currentUser.role !== (user?.role ?? "") ||
    currentUser.phoneNumber !== (user?.phoneNumber ?? "") ||
    currentUser.password !== "" ||
    currentUser.newPassword !== "";

  useEffect(() => {
    if (user) {
      setCurrentUser({
        userRef: user.userRef ?? "",
        email: user.email ?? "",
        role: user.role ?? "",
        password: "",
        newPassword: "",
        phoneNumber: user.phoneNumber ?? "",
      });

      setErrors({});
    }
  }, [user]);
console.log("Current User State:", user);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Update User Details</ModalHeader>

        <ModalBody>
          <VStack spacing={2} align="stretch">
            
            {/* User Reference */}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaIdBadge />
                </InputLeftElement>
                <Input value={currentUser.userRef} isReadOnly isDisabled />
              </InputGroup>

            {/* Email */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaEnvelope />
              </InputLeftElement>
              <Input
                name="email"
                placeholder="Enter Email"
                value={currentUser.email}
                onChange={handleChange}
              />
            </InputGroup>

            {/* Role */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaUserTag />
              </InputLeftElement>
              <Input
                name="role"
                placeholder="Enter Role"
                value={currentUser.role}
                onChange={handleChange}
              />
            </InputGroup>

            {/* Account Number */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <RiContactsLine />
              </InputLeftElement>
              <Input
                name="accountNumber"
                value={user.accountNumber}
                onChange={handleChange}
              />
            </InputGroup>

            {/* Current Password */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock />
              </InputLeftElement>
              <Input
                type="password"
                name="password"
                placeholder="Enter Current Password"
                value={currentUser.password}
                onChange={handleChange}
              />
            </InputGroup>

            {/* New Password */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock />
              </InputLeftElement>
              <Input
                type="password"
                name="newPassword"
                placeholder="Enter New Password"
                value={currentUser.newPassword}
                onChange={handleChange}
              />
            </InputGroup>

            {/* Phone Number */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaPhone />
              </InputLeftElement>
              <Input
                name="phoneNumber"
                placeholder="Enter Phone Number"
                value={currentUser.phoneNumber}
                onChange={handleChange}
              />
            </InputGroup>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>

          <Button
            colorScheme="blue"
            onClick={handleUpdate}
            isDisabled={!hasChanges}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
