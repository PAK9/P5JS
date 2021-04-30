
// Size of each 'point' in the pointilisation
let GridUnit = 6;

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

    pallete[0] = color(23,48,57); // background
    pallete[1] = color(19,135,205); // points

    // this is only relevant if you are animating the noise
    frameRate( 20 );
}

function getWave( x, y )
{
    wavespd = 0.1;

    let tickx = (frameCount * wavespd + x);
    let ticky = (frameCount * wavespd + y)*1;

    let funcx = sin( cos( tickx * 4 ) ) * 0.1;
    return ( ( sin( ticky + funcx ) )  * 2 - 1 );
}

function Renderpix( pix, x, y )
{
    let g = brightness(pix);

    g = g + getWave(x,y) * 3;

    if( g < 20 )
    {
        // Clip
        return;
    }

     // We have some chance of just not rendering at all based on brightness
     let chancie = 0;
     chancie = noise( x + 5976, y + 2876 ) * 100;
    if( chancie > g )
    {
        g = g * 0.1;
        return;
    }

    fill( pallete[1] );
    if( g < 40 )
    {
        // Render as dot
        fill( pallete[1] );
        let sy = 1;
        let sx = 0.2;
        quad( x - GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
            x + GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
            x + GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy,
            x - GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy );
    }
    else if( g < 60 )
    {
         // Render as colour with inner cut

         fill( pallete[1] );
         let sy = 1;
         let sx = 0.6;
         quad( x - GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
             x + GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
             x + GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy,
             x - GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy );
 
         fill( pallete[0] );
         sy = 1;
         sx = 0.3;
         quad( x - GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
             x + GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
             x + GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy,
             x - GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy );
    }
    else if( g < 80 )
    {
       // render smaller 
       let sy = 1;
       let sx = 0.4;
       quad( x - GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
           x + GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
           x + GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy,
           x - GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy );
    }
    else
    {
        // Render as fill

        fill( pallete[1] );
        let sy = 1;
        let sx = 0.6;
        quad( x - GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
            x + GridUnit * 0.5 * sx, y - GridUnit * 0.5 * sy,
            x + GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy,
            x - GridUnit * 0.5 * sx, y + GridUnit * 0.5 * sy );
    }   
}

function RandFromCentre( x,y )
{
    // This function returns true/false randomly, the chance of returning true increases
    // as we approach the 'origin'

    // Change the radius of the effect here
    let EffectRadius = 0.15;

    // pick a sensible origin point for the effect
    originx = width / 2 - 150;
    originy = height / 2 + 20;

    dist = sqrt( (originx-x)*(originx-x)+(originy-y)*(originy-y) );

    let chancie = 0;
    chancie = noise( x+785, y+888 );

    let norm = pow( dist/height,1.9 );
    
    return norm < chancie * EffectRadius;
}

function draw() 
{
    background(pallete[0]);

    noStroke();
    
    // Pick a nice seed
    noiseSeed(28); // use noiseSeed( frameCount ); to animate the noise
    // noiseSeed( frameCount );
    
    for (let y = GridUnit * 2; y < height - GridUnit; y=y+GridUnit ) 
    {
        for (let x = GridUnit * 2; x < width - GridUnit; x=x+GridUnit ) 
        {
            if( RandFromCentre(x,y))
            {
                let pix = img.get(x, y);
                Renderpix( pix,x,y );
            }
        }
    }
}

