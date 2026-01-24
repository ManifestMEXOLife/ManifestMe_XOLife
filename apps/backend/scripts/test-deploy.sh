#!/bin/bash
API_URL="http://your-eb-url.us-east-1.elasticbeanstalk.com"

echo "Testing / endpoint..."
curl -f $API_URL/ || { echo "Endpoint test failed!"; exit 1; }

echo "All tests passed!"
