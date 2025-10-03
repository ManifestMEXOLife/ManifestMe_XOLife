#!/bin/bash

# register
curl -X POST http://localhost:4000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"email":"dina@example.com","password":"Passw0rd!","name":"Dina"}'

# login
curl -X POST http://localhost:4000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email":"dina@example.com","password":"Passw0rd!"}'

# create goal
curl -X POST http://localhost:4000/api/goals \
 -H "Content-Type: application/json" \
 -d '{"userId":1,"title":"Visualization habit","description":"30s video daily","category":"Personal Growth"}'

# create micro-goal
curl -X POST http://localhost:4000/api/goals/micro \
 -H "Content-Type: application/json" \
 -d '{"goalId":1,"title":"Watch 30s video","dueDate":"2025-10-01"}'

# request mock video
curl -X POST http://localhost:4000/api/videos/request \
 -H "Content-Type: application/json" \
 -d '{"goalId":1,"prompt":"I have a million dollars, happy and generous"}'