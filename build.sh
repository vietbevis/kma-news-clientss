#!/bin/bash

HOST_IP=$(ip route get 1 | awk '{print $7; exit}')

echo "Building with HOST_IP: $HOST_IP"

docker build --build-arg NEXT_PUBLIC_API_ENDPOINT=http://$HOST_IP:8094 -t kma_client:v1.0.0 .
