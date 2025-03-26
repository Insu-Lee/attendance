import { useState } from 'react';
import { AccountProps } from '../utils/types';
import { question, permit, getTokenBalance } from '../utils/ethers';
import { decryptPrivateKey } from '../utils/crypto';

import Loading from '../components/Loading';

const QuestionForm = ({
  address,
  balance,
  setBalance,
  onSubmitted,
}: AccountProps) => {
  const [ask, setAsk] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const privateKey = decryptPrivateKey(
    sessionStorage.getItem('encryptedPrivateKey') || ''
  );

  const handleAsk = async () => {
    if (!address) {
      alert('지갑 주소가 없습니다.');
      return;
    }

    setLoading(true);

    try {
      await permit(privateKey);
      await question(address, ask);

      if (setBalance) {
        const updated = await getTokenBalance(address);
        setBalance(updated);
      }

      onSubmitted?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50px',
          }}
        >
          <div
            style={{
              background: '#f8f8f8',
              padding: '20px 30px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              width: '450px',
              textAlign: 'left',
            }}
          >
            <p>
              <strong>주소:</strong> {address}
            </p>
            <p>
              <strong>잔액:</strong> {balance}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <input
                type="text"
                placeholder="Please enter your question."
                onChange={(e) => setAsk(e.target.value)}
                style={{
                  width: '60%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={handleAsk}
                style={{
                  background: '#333',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                질문 등록
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionForm;
