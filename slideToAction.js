;(function ( $, window, document, undefined ) {

		var pluginName = "slideToAction",
				defaults = {
				slideHTML: "Slide To Action...",
				successHTML: "Success",
				maxWidth: false,
				touchOnly: false,
				classPrefix: "my",
				buttonHTML: "",
				afterSlide: function(){}
		};

		function Plugin ( element, options ) {
		
				perm = {};

		
				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._name = pluginName;this._defaults = defaults;			
				var flag = false;


				if(this.settings.touchOnly){

					if("ontouchstart" in window){}else{
						flag = true;
					}
				} 

				if(this.settings.maxWidth){
					if($(window).width() > this.settings.maxWidth){
						flag = true;
					}
				} 

				if(!flag){

					this.initialize();
					this.behaviour();
				
				
				}
			

		}

		Plugin.prototype = {
				initialize: function() {

						function setup(obj){

							var elm = {};
							var prefix = obj.settings.classPrefix;
							var outerHTML = "<div class='sta-container "+prefix+"-sta-container'>";
							var innerHTML = "<div class='sta-button "+prefix+"-sta-button'>"+obj.settings.buttonHTML+"</div>";
							innerHTML += "<span class='sta-slide-msg "+prefix+"-sta-slide-msg'>"+obj.settings.slideHTML+"</span>";
							innerHTML += "<div class='sta-success-msg "+prefix+"-sta-success-msg'>"+obj.settings.successHTML+"</div>";
							innerHTML += "</div>";

							$(obj.element).wrap(outerHTML);
							
							elm.container = $(obj.element).parent();
							perm.elm = $(obj.element).parent();

			

							elm.container.data("type", $(obj.element).prop("tagName"));

							if(elm.container.data("type") === "A"){
					
								elm.container.data("href", $(obj.element).attr("href"));
								elm.container.data("target", $(obj.element).attr("target"));
								elm.container.html(innerHTML);
							} else{ //only hide element if its not an anchor link, cuz thats how google likes it
								elm.container.append(innerHTML);
								$(obj.element)
									.addClass("sta-origin")
									.css("position", "absolute")
									.css("left", "-99999999px")
									.css("top", "-999999999px")
							}

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

						
						just.container = perm.elm;
						just.button = just.container.find(".sta-button");
						just.slideHTML = {};

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
								just.slideHTML = just.container.find(".sta-slide-msg");

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

								just.slideHTML.fadeOut(100);
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

						$(".sta-button").on("touchstart", function(e){
							
							e.preventDefault();
							$(this).trigger("mousedown");
						});

						just.container.on("touchmove", function(e){
							var md = $(this).data("sliding");
							if(md){

							
									slideMe(e, just);

							}

							e.preventDefault();
						});

						just.container.on("touchend", function(e){
							e.preventDefault();
							$(document).trigger("mouseup");
						});


						just.button.mousedown(function(e){
						
							console.log(1);

								var elm = $(this);
								preSlide(e, elm);

								ob.done = false;
								$(this).parent().data("sliding", true);

								just.button = $(this);
								just.container = $(this).parent();
								just.slideHTML = just.container.find(".sta-slide-msg");
								ob.os = true;
			

						});

						just.container.mousemove(function(e){

							var md = $(this).data("sliding");

							if(md){
							
								var elm = $(this);
									slideMe(e, just);
							}
						});

						if($(".sta-container").length == 1){

							$(window).mouseup(function(){
								//var d = $(".sta-button").data("md");
															
								setback();
							});

						}

   			

   						function setback(){
   							
   							var containers = $(".sta-container");


   							containers.each(function(){
   								if($(this).data("sliding")){
   									$(this).data("sliding", false);



   									$(this).find(".sta-button").animate({
   											marginLeft: 0
   										}, 500, function(){

   			
   											if(!$(this).parent().data("complete")){
   												$(this).parent().find(".sta-slide-msg").fadeIn(100);
   											} 
   											$(this).data("sliding", false);
   										})	
								}//if
   							})


   
						
   								
   						
   						}
   					

						function slideComplete(e, elm){
					
								elm.data("complete", true);
								console.log(elm.data("complete"));

								setTimeout(function(){
									
								
									
									elm.find(".sta-button").fadeOut(50, function(){
										
										elm.addClass("sta-complete");
										elm.find(".sta-success-msg").fadeIn(100);
										afterSlide();
										if(elm.data("type") === "A"){
												
											var url = elm.data("href");
											if(elm.data("target") === "_blank"){
													window.open(url,'_blank');
											} else{
												window.location = url;
											}

										} else{

											elm.find(".sta-origin").trigger("click");
										}
									});
								}, 200);

							
							
						}
						function redirect(href){
							window.location = href;
						}

						$(".sta-container").on("slideComplete", function(e){				
							//window.open(url);
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
