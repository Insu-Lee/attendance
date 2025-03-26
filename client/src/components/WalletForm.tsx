import { AccountProps } from '../utils/types';

const WalletForm = ({ address, balance }: AccountProps) => {
  return (
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
      </div>
    </div>
  );
};

export default WalletForm;
