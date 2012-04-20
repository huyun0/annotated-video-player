(function (window, Popcorn) {
	"use strict";

	var document = window.document;

	//temp
	var styleSheet;

	Popcorn.basePlugin('annotation', function(options, base) {
		var media = this.media, targetTime,
		mediaContainer, mediaSection, article, img,
		mainSection,
		title, main, headline, text, i, p,
		aside, el, link;
		
		function setMediaTime(time) {
			if (time < 0) {
				time = 0;
			}

			if (media.duration) {
				if (media.duration > time) {
					targetTime = time;
					media.currentTime = time;
				}
			} else {
				targetTime = time;
				media.addEventListener('loadedmetadata', function() {
					if (media.duration > targetTime) {
						media.currentTime = targetTime;
					}
				}, false);
			}
		}

		function mediaLoaded() {
			var width = img.videoWidth || img.naturalWidth || img.width;

			if (mediaSection) {
				mediaSection.style.width = width + 'px';
			}
		}
		
		function getMediaSources(video, sources) {
			var i;
			
		}
		
		if (!base.target || !options.title) {
			return;
		}
		
		//todo: add stylesheet with basePlugin
		if (!styleSheet) {
			styleSheet = document.createElement('style');
			styleSheet.setAttribute('type', 'text/css');
			styleSheet.appendChild(
				document.createTextNode('.popcorn-annotation { display: none; }\n' +
					'.popcorn-annotation.active { display: block; }\n' +
					'.popcorn-annotation > .title + div.media-left section.image { float: left; }\n' +
					'.popcorn-annotation > .title + div.media-right section.image { float: right; }\n' +
					'.popcorn-annotation > .title + div .clear { clear: both; border: none; }\n' +
					'.popcorn-annotation aside { float: right; }' +
					'.popcorn-annotation aside > a { display: block; }'
			));
			document.head.appendChild(styleSheet);
		}

		base.makeContainer();
		
		title = document.createElement('div');
		title.appendChild(document.createTextNode(options.title));
		base.container.appendChild(title);
		base.addClass(title, 'title');

		main = document.createElement('div');
		if (options.template) {
			base.addClass(main, options.template);
		}
		base.container.appendChild(main);

		if (options.image || options.video) {
			//set up video or image
			//todo: put this in load

			mediaContainer = document.createElement('div');
			base.addClass(mediaContainer, 'media-container');
			options.mediaContainer = mediaContainer;

			mediaSection = document.createElement('section');

			if (options.video) {
				img = document.createElement('video');
				img.controls = true;
				if (options.poster) {
					img.setAttribute('poster', options.poster);
				} else if (options.image) {
					img.setAttribute('poster', options.image);
				}
				
				//todo: get multiple sources
				img.src = options.video;
				base.addClass(mediaSection, 'video');
				img.addEventListener('loadedmetadata', mediaLoaded, false);
			} else if (options.image) {
				img = document.createElement('img');
				//todo: get multiple sources
				img.src = options.image;
				base.addClass(mediaSection, 'image');

				img.addEventListener('load', mediaLoaded, false);
			} else if (options.map) {

			}

			mediaContainer.appendChild(img);

			//caption
			if (options.caption) {
				p = document.createElement('p');
				base.addClass(p, 'caption');
				p.appendChild(document.createTextNode(options.caption));
				mediaContainer.appendChild(p);
			}

			mediaSection.appendChild(mediaContainer);
			main.appendChild(mediaSection);
		}
		
		if (options.related && options.related.length || options.extra) {
			aside = document.createElement('aside');

			if (options.related && options.related.length) {
				el = document.createElement('h3');
				el.appendChild(document.createTextNode('Related Links'));
				aside.appendChild(el);

				for (i = 0; i < options.related.length; i++) {
					link = options.related[i];
					el = document.createElement('a');
					el.appendChild(document.createTextNode(link.text));
					el.setAttribute('href', link.link);
					aside.appendChild(el);
				}
			}

			if (options.extra) {
				el = document.createElement('div');
				base.addClass(el, 'extra');
				el.innerHTML = options.extra;
				aside.appendChild(el);
			}

			main.appendChild(aside);
		}


		mainSection = document.createElement('section');
		
		headline = document.createElement('div');
		base.addClass(headline, 'headline');
		headline.appendChild(document.createTextNode(options.headline));
		mainSection.appendChild(headline);
		
		if (options.text) {
			text = options.text.split(/[\n\r]+/);
			for (i = 0; i < text.length; i++) {
				p = document.createElement('p');
				p.appendChild(document.createTextNode(text[i]));
				mainSection.appendChild(p);
			}
		}

		main.appendChild(mainSection);
		main.appendChild(document.createElement('hr'));
		base.addClass(main.lastChild, 'clear');

		return {
			start: function( event, options ) {
				base.addClass(base.container, 'active');
			},
			end: function( event, options ) {
				base.removeClass(base.container, 'active');
			}
		};
	});
	
})( window, Popcorn );