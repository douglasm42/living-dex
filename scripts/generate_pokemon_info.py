import requests
import json

def getData(url):
  print(url)
  response = requests.get(url)
  if response.status_code == 200:
    return response.json()
  else:
    print(f"Request failed with status code: {response.status_code}")
    raise Error("failed to get response")


def getPokemon(url):
  data = getData(url)

  result = {
    "id": data["id"],
    "name": data["name"],
    "has_gender_differences": data["has_gender_differences"],
    "varieties": [],
  }

  for v in data["varieties"]:
    result["varieties"].append(getVariations(v["pokemon"]["url"], v["pokemon"]["name"]))

  return result

def getVariations(url, is_default):
  data = getData(url)

  result = {
    "is_default": data["is_default"],
    "name": data["name"],
    "forms": [],
    "default_sprite": data["sprites"]["other"]["home"]["front_default"],
    "female_sprite": data["sprites"]["other"]["home"]["front_female"]
  }

  for f in data["forms"]:
    result["forms"].append(getForm(f["url"]))

  return result

def getForm(url):
  data = getData(url)

  return {
    "is_default": data["is_default"],
    "name": data["name"],
    "id": data["id"],
    "types": list(map(lambda x: x["type"]["name"], data["types"]))
  }

def getAllPokemons():
  data = getData('http://127.0.0.1:8000/api/v2/pokemon-species/?limit=2000')
  pokemons = []

  for pokemon in data['results']:
    pinfo = getPokemon(pokemon['url'])
    pokemons.append(pinfo)

  return pokemons

pokemons = getAllPokemons()

file_path = "pokemons_info.json"
with open(file_path, "w") as json_file:
    # Use json.dump() to write the dictionary directly to the file
    json.dump(pokemons, json_file, indent=2) # 'indent=4' makes the file human-readable

print(f"Dictionary successfully saved to {file_path}")