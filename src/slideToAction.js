
;(function ( $, window, document, undefined ) {

		var pluginName = "slideToAction",
				defaults = {
				slideMsg: "Slide To Action...",
				successMsg: "Success",
				minWidth: 400,
				classPrefix: "my",
				buttonHTML: "thug",
				swapAtBp: true,
				afterSlide: function(){}
		};

		function Plugin ( element, options ) {


				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._name = pluginName;this._defaults = defaults;
			
				this.initialize();
				this.behaviour();

				
		}



		Plugin.prototype = {
				initialize: function() {

						function setup(obj){

							var elm = {};
							var prefix = obj.settings.classPrefix;
							var innerHTML = "<div class='sta-container "+prefix+"-sta-container'>";
							innerHTML += "<div class='sta-button "+prefix+"-sta-button'>"+obj.settings.buttonHTML+"</div>";
							innerHTML += "<span class='sta-slide-msg "+prefix+"-sta-slide-msg'>"+obj.settings.slideMsg+"</span>";
							innerHTML += "<div class='sta-success-msg "+prefix+"-sta-success-msg'>"+obj.settings.successMsg+"</div>";
							innerHTML += "</div>";

							$(obj.element).replaceWith(innerHTML);
							
							elm.container = $(obj.element).parent();


							//check what kinda ting it is
							elm.container.data("type", $(obj.element).prop("tagName"));
							if(elm.container.data("type") === "A"){
								console.log("its a bit of data");
								elm.container.data("href", $(obj.element).attr("href"));
							}

							elm.container.html(innerHTML);

						}


						setup(this);
					},

				behaviour: function () {
						var ob = {};
						var sizes = {};
						var just = {};

						var button = $(".sta-button");
						var container = $(".sta-container");
						var afterSlide = this.settings.afterSlide;
						
						ob.mousedown = false;
						ob.done = false;
						ob.audio = loadSound("clak.mp3");

						just.button = {};
						just.container = {};
						just.slideMsg = {};

						sizes.pl = 0;
						sizes.pr = 0;
						sizes.cw = 0;
						sizes.bw = 0;
						sizes.bwhalf = 0;
						sizes.realinner = 0;
						sizes.rightpos = 0;
						sizes.rightcheck = 0;
						sizes.leftcheck = 0;

				

					
						function preSlide(e, elm){
								ob.done = false;
								just.button = elm;
								just.container = elm.parent();
								just.slideMsg = just.container.find(".sta-slide-msg");

								sizes.pl = parseInt(just.container.css("padding-left").replace("px", ""), 10);
								sizes.pr = parseInt(just.container.css("padding-right").replace("px", ""), 10);
								sizes.cw = just.container.innerWidth();
								sizes.bw = just.button.outerWidth();
								sizes.bwhalf = sizes.bw / 2;

								sizes.realinner = sizes.cw - sizes.pl;
								sizes.realinner = sizes.realinner - sizes.pr;

								sizes.rightpos = sizes.realinner - sizes.bw;

								sizes.rightcheck = sizes.cw - sizes.bwhalf;
								sizes.rightcheck = sizes.rightcheck - sizes.pr;

								sizes.leftcheck = sizes.bwhalf + sizes.pl;
								sizes.offset = just.container.offset();

								just.slideMsg.fadeOut(100);
						}



						function slideMe(e, just){
							var relativeX = 0;
							if("ontouchstart" in window){
								relativeX = (e.originalEvent.targetTouches[0].pageX - sizes.offset.left); //set up if duh
							} else{
								relativeX = (e.pageX - sizes.offset.left);
							}

							if(relativeX < sizes.leftcheck){

								just.button.css("margin-left", 0);
							} else if(relativeX > sizes.rightcheck){
								just.button.css("margin-left", sizes.rightpos);
								just.container.trigger("slideComplete");

							} else{
								just.button.css("margin-left", relativeX-sizes.bwhalf);
							}
						}



						button.on("touchstart", function(e){
							
							e.preventDefault();
							$(this).trigger("mousedown");
						});

						container.on("touchmove", function(e){
							var md = $(this).find(".sta-button").data("md");
							if(md){

							
									slideMe(e, just);
							}

							e.preventDefault();
						});

						container.on("touchend", function(e){
							e.preventDefault();
							$(document).trigger("mouseup");
						});


						button.mousedown(function(e){
							var elm = $(this);
							preSlide(e, elm);

							ob.done = false;
							$(this).data("md", true);

							just.button = $(this);
							just.container = $(this).parent();
							just.slideMsg = just.container.find(".sta-slide-msg");
						});

						container.mousemove(function(e){

							var md = $(this).find(".sta-button").data("md");
							if(md){
							
								var elm = $(this);
									slideMe(e, just);
							}
						});

						$(document).mouseup(function(){
							slideBack();
						});

						
						function loadSound(uri){
							var audio = new Audio();
							audio.src = uri;
							return audio;
						}

						function playSound(){        	
					      	ob.audio.play();      
   						}

   						function slideBack(){
   							$(".sta-button").data("md", false); //doing it to all

							if(!ob.done){
								$(".sta-button").animate({
									marginLeft: 0
								}, 500, function(){
									//$(".sta-slide-msg").fadeIn(100);
									//ob.done = false;
								});	
							}
   						}

   						playSound();

						function slideComplete(e, elm){
							if(!ob.done){

								setTimeout(function(){
									playSound();
								}, 50);


								setTimeout(function(){
									afterSlide();

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

		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
