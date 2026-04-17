import { AccountDto, CreateAccountDto } from "../models/account";
import { ResponseDto } from "../models/response";
import api from "./api";

export const getAllAccounts = async (): Promise<ResponseDto<AccountDto[]>> => {
  const response = await api.get("/account/getAllAccount") ;
  return response.data;
};

export const getAccountByNumber = async (accountNumber: string): Promise<ResponseDto<AccountDto>> => {
  const response = await api.get(`/account/getAccountByNumber?accountNumber=${accountNumber}`);
  return response.data;
};

export const createAccount = async (account: CreateAccountDto): Promise<ResponseDto<AccountDto>> => {
  const response = await api.post("/account/CreateAccount", account);
  return response.data;
};

export const updateAccount = async (account: AccountDto): Promise<ResponseDto<AccountDto>> => {
    const response = await api.put("/account/UpdateAccount", account);
    return response.data;
};

export const deleteAccount = async (accountNumber: string): Promise<ResponseDto<null>> => {
  const response = await api.delete(`/account/DeleteAccount/${accountNumber}`);
  return response.data;
};