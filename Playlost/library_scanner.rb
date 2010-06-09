require 'rubygems'
require 'mp3info'

puts "Playlost Library Scanner\n"
autogen_file = File.new( "./scripts/autogen_playlist.js", "w+" )

dir_base = ARGV[0]
if( dir_base.nil? )
  puts "Usage: library_scanner music_directory"
  Process.exit
end

mp3_filename_array = Array.new()

dir_array = Array.new();
dir_array << dir_base

dir_array.each{ |directory|

  Dir.chdir( directory )
  files = Dir.glob( "*" )

  files.each { | file |
	
	# Check if files is a directory
	if( File.directory?( file ) )
	  full_dir_path = directory + file + "/"
      puts "#{full_dir_path} is a directory\n"
	  dir_array << full_dir_path
    end
	
	# Check if file is an mp3
	filename_length = file.size
	if( filename_length >= 5 )
	  extension = file[ filename_length - 4, filename_length - 1 ]
	  if( extension == ".mp3" )
	    puts "#{file} is an mp3\n"
		mp3_filename_array << directory + file
	  end
	end
  }
}




autogen_file.puts( "function Setup_Autogen_Song_Database()\n" )
autogen_file.puts( "{\n" );
autogen_file.puts( "this.list_length = #{mp3_filename_array.size};\n" )
autogen_file.puts( "this.list = new Array( this.list_length );\n" )

mp3_idx = 0;
mp3_filename_array.each{ |mp3_filename|
  mp3 = Mp3Info.open( mp3_filename )

  album = mp3.tag.album
  artist = mp3.tag.artist
  title = mp3.tag.title
  filename = mp3_filename
  puts "Title: #{title}\tArtist:#{artist}\Album:#{album}\n"
  autogen_file.puts( "this.list[#{mp3_idx}] = new Song( \"#{title}\", \"#{artist}\", \"#{filename}\" );\n" )
  mp3.close()
  
  mp3_idx += 1
}
autogen_file.puts( "}\n" )
autogen_file.close()