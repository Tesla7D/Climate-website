/*
 * Maupload
 *
 * Version 1.0
 *
 * Maupload (or Multiple Ajax Upload) mimics uploading a file or files using Ajax, in that the 
 * window does not require refreshing to upload file(s). Works with the HTML5 multiple attribute.
 * https://github.com/BenLorantfy/maupload
 *
 * Open source under the MIT License (MIT)
 *
 * Copyright (c) 2014 Benjamin Lorantfy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
*/

(function($){
	$.fn.upload = function(action,posts,callback){

			if(this.is("input") && this.attr("type") == "file"){
				
				if(typeof posts == "undefined" || typeof posts == "object"){
					//Creates iframe with form
					var iframe = $("body").append('<iframe style = "display:none;"></iframe>').find("iframe");
					var contents = iframe.contents();
					var form = contents.find("body").append('<form action="' + action + '" method="post" enctype="multipart/form-data"></form>').find("form");
			
	
					//Adds hidden inputs for all post variables
					if(typeof posts == "object"){
						for(var property in posts){
						   form.append("<input type = 'hidden' name = '" + property + "' value = '" + posts[property].toString() + "'></input>");
						}
					}
	
					this.before(this.clone().val(''));
					form.append(this);
					
					//Submits the form
					form[0].submit();
					
					//When action is done executing call the callback function with data and remove iframe
					iframe.on("load",function(){
						var data = iframe.contents().find("body").html();
						iframe.remove();
						if(typeof callback == "function"){
							callback(data);
						}else if(typeof callback != "undefined"){
							throw "Callback function must be of type function.";
						}
						
						
					});

				}else{
					throw "Post variables must be provided in the form of an object.";
				}		
				
			}else{
				throw "Target must be an input element with a type attribute of 'file'.";
			}
			
			
			
			return this;

			
			

	};
}(jQuery));