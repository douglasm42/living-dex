require 'json'
require 'digest/sha1'
require 'titleize'

RAW_DATA_FILENAME = 'scripts/pokemons_info.json'

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
  'gmax',
]

REGION_PREFIX = {
  'alola' => 'Alolan',
  'galar' => 'Galarian',
  'hisui' => 'Hisuian',
  'paldea' => 'Paldean',
  'gmax' => 'Gigantamax',
}

def get_region(variation)
  REGIONS.select { |r| variation.include?(r) && !variation.end_with?('-cap') }.first if variation
end

data = JSON.parse(File.read(RAW_DATA_FILENAME))

def build_title(name)
  name.split('-').join(' ').titleize
end

def build_sub_title(variation)
  return nil unless variation

  if variation == 'f'
    '♀'
  elsif variation
    variation.split('-')
             .reject{|n| %w[alola galar hisui paldea breed gmax].include?(n) && !variation.include?('-cap') }
             .map {|t| t == 'f' ? '♀' : t }
             .join(' ').titleize
  end
end

def title_region(region)

end

def cleanup_variation(name, variation)
  return nil unless variation

  variation.gsub(name, '')
           .split('-').compact.reject(&:empty?)
           .join('-')
end

def build_pokemon(id, name, variation, imagePath)
  variation = cleanup_variation(name, variation)
  region = get_region(variation)

  region_prefix = REGION_PREFIX[region]
  title = build_title(name)
  sub_title = build_sub_title(variation)

  {
    id: id,
    prefix: region_prefix,
    title: title,
    subTitle: sub_title,
    name: name,
    variation: variation,
    imagePath: imagePath,
    region: region,
  }
end

default_pokemons = data.map do |pokemon|
  build_pokemon(
    pokemon['id'],
    pokemon['name'],
    nil,
    pokemon['varieties'].select { |v| v['is_default'] }.first['default_sprite'],
  )
end

default_female_pokemons = data.select{ |p| p['has_gender_differences'] }.map do |pokemon|
  default_variety = pokemon['varieties'].select { |v| v['is_default'] }.first
  build_pokemon(
    pokemon['id'],
    pokemon['name'],
    'f',
    default_variety['female_sprite'] || default_variety['default_sprite'],
  )
end.select {|p| p[:imagePath] }

BAN_NAME_PARTS = %w[-mega -primal -meteor -zen -totem-alola -gulping -gorging -crowned eiscue-noice morpeko-hangry eternatus-eternamax calyrex-ice calyrex-shadow ogerpon-cornerstone-mask ogerpon-hearthflame-mask ogerpon-wellspring-mask terapagos-terastal terapagos-stellar palafin-hero -totem necrozma-dusk necrozma-dawn necrozma-ultra wishiwashi-school]
BAN_NAMES = %w[zygarde-complete zygarde-10]
BAN_IDS = [351, 493, 649, 773, 778, 483, 484, 487, 421, 646, 716]

def is_banned?(variety)
  (
    (!variety['is_default'] || variety['forms'].size > 1 ) &&
      BAN_NAME_PARTS.all? {|n| !variety['name'].include?(n) } &&
      !BAN_NAMES.include?(variety['name'])
  )
end

only_varieties = JSON.parse(File.read(RAW_DATA_FILENAME)).select {|p| !BAN_IDS.include?(p['id']) }.map do |pokemon|
  pokemon['varieties'] = pokemon['varieties'].select {|v| is_banned?(v) }
  pokemon
end.select {|p| !p['varieties'].empty?}

varieties = only_varieties.reduce([]) do |vars, pokemon|
  vars + pokemon['varieties'].map do |v|
    v['forms'].map do |f|
      build_pokemon(pokemon['id'], pokemon['name'], f, v['default_sprite'])
    end + v['forms'].map do |f|
      build_pokemon(pokemon['id'], pokemon['name'], "#{f}-f", v['female_sprite'])
    end
  end.flatten
end.select {|p| p[:imagePath] && !p[:variation].end_with?('female') && !p[:variation].end_with?('male') }

varieties = varieties.map do |pokemon|
  if pokemon[:id] == 25 && pokemon[:subTitle].include?('Cap')
    pokemon[:subTitle] = pokemon[:subTitle].gsub(' Cap', '')
  elsif pokemon[:id] == 201
    pokemon[:imagePath] = "201-#{pokemon[:variation]}.png"
    pokemon[:subTitle] = pokemon[:subTitle].gsub('Unown ', '')
  elsif pokemon[:id] == 412
    pokemon[:imagePath] = "412-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 666
    pokemon[:imagePath] = "666-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 676
    pokemon[:imagePath] = "676-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 669
    pokemon[:imagePath] = "669-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 670
    pokemon[:imagePath] = "670-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 671
    pokemon[:imagePath] = "671-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 869 && pokemon[:region] != 'gmax'
    pokemon[:imagePath] = "869-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 585
    pokemon[:imagePath] = "585-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 586
    pokemon[:imagePath] = "586-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 422
    pokemon[:imagePath] = "422-#{pokemon[:variation]}.png"
  elsif pokemon[:id] == 423
    pokemon[:imagePath] = "423-#{pokemon[:variation]}.png"
  elsif pokemon[:imagePath] == "893-dada.png"
    pokemon[:imagePath] = "10192.png"
  end

  pokemon
end.select do |pokemon|
  ![414, 664, 665, 172].include?(pokemon[:id]) && !["battle-bond", "totem"].include?(pokemon[:variation])
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
  variation_sufix = p[:variation]
  if p[:id] == 869
    variation_sufix = variation_sufix.gsub('-sweet', '')
  end

  p[:uuid] = unique_uuid("#{p[:id]}-#{variation_sufix}")
  p
