import { useCallback, useEffect, useState } from 'react';
import { getQuestions } from '../utils/ethers';
import { decryptPrivateKey } from '../utils/crypto';
import { AccountProps } from '../utils/types';
import { AttendanceStatus } from '../utils/constant';

import Modal from '../components/Modal';
import QuestionForm from '../components/QuestionForm';
import QuestionList from '../components/QuestionList';

const Questions = ({ address, balance, setBalance }: AccountProps) => {
  const [questions, setQuestions] = useState<
    Record<string, string[]> | undefined
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<AttendanceStatus | null>(null);

  const refreshQuestions = useCallback(async () => {
    const q = await getQuestions();
    setQuestions(q);
  }, []);

  const account = {
    address: sessionStorage.getItem('address') || '',
    privateKey: decryptPrivateKey(
      sessionStorage.getItem('encryptedPrivateKey') || ''
    ),
  };

  const checkWallet = useCallback(() => {
    return !(account.address.length === 0 && account.privateKey.length === 0);
  }, [account.address, account.privateKey]);

  useEffect(() => {
    const check = checkWallet();
    if (!check) {
      setStatus(AttendanceStatus.Wallet_Load_Failed);
      setIsModalOpen(true);
    }
  }, [checkWallet]);

  return (
    <div>
      <QuestionForm
        address={address}
        balance={balance}
        setBalance={setBalance}
        onSubmitted={refreshQuestions}
      />
      <QuestionList questions={questions} refreshQuestions={refreshQuestions} />
      <Modal
        status={status}
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />
    </div>
  );
};

export default Questions;
