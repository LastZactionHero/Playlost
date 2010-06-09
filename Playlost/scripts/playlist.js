//
// Class: Song
//
function Song(name, artist, filename)
{
	// Variables
	this.name = name
	this.artist = artist
	this.filename = filename
} // Song


//
// Class: Playlist
// 
function Playlist()
{
	// Functions
	this.Setup_Autogen_Song_Database = Setup_Autogen_Song_Database;
	this.get_song_at_coord = get_song_at_coord;
	
	// Variables
	this.nullsong = Song( "", "", "" );
	
	// Initialize song database
	this.Setup_Autogen_Song_Database();
} // Playlist


//
// Playlist::get_song_at_coord
// Return the song at a given coordinate
//
function get_song_at_coord( coord )
{
	// Determine the size of the array
	array_side = Math.ceil( Math.sqrt( this.list_length ) );
	
	// Get the index of the coordinate in the array
	index = coord.x * array_side + coord.y;
	
	// If valid, return song
	if( index >= 0 && index < this.list_length )
	{
		return this.list[index];
	}
	
	// Invalid selection. Return empty song
	return this.nullsong;
} // Playlist::get_song_at_coord()