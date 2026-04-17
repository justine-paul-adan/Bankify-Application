import { ResponseDto } from "../models/response";
import { RequestTransaction, TransactionDto } from "../models/transaction";
import api from "./api";

export const getBalance = async (accountNumber: string, pin: string): Promise<ResponseDto<TransactionDto>> => {
  const response = await api.get(`/transaction/Balance?accountNumber=${accountNumber}&pin=${pin}`);
  return response.data;
};

export const getHistory = async (accountNumber: string): Promise<ResponseDto<TransactionDto[]>> => {
  const response = await api.get(`/transaction/History?accountNumber=${accountNumber}`);
  return response.data;
};

export const depositMoney = async (request : RequestTransaction): Promise<ResponseDto<TransactionDto>> => {
  const response = await api.put("/transaction/deposit", request);
  return response.data;
};

export const withdrawMoney = async (request : RequestTransaction): Promise<ResponseDto<TransactionDto>> => {
  const response = await api.put("/transaction/withdraw", request);
  return response.data;
};

export const changePin = async (request : RequestTransaction): Promise<ResponseDto<TransactionDto>> => {
  const response = await api.put("/transaction/changePin", request);
  return response.data;
}
