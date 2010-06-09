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
	return ( coord.x == gQueue[gActiveIdx].x && coord.y == gQueue[gActiveIdx].y );
} // is_node_active()


//
// is_even
//
function is_even( value )
{
	return ( value / 2 ) == parseInt( ( value / 2 ) )
}