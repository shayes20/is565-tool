#!/bin/bash
# Your script starts here

sudo grep ‘^CLIENT_LIST’ /var/log/openvpn/openvpn-status.log | awk -F’,' ‘{print $2, $3, $4, $5, $6}’