# Living Dex

Checklist to build a living dex including HOME storable alternate forms and variations.

## Roadmap

- [ ] Use atlas for loading pokemon images.
- [ ] Add internationalization
- [ ] Add fuzzy search
- [ ] Add modal box to show basic pokemon info including type
- [ ] Experiment with a spritesheet for showing the pokemon images.

## Development

To setup after a clone, do:

1. `nvm install`
2. `npm install -g pnpm`
3. `pnpm install`

To run, use this `pnpm dev`
~~~~
To deploy, just push to main.

### Scripts

- `src/assets/parse_pokemon_info.rb` - This one is used to parse the pokemons_info.json
  file and build the pokemons_data.json ready to be use by the app.
- `src/assets/generate_pokemon_info.py` - This one can be used to pull the pokemon info from PokeAPI and generate the pokemons_info.json file.
