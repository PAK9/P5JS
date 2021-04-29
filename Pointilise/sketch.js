
// Size of each 'point' in the pointilisation
let GridUnit = 8;

let pallete = []
let img;

function preload() 
{
    img = loadImage('assets/source.png');
}

function setup() 
{
    createCanvas(1200, 1200);

    imageMode(CENTER);
    img.loadPixels();

    pallete[0] = color(35,15,43); // background
    pallete[1] = color(242,29,65); // points

    // this is only relevant if you are animating the noise
    frameRate( 10 );
}

function Renderpix( pix, x, y )
{
    let g = brightness(pix);
    if( g < 30 )
    {
        // Clip
        return;
    }

     // We have some chance of just not rendering at all based on brightness
     let chancie = 0;
     chancie = noise( x + 5976, y + 2876 ) * 100;
    if( chancie > g )
    {
        return;
    }

    if( g < 30 )
    {
        // Render as just inner red
        fill( pallete[1] );
        circle( x,y, GridUnit * 0.4 );
    }
    else if( g < 60 )
    {
        // Render as red with inner cut

        fill( pallete[1] );
        circle( x,y, GridUnit * 0.8 );

        fill( pallete[0] );
        circle( x,y, GridUnit * 0.4 );
    }
    else
    {
        // Render as red
        fill( pallete[1] );
        circle( x,y, GridUnit * 0.8 );
    }   
}

function Rendersmallpix( pix, x, y )
{
    let g = brightness(pix);
    if( g < 30 )
    {
        // Clip
        return;
    }
   
    // We have some chance of just not rendering at all based on brightness
    let chancie = 0;
    chancie = noise( x + 759, y + 8977 ) * 150;
    if( chancie > g )
    {
        return;
    }

    // Then its basically random
    chancie = noise( x + 156, y + 7498 );
    if( chancie > 0.3 )
    {
        fill( pallete[1] );
        circle( x + GridUnit,y + GridUnit+GridUnit*0.5, GridUnit * 0.4 );
    }
}

function RandFromCentre( x,y )
{
    // This function returns true/false randomly, the chance of returning true increases
    // as we approach the 'origin'

    // Change the radius of the effect here
    let EffectRadius = 0.2;

    // pick a sensible origin point for the effect
    originx = width / 2 - 50;
    originy = height / 2 + 240;

    dist = sqrt( (originx-x)*(originx-x)+(originy-y)*(originy-y) );

    let chancie = 0;
    chancie = noise( x+785, y+888 );

    let norm = pow( dist/height,2 );
    
    return norm < chancie * EffectRadius;
}

function draw() 
{
    background(pallete[0]);

    noStroke();
    
    // Pick a nice seed
    noiseSeed(28); // use noiseSeed( frameCount ); to animate the noise
    
    for (let y = GridUnit * 2; y < height - GridUnit; y=y+GridUnit ) 
    {
        for (let x = GridUnit * 2; x < width - GridUnit; x=x+GridUnit ) 
        {
            if( RandFromCentre(x,y))
            {
                let pix = img.get(x, y);
                Renderpix( pix,x,y );
                Rendersmallpix(pix,x,y);
            }
        }
    }
}

