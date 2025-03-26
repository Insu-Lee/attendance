import { useNavigate } from 'react-router-dom';
import { ModalProps } from '../utils/types';
import { AttendanceStatus } from '../utils/constant';

const statusMessageMap: Record<AttendanceStatus, string> = {
  [AttendanceStatus.Wallet_Load_Failed]: '지갑 정보를 불러올 수 없습니다.',
  [AttendanceStatus.Attendance_Success]: '출석이 완료되었습니다!',
  [AttendanceStatus.Attendance_Failed]: '출석 중 문제가 발생했습니다.',
  [AttendanceStatus.Daily_Limit]: '이미 출석이 완료 되었습니다.',
};

const Modal = ({ status, onClose, isOpen }: ModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const message =
    statusMessageMap[status as AttendanceStatus] ??
    '알 수 없는 오류가 발생했습니다.';

  const handleClose = () => {
    switch (status) {
      case AttendanceStatus.Wallet_Load_Failed:
        navigate('/wallet');
        break;

      // Todo: 다른 상태에 대한 로직 추가
    }

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          minWidth: '300px',
          textAlign: 'center',
        }}
      >
        <h3>{message}</h3>
        <button
          onClick={handleClose}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            background: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default Modal;
