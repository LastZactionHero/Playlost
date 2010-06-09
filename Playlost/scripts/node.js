//
// Class: Node
//
function Node( coord, viewport )
{
	// Functions
	this.coord = coord;
	this.viewport = viewport;
	this.draw_node = draw_node;
	this.draw_connection = draw_connection;
	this.get_position_from_coord = get_position_from_coord;
	this.get_node_id_from_coord = get_node_id_from_coord;
	this.get_connect_id_from_coords = get_connect_id_from_coords;
	this.get_connect_image_from_coords = get_connect_image_from_coords;
	this.get_node_text = get_node_text;
	this.get_node_image = get_node_image;
	
	// Variables
	this.radius = 80;
	this.height = 40;
	this.width = 40;
	this.song = gPlaylist.get_song_at_coord( this.coord );
} // Node


//
// Node::get_node_id_from_coord
//
function get_node_id_from_coord( coord )
{
	return "node" + coord.x + "-" + coord.y;
} // Node::get_node_id_from_coord()


//
// Node::get_connect_id_from_coords
//
function get_connect_id_from_coords( coord_start, coord_end )
{
	return "connect" + coord_start.x + "-" + coord_start.y + "-" + coord_end.x + "-" + coord_end.y;
} // Node::get_connect_id_from_coords()


//
// Node::get_connect_image_from_coords
//
function get_connect_image_from_coords( coord_start, coord_end, active )
{	
	angle = "";
	if( coord_start.x == coord_end.x && coord_start.y != coord_end.y )
	{
		angle = "0";
	}
	else if( coord_start.x != coord_end.x && coord_start.y == coord_end.y )
	{
		angle = "120";
	}
	else
	{
		angle = "60";
	}
	
	connect_image = "url(images/connect" + angle;
	if( active )
	{
		connect_image += "active";
	}
	connect_image += ".png)";
	
	return connect_image;
} // Node::get_connect_image_from_coords()


//
// Node::handle_node_click()
// Callback function for clicked node
//
function handle_node_click( x, y )
{
	// Make sure the coordinate is not already in the list
	if( queue_contains_coord( new Coord( x, y ) ) )
		return;
	
	// Make sure this node neighbors the last node
	if( nodes_are_neighbors( gQueue[ gQueue.length - 1 ], new Coord( x, y ) ) == 0 )
		return;
	
	// Add new node to the list
	new_node = new Coord( x, y );
	gQueue[gQueue.length] = new_node;
	
	// Change the node to the "queued" state
	document.getElementById( get_node_id_from_coord( new_node ) ).style.backgroundImage = "url(images/node_queued.png)";
	
	// Get ids of connection images
	start_coord = gQueue[gQueue.length - 2];
	end_coord = gQueue[gQueue.length - 1];
	connect_name_forward = this.get_connect_id_from_coords( start_coord, end_coord );
	connect_name_reverse = this.get_connect_id_from_coords( end_coord, start_coord );
	
	// Get active connect image at the proper angle
	connect_image = this.get_connect_image_from_coords( start_coord, end_coord, true );
	
	// Update connect images
	if( document.getElementById( connect_name_forward ) )
		document.getElementById( connect_name_forward ).style.backgroundImage = connect_image;
		
	if( document.getElementById( connect_name_reverse ) )
		document.getElementById( connect_name_reverse ).style.backgroundImage = connect_image;
	
	// Update player to contain new song
	gPlayer.update_player_list();
} // Node::handle_node_click()


// 
// Node::get_position_from_coord
// Get screen coordinate from grid coordinate
function get_position_from_coord( input_coord )
{
	// Get the center of the screen
	node_top = this.viewport.top + this.viewport.height/2 - this.height/2;
	node_left = this.viewport.left + this.viewport.width/2 - this.width/2;
	
	// Adjust the top and left based on the size of a point
	node_left = node_left + input_coord.x * this.radius;
	node_top = node_top + input_coord.x * this.radius / 2 - input_coord.y * this.radius;
	
	return new Coord( parseInt( node_left ), parseInt( node_top ) );
} // Node::get_position_from_coord


