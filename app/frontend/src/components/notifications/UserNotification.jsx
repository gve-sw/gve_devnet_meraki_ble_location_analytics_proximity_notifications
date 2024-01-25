import PropTypes from 'prop-types';



const UserNotification = ({ message, onClose }) => {
    return (
        <div>
            <p>{message}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};


UserNotification.propTypes = {
    message: PropTypes.string.isRequired,
    notificationMessage: PropTypes.string,
    onClose: PropTypes.func, // Make onClose optional
};

export default UserNotification;
