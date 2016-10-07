var app = angular.module('fluro', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ngTouch',
    'fluro.config',
    'fluro.content',
    'fluro.asset',
])



/////////////////////////////////////////////////////////////////////

function getMetaKey(stringKey) {
    var metas = document.getElementsByTagName('meta');

    for (i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("property") == stringKey) {
            return metas[i].getAttribute("content");
        }
    }
    return "";
}


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

app.config(function($stateProvider, $httpProvider, FluroProvider, $urlRouterProvider, $locationProvider) {

    ///////////////////////////////////////////////////

    var access_token = getMetaKey('fluro_application_key');

    //API URL
    var api_url = getMetaKey('fluro_url');

    FluroProvider.set({
        apiURL: api_url,
        token: access_token,
        sessionStorage: true,
    });

    ///////////////////////////////////////////

    //Http Intercpetor to check auth failures for xhr requests
    if (!access_token) {
        $httpProvider.defaults.withCredentials = true;
    }

    $httpProvider.interceptors.push('FluroAuthentication');

    ///////////////////////////////////////////

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");

    ///////////////////////////////////////////
    ///////////////////////////////////////////

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'routes/home/home.html',
        controller: 'HomeController',
        resolve: {
            session: function($stateParams, FluroContent) {
                return FluroContent.endpoint('session').get().$promise;
            }
        }
    });

    ///////////////////////////////////////////

    $urlRouterProvider.otherwise("/");


});

/////////////////////////////////////////////////////////////////////


app.run(function($rootScope, Asset, $state) {

    $rootScope.asset = Asset;
    $rootScope.$state = $state;

    //////////////////////////////////////////////////////////////////

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        throw error;
    });


    //////////////////////////////////////////////////////

    //Make touch devices more responsive
    FastClick.attach(document.body);

});
app.directive('compileHtml', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(function() {
                return scope.$eval(attrs.compileHtml);
            }, function(value) {



                element.html(value);
                $compile(element.contents())(scope);
            });
        }
    };
});

(function() {
    
    Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    Date.longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    Date.shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    Date.longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // defining patterns
    var replaceChars = {
        // Day
        d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
        D: function() { return Date.shortDays[this.getDay()]; },
        j: function() { return this.getDate(); },
        l: function() { return Date.longDays[this.getDay()]; },
        N: function() { return (this.getDay() == 0 ? 7 : this.getDay()); },
        S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
        w: function() { return this.getDay(); },
        z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
        // Week
        W: function() { 
            var target = new Date(this.valueOf());
            var dayNr = (this.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            var firstThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() !== 4) {
                target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
            }
            return 1 + Math.ceil((firstThursday - target) / 604800000);
        },
        // Month
        F: function() { return Date.longMonths[this.getMonth()]; },
        m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
        M: function() { return Date.shortMonths[this.getMonth()]; },
        n: function() { return this.getMonth() + 1; },
        t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
        // Year
        L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
        o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
        Y: function() { return this.getFullYear(); },
        y: function() { return ('' + this.getFullYear()).substr(2); },
        // Time
        a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
        A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
        B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
        g: function() { return this.getHours() % 12 || 12; },
        G: function() { return this.getHours(); },
        h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
        H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
        i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
        s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
        u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
    '0' : '')) + m; },
        // Timezone
        e: function() { return "Not Yet Supported"; },
        I: function() {
            var DST = null;
                for (var i = 0; i < 12; ++i) {
                        var d = new Date(this.getFullYear(), i, 1);
                        var offset = d.getTimezoneOffset();
    
                        if (DST === null) DST = offset;
                        else if (offset < DST) { DST = offset; break; }                     else if (offset > DST) break;
                }
                return (this.getTimezoneOffset() == DST) | 0;
            },
        O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
        P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
        T: function() { return this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); },
        Z: function() { return -this.getTimezoneOffset() * 60; },
        // Full Date/Time
        c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
        r: function() { return this.toString(); },
        U: function() { return this.getTime() / 1000; }
    };

    // Simulates PHP's date function
    Date.prototype.format = function(format) {
        var date = this;
        return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
            return (esc === '' && replaceChars[chr]) ? replaceChars[chr].call(date) : chr;
        });
    };

}).call(this);

