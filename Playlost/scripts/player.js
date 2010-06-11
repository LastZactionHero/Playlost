//
// Class: Player
//
function Player()
{
	// Functions
	this.draw_player = draw_player;
	this.update_player = update_player;
	this.update_player_list = update_player_list;
	this.update_player_controller = update_player_controller;
	
	// Variables
	this.top = 20;
	this.left = gViewport.left + gViewport.width + 20;
	this.width = window.innerWidth - this.left - 36;
	this.height = window.innerHeight - 40 - 40;
} // Player


//
// Player::draw_player
function draw_player()
{
	// Draw list box
	document.write
		( 
		"<div id=\"div_playlist_list\" class=\"box_player_list\" style=\"" + 
		gen_position_string( this.left, this.top, this.width, this.height ) + "\"></div>" 
		);
		
	// Draw player controller
	document.write
		( 
		"<div id=\"div_playlist_player\" class=\"box_player_controller\" style=\"" + 
		gen_position_string( this.left, this.top + this.height, this.width, 40 ) + "\"></div>" 
		);
} // Player::draw_player()


//
// Player::update_player()
// Update both list and player
//
function update_player()
{
	this.update_player_list();
	this.update_player_controller();
} // Player::update_player()


//
// Update playlist text
//
function update_player_list()
{
	player_html = "";
	
	for( i = 0; i < gQueue.length; i++ )
	{
		trackColor = "white";
		if( gActiveIdx == i )
		{
			trackColor = "blue";
		}
		
		player_html += "<p style=\"color:" + trackColor + ";\">";
		player_html += "<a onclick=\"javascript:set_track(" + i + ")\">"
		song_coord = gQueue[i];
		song = gPlaylist.get_song_at_coord( gQueue[i] );
		player_html += i+1 + ": " + song.name + "-" + song.artist + "</a></p>";
	}
	
	document.getElementById( 'div_playlist_list' ).innerHTML = player_html;
} // Player::update_player_list()


//
// Player::set_track()
//
function set_track( track_idx )
{
	gActiveIdx = track_idx;
  
	gPlayer.update_player();
	
	update_node_image( gQueue[gActiveIdx-1] );
	if( gQueue.length > gActiveIdx )
	{
		update_node_image( gQueue[gActiveIdx] );
	}
} // Player::set_track()


//
// Player::update_player_controller
//
function update_player_controller()
{
	if( gActiveIdx < gQueue.length )
	{
		// Get filename of active track
		filename = gPlaylist.get_song_at_coord( gQueue[gActiveIdx] ).filename;
		
		// Generate player html
		player_html = "<audio style=\"top:0px;\" src=\"" + filename + "\" autoplay=\"true\" onended=\"javascript:next_track()\" controls=\"controls\">Your browser does not support the audio element.</audio>";
		
		// Update div
		document.getElementById( 'div_playlist_player' ).innerHTML = player_html;
	}
} // Player::update_player_controller()


//
// Player::next_track
//
function next_track()
{
	// Increment track counter and update player list and controller
	set_track( gActiveIdx + 1 );
} // Player::next_track()