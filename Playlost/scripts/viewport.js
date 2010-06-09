//
// Class: Viewport
//
function Viewport()
{
	// Functions
	this.draw_viewport = draw_viewport;
	this.draw_grid = draw_grid;
	
	// Variables
	this.top = 20;
	this.left = 20;
	this.width = window.innerWidth - 375;
	this.height = window.innerHeight - 40;
} // Viewport


//
// Viewport::draw_viewport
// Draw viewport box and containing grid
function draw_viewport()
{
	// Draw viewport box
	document.write
		( 
		"<div class=\"box_viewer\" style=\"top: " + 
		gen_position_string( this.left, this.top, this.width, this.height ) +
		"\">" 
		);
		
	// Draw grid
	this.draw_grid();
	
	// End viewport box
	document.write( "</div>" );
} // Viewport::draw_viewport()


//
// Viewport::draw_grid()
// Draw grid of nodes
//
function draw_grid()
{
	list_length = gPlaylist.list_length;
	square = Math.ceil( Math.sqrt( list_length ) );
	
	x_start = 0;
	x_end = square;
	y_start = 0;
	y_end = square;
	
	// Loop through grid and draw nodes
	for( x_posn = x_start; x_posn < x_end; x_posn++ )
	{
		for( y_posn = y_start; y_posn < y_end; y_posn++ )
		{
			grid_node = new Node( new Coord( x_posn, y_posn ), gViewport );
			grid_node.draw_node();
		}
	}
} // Viewport::draw_grid()