import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ background: '#333', padding: '10px', color: 'white' }}>
      <nav style={{ display: 'flex', gap: '20px' }}>
        <>
          <Link to="/main" style={{ color: 'white', textDecoration: 'none' }}>
            홈
          </Link>
          <Link to="/wallet" style={{ color: 'white', textDecoration: 'none' }}>
            Wallet
          </Link>
          <Link
            to="/question"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Question
          </Link>
        </>
      </nav>
    </header>
  );
};

export default Header;
