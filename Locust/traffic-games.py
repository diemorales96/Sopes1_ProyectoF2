import time
from locust import HttpUser, task
import json
import random

class QuickstartUser(HttpUser):
    games = []
    with open('games.json') as json_file:
        data = json.load(json_file)
        games.extend(data)

    @task
    def insercion_juego(self):
        time.sleep(1)
        response = self.client.post("/api/exec-game",json=random.choice(self.games))
        json_response_dict = response.json()
        print(response.json())
       