import { AttendanceStatus } from '../utils/constant';
import { Dispatch, SetStateAction } from 'react';

export type AccountProps = {
  address: string | null;
  balance: string | null;
  setBalance?: (balance: string) => void;
  onSubmitted?: () => void;
};

export type ModalProps = {
  status: AttendanceStatus | null;
  onClose: () => void;
  isOpen: boolean;
};

export interface WalletProps extends AccountProps {
  setAddress: Dispatch<SetStateAction<string | null>>;
  setBalance: Dispatch<SetStateAction<string | null>>;
}

export type QuestionListProps = {
  questions: Record<string, string[]> | undefined;
  refreshQuestions: () => void;
};
