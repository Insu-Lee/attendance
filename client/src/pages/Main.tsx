import { useState, useEffect, useCallback } from 'react';
import { decryptPrivateKey } from '../utils/crypto';
import { AttendanceStatus } from '../utils/constant';
import { dailyLimit, attendance } from '../utils/ethers';

import Modal from '../components/Modal';
import Loading from '../components/Loading';

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const account = {
    address: sessionStorage.getItem('address') || '',
    privateKey: decryptPrivateKey(
      sessionStorage.getItem('encryptedPrivateKey') || ''
    ),
  };

  const checkWallet = useCallback(() => {
    return !(account.address.length === 0 && account.privateKey.length === 0);
  }, [account.address, account.privateKey]);

  const handleAttendance = async () => {
    setLoading(true);

    try {
      if (!(await dailyLimit(account.address))) {
        setStatus(AttendanceStatus.Daily_Limit);
        setIsModalOpen(true);
        return;
      }

      await attendance(account.address);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const check = checkWallet();
    if (!check) {
      setStatus(AttendanceStatus.Wallet_Load_Failed);
      setIsModalOpen(true);
    }
  }, [checkWallet]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <button
            onClick={handleAttendance}
            style={{
              background: '#333',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              borderRadius: '4px',
              marginTop: '100px',
            }}
          >
            출석
          </button>
          <Modal
            status={status}
            onClose={() => setIsModalOpen(false)}
            isOpen={isModalOpen}
          />
        </>
      )}
    </div>
  );
};

export default Main;
