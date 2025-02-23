import { NavigatorScreenParams } from '@react-navigation/native'

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  AddTransaction: undefined;
};

// Ana tab navigator tipleri
export type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  AddTransaction: undefined;
  Reports: undefined;
  Budget: undefined;
};

// Her tab için stack navigator tipleri
export type HomeStackParamList = {
  Dashboard: undefined;
  TransactionDetail: { id: string };
}

export type TransactionsStackParamList = {
  TransactionList: undefined;
  TransactionDetail: { id: string };
  Filters: undefined;
}

export type AddTransactionStackParamList = {
  AddTransactionForm: undefined;
  CategorySelect: undefined;
}

export type ReportsStackParamList = {
  ReportList: undefined;
  ReportDetail: { type: string };
}

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  AccountDetails: undefined;
} 