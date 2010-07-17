//
// gen_position_string
// Generate CSS position string from values
//
function gen_position_string( left, top, width, height )
{
	return "top: " + top + "px; left: " + left + "px; width: " + width + "px; height: " + height + "px;";
} // gen_position_string()


// 
// nodes_are_neighbors
// Determine if two nodes are touching
//
function nodes_are_neighbors( start_coord, end_coord )
{	
	if( start_coord.y > end_coord.y )
	{
		temp = start_coord;
		start_coord = end_coord;
		end_coord = temp;
	}
	
	if( is_even( start_coord.y ) )
	{
		if( ( start_coord.x == end_coord.x		&&	start_coord.y == end_coord.y + 2	) ||
			( start_coord.x == end_coord.x		&&	start_coord.y == end_coord.y + 1	) ||
			( start_coord.x == end_coord.x		&&	start_coord.y == end_coord.y - 1	) ||
			( start_coord.x == end_coord.x		&&	start_coord.y == end_coord.y - 2	) ||
			( start_coord.x == end_coord.x + 1	&&	start_coord.y == end_coord.y - 1	) ||
			( start_coord.x == end_coord.x + 1	&&	start_coord.y == end_coord.y + 1 ) )
		{
			return true;
		}
	}
	else
	{
		if( ( start_coord.x == end_coord.x		&& start_coord.y == end_coord.y + 2		) ||
			( start_coord.x == end_coord.x - 1	&& start_coord.y == end_coord.y - 1		) ||
			( start_coord.x == end_coord.x - 1	&& start_coord.y == end_coord.y + 1		) ||
			( start_coord.x == end_coord.x		&& start_coord.y == end_coord.y - 2		) ||
			( start_coord.x == end_coord.x		&& start_coord.y == end_coord.y - 1		) ||
			( start_coord.x == end_coord.x		&& start_coord.y == end_coord.y + 1	) )
		{
			return true;
		}
	}

	return false;
} // nodes_are_neighbors()


//
// queue_contains_coord
// Determine if the queue contains a given coordinate
//
function queue_contains_coord( coord )
{
	for( i = 0; i < gQueue.length; i++ )
	{
		if( coord.x == gQueue[i].x && coord.y == gQueue[i].y )
		{
			return 1;
		}
	}
	return 0;
} // queue_contains_coord()


//
// is_node_active
// Determine if a node is the active track
//
function is_node_active( coord )
{
	if( gQueue.length <= 0 )
		return false;
		
	return ( coord.x == gQueue[gActiveIdx].x && coord.y == gQueue[gActiveIdx].y );
} // is_node_active()


//
// is_even
//
function is_even( value )
{
	return ( value / 2 ) == parseInt( ( value / 2 ) )
}


//
// Detect Current Browser
//
function browser_detect()
{
	browser = "Unknown";
	
	if( navigator.userAgent.indexOf( "Firefox" ) != -1 )
	{
		browser = "Firefox";
	}
	else if( navigator.userAgent.indexOf( "Chrome" ) != -1 )
	{
		browser = "Chrome";
	}
	else if( navigator.userAgent.indexOf( "Internet Explorer" ) != -1 )
	{
		browser = "Internet Explorer";
	}
	else if( navigator.userAgent.indexOf( "Safari" ) != -1 )
	{
		browser = "Safari";
	}

	return browser;
} // browser_detect()


// 
// OS Detect
//
function os_detect()
{
	os = "Unknown";
  
	if( navigator.userAgent.indexOf( "Macintosh" ) != -1 )
	{
		os = "Mac";
	}
	else if( navigator.userAgent.indexOf( "Windows" ) != -1 )
	{
		os = "Windows";
	}
	
	return os;
} // os_detect()


//
// Does this current browser support HTML5
// MP3 Audio?
//
function use_html5_audio()
{
	browser = browser_detect();
	if( browser == "Chrome" || browser == "Safari" ) return true;
	return false;
}


//
// Quicktime Player Track Ended Callback
//
function quicktime_player_ended_callback()
{
	document.getElementById( 'div_playlist_player' ).innerHTML = "";
	next_track();
} // quicktime_player_ended_callback()


//
// Register for Quicktime Player callbacks
//
function register_quicktime_player()
{
	if( document.getElementById( "quicktime_audio_player" ) )
	{ 
		document.getElementById( "quicktime_audio_player" ).addEventListener( 'qt_ended', quicktime_player_ended_callback, false ); 
	}
	else
	{
		setTimeout( "register_quicktime_player()", 500 );
	}
} // register_quicktime_player()


//
// Browser Warning
// Send incompatible browser warnings
function browser_warning()
{
	browser = browser_detect();
	os = os_detect();

	if( os != "Mac" )
	{
		if( browser != "Chrome" && browser != "Safari" )
		{
			alert( "Warning: Playlost only supports Google Chrome or Apple Safari on your platform." );
		}
	}
} // browser_warning()