import { Component } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';

class MerakiDashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      notifications: [],
      showNotification: false,
      currentNotification: null,
      notificationSentForDevice: {},
    };
  }

  componentDidMount() {
    this.startListeningForEvents();
  }

  componentWillUnmount() {
    this.stopListeningForEvents();
  }

  startListeningForEvents = () => {
    // Initialize the EventSource and handle events
    this.eventSource = new EventSource('http://localhost:8000/events');
    this.eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        this.setState({ data: newData }, () => {
          this.checkForNotifications(newData);
        });
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
    };
  };

  stopListeningForEvents = () => {
    // Close the EventSource connection if it exists
    if (this.eventSource) {
      this.eventSource.close();
    }
  };

  checkForNotifications = (newData) => {
    const { notificationSentForDevice } = this.state;

    newData.forEach((device) => {
      if (device.nearest_ap_rssi > -50 && !notificationSentForDevice[device.id]) {
        // Check if RSSI is greater than -40 and a notification hasn't been sent for this device
        const timestamp = new Date().toLocaleString(); // Get the current timestamp
        const notificationWithTimestamp = { ...device, timestamp }; // Add timestamp to the notification object
        this.setState((prevState) => ({
          notifications: [...prevState.notifications, notificationWithTimestamp],
          showNotification: true,
          currentNotification: device,
          notificationSentForDevice: {
            ...prevState.notificationSentForDevice,
            [device.id]: true, // Mark the device as notified
          },
        }));
      }
    });
  };

  closeNotification = () => {
    this.setState({ showNotification: false, currentNotification: null });
  };

  renderNotificationTable() {
    const { currentNotification } = this.state;
    if (!currentNotification) {
      return null;
    }

    return (
      <TableContainer component={Paper}>
        <Table aria-label="Notification Details">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Device
              </TableCell>
              <TableCell>{currentNotification.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                RSSI
              </TableCell>
              <TableCell>{currentNotification.nearest_ap_rssi}</TableCell>
            </TableRow>
            {/* Add more rows for additional details */}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  render() {
    const { data, notifications, showNotification, currentNotification } = this.state;

    return (
      <div>
        <Typography variant="h5" style={{ margin: '20px 0' }}>
          Meraki Dashboard
        </Typography>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h6">Condensed Device List</Typography>
              <TableContainer>
                <Table aria-label="Device List">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>RSSI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((device, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{device.name || 'N/A'}</TableCell>
                        <TableCell>{device.nearest_ap_rssi}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          <div style={{ flex: 1, marginLeft: '10px' }}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h6">Notifications</Typography>
              <List>
  {notifications.map((notification, index) => (
    <ListItem key={index}>
      <ListItemText
        primary={`Device: ${notification.name}`}
        secondary={`RSSI: ${notification.nearest_ap_rssi}`}
        secondaryTypographyProps={{ component: 'span', variant: 'body2', color: 'text.primary' }}
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">{notification.timestamp}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.setState({ currentNotification: notification })}
          style={{ marginLeft: '10px' }} // Add some spacing between timestamp and button
        >
          More Info
        </Button>
      </div>
    </ListItem>
  ))}
</List>
            </Paper>
          </div>
        </div>
        <Snackbar open={showNotification} autoHideDuration={6000} onClose={this.closeNotification}>
          <Alert onClose={this.closeNotification} severity="info" sx={{ width: '100%' }}>
            {currentNotification ? `Notification for ${currentNotification.name}: RSSI ${currentNotification.nearest_ap_rssi}` : ''}
          </Alert>
        </Snackbar>
        {currentNotification && (
          <Card style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
            <CardContent>
              <Typography variant="h6">Notification Details</Typography>
              {this.renderNotificationTable()}
              <Button variant="contained" color="primary" onClick={this.closeNotification}>
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
}

export default MerakiDashboardComponent;