//
// Node::draw_connection
//
function draw_connection( connect_coord )
{
	// Get start and end points of the connection
	coord_start = this.get_position_from_coord( this.coord );
	coord_end = this.get_position_from_coord( connect_coord );
	
	// Get the start position coordinate
	line_start = new Coord( Math.min( coord_start.x, coord_end.x ), Math.min( coord_start.y, coord_end.y ) );
	
	// Get id of connection
	connection_id = get_connect_id_from_coords( this.coord, connect_coord );
	connection_image = get_connect_image_from_coords( this.coord, connect_coord, false );
	
	// Get position on screen
	position = "";
	if( this.coord.x == connect_coord.x && this.coord.y != connect_coord.y )
	{
		position = gen_position_string( line_start.x - ( 79 - this.width)/2, line_start.y + this.height/2, 79, 79 );
	}
	else if( this.coord.x != connect_coord.x && this.coord.y != connect_coord.y )
	{
		position = gen_position_string( line_start.x + this.width/2, line_start.y, 79, 79 );
	}
	else if( this.coord.x != connect_coord.x && this.coord.y == connect_coord.y )
	{
		position = gen_position_string( line_start.x + this.width/2, line_start.y, 79, 79 );
	}
	
	// Write out node
	document.write
		(
		"<div id=\"" + connection_id + 
		"\" style=\"z-index:1; position:absolute; " +
		"background-image:" + connection_image + "; " + 
		position + 
		"\"></div>" 
		);		
} // Node::draw_connection()


//
// Node::get_node_text
//
function get_node_text()
{
	node_text = "";	
	if( !this.song )
	{
		return "";
	}
	if( this.song.name && this.song.artist )
	{
		node_text = this.song.name + "<br>" + this.song.artist;
	}
	else if( this.song.filename )
	{
		node_text = this.song.filename;
	}
	
	return node_text;
} // Node::get_node_text()


//
// Node::get_node_image
function get_node_image()
{
	node_image = ""
	if( is_node_active( this.coord ) )
	{
		node_image = "url(\'images/node_active.png\');"
	}
	else if( queue_contains_coord( this.coord ) )
	{
		node_image = "url(\'images/node_queued.png\');"
	}
	else
	{
		node_image = "url(\'images/node.png\');"
	}
	return node_image;
} // Node::get_node_image()


//
// Node::draw_node
//
function draw_node()
{
	// Draw node connections in all direction
	// Todo: Don't do this
	this.draw_connection( new Coord( this.coord.x, this.coord.y + 1 ) );
	this.draw_connection( new Coord( this.coord.x + 1, this.coord.y + 1 ) );
	this.draw_connection( new Coord( this.coord.x + 1, this.coord.y ) );
	this.draw_connection( new Coord( this.coord.x, this.coord.y - 1 ) );
	this.draw_connection( new Coord( this.coord.x - 1, this.coord.y - 1 ) );
	this.draw_connection( new Coord( this.coord.x - 1, this.coord.y ) );
	
	// Get node text
	node_text = this.get_node_text();
	
	// Get node image
	node_image = this.get_node_image();

	// Get node onscreen position
	position = this.get_position_from_coord( this.coord );
	
	// Write node to screen
	document.write
		( 
		 "<a onclick=\"javascript:handle_node_click(" + this.coord.x + "," + this.coord.y + ")\">" +
		 "<div id=\"" + get_node_id_from_coord( this.coord ) + "\" " + 
		 "class=\"box_node\" style=\"background-image:" + node_image + " " + 
		 gen_position_string( position.x, position.y, this.width, this.height ) + "\">" +
		 node_text + 
		 "</div></a>"
		 );
} // Node::draw_node()
