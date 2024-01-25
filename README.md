# gve_devnet_meraki_ble_location_analytics_proximity_notifications
React web-app that logs the proximity of devices to access points. This leverages major an minor values in BLE beacons to send push notifications to end users when they are close to an access point. 


## Contacts
* Rey Diaz

## Solution Components
* Meraki Python SDK
*  React
*  FastAPI


## Prerequisites
#### Meraki API Keys
In order to use the Meraki API, you need to enable the API for your organization first. After enabling API access, you can generate an API key. Follow these instructions to enable API access and generate an API key:
1. Login to the Meraki dashboard
2. In the left-hand menu, navigate to `Organization > Settings > Dashboard API access`
3. Click on `Enable access to the Cisco Meraki Dashboard API`
4. Go to `My Profile > API access`
5. Under API access, click on `Generate API key`
6. Save the API key in a safe place. The API key will only be shown once for security purposes, so it is very important to take note of the key then. In case you lose the key, then you have to revoke the key and a generate a new key. Moreover, there is a limit of only two API keys per profile.

> For more information on how to generate an API key, please click [here](https://developer.cisco.com/meraki/api-v1/#!authorization/authorization). 

> Note: You can add your account as Full Organization Admin to your organizations by following the instructions [here](https://documentation.meraki.com/General_Administration/Managing_Dashboard_Access/Managing_Dashboard_Administrators_and_Permissions).


## Installation/Configuration
 1. Clone this repository with `git clone [repository name]`. To find the repository name, click the green `Code` button above the repository files. Then, the dropdown menu will show the https domain name. Click the copy button to the right of the domain name to get the value to replace [repository name] placeholder.
 ![git-clone.png](git-clone.png)



## Installation

### Backend

1. Navigate to the `backend` directory.
2. Create a `.env` file with the following structure and fill in your Meraki details:
    ```
    MERAKI_SECRET=YOUR_MERAKI_SECRET
    MERAKI_VALIDATOR=YOUR_MERAKI_VALIDATOR
    MERAKI_API_KEY=YOUR_MERAKI_API_KEY
    MERAKI_NETWORK_ID=YOUR_MERAKI_NETWORK_ID
    ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install the required npm packages:
    ```
    npm install
    ```

## Setting Up ngrok for Meraki Scanning API

1. Sign up or log in to your ngrok account.
2. Download and install ngrok from [ngrok's website](https://ngrok.com/download).
3. Connect your ngrok account by running: 
 ```
 ngrok authtoken <your_auth_token>
 ```
 Replace `<your_auth_token>` with your actual ngrok auth token.
4. Start an ngrok tunnel to your application's port (e.g., 5000 for Flask apps):
 ```
 ngrok http 5000
 ```
5. Use the HTTPS URL provided by ngrok as the URL for the Meraki Scanning API post URL.


## Usage

### Backend

Run the backend application with the following command:

```bash
$ python3 server.py
```

### Frontend

Start the frontend application by running:

```bash
$ npm run dev
```

This command should be executed within the `frontend` directory.


# Screenshots

![/IMAGES/0image.png](/IMAGES/0image.png)

### LICENSE

Provided under Cisco Sample Code License, for details see [LICENSE](LICENSE.md)

### CODE_OF_CONDUCT

Our code of conduct is available [here](CODE_OF_CONDUCT.md)

### CONTRIBUTING

See our contributing guidelines [here](CONTRIBUTING.md)

#### DISCLAIMER:
<b>Please note:</b> This script is meant for demo purposes only. All tools/ scripts in this repo are released for use "AS IS" without any warranties of any kind, including, but not limited to their installation, use, or performance. Any use of these scripts and tools is at your own risk. There is no guarantee that they have been through thorough testing in a comparable environment and we are not responsible for any damage or data loss incurred with their use.
You are responsible for reviewing and testing any scripts you run thoroughly before use in any non-testing environment.
