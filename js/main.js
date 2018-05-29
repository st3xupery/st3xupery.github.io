(function() {
	var module = window;

	module.parseHTML = function(str) {
	  var tmp = document.implementation.createHTMLDocument();
	  tmp.body.innerHTML = str;
	  return tmp.body.children;
	};

	module.scrollTo = function(element, to, duration) {
		if (duration <= 0) return;
		var difference = to - element.scrollTop;
		var perTick = difference / duration * 10;

		setTimeout(function() {
			element.scrollTop = element.scrollTop + perTick;
			if (element.scrollTop === to) return;
			scrollTo(element, to, duration - 10);
		}, 10);
	};

	module.getMenuToggleEvent = function(toggle, menu, callback) {
		var active = true,
			body = document.body;

		function documentListener (e) {
			active = !active;
			if (!active || menu.contains(e.target)) return;
			callback(false);
			body.removeEventListener('click', documentListener);
		}

		function toggleMainNav() {
			if (!active) return;
			callback(true);
			body.addEventListener('click', documentListener);
		}

		return toggleMainNav;
	};

	function sticky(el, className) {
		if (!className) className = 'stuck';
		var elOffsetTop = el.getBoundingClientRect().top + document.body.scrollTop;
		var elSub = document.createElement('div');

		function scrollerReverse() {
			if (elOffsetTop >= window.pageYOffset) {
				el.classList.remove(className);
				el.parentNode.removeChild(elSub);
				window.removeEventListener('scroll', scrollerReverse);
				window.addEventListener('scroll', scroller);
			}
		}

		function scroller() {
			if (elOffsetTop < window.pageYOffset) {
				elSub.style.height = el.offsetHeight + 'px';
				el.parentNode.insertBefore(elSub, el.nextSibling);
				el.classList.add(className);
				window.removeEventListener('scroll', scroller);
				window.addEventListener('scroll', scrollerReverse);
			}
		}
		window.addEventListener('scroll', scroller);
	}

	module.sticky = sticky;
})();

sticky(document.getElementById('page-header'), 'docked');

// Directives
(function(){
	// Simple Toggle
	var simpleToggles = document.querySelectorAll('[data-toggle]');
	Array.prototype.forEach.call(simpleToggles, function(simpleToggleEl){
		var button = simpleToggleEl.querySelector('[data-toggle-button]'),
			menu = simpleToggleEl.querySelector('[data-toggle-menu]'),
			callback = function(toggle) {
				simpleToggleEl.classList[toggle ? 'add' : 'remove']('on');
			},
			clickHandler = getMenuToggleEvent(button, menu, callback);

		button.addEventListener('click', clickHandler, false);
	});
})();

// To Top
(function() {
	var sidebar = document.getElementById('sidebar'),
		toTopEl = document.getElementById('toTop'),
		toTop = toTopEl !== null ? 
			toTopEl.getBoundingClientRect().top + document.body.scrollTop - document.documentElement.offsetHeight + 20 : 0;

	document.addEventListener('scroll', function () {
		if (document.documentElement.offsetWidth >= 800) {
			if(document.body.scrollTop > toTop) {
				toTopEl.classList.add('fix');
				toTopEl.style.left = sidebar.getBoundingClientRect().left;
			} else {
				toTopEl.classList.remove('fix');
			}
		} else {
			toTopEl.classList.add('fix');
			toTopEl.style.right = 20;
		}
	});

	document.getElementById('toTop').addEventListener('click', function () {
		scrollTo(document.body, 0, 200);
	});
})();

(function () {

	// Prevent duplicate binding
	if (typeof(__SHARE_BUTTON_BINDED__) === 'undefined' || !__SHARE_BUTTON_BINDED__) {
		__SHARE_BUTTON_BINDED__ = true;
	} else {
		return;
	}

	function buildShareBox() {
		var url = this.getAttribute('data-url'),
			encodedUrl = encodeURIComponent(url),
			id = 'article-share-box-' + this.getAttribute('data-id'),
			html = [
				'<div id="' + id + '" class="article-share-box">',
					'<input class="article-share-input" value="' + url + '">',
					'<div class="article-share-links">',
						'<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="share-twitter" target="_blank" title="Twitter"></a>',
						'<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="share-facebook" target="_blank" title="Facebook"></a>',
						'<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="share-pinterest" target="_blank" title="Pinterest"></a>',
						'<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="share-google" target="_blank" title="Google+"></a>',
					'</div>',
				'</div>'
			].join('');
		return parseHTML(html)[0];
	}

	var articleShareLinks = document.getElementsByClassName('article-share-link');
	Array.prototype.forEach.call(articleShareLinks, function(articleShareLink) {
		var box = buildShareBox.call(articleShareLink),
			toggleCallback = function(toggle) {
				if(toggle) {
					var offset = articleShareLink.getBoundingClientRect();
					document.body.appendChild(box);
					box.classList.add('on');
					box.style.top = offset.top + document.body.scrollTop + 20 + 'px';
					box.style.left = offset.left + 'px';
				} else {
					document.body.removeChild(box);
				}
			},
			toggleEvent = getMenuToggleEvent(articleShareLink, box, toggleCallback);

		articleShareLink.addEventListener('click', toggleEvent, false);
	});

// Caption
	/*$('.article-entry').each(function(i){
		$(this).find('img').each(function(){
			if ($(this).parent().hasClass('fancybox')) {
				return;
			}
			var alt = this.alt;
			if (alt) {
				$(this).after('<span class="caption">' + alt + '</span>');
			}

			$(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
		});

		$(this).find('.fancybox').each(function(){
			$(this).attr('rel', 'article' + i);
		});
	});
	if ($.fancybox){
		$('.fancybox').fancybox();
	}*/

})();
