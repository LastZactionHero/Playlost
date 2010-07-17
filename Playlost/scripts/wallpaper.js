//
// Background Wallpaper
//
function Wallpaper()
{
	// Member functions
	this.draw_frame = draw_frame;
	this.draw_wallpaper = draw_wallpaper;
	
	// Draw wallpaper frame and wallpaper
	this.draw_frame();
	this.draw_wallpaper();
	
	// Update wallpaper on resize
	document.body.onresize = this.draw_wallpaper;
} // Wallpaper()


//
// Draw Frame
// 
function draw_frame()
{
	// Draw frame that contains wallpaper
	document.write
		(
		"<div style=\"z-index:-1;\" id=\"div_id_wallpaper\"></div>"
		);
} // draw_frame

//
// Draw Wallpaper
//
function draw_wallpaper()
{
	htmlString = "";
	
	//var colors = new Array( "4a3226" , "719b8f", "94aa9d", "727064", "5a8885" );
	var colors = new Array( "4a3226" , "4a3226", "4a3226", "4a3226", "727064" );
	left_posn = 0;
	for( i = 0; i < 5; i++ )
	{
		divString = "<div style=\"position: absolute; z-index: -1; background-color: #" + colors[i] + "; top: 0px; left: " + left_posn + "px; width: " + get_wallpaper_pane_width() + "px; height: " + get_wallpaper_pane_height() + "px;\"></div>";
		htmlString += divString;
		
		left_posn += get_wallpaper_pane_width() - 2;
	} 
	
	// Update wallpaper frame
	document.getElementById( "div_id_wallpaper" ).innerHTML = htmlString;
} // draw_wallpaper

//
// Get Wallpaper Width
//
function get_wallpaper_pane_width()
{
	return window.innerWidth / 5 + 3;
} // get_wallpaper_width

//
// Get Wallpaper Height
function get_wallpaper_pane_height()
{
	return	window.innerHeight;
} // get_wallpaper_height