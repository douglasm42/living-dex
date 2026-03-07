require 'json'

REGIONS = [
  'kanto',
  'johto',
  'hoenn',
  'sinnoh',
  'unova',
  'kalos',
  'alola',
  'galar',
  'hisui',
  'paldea',
]

def get_region(name)
  REGIONS.select { |r| name.include?(r) && !name.end_with?('-cap') }.first
end

data = JSON.parse(File.read('pokemons_info.json'))

def build_pokemon(id, name, imagePath)
  puts "id: #{id}, name: #{name}, img: #{imagePath}"
  {
    id: id,
    name: name,
    imagePath: imagePath,
    region: get_region(name),
  }
end

default_pokemons = data.map do |pokemon|
  build_pokemon(
    pokemon['id'],
    pokemon['name'],
    pokemon['varieties'].select { |v| v['is_default'] }.first['default_sprite']
  )
end

default_female_pokemons = data.map do |pokemon|
  build_pokemon(
    pokemon['id'],
    pokemon['name'],
    pokemon['varieties'].select { |v| v['is_default'] }.first['female_sprite']
  )
end.select {|p| p[:imagePath] }

only_varieties = JSON.parse(File.read('pokemons_info.json')).map do |pokemon|
  pokemon['varieties'] = pokemon['varieties'].select { |v| (!v['is_default'] || v['forms'].size > 1 ) && !v['name'].include?('-mega') && !v['name'].include?('-gmax') && !v['name'].include?('-primal') }
  pokemon
end.select {|p| !p['varieties'].empty?  }

varieties = only_varieties.reduce([]) do |vars, pokemon|
  vars + pokemon['varieties'].map { |v| v['forms'].map{ |f| build_pokemon(pokemon['id'], f, v['default_sprite']) } }.flatten
end.select {|p| p[:imagePath] && !p[:name].end_with?('-female') && !p[:name].end_with?('-male') }

varieties_females = only_varieties.reduce([]) do |vars, pokemon|
  vars + pokemon['varieties'].map { |v| v['forms'].map{ |f| build_pokemon(pokemon['id'], f, v['female_sprite']) } }.flatten
end.select {|p| p[:imagePath] && !p[:name].end_with?('-female') && !p[:name].end_with?('-male') }

varieties = varieties.map do |pokemon|
  if pokemon[:id] == 201
    pokemon[:imagePath] = "201-#{pokemon[:name].match(/unown-(.*)/)[1]}.png"
  elsif pokemon[:id] == 412
    pokemon[:imagePath] = "412-#{pokemon[:name].match(/burmy-(.*)/)[1]}.png"
  elsif pokemon[:id] == 493
    pokemon[:imagePath] = "493-#{pokemon[:name].match(/arceus-(.*)/)[1]}.png" unless pokemon[:name] == 'arceus-normal'
  elsif pokemon[:id] == 666
    pokemon[:imagePath] = "666-#{pokemon[:name].match(/vivillon-(.*)/)[1]}.png"
  elsif pokemon[:id] == 676
    pokemon[:imagePath] = "676-#{pokemon[:name].match(/furfrou-(.*)/)[1]}.png"
  elsif pokemon[:id] == 669
    pokemon[:imagePath] = "669-#{pokemon[:name].match(/flabebe-(.*)/)[1]}.png"
  elsif pokemon[:id] == 670
    pokemon[:imagePath] = "670-#{pokemon[:name].match(/floette-(.*)/)[1]}.png"
  elsif pokemon[:id] == 671
    pokemon[:imagePath] = "671-#{pokemon[:name].match(/florges-(.*)/)[1]}.png"
  elsif pokemon[:id] == 773
    pokemon[:imagePath] = "773-#{pokemon[:name].match(/silvally-(.*)/)[1]}.png"
  elsif pokemon[:id] == 869
    pokemon[:imagePath] = "869-#{pokemon[:name].match(/alcremie-(.*)/)[1]}.png"
  elsif pokemon[:id] == 649
    pokemon[:imagePath] = "649#{pokemon[:name].match(/genesect(.*)/)[1]}.png"
  elsif pokemon[:id] == 585
    pokemon[:imagePath] = "585#{pokemon[:name].match(/deerling(.*)/)[1]}.png"
  elsif pokemon[:id] == 586
    pokemon[:imagePath] = "586#{pokemon[:name].match(/sawsbuck(.*)/)[1]}.png"
  end
  pokemon
end.select do |pokemon|
  ![414, 664, 665, 172].include?(pokemon[:id]) && !["greninja-battle-bond", "marowak-totem"].include?(pokemon[:name])
end

File.write('pokemons_data.json', JSON.pretty_generate({
  defaultPokemons: default_pokemons,
  defaultFemalePokemons: default_female_pokemons,
  varieties: varieties,
  varietiesFemales: varieties_females,
}))
