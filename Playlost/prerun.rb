#!/usr/bin/ruby

require "rubygems"

begin
  gem "ruby-mp3info"
rescue LoadError
  puts ARGV[0]
  pathEndIdx = ARGV[0].rindex('/')
  output_dir = ARGV[0].slice( 0, pathEndIdx )
  puts output_dir
  
  gem_path = output_dir + "/ruby/ruby-mp3info-0.6.13.gem"
  #gem_path = "./ruby/ruby-mp3info-0.6.13.gem"
  
  install_command = "gem install " + gem_path + " >> " + output_dir + "/install_out.txt"
  puts install_command
  puts "Gem mp3info not installed. Attempting install...\n"
  puts system( install_command )
end