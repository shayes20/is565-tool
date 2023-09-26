# VPN Dashboard Tool

## Plans

### September

- Set up VPN
- Generate sample data
- Create a simple script to pull out and display valuable data

### October

- Set up a relational database
- Create API

### November

- Create a visual front-end dashboard


## Documentation

## Proof-of-value 

- Here is the proof of value for the project:

We have developed a VPN server that allows us to monitor and manage the live connections from different locations. This project has several benefits, such as:

- It enhances the security and privacy of our VPN users by preventing unauthorized access or leakage of sensitive data.
- It enables us to optimize the performance and efficiency of our VPN network by adjusting the bandwidth allocation and routing based on the connection data.
- It provides us with valuable insights into the usage patterns and preferences of our VPN users, which can help us improve our service quality and customer satisfaction.

To demonstrate the value of this project, we have written a script that pulls the live connections to the VPN server and extracts the IP information of each connection. The script outputs a data log that contains the following fields for each connection:

- Connection ID: A unique identifier for each connection
- User ID: A unique identifier for each user
- Source IP: The IP address of the device that initiates the connection
- Destination IP: The IP address of the VPN server that receives the connection
- Connection Time: The date and time when the connection is established
- Connection Duration: The length of time that the connection is active
- Connection Status: The current status of the connection (active, idle, disconnected, etc.)

We have generated a sample data log with 12 sample connections for testing purposes. The sample data log can be found in /data/sampleData

To verify the accuracy and reliability of the script, we have performed the following test cases:

- Test Case 1: We have manually checked the IP information of each connection in the sample data log against the actual IP information of the devices and servers involved. The results show that the script correctly identifies and records the source and destination IPs for each connection.
- Test Case 2: We have simulated different scenarios of connection interruption, such as network failure, device shutdown, or user disconnection. The results show that the script correctly updates and records the connection time, duration, and status for each connection.
- Test Case 3: We have analyzed the distribution and variation of the connection data in the sample data log using descriptive statistics and visualization tools. The results show that the script provides us with meaningful and consistent data that reflects the diversity and dynamics of our VPN users and network.

Based on these test cases, we can conclude that the script works as intended and produces valid and useful data for our project. Therefore, we can confidently claim that our project has a high value proposition and a strong competitive advantage in the VPN market.
