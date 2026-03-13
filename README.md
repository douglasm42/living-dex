# Living Dex

Checklist to build a living dex including HOME storable alternate forms and variations.

- [x] Fix this README
  - [x] How to run?
  - [x] How to deploy?
- [x] Remove forms that are not storable.
- [x] Add torchick back and other female variations that may have been removed by mistake. (difference can be in the back)
- [x] Make sure images match
- [x] Remove duplicates
- [x] Use catppuccin theme with dark/light variations and toggle at the top.
- [x] Add an export/import feature to save living dex data locally.
- [x] Make the catch toggle faster.
  - [x] Change the storage to use a key for each pokemon.
  - [x] Change the Pokemon to register a callback on load so the storage can redraw everything when imported.
- [ ] Add modal box to show pokemon info
- [ ] Merge the two generate scripts (`src/assets/parse_pokemon_info.rb` and
      `src/assets/generate_pokemon_info.py`) and move them into a scripts folder.


## Development

To setup after a clone, do:

1. `nvm install`
2. `npm install -g pnpm`
3. `pnpm install`

To run, use this `pnpm dev`

To deploy, just push to main.

### Scripts

- `src/assets/parse_pokemon_info.rb` - This one is used to parse the pokemons_info.json
  file and build the pokemons_data.json ready to be use by the app.
- `src/assets/generate_pokemon_info.py` - This one can be used to pull the pokemon info from PokeAPI and generate the pokemons_info.json file.
