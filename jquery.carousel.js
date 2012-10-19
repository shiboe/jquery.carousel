/*
 * jQuery Carousel
 * 
 * Build a 3D slide-view carousel from a list
 * 
 * Copyright © 2008 Stephen Cave - sccave@gmail.com
 * All rights reserved.
 * 
 */

(function( $ ){

  var methods = {
     init : function( options ) {
         
        var settings = $.extend( {
            "spacing":12,
            "perspective":600,
            "size":800,
            "tilt": {x:-22, y:32},
            "offset":0,
            "fadeout": {start:.8, limit:4}, // set to false to not use fadeout
            "centering":"left",
            "callback": false,
            "prevButton": false,
            "nextButton": false
        }, options);

       return this.each(function(){

           build( this, settings );

           var data = $(this).data("carousel");
           if( !data ){
               
               $(this).data('carousel',{
                   index:0,
                   settings: settings
               });
           }
       });

     },
     destroy : function( ) {

       return this.each(function(){
           
       });
     },
     
     go : function( index )
     {
         return this.each(function()
         {
             var data = $(this).data("carousel");;
                 
             reposition( this, index, $(this).data("carousel").settings );
             
             $(this).data("carousel").index = index;
         });
     },
     
     previous : function() {
         
         return this.each(function(){
             var data = $(this).data("carousel"),
                 index = data.index - 1;
             if( index < 0 ) index = $(".carousel li",this).length - 1;
                 
             reposition( this, index, $(this).data("carousel").settings );
             
             $(this).data("carousel").index = index;
         });
     },
     next : function() {
         
         return this.each(function(){
             var data = $(this).data("carousel"),
                 index = data.index + 1;
             if( index >= $(".carousel li",this).length ) index = 0;
                 
             reposition( this, index, $(this).data("carousel").settings );
             
             $(this).data("carousel").index = index;
         });
     }
  };

  $.fn.carousel = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method == "number" ) {
      return methods.go.apply( this, arguments );
    }else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.carousel' );
    }    
  
  };
  
  function build( container, settings )
  {
      $(container)
                .css( vendorPrefixed( "perspective" ), settings.perspective )
                .css( vendorPrefixed( "transformStyle" ), "preserve-3d" )
                .css( vendorPrefixed( "transform" ), "rotateX("+settings.tilt.x+"deg) rotateY("+settings.tilt.y+"deg)" )
                .html( "<div class='carousel'>"+$(container).html()+"</div>" );
                
      var carousel = $(".carousel",container),
          items = $("li", carousel).css( {"position":"absolute", "top":"0px", "left":"0px"} ),
          offset = -(settings.size) + settings.offset;
   
      carousel
          .css( vendorPrefixed( "transformStyle" ), "preserve-3d" )
          .css( {"width": $(".carousel li",container).width(), "height": $(".carousel li",container).height()} );
  
      reposition( container, 0, settings );
      
      if(settings.prevButton)$(settings.prevButton).on("mousedown", function(e){ e.preventDefault(); $(container).carousel("previous");} );
      if(settings.nextButton)$(settings.nextButton).on("mousedown", function(e){ e.preventDefault(); $(container).carousel("next");} );
      
      items.on("mousedown", function(){ $(container).carousel( "go", $(this).index() );} );
  }
  
  function reposition( container, index, settings )
  {
      var carousel = $(".carousel",container),
          items = $("li", carousel).removeClass("active"),
          offset = -(settings.size) + settings.offset,
          i = index+1,
          opacity = 1,
          Sp = parseInt( settings.spacing );
      
      if( settings.fadeout )
      {
          var L = settings.fadeout.limit,
              S = settings.fadeout.start,
              miniSpaceOffset = (index * Sp) - (index * Sp/4);
          
          for( i;i<items.length;i++ )
          {
              opacity = i >= L+index ? 0 : S * ( 1 - ( ( i-index-1 ) /L));
              items.eq(i).css("opacity",opacity).css( vendorPrefixed( "transform" ), "rotateY("+( Sp * i )+"deg) translateX("+settings.size+"px) scale(1)" );
          }
          
          for( i=0;i<index;i++ )
          {                             
              opacity = i < index-L ? 0 : ( 1 - ( ( index - i - 1 ) / L ) ) * S;
              items.eq(i).css("opacity",S/2).css( vendorPrefixed( "transform" ), "rotateY("+( miniSpaceOffset + ((Sp/4) * i) )+"deg) translateX("+(settings.size - ( items.width()/2 ))+"px) translateY("+(items.height()/2)+"px) scale(.25)" );
          }
      }
      
      items.eq( index ).addClass("active").css("opacity",1).css( vendorPrefixed( "transform" ), "rotateY("+( Sp * index )+"deg) translateX("+settings.size+"px) scale(1)" );
      
      carousel.css( vendorPrefixed( "transform" ), "translateX("+offset+"px) rotateY(-"+(Sp*index)+"deg)" );
      
      if( settings.callback ) settings.callback(index);
  }

})( jQuery );