#!/bin/bash
# Your script starts here

while true
do
    sudo grep '^CLIENT_LIST' /var/log/openvpn/openvpn-status.log | awk -F',' '{print $2, $3, $4, $5, $6}'
    sleep 3  # Adjust the sleep duration as needed
    clear
done
