
import PropTypes from 'prop-types';
import Header from '../core/NavBar';
import Footer from '../core/Footer';

import './layout.css'; // Import your CSS file for styling

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
      <Header />
      <div className="body-section">
        <main>
          {children}
        </main>
      </div>
      <Footer />
    </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node,
};

export default Layout;