(function () {
	'use strict';
	
	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @version 1.0.3
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */
	
	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/
	
	
	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} options The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;
	
		options = options || {};
	
		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;
	
	
		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;
	
	
		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;
	
	
		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;
	
	
		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;
	
	
		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;
	
	
		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;
	
	
		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;
	
		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;
	
		if (FastClick.notNeeded(layer)) {
			return;
		}
	
		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}
	
	
		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}
	
		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}
	
		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);
	
		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};
	
			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}
	
		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {
	
			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}
	
	
	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;
	
	
	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
	
	
	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);
	
	
	/**
	 * iOS 6.0(+?) requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);
	
	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;
	
	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {
	
		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}
	
			break;
		case 'input':
	
			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}
	
			break;
		case 'label':
		case 'video':
			return true;
		}
	
		return (/\bneedsclick\b/).test(target.className);
	};
	
	
	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}
	
			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};
	
	
	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;
	
		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}
	
		touch = event.changedTouches[0];
	
		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};
	
	FastClick.prototype.determineEventType = function(targetElement) {
	
		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}
	
		return 'click';
	};
	
	
	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;
	
		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};
	
	
	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;
	
		scrollParent = targetElement.fastClickScrollParent;
	
		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}
	
				parentElement = parentElement.parentElement;
			} while (parentElement);
		}
	
		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};
	
	
	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	
		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}
	
		return eventTarget;
	};
	
	
	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;
	
		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}
	
		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];
	
		if (deviceIsIOS) {
	
			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}
	
			if (!deviceIsIOS4) {
	
				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}
	
				this.lastTouchIdentifier = touch.identifier;
	
				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}
	
		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;
	
		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;
	
		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}
	
		return true;
	};
	
	
	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;
	
		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}
	
		return false;
	};
	
	
	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}
	
		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}
	
		return true;
	};
	
	
	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {
	
		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}
	
		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}
	
		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};
	
	
	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
	
		if (!this.trackingClick) {
			return true;
		}
	
		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}
	
		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;
	
		this.lastClickTime = event.timeStamp;
	
		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;
	
		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];
	
			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}
	
		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}
	
				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {
	
			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}
	
			this.focus(targetElement);
			this.sendClick(targetElement, event);
	
			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}
	
			return false;
		}
	
		if (deviceIsIOS && !deviceIsIOS4) {
	
			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}
	
		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}
	
		return false;
	};
	
	
	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};
	
	
	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {
	
		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}
	
		if (event.forwardedTouchEvent) {
			return true;
		}
	
		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}
	
		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
	
			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {
	
				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}
	
			// Cancel the event
			event.stopPropagation();
			event.preventDefault();
	
			return false;
		}
	
		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};
	
	
	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;
	
		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}
	
		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}
	
		permitted = this.onMouse(event);
	
		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}
	
		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};
	
	
	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;
	
		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}
	
		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};
	
	
	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
	
		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}
	
		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];
	
		if (chromeVersion) {
	
			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');
	
				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
	
			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}
	
		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
	
			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');
	
				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}
	
		// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none') {
			return true;
		}
	
		return false;
	};
	
	
	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} options The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};
	
	
	if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
	
		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

app.directive('definitionFieldRender', function($compile, $templateCache) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '=ngField', //Field information 
            model: '=ngModel', //Host object we look for the data on
        },
        templateUrl: 'definition-field-render/definition-field-render.html',
        link: function($scope, $element, $attrs) {

            //Get the model
            //$scope.model = $scope.host[$scope.field.key];

            $scope.showField = true;
            ////////////////////////////////////////

            $scope.viewInModal = function(item) {
                console.log('View in modal', item)
                //ModalService.view(item);
            }

            $scope.editInModal = function(item) {
                console.log('Edit in modal', item)
                //ModalService.edit(item);
            }

            ////////////////////////////////////////

            var template = '';


            switch ($scope.field.type) {
                case 'void':
                case 'null':
                case '':
                    return $element.empty();
                    break;
            }


            // if(!$scope.model[$scope.field.key]) {
            //     return $scope.showField = false;
            // }
            ////////////////////////////////////////


            if ($scope.field.type == 'group') {

                if ($scope.field.asObject) {

                    //Check if multi group or singular
                    if (_.isArray($scope.model[$scope.field.key])) {

                        // template = '<pre ng-repeat="group in model">{{group | json}}</pre>';
                        template = '<div ng-repeat="group in model[field.key]" class="panel panel-default"><div class="panel-heading">{{field.title}} {{$index + 1}}</div><div class="panel-body"><definition-field-render ng-model="group" ng-field="subField" ng-repeat="subField in field.fields"/></div></div>';
                    } else {
                        template = '<definition-field-render ng-model="model[field.key]" ng-field="subField" ng-repeat="subField in field.fields"/>';
                    }
                } else {
                    template = '<definition-field-render ng-model="model" ng-field="subField" ng-repeat="subField in field.fields"/>';

                    //<div ng-repeat="subField in field.fields"> <definition-field-render ng-host="host" ng-model="model" ng-field="subField"></definition-field-render> </div>'; // <definition-field-render ng-host="host" ng-model="group[subField.key]" ng-field="subField"></definition-field-render>
                    // template = '<div class="{{field.className}}"><div ng-repeat="subField in field.fields" class="{{subField.className}}"><pre>{{field | json}}</pre><definition-field-render ng-host="host" ng-model="host[subField.key]" ng-field="subField" ></definition-field-render></div></div>';

                }
            } else {
                //console.log('BOOOOM', $scope.field.key, $scope.model, $scope.model[$scope.field.key])
                //

                if (_.isArray($scope.model[$scope.field.key]) && $scope.model[$scope.field.key].length) {

                    template = $templateCache.get('definition-field-render/field-types/multiple-value.html');
                    //template = '<ol><li class="value in model[field.key]">{{value}}</li></ol>';
                } else {

                    if($scope.model[$scope.field.key]) {
                        template = $templateCache.get('definition-field-render/field-types/value.html');
                    }

                    //template = '<div>{{model[field.key]}}</div>';
                }

                /*
                if (_.isArray($scope.model[$scope.field.key])) {
                    template = '<ol><li class="value in model[field.key]">{{value}}</li></ol>';
                } else {
                    template = '<div>{{model}}</div>';
                }
                */
            }



            ////////////////////////////////////////

            if (template.length) {



                var cTemplate = $compile(template)($scope);

                var contentHolder = $element.find('[field-transclude]');


                if ($scope.field.type == 'group') {
                    contentHolder.addClass($scope.field.className).append(cTemplate);
                } else {
                    $element.addClass($scope.field.className);
                    contentHolder.replaceWith(cTemplate);
                }
            } else {



                $scope.showField = false;
                $element.empty();
            }


        }
    };



})

