import { Component } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

class MerakiDataComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: null,
    };
  }

  componentDidMount() {
    this.startListeningForEvents();
  }

  componentWillUnmount() {
    this.stopListeningForEvents();
  }

  startListeningForEvents = () => {
    this.eventSource = new EventSource('http://localhost:8000/events');
    this.eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        this.setState({ data: newData, error: null });
      } catch (error) {
        console.error('Error parsing SSE data:', error);
        this.setState({ error: 'Error parsing SSE data' });
      }
    };
    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      this.setState({ error: 'SSE Error' });
    };
  };

  stopListeningForEvents = () => {
    if (this.eventSource) {
      this.eventSource.close();
    }
  };

  render() {
    const { data, error } = this.state;

    return (
      <div>
        <Typography variant="h5" style={{ margin: '20px 0' }}>
          Meraki Scanning Data
        </Typography>
        {error && (
          <Typography variant="body1" style={{ color: 'red' }}>
            {error}
          </Typography>
        )}
        <TableContainer component={Paper} style={{ maxHeight: 400, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Client MAC</TableCell>
                <TableCell>UUID</TableCell>
                <TableCell>Major</TableCell>
                <TableCell>Minor</TableCell>
                <TableCell>Nearest AP MAC</TableCell>
                <TableCell>Nearest AP RSSI</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((observation, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{observation.name || 'N/A'}</TableCell>
                  <TableCell>{observation.client_mac || 'N/A'}</TableCell>
                  <TableCell>{observation.uuid || 'N/A'}</TableCell>
                  <TableCell>{observation.major || '0'}</TableCell>
                  <TableCell>{observation.minor || '0'}</TableCell>
                  <TableCell>{observation.nearest_ap_mac || 'N/A'}</TableCell>
                  <TableCell>{observation.nearest_ap_rssi || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default MerakiDataComponent;
