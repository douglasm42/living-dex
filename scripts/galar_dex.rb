require 'json'

galar_mons = File.read('./scripts/galar_dex.txt').split("\n")

data = JSON.parse(File.read('./src/assets/pokemons_data.json'))

defaultPokemons = data['defaultPokemons']

galarian = []
not_galarian = []


galar_mons.each do |name|
  pokemon = defaultPokemons.find {|p| p['name'] == name.downcase.gsub('.', '').gsub(':', '').gsub(' ', '-').gsub('\'', '') }

  if pokemon
    id = pokemon['id']
    if id >= 810 && id <= 905
      galarian << id
    else
      not_galarian << id
    end
  else
    puts "#{name} not found!!!!! ------------"
  end
end

puts 'Galarian mons:'
galarian.each do |id|
  puts id
end

puts 'Not Galarian mons:'
not_galarian.each do |id|
  puts "#{id},"
end



