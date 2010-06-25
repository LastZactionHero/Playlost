#!/usr/bin/ruby

require "rubygems"


# Replace Non Ascii Characters
class String 
  def remove_nonascii(replacement) 
    n = self.split( "" ) 
    self.slice!(0..self.size) 
    n.each{ |b| 
	  if b[0].to_i< 32 || b[0].to_i>127 || b[0].to_i == 34 then 
	    self.concat(replacement) 
	  else 
	    self.concat(b) 
      end 
    } 
    self.to_s 
  end 
end 


# MP3 Tag Class
class MP3_Tag
  attr_accessor :title, :artist, :default
end


# Extract MP3 tag information from a file
def get_id3_tag( filename )
  ret = MP3_Tag.new
  
  # Set up default value incase tag extraction fails
  tag_default_start = filename.rindex( '/' )
  tag_default_end = filename.length
  tag_default = filename.slice( tag_default_start + 1, tag_default_end - tag_default_start - 5 )
  ret.default = tag_default.remove_nonascii( '-' )
  
  # Extract tag
  mp3_file = File.open( filename, "r" )
  if mp3_file
    file_length = mp3_file.stat.size
	
	if file_length > 128 
	  # Read in last 128 bytes, ID3v1 Tag
	  mp3_file.seek( -128, IO::SEEK_END )
	  tag_string = mp3_file.read( 128 )
      
	  # Make sure the last part is actually a tag
	  if( tag_string.size == 128 &&
		  tag_string[0,3] == "TAG" )
		  
		# Extract artist and title
	    tag_title = tag_string[3,30]
		tag_artist = tag_string[33,30]
		ret.title = tag_title.strip.remove_nonascii( '-' )
		ret.artist = tag_artist.strip.remove_nonascii( '-' )
	  end

    end
	
    mp3_file.close()
  end
  
  return ret
end


# Get output dir from path
def get_output_dir( path )
  ret = "."
  
  if ARGV[0]
    path_end_idx = ARGV[0].rindex('/')
    ret = ARGV[0].slice( 0, path_end_idx )
  end
  
  return ret
end



# ----------------------------------------
#
# SCRIPT STARTS HERE
#
# ----------------------------------------
puts "Playlost Library Scanner\n"

# Determine script output path
output_dir = get_output_dir( ARGV[0] )
puts output_dir

# Open autogen file for writing
autogen_file = File.new( output_dir + "/scripts/autogen_playlist.js", "w+" )
if !autogen_file
  puts "Could not create output file!\n"
  Process.exit
end

# Set to the "~/Music" directory
dir_base = Etc.getpwuid.dir + "/Music/"

# Directory and filename arrays
mp3_filename_array = Array.new()
dir_array = Array.new()
dir_array << dir_base

# Scan "~/Music" directory for MP3s
dir_array.each{ |directory|
  # Set Directory
  puts "Directory: " + directory + "\n"
  Dir.chdir( directory )
  
  # Get all files in directory
  files = Dir.glob( "*" )

  # Check each file
  files.each { | file |
	
    # If file is a directory, add to directory list
	if( File.directory?( file ) )
	  full_dir_path = directory + file + "/"
	  dir_array << full_dir_path
    end
	
    # If file is MP3, add to MP3 List
	filename_length = file.size
	if( filename_length >= 5 )
	  extension = file[ filename_length - 4, filename_length - 1 ]
	  if( extension == ".mp3" )
		mp3_filename_array << directory + file
	  end
	end
  }
}

# Randomize File Array
(0..mp3_filename_array.length - 1 ).each{ |idx|
  swap_idx = rand( mp3_filename_array.length - 1 )
  
  temp = mp3_filename_array[idx]
  mp3_filename_array[idx] = mp3_filename_array[swap_idx]
  mp3_filename_array[swap_idx] = temp
}

# Write to file, header
autogen_file.puts( "function Setup_Autogen_Song_Database()\n" )
autogen_file.puts( "{\n" );
autogen_file.puts( "this.list_length = #{mp3_filename_array.size};\n" )
autogen_file.puts( "this.list = new Array( this.list_length );\n" )

mp3_idx = 0;
mp3_count = mp3_filename_array.length

# Get MP3 tags and write to file
mp3_filename_array.each{ |mp3_filename|
  puts "Scanning #{(mp3_idx + 1).to_s } of #{mp3_count.to_s}: " + mp3_filename + "\n"
  
  # Get Tag
  tag = get_id3_tag( mp3_filename )
  if !tag.title
    tag.title = tag.default
  end
  puts "Title: #{tag.title}\nArtist:#{tag.artist}\n\n\n"

  # Write to file  
  autogen_file.puts( "this.list[#{mp3_idx}] = new Song( \"#{tag.title}\", \"#{tag.artist}\", \"#{mp3_filename}\" );\n" )
  
  mp3_idx += 1
}

# Write end of file
autogen_file.puts( "}\n" )
autogen_file.close()

puts "***Scan Complete!***\n"
puts "Open Playlost Viewer in your browser to begin.\n"
puts "Run this script again after adding new music to your library.\n"