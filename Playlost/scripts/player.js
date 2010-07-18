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
	this.poll_flash_finished = poll_flash_finished;
	
	// Variables
	this.top = 10;
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
	// Set the active track
	gActiveIdx = track_idx;
  
	gPlayer.update_player();
	
	// Update node images
	for( i = 0; i <gQueue.length; i++ )
	{
		update_node_image( gQueue[i] );
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
		player_html = "";
		register_quicktime = false;
		
		if( use_html5_audio() )
		{	
			// Use HTML5 Audio
			player_html = "<audio style=\"top:0px;\" src=\"" + filename + "\" autoplay=\"true\" onended=\"javascript:next_track()\" controls=\"controls\">Your browser does not support the audio element.</audio>";
		}
		else if( os_detect() == "Mac" && browser_detect() == "Firefox" )
		{
			// Use Quicktime
			player_html = "<object classid=\"clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B\" codebase=\"http://www.apple.com/qtactivex/qtplugin.cab\">";
			player_html += "<embed id=\"quicktime_audio_player\" postdomevents=\"true\" src=\"" + filename + "\" width=\"" + this.width + "\" height=\"15\" autoplay=\"true\" style=\"behavior:url(#qt_event_source);\" controller=\"true\" pluginspage=\"http://www.apple.com/quicktime/download/\"></embed>";
			player_html += "</object>";
			
			register_quicktime = true;
		}
		else
		{
			// Use Flash
			player_html += "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0\" width=\"165\" height=\"37\" id=\"flash_player\" align=\"\">";
			player_html += "	<param name=movie value=\"scripts/niftyplayer.swf?file=" + filename + "&as=1\">";
			player_html += "	<param name=quality value=high>";
			player_html += "	<param name=bgcolor value=#FFFFFF>";
			player_html += "	<embed src=\"scripts/niftyplayer.swf?file=" + filename + "&as=1\" quality=high bgcolor=#FFFFFF width=\"165\" height=\"37\" name=\"flash_player\" align=\"\" type=\"application/x-shockwave-flash\" swLiveConnect=\"true\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\">";
			player_html += "	</embed>";
			player_html += "</object>";
		}
		
		// Update div
		document.getElementById( 'div_playlist_player' ).innerHTML = player_html;
		
		// Register quicktime player if not using HTML5 audio
		if( register_quicktime )
		{
			register_quicktime_player();
		}
		
		this.poll_flash_finished();
	}
} // Player::update_player_controller()


//
// Poll for flash player finished state
function poll_flash_finished()
{
	// If the player exists and is finished, forward
	// to the next track
	if( document.getElementById( "flash_player" ) &&
		niftyplayer('flash_player') &&
		niftyplayer('flash_player').getState() == "finished" )
	{
		next_track();
	}
	else
	{
		// Poll again
		setTimeout( "poll_flash_finished()", 2000 );
	}
} // Player::poll_flash_finished()

//
// Player::next_track
//
function next_track()
{
	// Increment track counter and update player list and controller
	set_track( gActiveIdx + 1 );
} // Player::next_track()