end

def ordering_name(id, name)
  return nil unless name

  oname = name.gsub('spring', 'a')
              .gsub('summer', 'b')
              .gsub('autumn', 'c')
              .gsub('winter', 'd')
              .gsub('small', 'a')
              .gsub('large', 'b')
              .gsub('super', 'c')
              .gsub('white', '0white')
              .gsub('red', '1red')
              .gsub('orange', '2orange')
              .gsub('yellow', '3yellow')
              .gsub('green', '4green')
              .gsub('blue', '5blue')
              .gsub('indigo', '6indigo')
              .gsub('violet', '7violet')
              .gsub('black', '8black')
              .gsub('flower', '1flower')         # orange
              .gsub('star', '2star')             # yellow
              .gsub('clover', '3clover')         # green
              .gsub('berry', '4berry')           # blue
              .gsub('ribbon', '5ribbon')         # purple
              .gsub('strawberry', '6strawberry') # pink
              .gsub('love', '7love')             # light pink
              .gsub('natural', '0natural')
              .gsub('exclamation', 'z-exclamation')
              .gsub('question', 'z-question')
  
  oname = oname.gsub(/^(.+?)-(.+?)-(.+?)-(.+?)$/, '\3-\2-\1') if id == 869

  oname
end

def edit_entry(elements, uuid)
  entry = elements.find {|p| p[:uuid] == uuid }
  yield(entry)
end

edit_entry(varieties, '849-amped-gmax') do |p|
  p[:prefix] = nil
  p[:subTitle] = 'Amped'
  p[:variation] = 'amped'
  p[:region] = nil
  p[:uuid] = '849-amped'
  p[:imagePath] = '849.png'
end

edit_entry(varieties, '849-low-key-gmax') do |p|
  p[:prefix] = 'Gigantamax'
  p[:subTitle] = nil
  p[:variation] = 'gmax'
  p[:uuid] = '849-gmax'
end

varieties << {
  id: 413,
  prefix: nil,
  title: "Wormadam",
  subTitle: "Plant",
  name: "wormadam",
  variation: "plant",
  imagePath: "413.png",
  region: nil,
  uuid: "413-plant",
}

varieties << {
  id: 550,
  prefix: nil,
  title: "Basculin",
  subTitle: "Red Striped",
  name: "basculin",
  variation: "red-striped",
  imagePath: "550.png",
  region: nil,
  uuid: "550-red-striped"
}

varieties << {
  id: 931,
  prefix: nil,
  title: "Squawkabilly",
  subTitle: "Green Plumage",
  name: "squawkabilly",
  variation: "green-plumage",
  imagePath: "931.png",
  region: nil,
  uuid: "931-green-plumage"
}

varieties << {
  id: 978,
  prefix: nil,
  title: "Tatsugiri",
  subTitle: "Curly",
  name: "tatsugiri",
  variation: "curly",
  imagePath: "978.png",
  region: nil,
  uuid: "978-curly"
}

all_entries = default_pokemons + default_female_pokemons + varieties
all_entries.each do |entry|
  duplicates = all_entries.select { |e| e[:uuid] == entry[:uuid] }
  raise "Duplicate uuids for: #{duplicates}" if duplicates.size != 1
end

result = {
  defaultPokemons: default_pokemons.sort_by { |a| [a[:id], ordering_name(a[:id], a[:variation])] },
  defaultFemalePokemons: default_female_pokemons.sort_by { |a| [a[:id], ordering_name(a[:id], a[:variation])] },
  varieties: varieties.sort_by { |a| [a[:id], ordering_name(a[:id], a[:variation])] },
}

def assert_no_missing_on_second(message, first_list, second_list, compare = false)
  missing = []
  first_list.each do |first_record|
    second_record = second_list.find { |p| p[:uuid] == first_record[:uuid] }
    missing << "- Missing UUID: #{first_record[:name]}:#{first_record[:variation]} ##{first_record[:uuid]}" unless second_record
    if compare
      missing << "- Different Image: #{first_record[:name]}:#{first_record[:variation]} #{first_record[:imagePath]} -> #{second_record[:imagePath]}" unless second_record[:imagePath] == first_record[:imagePath]
    end
  end

  return false if missing.empty?

  puts "#{message}:"
  puts missing.join("\n")
  true
end

def assert_no_changes_to_uuid(result)
  old = JSON.parse(File.read('./src/assets/pokemons_data.json'), symbolize_names: true)

  misses = false
  misses = misses || assert_no_missing_on_second('Not found on new.default', old[:defaultPokemons], result[:defaultPokemons], true)
  misses = misses || assert_no_missing_on_second('Not found on old.default', result[:defaultPokemons], old[:defaultPokemons])

  misses = misses || assert_no_missing_on_second('Not found on new.females', old[:defaultFemalePokemons], result[:defaultFemalePokemons], true)
  misses = misses || assert_no_missing_on_second('Not found on old.females', result[:defaultFemalePokemons], old[:defaultFemalePokemons])

  misses = misses || assert_no_missing_on_second('Not found on new.varieties', old[:varieties], result[:varieties], true)
  misses = misses || assert_no_missing_on_second('Not found on old.varieties', result[:varieties], old[:varieties])
  
  raise "Skipping write because the new version isn't compatible" if misses
end

File.write('./src/assets/pokemons_data.json', JSON.pretty_generate(result))
puts "Completed"
