require 'json'
require 'digest/sha1'
require 'titleize'

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

def build_pokemon(id, name, imagePath, species_name)
  title = name.split('-').select{|n| !%w[alola galar hisui paldea breed].include?(n) || id == 25}.join(' ').titleize
  {
    id: id,
    title: title,
    fullTitle: title,
    name: name,
    imagePath: imagePath,
    region: get_region(name),
    species_name: species_name,
  }
end

default_pokemons = data.map do |pokemon|
  build_pokemon(
    pokemon['id'],
    pokemon['name'],
    pokemon['varieties'].select { |v| v['is_default'] }.first['default_sprite'],
    pokemon['name']
  )
end

default_female_pokemons = data.select{ |p| p['has_gender_differences'] }.map do |pokemon|
  default_variety = pokemon['varieties'].select { |v| v['is_default'] }.first
  build_pokemon(
    pokemon['id'],
    pokemon['name'],
    default_variety['female_sprite'] || default_variety['default_sprite'],
    pokemon['name']
  )
end.select {|p| p[:imagePath] }

BAN_NAMES = %w[-mega -gmax -primal -meteor -zen -totem-alola -gulping -gorging -crowned eiscue-noice morpeko-hangry eternatus-eternamax calyrex-ice calyrex-shadow ogerpon-cornerstone-mask ogerpon-hearthflame-mask ogerpon-wellspring-mask terapagos-terastal terapagos-stellar palafin-hero -totem necrozma-dusk necrozma-dawn necrozma-ultra wishiwashi-school]
BAN_IDS = [351, 493, 649, 773, 778, 483, 484, 487, 421, 646]

def is_banned?(variety)
  (
    (!variety['is_default'] || variety['forms'].size > 1 ) &&
      BAN_NAMES.all? {|n| !variety['name'].include?(n) }
  )
end

only_varieties = JSON.parse(File.read('pokemons_info.json')).select {|p| !BAN_IDS.include?(p['id']) }.map do |pokemon|
  pokemon['varieties'] = pokemon['varieties'].select {|v| is_banned?(v) }
  pokemon
end.select {|p| !p['varieties'].empty?}

varieties = only_varieties.reduce([]) do |vars, pokemon|
  vars + pokemon['varieties'].map do |v|
    v['forms'].map do |f|
      build_pokemon(pokemon['id'], f, v['default_sprite'], pokemon['name'])
    end
  end.flatten
end.select {|p| p[:imagePath] && !p[:name].end_with?('-female') && !p[:name].end_with?('-male') }

varieties_females = only_varieties.reduce([]) do |vars, pokemon|
  vars + pokemon['varieties'].map do |v|
    v['forms'].map do |f|
      build_pokemon(pokemon['id'], f, v['female_sprite'], pokemon['name'])
    end
  end.flatten
end.select {|p| p[:imagePath] && !p[:name].end_with?('-female') && !p[:name].end_with?('-male') }

varieties = varieties.map do |pokemon|
  if pokemon[:id] == 25 && pokemon[:title].include?('Cap')
    pokemon[:title] = pokemon[:title].gsub('Pikachu ', '').gsub(' Cap', '')
  elsif pokemon[:id] == 201
    pokemon[:imagePath] = "201-#{pokemon[:name].match(/unown-(.*)/)[1]}.png"
    pokemon[:title] = pokemon[:title].gsub('Unown ', '')
  elsif pokemon[:id] == 412
    pokemon[:imagePath] = "412-#{pokemon[:name].match(/burmy-(.*)/)[1]}.png"
  elsif pokemon[:id] == 493
    pokemon[:imagePath] = "493-#{pokemon[:name].match(/arceus-(.*)/)[1]}.png" unless pokemon[:name] == 'arceus-normal'
  elsif pokemon[:id] == 666
    pokemon[:imagePath] = "666-#{pokemon[:name].match(/vivillon-(.*)/)[1]}.png"
    pokemon[:title] = pokemon[:title].gsub('Vivillon ', '')
  elsif pokemon[:id] == 676
    pokemon[:imagePath] = "676-#{pokemon[:name].match(/furfrou-(.*)/)[1]}.png"
    pokemon[:title] = pokemon[:title].gsub('Furfrou ', '')
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
    pokemon[:title] = pokemon[:title].gsub('Alcremie ', '').gsub(' Sweet', '')
  elsif pokemon[:id] == 649
    pokemon[:imagePath] = "649#{pokemon[:name].match(/genesect(.*)/)[1]}.png"
  elsif pokemon[:id] == 585
    pokemon[:imagePath] = "585#{pokemon[:name].match(/deerling(.*)/)[1]}.png"
  elsif pokemon[:id] == 586
    pokemon[:imagePath] = "586#{pokemon[:name].match(/sawsbuck(.*)/)[1]}.png"
  elsif pokemon[:id] == 422
    pokemon[:imagePath] = "422#{pokemon[:name].match(/shellos(.*)/)[1]}.png"
  elsif pokemon[:id] == 423
    pokemon[:imagePath] = "423#{pokemon[:name].match(/gastrodon(.*)/)[1]}.png"
  elsif pokemon[:imagePath] == "893-dada.png"
    pokemon[:imagePath] = "10192.png"
  end
  pokemon
end.select do |pokemon|
  ![414, 664, 665, 172].include?(pokemon[:id]) && !["greninja-battle-bond", "marowak-totem"].include?(pokemon[:name])
end

default_pokemons = default_pokemons.map do |p|
  p[:uuid] = "#{p[:id]}"
  p
end

default_female_pokemons = default_female_pokemons.map do |p|
  p[:uuid] = "#{p[:id]}-f"
  p
end

$used_uuids = {}
def unique_uuid(uuid)
  final_uuid = uuid
  if $used_uuids[uuid]
    $used_uuids[uuid] = $used_uuids[uuid] + 1
    final_uuid = "#{uuid}-v#{$used_uuids[uuid]}"
  else
    $used_uuids[uuid] = 1
  end
  final_uuid 
end

varieties = varieties.map do |p|
  variation_sufix = p[:name].gsub(p[:species_name], '')
  if p[:id] == 869
    variation_sufix = variation_sufix.gsub('-sweet', '')
  end

  p[:uuid] = unique_uuid("#{p[:id]}#{variation_sufix}")
  p
end

varieties_females = varieties_females.map do |p|
  variation_sufix = p[:name].gsub(p[:species_name], '')

  p[:uuid] = unique_uuid("#{p[:id]}#{variation_sufix}-f")
  p
end

File.write('pokemons_data.json', JSON.pretty_generate({
  defaultPokemons: default_pokemons,
  defaultFemalePokemons: default_female_pokemons,
  varieties: varieties,
  varietiesFemales: varieties_females,
}))
