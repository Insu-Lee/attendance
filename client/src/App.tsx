import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Main from './pages/Main';
import Wallet from './pages/Wallet';
import Header from './components/Header';
import Questions from './pages/Questions';

function App() {
  const [address, setAddress] = useState<string | null>(
    sessionStorage.getItem('address') || null
  );
  const [balance, setBalance] = useState<string | null>(null);

  return (
    <Router basename="/attendance">
      <Header />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/wallet" replace />} />
          <Route path="/main" element={<Main />} />
          <Route
            path="/wallet"
            element={
              <Wallet
                address={address}
                setAddress={setAddress}
                balance={balance}
                setBalance={setBalance}
              />
            }
          />
          <Route
            path="/question"
            element={
              <Questions
                address={address}
                balance={balance}
                setBalance={setBalance}
              />
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
