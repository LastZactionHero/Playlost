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
	this.get_connect_id_from_angle = get_connect_id_from_angle;
	this.get_connect_image_from_angle = get_connect_image_from_angle
	this.get_node_text = get_node_text;
	this.get_node_image = get_node_image;
	this.update_node_image = update_node_image;
	
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
// Node::get_connect_id_from_angle
function get_connect_id_from_angle( start_coord, angle )
{
	return "connect_id_" + start_coord.x + "_" + start_coord.y + "_" + angle;
} // Node::get_connect_id_from_angle()


//
// Node::get_connect_image_from_angle
//
function get_connect_image_from_angle( angle, active )
{
	connect_image = "url(images/connect" + angle;
	
	if( active )
	{
		connect_image += "active";
	}
	
	connect_image += ".png)";
	return connect_image;
} // Node::get_connect_image_from_angle()


//
// Node::handle_node_click()
// Callback function for clicked node
//
function handle_node_click( x, y )
{
	// If this is the first node, allow
	if( gQueue.length <= 0 )
	{
		// Add new node to the list
		new_node = new Coord( x, y );
		gQueue[gQueue.length] = new_node;
		
		// Change the node to the "queued" state
		document.getElementById( get_node_id_from_coord( new_node ) ).style.backgroundImage = "url(images/node_active.png)";
	
		// Update player to contain new song
		gPlayer.update_player_list();
		gPlayer.update_player_controller();
		return;
	}
	
	// Make sure the coordinate is not already in the list
	if( queue_contains_coord( new Coord( x, y ) ) )
		return;
	
	// Make sure this node neighbors the last node
	if( !nodes_are_neighbors( gQueue[ gQueue.length - 1 ], new Coord( x, y ) ) )
		return;
	
	// Add new node to the list
	new_node = new Coord( x, y );
	gQueue[gQueue.length] = new_node;
	
	// Change the node to the "queued" state
	document.getElementById( get_node_id_from_coord( new_node ) ).style.backgroundImage = "url(images/node_queued.png)";
	
	// Collect connection nodes
	start_node = gQueue[ gQueue.length - 2 ];
	end_node = gQueue[ gQueue.length - 1 ];
	
	// Reorder nodes if necessary
	if( end_node.y < start_node.y )
	{
		temp_node = start_node;
		start_node = end_node;
		end_node = temp_node;
	}
	
	// Determine node angle
	angle = 0;
	
	if( is_even( start_node.y ) )
	{
		if( start_node.x == end_node.x + 1 )
			angle = 240;
		else if( start_node.y == end_node.y - 2 )
			angle = 180;
		else
			angle = 120;
	}
	else
	{
		if( start_node.x == end_node.x - 1 )
			angle = 120;
		else if( start_node.y == end_node.y - 2 )
			angle = 180;
		else
			angle = 240;
	}
	
	// Get connection id
	connect_id = get_connect_id_from_angle( start_node, angle );
	
	// Get active connect image at the proper angle
	connect_image = this.get_connect_image_from_angle( angle, true );
	
	// Update connect images
	if( document.getElementById( connect_id ) )
		document.getElementById( connect_id ).style.backgroundImage = connect_image;

	// Update player to contain new song
	gPlayer.update_player_list();
} // Node::handle_node_click()


// 
// Node::get_position_from_coord
// Get screen coordinate from grid coordinate
function get_position_from_coord( input_coord )
{	
	node_left = this.viewport.left + input_coord.x * this.radius * 2;
	node_top = this.viewport.top + input_coord.y * this.radius / 2;
	
	if( !is_even( input_coord.y ) )
		node_left += this.radius;
		
	return new Coord( parseInt( node_left ), parseInt( node_top ) );
} // Node::get_position_from_coord


//
// Node::draw_connection
//
function draw_connection( angle )
{
	// Get start and end points of the connection
	coord_start = this.get_position_from_coord( this.coord );
	
	// Get connection image and position
	connection_image = get_connect_image_from_angle( angle, false );
	position = "";
	if( angle == 240 )
	{
		position = gen_position_string( coord_start.x - this.height, coord_start.y, 80, 80 );
	}
	else if( angle == 120 )
	{
		position = gen_position_string( coord_start.x + this.height / 2, coord_start.y, 80, 80 );
	}
	else
	{
		position = gen_position_string( coord_start.x - this.height / 2, coord_start.y + this.height / 2, 80, 80 );
	}
	
	// Get id of connection
	connection_id = get_connect_id_from_angle( this.coord, angle );
	
	// Write out connection
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
function get_node_image( node_coord )
{
	node_image = ""
	if( is_node_active( node_coord ) )
	{
		node_image = "url(\'images/node_active.png\')"
	}
	else if( queue_contains_coord( node_coord ) )
	{
		node_image = "url(\'images/node_queued.png\')"
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
	this.draw_connection( 120 );
	this.draw_connection( 180 );
	this.draw_connection( 240 );
		
	// Get node text
	node_text = this.get_node_text();
	
	// Get node image
	node_image = this.get_node_image( this.coord );

	// Get node onscreen position
	position = this.get_position_from_coord( this.coord );
	
	// Write node to screen
	document.write
		( 
		 "<a onclick=\"javascript:handle_node_click(" + this.coord.x + "," + this.coord.y + ")\">" +
		 "<div id=\"" + get_node_id_from_coord( this.coord ) + "\" " + 
		 "class=\"box_node\" style=\"background-image:" + node_image + "; " + 
		 gen_position_string( position.x, position.y, this.width, this.height ) + "\">" +
		 "</div>" + 
		 "<div class=\"box_node_text\" style=\"" + gen_position_string( position.x, position.y + 5, this.width * 4, this.height ) + "\">" + node_text + "</div></a>"
		 );
} // Node::draw_node()


//
// Node::update_node_image
//
function update_node_image( node_coord )
{	
	node_id = get_node_id_from_coord( node_coord );
	if( node_id )
	{
		node_image = get_node_image( node_coord );
		if( document.getElementById( node_id ) )
		{
			document.getElementById( node_id ).style.backgroundImage = node_image;
		}
	}
} // Node::update_node_image()
