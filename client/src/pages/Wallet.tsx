import { useEffect, useCallback } from 'react';
import { createWallet, importWallet, getTokenBalance } from '../utils/ethers';
import { encryptPrivateKey, decryptPrivateKey } from '../utils/crypto';
import WalletForm from '../components/WalletForm';
import { WalletProps } from '../utils/types';

const Wallet = ({ address, setAddress, balance, setBalance }: WalletProps) => {
  const create = async () => {
    const newWallet = await createWallet();
    setAddress(newWallet.address);
    sessionStorage.setItem('address', newWallet.address);

    const encrypted = encryptPrivateKey(newWallet.privateKey);
    sessionStorage.setItem('encryptedPrivateKey', encrypted);

    const balance = await getTokenBalance(newWallet.address);
    setBalance(balance);
  };

  const importAccount = useCallback(
    async (privateKey: string) => {
      try {
        const imported = importWallet(privateKey);
        setAddress(imported.address);
        sessionStorage.setItem('address', imported.address);

        const encrypted = encryptPrivateKey(privateKey);
        sessionStorage.setItem('encryptedPrivateKey', encrypted);

        const balance = await getTokenBalance(imported.address);
        setBalance(balance);
      } catch (err) {
        alert('유효하지 않은 프라이빗 키 입니다.');
      }
    },
    [setAddress, setBalance]
  );

  const logout = () => {
    setAddress(null);
    setBalance(null);
    sessionStorage.removeItem('address');
    sessionStorage.removeItem('encryptedPrivateKey');
  };

  useEffect(() => {
    const encryptedPrivateKey = sessionStorage.getItem('encryptedPrivateKey');
    if (encryptedPrivateKey && !address) {
      const privateKey = decryptPrivateKey(encryptedPrivateKey);
      importAccount(privateKey);
    }
  }, [address, importAccount]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        const updatedBalance = await getTokenBalance(address);
        setBalance(updatedBalance);
      }
    };

    fetchBalance();
  }, [address, setBalance]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '50px' }}>출석용 지갑</h2>
      {!address ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '50px',
          }}
        >
          <button
            onClick={create}
            style={{
              background: '#333',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            새 지갑 생성
          </button>

          <div>or</div>

          <input
            type="text"
            placeholder="Please enter your private key."
            onKeyDown={(e) => {
              if (e.key === 'Enter') importAccount(e.currentTarget.value);
            }}
            onChange={(e) => importAccount(e.target.value)}
            style={{
              width: '60%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
      ) : (
        <>
          <WalletForm address={address} balance={balance} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <button
              onClick={logout}
              style={{
                background: '#333',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;
