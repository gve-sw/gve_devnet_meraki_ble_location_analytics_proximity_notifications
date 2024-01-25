import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/layout';
import DeviceTable from './components/tables/DeviceTable';
import UserNotification from './components/notifications/UserNotification';
import HomePage from './components/pages/home'; // Import the HomePage component
import DistanceDataComponent from './components/pages/tablepage'; // Import the HomePage component
import NotificationPage from './components/pages/notificationpage';

function App() {
  const [devices] = useState([]); // Mock data or fetch from API
  const [notification, setNotification] = useState('');

  const handleTriggerCoupon = (deviceId) => {
    // Logic to trigger coupon for a specific device
    setNotification(`Coupon sent to device ${deviceId}`);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/devices" element={<DeviceTable devices={devices} onTriggerCoupon={handleTriggerCoupon} />} />
          <Route path="/notifications" element={<UserNotification message={'hello, below is the users perspective'} notificationMessage={notification} />} />
          <Route path="/" element={<HomePage />} /> {/* Updated this line */}
          <Route path="/tablepage" element={<DistanceDataComponent />} />
          <Route path="/NotificationPage" element={<NotificationPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
