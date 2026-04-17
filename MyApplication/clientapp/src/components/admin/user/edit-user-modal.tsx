import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, VStack, FormControl, FormLabel, Text, HStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BankifyUserDto, UpdateBankifyUserDto } from "../../../models/bankifyUser";
import { updateUser } from "../../../services/bankifyUserService";

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
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>

        <ModalBody>
          <VStack spacing={2} align="stretch">
            {/* User Ref */}
            <FormControl>
              <FormLabel>User Reference</FormLabel>
              <Input value={currentUser.userRef} isReadOnly isDisabled />
            </FormControl>

            {/* Email */}
            <FormControl isInvalid={!!errors.email}>
              <HStack justify="space-between">
                <FormLabel>Email</FormLabel>
                {errors.email && (
                  <Text fontSize="sm" color="red.500">
                    {errors.email}
                  </Text>
                )}
              </HStack>
              <Input
                name="email"
                value={currentUser.email}
                onChange={handleChange}
              />
            </FormControl>

            {/* Role */}
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input
                name="role"
                value={currentUser.role}
                onChange={handleChange}
              />
            </FormControl>

            {/* Account Number */}
            <FormControl>
              <FormLabel>Account Number</FormLabel>
              <Input value={user.accountNumber} isReadOnly isDisabled />
            </FormControl>

            {/* Password */}
            <FormControl>
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={currentUser.password}
                onChange={handleChange}
              />
            </FormControl>

            {/* New Password */}
            <FormControl isInvalid={!!errors.newPassword}>
              <HStack justify="space-between">
                <FormLabel>New Password</FormLabel>
                {errors.newPassword && (
                  <Text fontSize="sm" color="red.500">
                    {errors.newPassword}
                  </Text>
                )}
              </HStack>
              <Input
                type="password"
                name="newPassword"
                value={currentUser.newPassword}
                onChange={handleChange}
              />
            </FormControl>

            {/* Phone Number */}
            <FormControl isInvalid={!!errors.phoneNumber}>
              <HStack justify="space-between">
                <FormLabel>Phone Number</FormLabel>
                {errors.phoneNumber && (
                  <Text fontSize="sm" color="red.500">
                    {errors.phoneNumber}
                  </Text>
                )}
              </HStack>
              <Input
                name="phoneNumber"
                value={currentUser.phoneNumber}
                onChange={handleChange}
              />
            </FormControl>
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