/////////////////////////////////////////////////////////////////

app.directive('viewDefinitionFields', function($compile) {
    return {
        restrict: 'E',
        scope:{
            'definition':"=",
            'dataModel':'=ngModel',
        },
        link: function($scope, $element, $attrs) {

            if($scope.definition) {

            
                $scope.fields = $scope.definition.fields;

                var template = '<definition-field-render ng-model="dataModel" ng-field="field" ng-repeat="field in fields"></definition-field-render>';
                var cTemplate = $compile(template)($scope);
                $element.append(cTemplate);

            }





            /**
            if($scope.definition) {
                $scope.flattenedFields = getFlattenedFields($scope.definition.fields);
            }
            var template = '<field-view-render ng-model="item.data[field.key]" ng-field="field" ng-repeat="field in flattenedFields"></field-view-render>';

            //Compile the template and replace
            var cTemplate = $compile(template)($scope);
            $element.append(cTemplate);

            /**/

        }
    };
});

app.filter('timeago', function(){
  return function(date){
    return moment(date).fromNow();
  };
});

app.controller('HomeController', function($scope, $state, $sessionStorage, FluroContent, session) {


	//This will be the user
	$scope.user = session;

	/**
	$scope.session = $sessionStorage;

	//////////////////////////

	if(!$scope.session.search) {
		$scope.session.search = {};
	}

	if(!$scope.session.selection) {
		$scope.session.selection = [];
	}

	//////////////////////////
    
    $scope.$watch('session.search.terms', function(keywords) {
        
        $scope.facets = [];
         
        if(!keywords || keywords.length < 2) {
            return;
        }
        
        $scope.session.search.status = 'processing';
        
        FluroContent.endpoint('content/search/' + keywords).query({
        	//types:['family','contact']
        }).$promise.then(function(res) {
            
            $scope.facets = _.groupBy(res, function(item) {
            	return item._type;
            });

            $scope.session.search.status = 'ready';
        }, function(res) {
            $scope.session.search.status = 'ready';
        });
    }, true)


    //////////////////////////

	$scope.contains = function(contact) {
		var match = _.find($scope.session.selection, {_id:contact._id});
		if(match) {
			return true;
		}
	}


	//////////////////////////

	$scope.toggle = function(contact) {
		if($scope.contains(contact)) {
			$scope.deselect(contact);
		} else {
			$scope.select(contact);
		}
	}

	//////////////////////////

	$scope.deselect = function(contact) {
		
		var match = _.find($scope.session.selection, {_id:contact._id});
		if(match) {
			_.pull($scope.session.selection, match);
		}

	}

	//////////////////////////

	$scope.select = function(contact) {
		if(!$scope.contains(contact)) {
			$scope.session.selection.push(contact);
		}
	}


	//////////////////////////

	$scope.edit = function(item) {
		switch(item._type) {
			case 'family':
				$state.go('family_edit', {id:item._id})
			break;
			case 'contact':
				$state.go('contact_edit', {id:item._id})
			break;
		}
	}

	//////////////////////////

	$scope.view = function(item) {
		switch(item._type) {
			case 'family':
				$state.go('family_view', {id:item._id})
			break;
			case 'contact':
				$state.go('contact_view', {id:item._id})
			break;
		}
	}

	//////////////////////////
	//////////////////////////
	//////////////////////////
	/**/



});
