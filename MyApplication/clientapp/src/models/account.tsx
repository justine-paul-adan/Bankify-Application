export interface AccountDto {
  accountNumber: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  location: string;
  phoneNumber: string;
  availableBalance: number;
  status: string;
}

export interface CreateAccountDto {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  location: string;
  phoneNumber: string;
  availableBalance: number;
}