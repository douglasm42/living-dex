require 'json'
require 'rmagick'

PATH = 'sprites/pokemon/other/home/'
ROOT = '/home/douglas/projects/pokeapi/data/v2/sprites/'

$atlas_map = {}

def generate_atlas(filenames, atlas_index)
  columns = 10
  rows = 15
  image_list = Magick::ImageList.new

  filenames.each_with_index do |filename, index|
    puts "Reading #{filename}... p#{index%columns}:#{index/columns}"
    $atlas_map[filename] = {
      sheet: atlas_index,
      x: index%columns,
      y: index/columns,
    }
    image_list.read("#{ROOT}#{PATH}#{filename}")
  end

  puts "Building Atlas ##{atlas_index}..."
  atlas = image_list.montage do |options|
    options.background_color = 'transparent'
    options.geometry = Magick::Geometry.new(256, 256, 0, 0)
    options.tile = Magick::Geometry.new(columns,rows)
  end

  puts "Saving Atlas atlas_#{atlas_index}.png..."
  atlas.write("./public/atlas_#{atlas_index}.png")
end

filenames = []

data = JSON.parse(File.read('../src/assets/pokemons_data.json'))

data['defaultPokemons'].each do |pokemon|
  filenames << pokemon['imagePath']
end

data['defaultFemalePokemons'].each do |pokemon|
  filenames << pokemon['imagePath']
end

data['varieties'].each do |pokemon|
  filenames << pokemon['imagePath']
end

filenames.uniq!

index = 0
filenames.each_slice(150) do |chunk|
  generate_atlas(chunk, index)
  index += 1
end

File.write('./src/assets/atlas_sprite_map.json', JSON.pretty_generate($atlas_map))
