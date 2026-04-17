import { useState } from "react";
import { Box, Flex, HStack, Link, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Menu, MenuButton, MenuList, MenuItem, Avatar } from "@chakra-ui/react";
import s from "./header.module.scss";
import { Login } from "../logins/login";
import { SignUp } from "../logins/signUp";
import { useAuth } from "../../context/authContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const navByRole = (role: string) => {
    switch (role) {
      case "Admin":
        return [{ label: "Dashboard", href: "/admin/dashboard" }];

      case "Teller":
        return [
          { label: "Dashboard", href: "/teller/dashboard" },
          { label: "Customers", href: "/teller/customers" },
        ];

      case "User":
        return [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Transactions", href: "/transactions" },
          { label: "Accounts", href: "/accounts" },
          { label: "Settings", href: "/settings" },
        ];
      default:
        return [];
    }
  };
  
  const navItems = navByRole(user?.role || "User");
  const getInitials = (email?: string): string =>
    email ? email[0].toUpperCase() + (email[1]?.toUpperCase() ?? "") : "UN";

  const getRoleColor = (role: string): string => {
    switch (role) {
      case "Admin":
        return "purple.500";
      case "Teller":
        return "blue.500";
      default:
        return "green.500";
    }
  };

  return (
    <Box className={s.header}>
      <Flex align="center" justify="space-between" w="100%">
        <Box className={s.logo}>
          <Link href="/">
            <Image src="/logo.png" alt="Logo" />
          </Link>
        </Box>

        <HStack className={s.navLinks}>
          {user &&
            navItems.map((nav) => (
              <Link key={nav.label} href={nav.href} fontWeight="bold">
                {nav.label}
              </Link>
            ))}
        </HStack>

        <Flex className={s.actionButtons} align="center">
          {!user ? (
            <>
              <Button onClick={() => setIsOpen(true)}>Login</Button>
              <Button onClick={() => setIsRegisterOpen(true)}>Join Now</Button>
            </>
          ) : (
            <Menu>
              <MenuButton>
                <Avatar
                  size="sm"
                  name={user.email}
                  getInitials={(name) => getInitials(name)}
                />
              </MenuButton>

              <MenuList>
                <MenuItem>{user.email}</MenuItem>

                <MenuItem color={getRoleColor(user.role)}>
                  Role: {user.role}
                </MenuItem>

                <MenuItem onClick={logout} color="red.500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>

      {/* Login Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Login onSuccess={() => setIsOpen(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SignUp onSuccess={() => setIsRegisterOpen(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Header;
