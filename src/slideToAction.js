// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "slideToAction",
				defaults = {
				slideMsg: "Slide To Action...",
				successMsg: "Success",
				minWidth: 400,
				classPrefix: "my",
				buttonHTML: "thug",
				swapAtBp: true,
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {


				this.element = element;				
				this.settings = $.extend( {}, defaults, options );
				this._name = pluginName;this._defaults = defaults;
			
				this.init();

				
		}



		Plugin.prototype = {
				init: function () {
						ob = [];
						elms = [];
						sizes = [];

						ob.elmLink = $(this.element).attr("href");
						ob.pfx = this.settings["classPrefix"];
						ob.elm = $(this.element);
						ob.elmtype = $(this.element).prop("tagName");
						ob.successm = this.settings["successMsg"];
						ob.bt = this.settings["buttonHTML"];
						ob.slidem = this.settings["slideMsg"];
						ob.mousedown = false;
						ob.done = false;

						elms.container;
						elms.button;
						elms.elm = $(this.element);

						sizes.pl;
						sizes.pr;
						sizes.bw;
						sizes.bwhalf;
						sizes.cw;
						sizes.realinner;
						sizes.rightpos;

						console.log(ob.elm);
						
						function setup(){
							console.log(ob.bt);
							var buttonHTML = "<div class='sta-button "+ob.pfx+"-sta-button'>"+ob.bt+"</div>";
							var slideMsgHTML = "<span class='sta-slide-msg "+ob.pfx+"-sta-slide-msg'>"+ob.slidem+"</span>";
							var successMsgHTML = "<div class='sta-success-msg "+ob.pfx+"-sta-success-msg'>"+ob.successm+"</div>";
							
							elms.elm.wrap("<div class='sta-container "+ob.pfx+"-sta-container'>");
							
							elms.container = ob.elm.parent();
							elms.container.data("type", ob.elmtype);
							if(ob.elmtype === "A"){
								elms.container.data("href", ob.elmLink);
							}


							elms.container.html(buttonHTML);

							elms.container.append(slideMsgHTML);
							elms.container.append(successMsgHTML);

							elms.button = elms.container.find(".sta-button");
						
						}
						alert("x");
						function getSizes(){
	
						}

						function slideMe(e, elm){
								var button = elm.find(".sta-button");
								var slideMsg = elm.find(".sta-slide-msg");

								var pl = parseInt(elm.css("padding-left"));
								var pr = parseInt(elm.css("padding-right"));
								var cw = elm.innerWidth();
								var bw = button.outerWidth();
								var bwhalf = bw / 2;
								var realinner = cw - pl;
								var realinner = realinner - pr;
								var rightpos = realinner -bw;

								var offset = elm.offset();
  				  				var relativeX = (e.pageX - offset.left);
  				  				var leftcheck = bwhalf + pl;



  				  				var rightcheck = cw - bwhalf;
  				  				rightcheck = rightcheck - pr;

  				  				
  				  				slideMsg.fadeOut(100);

  				  				if(relativeX < leftcheck){
  				  					console.log("less");
  				  					button.css("margin-left", 0);
  				  				} else if(relativeX > rightcheck){
  				  					button.css("margin-left", rightpos);
  				  					elm.trigger("slideComplete");
  				  					
  				  				} else{
  				  					button.css("margin-left", relativeX-bwhalf);
  				  				}
						}


						setup();
						getSizes();
						console.log(sizes);

						elms.button.mousedown(function(){
							ob.done = false;

							$(this).data("md", true);
							console.log(ob.mousedown);
						});

						elms.container.mousemove(function(e){

							var md = $(this).find(".sta-button").data("md");
							if(md){

								var elm = $(this);
									slideMe(e, elm);
							}
						});
						
						$(document).mouseup(function(){
							$(".sta-button").data("md", false);

							if(!ob.done){
								$(".sta-button").animate({
									marginLeft: 0
								}, 500, function(){
									$(".sta-slide-msg").fadeIn(100);
									ob.done = false;
								});	
							}

						});

							
							var clak = "clak.mp3";
							var zap = "zap.wav";
							function playSound(audioFile){      
					      	
					      		var sound = new Audio(audioFile);   
					      		sound.play();      
   						}

						function slideComplete(e, elm){
							if(!ob.done){

								setTimeout(function(){
									playSound(clak);
								}, 50);


								setTimeout(function(){
									elm.find(".sta-success-msg").fadeIn(100);
									elm.addClass("sta-complete");
									elm.find(".sta-button").fadeOut(50, function(){

										if(elm.data("type") === "A"){
											//redirect(elm.data("href"));
										}

									});
					

								}, 200);


								ob.done = true;
							}
						}

						function redirect(href){
							window.location = href;
						}




						$(".sta-container").on("slideComplete", function(e){
							//window.location = ob.elmLink;

							slideComplete(e, $(this));
							
						})
				}

				

		};


		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
