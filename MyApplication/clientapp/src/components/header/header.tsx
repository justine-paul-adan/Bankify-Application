import { useState } from "react";
import { Box, Flex, HStack, Link, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Menu, MenuButton, MenuList, MenuItem, Avatar, Badge, Divider, Icon } from "@chakra-ui/react";
import s from "./header.module.scss";
import { Login } from "../logins/login";
import { SignUp } from "../logins/signUp";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { FiClock, FiLock, FiLogOut, FiUser, FiUsers } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { LuBanknote } from "react-icons/lu";
import { BsGraphUpArrow } from "react-icons/bs";
import { GoGear } from "react-icons/go";
import logo from "../assets/logo1.png";

const Header = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const navByRole = (role: string) => {
    switch (role) {
      case "Admin":
        return [
          {
            label: "Dashboard", icon: <RxDashboard />
            , href: "/admin/dashboard"
          },
          { label: "Users", icon: <FiUsers  />, href: "/admin/users" },
          { label: "Accounts", icon: <LuBanknote />, href: "/admin/accounts" },
          { label: "Reports", icon: <BsGraphUpArrow  />, href: "/admin/settings" },
        ];

      case "Teller":
        return [
          { label: "Dashboard", icon: <RxDashboard />, href: "/teller/dashboard" },
          { label: "Customers", icon: <FiUsers  />, href: "/teller/customers" },
          { label: "Reports", icon: <BsGraphUpArrow  />, href: "/admin/settings" },
          { label: "Accounts", icon: <LuBanknote />, href: "/admin/accounts" },
        ];

      case "User":
        return [
          { label: "Dashboard", icon: <RxDashboard />, href: "/dashboard" },
          { label: "Transactions", icon: <FiClock />, href: "/transactions" },
          { label: "Settings", icon: <GoGear  />, href: "/settings" },
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
        <Link className={s.logo} href="/" _hover={{ textDecoration: "none" }}>
          <img src={logo} alt="Bankify Logo" />
          <span>Bankify</span>
        </Link>

        <HStack spacing={8}>
          {user &&
            navItems.map((nav) => (
              <Link className={s.navLinks} key={nav.label} href={nav.href} fontWeight="bold" _hover={{ textDecoration: "none" }}>
               {nav.icon}
               {nav.label}
              </Link>
            ))}
        </HStack>

        <Flex className={s.actionButtons} align="center" >
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

              <MenuList p={3} borderRadius="md" boxShadow="lg">
                <Flex align="center" mb={3}>
                  <Avatar
                    size="md"
                    name={user.email}
                    getInitials={(name) => getInitials(name)}
                  />
                  <Box flex={1} ml={4}>
                    <Text fontWeight="bold">{user.email}</Text>
                    <Badge colorScheme="green" borderRadius="full" px={2}>
                      User
                    </Badge>
                  </Box>

                </Flex>
                <Divider mb={2} />

                <MenuItem icon={<Icon as={FiUser} />}>
                  Profile Settings
                </MenuItem>

                <MenuItem icon={<Icon as={FiLock} />}>
                  Security (PIN / Password)
                </MenuItem>

                <MenuItem icon={<Icon as={FiClock} />}>
                  Activity Log
                </MenuItem>

                <Divider my={2} />

                {/* Logout */}
                <MenuItem
                  icon={<Icon as={FiLogOut} />}
                  color="red.500"
                  _hover={{ bg: "red.50" }}
                  onClick={() => logout(false)}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
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
    </Box>
  );
};

export default Header;
