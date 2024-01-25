import PropTypes from 'prop-types';

// Define the component first
const DeviceTable = ({ devices }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Device ID</th>
                    <th>Distance</th>
                </tr>
            </thead>
            <tbody>
                {devices.map(device => (
                    <tr key={device.id}>
                        <td>{device.id}</td>
                        <td>{device.distance}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// Then set propTypes
DeviceTable.propTypes = {
    devices: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            distance: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default DeviceTable;