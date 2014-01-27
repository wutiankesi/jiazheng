define("js/home/silder", [ "jquery", "../common/jquery.flexslider", "../common/CD", "../common/util" ], function(require, exports, module) {
    var $ = require("jquery");
    var ss = require("../common/jquery.flexslider");
    var CD = require("../common/CD");
    var util = require("../common/util");
    exports.init = function(dom_selector) {
        var dom = $("#slider");
        var size = {
            width: 598,
            height: 320
        };
        dom.find("img").each(function(i, img) {
            util.imgLoad(img, function() {
                util.fixImg(img, size);
            });
        });
        dom.flexslider({
            slideshowSpeed: 3e3,
            animation: "slide",
            animationLoop: true
        });
    };
});

/*
 * jQuery FlexSlider v2.2.2
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
(function($) {
    //FlexSlider: Object Instance
    $.flexslider = function(el, options) {
        var slider = $(el);
        // making variables public
        slider.vars = $.extend({}, $.flexslider.defaults, options);
        var namespace = slider.vars.namespace, msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture, touch = ("ontouchstart" in window || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch, // depricating this idea, as devices are being released with both of these events
        //eventType = (touch) ? "touchend" : "click",
        eventType = "click touchend MSPointerUp", watchedEvent = "", watchedEventClearTimer, vertical = slider.vars.direction === "vertical", reverse = slider.vars.reverse, carousel = slider.vars.itemWidth > 0, fade = slider.vars.animation === "fade", asNav = slider.vars.asNavFor !== "", methods = {}, focused = true;
        // Store a reference to the slider object
        $.data(el, "flexslider", slider);
        // Private slider methods
        methods = {
            init: function() {
                slider.animating = false;
                // Get current slide and make sure it is a number
                slider.currentSlide = parseInt(slider.vars.startAt ? slider.vars.startAt : 0, 10);
                if (isNaN(slider.currentSlide)) slider.currentSlide = 0;
                slider.animatingTo = slider.currentSlide;
                slider.atEnd = slider.currentSlide === 0 || slider.currentSlide === slider.last;
                slider.containerSelector = slider.vars.selector.substr(0, slider.vars.selector.search(" "));
                slider.slides = $(slider.vars.selector, slider);
                slider.container = $(slider.containerSelector, slider);
                slider.count = slider.slides.length;
                // SYNC:
                slider.syncExists = $(slider.vars.sync).length > 0;
                // SLIDE:
                if (slider.vars.animation === "slide") slider.vars.animation = "swing";
                slider.prop = vertical ? "top" : "marginLeft";
                slider.args = {};
                // SLIDESHOW:
                slider.manualPause = false;
                slider.stopped = false;
                //PAUSE WHEN INVISIBLE
                slider.started = false;
                slider.startTimeout = null;
                // TOUCH/USECSS:
                slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && function() {
                    var obj = document.createElement("div"), props = [ "perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective" ];
                    for (var i in props) {
                        if (obj.style[props[i]] !== undefined) {
                            slider.pfx = props[i].replace("Perspective", "").toLowerCase();
                            slider.prop = "-" + slider.pfx + "-transform";
                            return true;
                        }
                    }
                    return false;
                }();
                // CONTROLSCONTAINER:
                if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
                // MANUAL:
                if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);
                // RANDOMIZE:
                if (slider.vars.randomize) {
                    slider.slides.sort(function() {
                        return Math.round(Math.random()) - .5;
                    });
                    slider.container.empty().append(slider.slides);
                }
                slider.doMath();
                // INIT
                slider.setup("init");
                // CONTROLNAV:
                if (slider.vars.controlNav) methods.controlNav.setup();
                // DIRECTIONNAV:
                if (slider.vars.directionNav) methods.directionNav.setup();
                // KEYBOARD:
                if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
                    $(document).bind("keyup", function(event) {
                        var keycode = event.keyCode;
                        if (!slider.animating && (keycode === 39 || keycode === 37)) {
                            var target = keycode === 39 ? slider.getTarget("next") : keycode === 37 ? slider.getTarget("prev") : false;
                            slider.flexAnimate(target, slider.vars.pauseOnAction);
                        }
                    });
                }
                // MOUSEWHEEL:
                if (slider.vars.mousewheel) {
                    slider.bind("mousewheel", function(event, delta, deltaX, deltaY) {
                        event.preventDefault();
                        var target = delta < 0 ? slider.getTarget("next") : slider.getTarget("prev");
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                    });
                }
                // PAUSEPLAY
                if (slider.vars.pausePlay) methods.pausePlay.setup();
                //PAUSE WHEN INVISIBLE
                if (slider.vars.slideshow && slider.vars.pauseInvisible) methods.pauseInvisible.init();
                // SLIDSESHOW
                if (slider.vars.slideshow) {
                    if (slider.vars.pauseOnHover) {
                        slider.hover(function() {
                            if (!slider.manualPlay && !slider.manualPause) slider.pause();
                        }, function() {
                            if (!slider.manualPause && !slider.manualPlay && !slider.stopped) slider.play();
                        });
                    }
                    // initialize animation
                    //If we're visible, or we don't use PageVisibility API
                    if (!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
                        slider.vars.initDelay > 0 ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
                    }
                }
                // ASNAV:
                if (asNav) methods.asNav.setup();
                // TOUCH
                if (touch && slider.vars.touch) methods.touch();
                // FADE&&SMOOTHHEIGHT || SLIDE:
                if (!fade || fade && slider.vars.smoothHeight) $(window).bind("resize orientationchange focus", methods.resize);
                slider.find("img").attr("draggable", "false");
                // API: start() Callback
                setTimeout(function() {
                    slider.vars.start(slider);
                }, 200);
            },
            asNav: {
                setup: function() {
                    slider.asNav = true;
                    slider.animatingTo = Math.floor(slider.currentSlide / slider.move);
                    slider.currentItem = slider.currentSlide;
                    slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
                    if (!msGesture) {
                        slider.slides.on(eventType, function(e) {
                            e.preventDefault();
                            var $slide = $(this), target = $slide.index();
                            var posFromLeft = $slide.offset().left - $(slider).scrollLeft();
                            // Find position of slide relative to left of slider container
                            if (posFromLeft <= 0 && $slide.hasClass(namespace + "active-slide")) {
                                slider.flexAnimate(slider.getTarget("prev"), true);
                            } else if (!$(slider.vars.asNavFor).data("flexslider").animating && !$slide.hasClass(namespace + "active-slide")) {
                                slider.direction = slider.currentItem < target ? "next" : "prev";
                                slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                            }
                        });
                    } else {
                        el._slider = slider;
                        slider.slides.each(function() {
                            var that = this;
                            that._gesture = new MSGesture();
                            that._gesture.target = that;
                            that.addEventListener("MSPointerDown", function(e) {
                                e.preventDefault();
                                if (e.currentTarget._gesture) e.currentTarget._gesture.addPointer(e.pointerId);
                            }, false);
                            that.addEventListener("MSGestureTap", function(e) {
                                e.preventDefault();
                                var $slide = $(this), target = $slide.index();
                                if (!$(slider.vars.asNavFor).data("flexslider").animating && !$slide.hasClass("active")) {
                                    slider.direction = slider.currentItem < target ? "next" : "prev";
                                    slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                                }
                            });
                        });
                    }
                }
            },
            controlNav: {
                setup: function() {
                    if (!slider.manualControls) {
                        methods.controlNav.setupPaging();
                    } else {
                        // MANUALCONTROLS:
                        methods.controlNav.setupManual();
                    }
                },
                setupPaging: function() {
                    var type = slider.vars.controlNav === "thumbnails" ? "control-thumbs" : "control-paging", j = 1, item, slide;
                    slider.controlNavScaffold = $('<ol class="' + namespace + "control-nav " + namespace + type + '"></ol>');
                    if (slider.pagingCount > 1) {
                        for (var i = 0; i < slider.pagingCount; i++) {
                            slide = slider.slides.eq(i);
                            item = slider.vars.controlNav === "thumbnails" ? '<img src="' + slide.attr("data-thumb") + '"/>' : "<a>" + j + "</a>";
                            if ("thumbnails" === slider.vars.controlNav && true === slider.vars.thumbCaptions) {
                                var captn = slide.attr("data-thumbcaption");
                                if ("" != captn && undefined != captn) item += '<span class="' + namespace + 'caption">' + captn + "</span>";
                            }
                            slider.controlNavScaffold.append("<li>" + item + "</li>");
                            j++;
                        }
                    }
                    // CONTROLSCONTAINER:
                    slider.controlsContainer ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
                    methods.controlNav.set();
                    methods.controlNav.active();
                    slider.controlNavScaffold.delegate("a, img", eventType, function(event) {
                        event.preventDefault();
                        if (watchedEvent === "" || watchedEvent === event.type) {
                            var $this = $(this), target = slider.controlNav.index($this);
                            if (!$this.hasClass(namespace + "active")) {
                                slider.direction = target > slider.currentSlide ? "next" : "prev";
                                slider.flexAnimate(target, slider.vars.pauseOnAction);
                            }
                        }
                        // setup flags to prevent event duplication
                        if (watchedEvent === "") {
                            watchedEvent = event.type;
                        }
                        methods.setToClearWatchedEvent();
                    });
                },
                setupManual: function() {
                    slider.controlNav = slider.manualControls;
                    methods.controlNav.active();
                    slider.controlNav.bind(eventType, function(event) {
                        event.preventDefault();
                        if (watchedEvent === "" || watchedEvent === event.type) {
                            var $this = $(this), target = slider.controlNav.index($this);
                            if (!$this.hasClass(namespace + "active")) {
                                target > slider.currentSlide ? slider.direction = "next" : slider.direction = "prev";
                                slider.flexAnimate(target, slider.vars.pauseOnAction);
                            }
                        }
                        // setup flags to prevent event duplication
                        if (watchedEvent === "") {
                            watchedEvent = event.type;
                        }
                        methods.setToClearWatchedEvent();
                    });
                },
                set: function() {
                    var selector = slider.vars.controlNav === "thumbnails" ? "img" : "a";
                    slider.controlNav = $("." + namespace + "control-nav li " + selector, slider.controlsContainer ? slider.controlsContainer : slider);
                },
                active: function() {
                    slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
                },
                update: function(action, pos) {
                    if (slider.pagingCount > 1 && action === "add") {
                        slider.controlNavScaffold.append($("<li><a>" + slider.count + "</a></li>"));
                    } else if (slider.pagingCount === 1) {
                        slider.controlNavScaffold.find("li").remove();
                    } else {
                        slider.controlNav.eq(pos).closest("li").remove();
                    }
                    methods.controlNav.set();
                    slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length ? slider.update(pos, action) : methods.controlNav.active();
                }
            },
            directionNav: {
                setup: function() {
                    var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + "</a></li></ul>");
                    // CONTROLSCONTAINER:
                    if (slider.controlsContainer) {
                        $(slider.controlsContainer).append(directionNavScaffold);
                        slider.directionNav = $("." + namespace + "direction-nav li a", slider.controlsContainer);
                    } else {
                        slider.append(directionNavScaffold);
                        slider.directionNav = $("." + namespace + "direction-nav li a", slider);
                    }
                    methods.directionNav.update();
                    slider.directionNav.bind(eventType, function(event) {
                        event.preventDefault();
                        var target;
                        if (watchedEvent === "" || watchedEvent === event.type) {
                            target = $(this).hasClass(namespace + "next") ? slider.getTarget("next") : slider.getTarget("prev");
                            slider.flexAnimate(target, slider.vars.pauseOnAction);
                        }
                        // setup flags to prevent event duplication
                        if (watchedEvent === "") {
                            watchedEvent = event.type;
                        }
                        methods.setToClearWatchedEvent();
                    });
                },
                update: function() {
                    var disabledClass = namespace + "disabled";
                    if (slider.pagingCount === 1) {
                        slider.directionNav.addClass(disabledClass).attr("tabindex", "-1");
                    } else if (!slider.vars.animationLoop) {
                        if (slider.animatingTo === 0) {
                            slider.directionNav.removeClass(disabledClass).filter("." + namespace + "prev").addClass(disabledClass).attr("tabindex", "-1");
                        } else if (slider.animatingTo === slider.last) {
                            slider.directionNav.removeClass(disabledClass).filter("." + namespace + "next").addClass(disabledClass).attr("tabindex", "-1");
                        } else {
                            slider.directionNav.removeClass(disabledClass).removeAttr("tabindex");
                        }
                    } else {
                        slider.directionNav.removeClass(disabledClass).removeAttr("tabindex");
                    }
                }
            },
            pausePlay: {
                setup: function() {
                    var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');
                    // CONTROLSCONTAINER:
                    if (slider.controlsContainer) {
                        slider.controlsContainer.append(pausePlayScaffold);
                        slider.pausePlay = $("." + namespace + "pauseplay a", slider.controlsContainer);
                    } else {
                        slider.append(pausePlayScaffold);
                        slider.pausePlay = $("." + namespace + "pauseplay a", slider);
                    }
                    methods.pausePlay.update(slider.vars.slideshow ? namespace + "pause" : namespace + "play");
                    slider.pausePlay.bind(eventType, function(event) {
                        event.preventDefault();
                        if (watchedEvent === "" || watchedEvent === event.type) {
                            if ($(this).hasClass(namespace + "pause")) {
                                slider.manualPause = true;
                                slider.manualPlay = false;
                                slider.pause();
                            } else {
                                slider.manualPause = false;
                                slider.manualPlay = true;
                                slider.play();
                            }
                        }
                        // setup flags to prevent event duplication
                        if (watchedEvent === "") {
                            watchedEvent = event.type;
                        }
                        methods.setToClearWatchedEvent();
                    });
                },
                update: function(state) {
                    state === "play" ? slider.pausePlay.removeClass(namespace + "pause").addClass(namespace + "play").html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + "play").addClass(namespace + "pause").html(slider.vars.pauseText);
                }
            },
            touch: function() {
                var startX, startY, offset, cwidth, dx, startT, scrolling = false, localX = 0, localY = 0, accDx = 0;
                if (!msGesture) {
                    el.addEventListener("touchstart", onTouchStart, false);
                    function onTouchStart(e) {
                        if (slider.animating) {
                            e.preventDefault();
                        } else if (window.navigator.msPointerEnabled || e.touches.length === 1) {
                            slider.pause();
                            // CAROUSEL:
                            cwidth = vertical ? slider.h : slider.w;
                            startT = Number(new Date());
                            // CAROUSEL:
                            // Local vars for X and Y points.
                            localX = e.touches[0].pageX;
                            localY = e.touches[0].pageY;
                            offset = carousel && reverse && slider.animatingTo === slider.last ? 0 : carousel && reverse ? slider.limit - (slider.itemW + slider.vars.itemMargin) * slider.move * slider.animatingTo : carousel && slider.currentSlide === slider.last ? slider.limit : carousel ? (slider.itemW + slider.vars.itemMargin) * slider.move * slider.currentSlide : reverse ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                            startX = vertical ? localY : localX;
                            startY = vertical ? localX : localY;
                            el.addEventListener("touchmove", onTouchMove, false);
                            el.addEventListener("touchend", onTouchEnd, false);
                        }
                    }
                    function onTouchMove(e) {
                        // Local vars for X and Y points.
                        localX = e.touches[0].pageX;
                        localY = e.touches[0].pageY;
                        dx = vertical ? startX - localY : startX - localX;
                        scrolling = vertical ? Math.abs(dx) < Math.abs(localX - startY) : Math.abs(dx) < Math.abs(localY - startY);
                        var fxms = 500;
                        if (!scrolling || Number(new Date()) - startT > fxms) {
                            e.preventDefault();
                            if (!fade && slider.transitions) {
                                if (!slider.vars.animationLoop) {
                                    dx = dx / (slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0 ? Math.abs(dx) / cwidth + 2 : 1);
                                }
                                slider.setProps(offset + dx, "setTouch");
                            }
                        }
                    }
                    function onTouchEnd(e) {
                        // finish the touch by undoing the touch session
                        el.removeEventListener("touchmove", onTouchMove, false);
                        if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                            var updateDx = reverse ? -dx : dx, target = updateDx > 0 ? slider.getTarget("next") : slider.getTarget("prev");
                            if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth / 2)) {
                                slider.flexAnimate(target, slider.vars.pauseOnAction);
                            } else {
                                if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                            }
                        }
                        el.removeEventListener("touchend", onTouchEnd, false);
                        startX = null;
                        startY = null;
                        dx = null;
                        offset = null;
                    }
                } else {
                    el.style.msTouchAction = "none";
                    el._gesture = new MSGesture();
                    el._gesture.target = el;
                    el.addEventListener("MSPointerDown", onMSPointerDown, false);
                    el._slider = slider;
                    el.addEventListener("MSGestureChange", onMSGestureChange, false);
                    el.addEventListener("MSGestureEnd", onMSGestureEnd, false);
                    function onMSPointerDown(e) {
                        e.stopPropagation();
                        if (slider.animating) {
                            e.preventDefault();
                        } else {
                            slider.pause();
                            el._gesture.addPointer(e.pointerId);
                            accDx = 0;
                            cwidth = vertical ? slider.h : slider.w;
                            startT = Number(new Date());
                            // CAROUSEL:
                            offset = carousel && reverse && slider.animatingTo === slider.last ? 0 : carousel && reverse ? slider.limit - (slider.itemW + slider.vars.itemMargin) * slider.move * slider.animatingTo : carousel && slider.currentSlide === slider.last ? slider.limit : carousel ? (slider.itemW + slider.vars.itemMargin) * slider.move * slider.currentSlide : reverse ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                        }
                    }
                    function onMSGestureChange(e) {
                        e.stopPropagation();
                        var slider = e.target._slider;
                        if (!slider) {
                            return;
                        }
                        var transX = -e.translationX, transY = -e.translationY;
                        //Accumulate translations.
                        accDx = accDx + (vertical ? transY : transX);
                        dx = accDx;
                        scrolling = vertical ? Math.abs(accDx) < Math.abs(-transX) : Math.abs(accDx) < Math.abs(-transY);
                        if (e.detail === e.MSGESTURE_FLAG_INERTIA) {
                            setImmediate(function() {
                                el._gesture.stop();
                            });
                            return;
                        }
                        if (!scrolling || Number(new Date()) - startT > 500) {
                            e.preventDefault();
                            if (!fade && slider.transitions) {
                                if (!slider.vars.animationLoop) {
                                    dx = accDx / (slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0 ? Math.abs(accDx) / cwidth + 2 : 1);
                                }
                                slider.setProps(offset + dx, "setTouch");
                            }
                        }
                    }
                    function onMSGestureEnd(e) {
                        e.stopPropagation();
                        var slider = e.target._slider;
                        if (!slider) {
                            return;
                        }
                        if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                            var updateDx = reverse ? -dx : dx, target = updateDx > 0 ? slider.getTarget("next") : slider.getTarget("prev");
                            if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth / 2)) {
                                slider.flexAnimate(target, slider.vars.pauseOnAction);
                            } else {
                                if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                            }
                        }
                        startX = null;
                        startY = null;
                        dx = null;
                        offset = null;
                        accDx = 0;
                    }
                }
            },
            resize: function() {
                if (!slider.animating && slider.is(":visible")) {
                    if (!carousel) slider.doMath();
                    if (fade) {
                        // SMOOTH HEIGHT:
                        methods.smoothHeight();
                    } else if (carousel) {
                        //CAROUSEL:
                        slider.slides.width(slider.computedW);
                        slider.update(slider.pagingCount);
                        slider.setProps();
                    } else if (vertical) {
                        //VERTICAL:
                        slider.viewport.height(slider.h);
                        slider.setProps(slider.h, "setTotal");
                    } else {
                        // SMOOTH HEIGHT:
                        if (slider.vars.smoothHeight) methods.smoothHeight();
                        slider.newSlides.width(slider.computedW);
                        slider.setProps(slider.computedW, "setTotal");
                    }
                }
            },
            smoothHeight: function(dur) {
                if (!vertical || fade) {
                    var $obj = fade ? slider : slider.viewport;
                    dur ? $obj.animate({
                        height: slider.slides.eq(slider.animatingTo).height()
                    }, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
                }
            },
            sync: function(action) {
                var $obj = $(slider.vars.sync).data("flexslider"), target = slider.animatingTo;
                switch (action) {
                  case "animate":
                    $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true);
                    break;

                  case "play":
                    if (!$obj.playing && !$obj.asNav) {
                        $obj.play();
                    }
                    break;

                  case "pause":
                    $obj.pause();
                    break;
                }
            },
            uniqueID: function($clone) {
                $clone.find("[id]").each(function() {
                    var $this = $(this);
                    $this.attr("id", $this.attr("id") + "_clone");
                });
                return $clone;
            },
            pauseInvisible: {
                visProp: null,
                init: function() {
                    var prefixes = [ "webkit", "moz", "ms", "o" ];
                    if ("hidden" in document) return "hidden";
                    for (var i = 0; i < prefixes.length; i++) {
                        if (prefixes[i] + "Hidden" in document) methods.pauseInvisible.visProp = prefixes[i] + "Hidden";
                    }
                    if (methods.pauseInvisible.visProp) {
                        var evtname = methods.pauseInvisible.visProp.replace(/[H|h]idden/, "") + "visibilitychange";
                        document.addEventListener(evtname, function() {
                            if (methods.pauseInvisible.isHidden()) {
                                if (slider.startTimeout) clearTimeout(slider.startTimeout); else slider.pause();
                            } else {
                                if (slider.started) slider.play(); else slider.vars.initDelay > 0 ? setTimeout(slider.play, slider.vars.initDelay) : slider.play();
                            }
                        });
                    }
                },
                isHidden: function() {
                    return document[methods.pauseInvisible.visProp] || false;
                }
            },
            setToClearWatchedEvent: function() {
                clearTimeout(watchedEventClearTimer);
                watchedEventClearTimer = setTimeout(function() {
                    watchedEvent = "";
                }, 3e3);
            }
        };
        // public methods
        slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
            if (!slider.vars.animationLoop && target !== slider.currentSlide) {
                slider.direction = target > slider.currentSlide ? "next" : "prev";
            }
            if (asNav && slider.pagingCount === 1) slider.direction = slider.currentItem < target ? "next" : "prev";
            if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
                if (asNav && withSync) {
                    var master = $(slider.vars.asNavFor).data("flexslider");
                    slider.atEnd = target === 0 || target === slider.count - 1;
                    master.flexAnimate(target, true, false, true, fromNav);
                    slider.direction = slider.currentItem < target ? "next" : "prev";
                    master.direction = slider.direction;
                    if (Math.ceil((target + 1) / slider.visible) - 1 !== slider.currentSlide && target !== 0) {
                        slider.currentItem = target;
                        slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
                        target = Math.floor(target / slider.visible);
                    } else {
                        slider.currentItem = target;
                        slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
                        return false;
                    }
                }
                slider.animating = true;
                slider.animatingTo = target;
                // SLIDESHOW:
                if (pause) slider.pause();
                // API: before() animation Callback
                slider.vars.before(slider);
                // SYNC:
                if (slider.syncExists && !fromNav) methods.sync("animate");
                // CONTROLNAV
                if (slider.vars.controlNav) methods.controlNav.active();
                // !CAROUSEL:
                // CANDIDATE: slide active class (for add/remove slide)
                if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
                // INFINITE LOOP:
                // CANDIDATE: atEnd
                slider.atEnd = target === 0 || target === slider.last;
                // DIRECTIONNAV:
                if (slider.vars.directionNav) methods.directionNav.update();
                if (target === slider.last) {
                    // API: end() of cycle Callback
                    slider.vars.end(slider);
                    // SLIDESHOW && !INFINITE LOOP:
                    if (!slider.vars.animationLoop) slider.pause();
                }
                // SLIDE:
                if (!fade) {
                    var dimension = vertical ? slider.slides.filter(":first").height() : slider.computedW, margin, slideString, calcNext;
                    // INFINITE LOOP / REVERSE:
                    if (carousel) {
                        //margin = (slider.vars.itemWidth > slider.w) ? slider.vars.itemMargin * 2 : slider.vars.itemMargin;
                        margin = slider.vars.itemMargin;
                        calcNext = (slider.itemW + margin) * slider.move * slider.animatingTo;
                        slideString = calcNext > slider.limit && slider.visible !== 1 ? slider.limit : calcNext;
                    } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
                        slideString = reverse ? (slider.count + slider.cloneOffset) * dimension : 0;
                    } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
                        slideString = reverse ? 0 : (slider.count + 1) * dimension;
                    } else {
                        slideString = reverse ? (slider.count - 1 - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
                    }
                    slider.setProps(slideString, "", slider.vars.animationSpeed);
                    if (slider.transitions) {
                        if (!slider.vars.animationLoop || !slider.atEnd) {
                            slider.animating = false;
                            slider.currentSlide = slider.animatingTo;
                        }
                        slider.container.unbind("webkitTransitionEnd transitionend");
                        slider.container.bind("webkitTransitionEnd transitionend", function() {
                            slider.wrapup(dimension);
                        });
                    } else {
                        slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function() {
                            slider.wrapup(dimension);
                        });
                    }
                } else {
                    // FADE:
                    if (!touch) {
                        //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
                        //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);
                        slider.slides.eq(slider.currentSlide).css({
                            zIndex: 1
                        }).animate({
                            opacity: 0
                        }, slider.vars.animationSpeed, slider.vars.easing);
                        slider.slides.eq(target).css({
                            zIndex: 2
                        }).animate({
                            opacity: 1
                        }, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);
                    } else {
                        slider.slides.eq(slider.currentSlide).css({
                            opacity: 0,
                            zIndex: 1
                        });
                        slider.slides.eq(target).css({
                            opacity: 1,
                            zIndex: 2
                        });
                        slider.wrapup(dimension);
                    }
                }
                // SMOOTH HEIGHT:
                if (slider.vars.smoothHeight) methods.smoothHeight(slider.vars.animationSpeed);
            }
        };
        slider.wrapup = function(dimension) {
            // SLIDE:
            if (!fade && !carousel) {
                if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
                    slider.setProps(dimension, "jumpEnd");
                } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
                    slider.setProps(dimension, "jumpStart");
                }
            }
            slider.animating = false;
            slider.currentSlide = slider.animatingTo;
            // API: after() animation Callback
            slider.vars.after(slider);
        };
        // SLIDESHOW:
        slider.animateSlides = function() {
            if (!slider.animating && focused) slider.flexAnimate(slider.getTarget("next"));
        };
        // SLIDESHOW:
        slider.pause = function() {
            clearInterval(slider.animatedSlides);
            slider.animatedSlides = null;
            slider.playing = false;
            // PAUSEPLAY:
            if (slider.vars.pausePlay) methods.pausePlay.update("play");
            // SYNC:
            if (slider.syncExists) methods.sync("pause");
        };
        // SLIDESHOW:
        slider.play = function() {
            if (slider.playing) clearInterval(slider.animatedSlides);
            slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
            slider.started = slider.playing = true;
            // PAUSEPLAY:
            if (slider.vars.pausePlay) methods.pausePlay.update("pause");
            // SYNC:
            if (slider.syncExists) methods.sync("play");
        };
        // STOP:
        slider.stop = function() {
            slider.pause();
            slider.stopped = true;
        };
        slider.canAdvance = function(target, fromNav) {
            // ASNAV:
            var last = asNav ? slider.pagingCount - 1 : slider.last;
            return fromNav ? true : asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev" ? true : asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next" ? false : target === slider.currentSlide && !asNav ? false : slider.vars.animationLoop ? true : slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next" ? false : slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next" ? false : true;
        };
        slider.getTarget = function(dir) {
            slider.direction = dir;
            if (dir === "next") {
                return slider.currentSlide === slider.last ? 0 : slider.currentSlide + 1;
            } else {
                return slider.currentSlide === 0 ? slider.last : slider.currentSlide - 1;
            }
        };
        // SLIDE:
        slider.setProps = function(pos, special, dur) {
            var target = function() {
                var posCheck = pos ? pos : (slider.itemW + slider.vars.itemMargin) * slider.move * slider.animatingTo, posCalc = function() {
                    if (carousel) {
                        return special === "setTouch" ? pos : reverse && slider.animatingTo === slider.last ? 0 : reverse ? slider.limit - (slider.itemW + slider.vars.itemMargin) * slider.move * slider.animatingTo : slider.animatingTo === slider.last ? slider.limit : posCheck;
                    } else {
                        switch (special) {
                          case "setTotal":
                            return reverse ? (slider.count - 1 - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;

                          case "setTouch":
                            return reverse ? pos : pos;

                          case "jumpEnd":
                            return reverse ? pos : slider.count * pos;

                          case "jumpStart":
                            return reverse ? slider.count * pos : pos;

                          default:
                            return pos;
                        }
                    }
                }();
                return posCalc * -1 + "px";
            }();
            if (slider.transitions) {
                target = vertical ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
                dur = dur !== undefined ? dur / 1e3 + "s" : "0s";
                slider.container.css("-" + slider.pfx + "-transition-duration", dur);
                slider.container.css("transition-duration", dur);
            }
            slider.args[slider.prop] = target;
            if (slider.transitions || dur === undefined) slider.container.css(slider.args);
            slider.container.css("transform", target);
        };
        slider.setup = function(type) {
            // SLIDE:
            if (!fade) {
                var sliderOffset, arr;
                if (type === "init") {
                    slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({
                        overflow: "hidden",
                        position: "relative"
                    }).appendTo(slider).append(slider.container);
                    // INFINITE LOOP:
                    slider.cloneCount = 0;
                    slider.cloneOffset = 0;
                    // REVERSE:
                    if (reverse) {
                        arr = $.makeArray(slider.slides).reverse();
                        slider.slides = $(arr);
                        slider.container.empty().append(slider.slides);
                    }
                }
                // INFINITE LOOP && !CAROUSEL:
                if (slider.vars.animationLoop && !carousel) {
                    slider.cloneCount = 2;
                    slider.cloneOffset = 1;
                    // clear out old clones
                    if (type !== "init") slider.container.find(".clone").remove();
                    slider.container.append(slider.slides.first().clone().addClass("clone").attr("aria-hidden", "true")).prepend(slider.slides.last().clone().addClass("clone").attr("aria-hidden", "true"));
                    methods.uniqueID(slider.slides.first().clone().addClass("clone")).appendTo(slider.container);
                    methods.uniqueID(slider.slides.last().clone().addClass("clone")).prependTo(slider.container);
                }
                slider.newSlides = $(slider.vars.selector, slider);
                sliderOffset = reverse ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
                // VERTICAL:
                if (vertical && !carousel) {
                    slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
                    setTimeout(function() {
                        slider.newSlides.css({
                            display: "block"
                        });
                        slider.doMath();
                        slider.viewport.height(slider.h);
                        slider.setProps(sliderOffset * slider.h, "init");
                    }, type === "init" ? 100 : 0);
                } else {
                    slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
                    slider.setProps(sliderOffset * slider.computedW, "init");
                    setTimeout(function() {
                        slider.doMath();
                        slider.newSlides.css({
                            width: slider.computedW,
                            "float": "left",
                            display: "block"
                        });
                        // SMOOTH HEIGHT:
                        if (slider.vars.smoothHeight) methods.smoothHeight();
                    }, type === "init" ? 100 : 0);
                }
            } else {
                // FADE:
                slider.slides.css({
                    width: "100%",
                    "float": "left",
                    marginRight: "-100%",
                    position: "relative"
                });
                if (type === "init") {
                    if (!touch) {
                        //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
                        slider.slides.css({
                            opacity: 0,
                            display: "block",
                            zIndex: 1
                        }).eq(slider.currentSlide).css({
                            zIndex: 2
                        }).animate({
                            opacity: 1
                        }, slider.vars.animationSpeed, slider.vars.easing);
                    } else {
                        slider.slides.css({
                            opacity: 0,
                            display: "block",
                            webkitTransition: "opacity " + slider.vars.animationSpeed / 1e3 + "s ease",
                            zIndex: 1
                        }).eq(slider.currentSlide).css({
                            opacity: 1,
                            zIndex: 2
                        });
                    }
                }
                // SMOOTH HEIGHT:
                if (slider.vars.smoothHeight) methods.smoothHeight();
            }
            // !CAROUSEL:
            // CANDIDATE: active slide
            if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide");
            //FlexSlider: init() Callback
            slider.vars.init(slider);
        };
        slider.doMath = function() {
            var slide = slider.slides.first(), slideMargin = slider.vars.itemMargin, minItems = slider.vars.minItems, maxItems = slider.vars.maxItems;
            slider.w = slider.viewport === undefined ? slider.width() : slider.viewport.width();
            slider.h = slide.height();
            slider.boxPadding = slide.outerWidth() - slide.width();
            // CAROUSEL:
            if (carousel) {
                slider.itemT = slider.vars.itemWidth + slideMargin;
                slider.minW = minItems ? minItems * slider.itemT : slider.w;
                slider.maxW = maxItems ? maxItems * slider.itemT - slideMargin : slider.w;
                slider.itemW = slider.minW > slider.w ? (slider.w - slideMargin * (minItems - 1)) / minItems : slider.maxW < slider.w ? (slider.w - slideMargin * (maxItems - 1)) / maxItems : slider.vars.itemWidth > slider.w ? slider.w : slider.vars.itemWidth;
                slider.visible = Math.floor(slider.w / slider.itemW);
                slider.move = slider.vars.move > 0 && slider.vars.move < slider.visible ? slider.vars.move : slider.visible;
                slider.pagingCount = Math.ceil((slider.count - slider.visible) / slider.move + 1);
                slider.last = slider.pagingCount - 1;
                slider.limit = slider.pagingCount === 1 ? 0 : slider.vars.itemWidth > slider.w ? slider.itemW * (slider.count - 1) + slideMargin * (slider.count - 1) : (slider.itemW + slideMargin) * slider.count - slider.w - slideMargin;
            } else {
                slider.itemW = slider.w;
                slider.pagingCount = slider.count;
                slider.last = slider.count - 1;
            }
            slider.computedW = slider.itemW - slider.boxPadding;
        };
        slider.update = function(pos, action) {
            slider.doMath();
            // update currentSlide and slider.animatingTo if necessary
            if (!carousel) {
                if (pos < slider.currentSlide) {
                    slider.currentSlide += 1;
                } else if (pos <= slider.currentSlide && pos !== 0) {
                    slider.currentSlide -= 1;
                }
                slider.animatingTo = slider.currentSlide;
            }
            // update controlNav
            if (slider.vars.controlNav && !slider.manualControls) {
                if (action === "add" && !carousel || slider.pagingCount > slider.controlNav.length) {
                    methods.controlNav.update("add");
                } else if (action === "remove" && !carousel || slider.pagingCount < slider.controlNav.length) {
                    if (carousel && slider.currentSlide > slider.last) {
                        slider.currentSlide -= 1;
                        slider.animatingTo -= 1;
                    }
                    methods.controlNav.update("remove", slider.last);
                }
            }
            // update directionNav
            if (slider.vars.directionNav) methods.directionNav.update();
        };
        slider.addSlide = function(obj, pos) {
            var $obj = $(obj);
            slider.count += 1;
            slider.last = slider.count - 1;
            // append new slide
            if (vertical && reverse) {
                pos !== undefined ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
            } else {
                pos !== undefined ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
            }
            // update currentSlide, animatingTo, controlNav, and directionNav
            slider.update(pos, "add");
            // update slider.slides
            slider.slides = $(slider.vars.selector + ":not(.clone)", slider);
            // re-setup the slider to accomdate new slide
            slider.setup();
            //FlexSlider: added() Callback
            slider.vars.added(slider);
        };
        slider.removeSlide = function(obj) {
            var pos = isNaN(obj) ? slider.slides.index($(obj)) : obj;
            // update count
            slider.count -= 1;
            slider.last = slider.count - 1;
            // remove slide
            if (isNaN(obj)) {
                $(obj, slider.slides).remove();
            } else {
                vertical && reverse ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
            }
            // update currentSlide, animatingTo, controlNav, and directionNav
            slider.doMath();
            slider.update(pos, "remove");
            // update slider.slides
            slider.slides = $(slider.vars.selector + ":not(.clone)", slider);
            // re-setup the slider to accomdate new slide
            slider.setup();
            // FlexSlider: removed() Callback
            slider.vars.removed(slider);
        };
        //FlexSlider: Initialize
        methods.init();
    };
    // Ensure the slider isn't focussed if the window loses focus.
    $(window).blur(function(e) {
        focused = false;
    }).focus(function(e) {
        focused = true;
    });
    //FlexSlider: Default Settings
    $.flexslider.defaults = {
        namespace: "flex-",
        //{NEW} String: Prefix string attached to the class of every element generated by the plugin
        selector: ".slides > li",
        //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
        animation: "fade",
        //String: Select your animation type, "fade" or "slide"
        easing: "swing",
        //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
        direction: "horizontal",
        //String: Select the sliding direction, "horizontal" or "vertical"
        reverse: false,
        //{NEW} Boolean: Reverse the animation direction
        animationLoop: true,
        //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
        smoothHeight: false,
        //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
        startAt: 0,
        //Integer: The slide that the slider should start on. Array notation (0 = first slide)
        slideshow: true,
        //Boolean: Animate slider automatically
        slideshowSpeed: 7e3,
        //Integer: Set the speed of the slideshow cycling, in milliseconds
        animationSpeed: 600,
        //Integer: Set the speed of animations, in milliseconds
        initDelay: 0,
        //{NEW} Integer: Set an initialization delay, in milliseconds
        randomize: false,
        //Boolean: Randomize slide order
        thumbCaptions: false,
        //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.
        // Usability features
        pauseOnAction: true,
        //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
        pauseOnHover: false,
        //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
        pauseInvisible: true,
        //{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
        useCSS: true,
        //{NEW} Boolean: Slider will use CSS3 transitions if available
        touch: true,
        //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
        video: false,
        //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches
        // Primary Controls
        controlNav: true,
        //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
        directionNav: true,
        //Boolean: Create navigation for previous/next navigation? (true/false)
        prevText: "Previous",
        //String: Set the text for the "previous" directionNav item
        nextText: "Next",
        //String: Set the text for the "next" directionNav item
        // Secondary Navigation
        keyboard: true,
        //Boolean: Allow slider navigating via keyboard left/right keys
        multipleKeyboard: false,
        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
        mousewheel: false,
        //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
        pausePlay: false,
        //Boolean: Create pause/play dynamic element
        pauseText: "Pause",
        //String: Set the text for the "pause" pausePlay item
        playText: "Play",
        //String: Set the text for the "play" pausePlay item
        // Special properties
        controlsContainer: "",
        //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
        manualControls: "",
        //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
        sync: "",
        //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
        asNavFor: "",
        //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider
        // Carousel Options
        itemWidth: 0,
        //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
        itemMargin: 0,
        //{NEW} Integer: Margin between carousel items.
        minItems: 1,
        //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
        maxItems: 0,
        //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
        move: 0,
        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
        allowOneSlide: true,
        //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide
        // Callback API
        start: function() {},
        //Callback: function(slider) - Fires when the slider loads the first slide
        before: function() {},
        //Callback: function(slider) - Fires asynchronously with each slider animation
        after: function() {},
        //Callback: function(slider) - Fires after each slider animation completes
        end: function() {},
        //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
        added: function() {},
        //{NEW} Callback: function(slider) - Fires after a slide is added
        removed: function() {},
        //{NEW} Callback: function(slider) - Fires after a slide is removed
        init: function() {}
    };
    //FlexSlider: Plugin Function
    $.fn.flexslider = function(options) {
        if (options === undefined) options = {};
        if (typeof options === "object") {
            return this.each(function() {
                var $this = $(this), selector = options.selector ? options.selector : ".slides > li", $slides = $this.find(selector);
                if ($slides.length === 1 && options.allowOneSlide === true || $slides.length === 0) {
                    $slides.fadeIn(400);
                    if (options.start) options.start($this);
                } else if ($this.data("flexslider") === undefined) {
                    new $.flexslider(this, options);
                }
            });
        } else {
            // Helper strings to quickly perform functions on the slider
            var $slider = $(this).data("flexslider");
            switch (options) {
              case "play":
                $slider.play();
                break;

              case "pause":
                $slider.pause();
                break;

              case "stop":
                $slider.stop();
                break;

              case "next":
                $slider.flexAnimate($slider.getTarget("next"), true);
                break;

              case "prev":
              case "previous":
                $slider.flexAnimate($slider.getTarget("prev"), true);
                break;

              default:
                if (typeof options === "number") $slider.flexAnimate(options, true);
            }
        }
    };
    if (typeof define !== "undefined") {
        define("js/common/jquery.flexslider", [], function(require, exports, modules) {
            exports.flexslider = $.flexslider;
        });
    }
})(jQuery);

(function(window) {
    var win = window, QNR;
    if (typeof win.QNR === "undefined") {
        QNR = win.QNR = {};
    } else {
        QNR = win.QNR;
    }
    if (QNR._TRAVEL_INIT_) {
        return;
    }
    QNR._TRAVEL_INIT_ = true;
    var document = win.document, ObjectPro = Object.prototype, ArrayPro = Array.prototype, toString = ObjectPro.toString, hasOwnProperty = ObjectPro.hasOwnProperty, trimLeft = /^\s+/, trimRight = /\s+$/;
    /***************
	 * ECM script 5 数组操作
	 * ************/
    var ArrayH = {
        /**
		 * 在数组中的每个项上运行一个函数，并将全部结果作为数组返回。
		 * @method map
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {Array} 返回满足过滤条件的元素组成的新数组
		 * @example
		 var arr=["aa","ab","bc"];
		 var arr2=map(arr,function(a,b){return a.substr(0,1)=="a"});
		 alert(arr2);
		 */
        map: function(arr, callback, pThis) {
            var len = arr.length;
            var rlt = new Array(len);
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    rlt[i] = callback.call(pThis, arr[i], i, arr);
                }
            }
            return rlt;
        },
        /**
		 * 对Array的每一个元素运行一个函数。
		 * @method forEach
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {void}
		 * @example
		 var arr=["a","b","c"];
		 var dblArr=[];
		 forEach(arr,function(a,b){dblArr.push(b+":"+a+a);});
		 alert(dblArr);
		 */
        forEach: function(arr, callback, pThis) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i in arr) {
                    callback.call(pThis, arr[i], i, arr);
                }
            }
        },
        /**
		 * 在数组中的每个项上运行一个函数，并将函数返回真值的项作为数组返回。
		 * @method filter
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {Array} 返回满足过滤条件的元素组成的新数组
		 * @example
		 var arr=["aa","ab","bc"];
		 var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		 alert(arr2);
		 */
        filter: function(arr, callback, pThis) {
            var rlt = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i in arr && callback.call(pThis, arr[i], i, arr)) {
                    rlt.push(arr[i]);
                }
            }
            return rlt;
        },
        /**
		 * 判断数组中是否有元素满足条件。
		 * @method some
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {boolean} 如果存在元素满足条件，则返回true.
		 * @example
		 var arr=["aa","ab","bc"];
		 var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		 alert(arr2);
		 */
        some: function(arr, callback, pThis) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i in arr && callback.call(pThis, arr[i], i, arr)) {
                    return true;
                }
            }
            return false;
        },
        /**
		 * 判断数组中所有元素都满足条件。
		 * @method every
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数.
		 * @param {Object} pThis (Optional) 指定callback的this对象.
		 * @return {boolean} 所有元素满足条件，则返回true.
		 * @example
		 var arr=["aa","ab","bc"];
		 var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		 alert(arr2);
		 */
        every: function(arr, callback, pThis) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i in arr && !callback.call(pThis, arr[i], i, arr)) {
                    return false;
                }
            }
            return true;
        },
        /**
		 * 返回一个元素在数组中的位置（从前往后找）。如果数组里没有该元素，则返回-1
		 * @method indexOf
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Object} obj 元素，可以是任何类型
		 * @param {int} fromIdx (Optional) 从哪个位置开始找起，如果为负，则表示从length+startIdx开始找
		 * @return {int} 则返回该元素在数组中的位置.
		 * @example
		 var arr=["a","b","c"];
		 alert(indexOf(arr,"c"));
		 */
        indexOf: function(arr, obj, fromIdx) {
            var len = arr.length;
            fromIdx |= 0;
            //取整
            if (fromIdx < 0) {
                fromIdx += len;
            }
            if (fromIdx < 0) {
                fromIdx = 0;
            }
            for (;fromIdx < len; fromIdx++) {
                if (fromIdx in arr && arr[fromIdx] === obj) {
                    return fromIdx;
                }
            }
            return -1;
        },
        /**
		 * 返回一个元素在数组中的位置（从后往前找）。如果数组里没有该元素，则返回-1
		 * @method lastIndexOf
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Object} obj 元素，可以是任何类型
		 * @param {int} fromIdx (Optional) 从哪个位置开始找起，如果为负，则表示从length+startIdx开始找
		 * @return {int} 则返回该元素在数组中的位置.
		 * @example
		 var arr=["a","b","a"];
		 alert(lastIndexOf(arr,"a"));
		 */
        lastIndexOf: function(arr, obj, fromIdx) {
            var len = arr.length;
            fromIdx |= 0;
            //取整
            if (!fromIdx || fromIdx >= len) {
                fromIdx = len - 1;
            }
            if (fromIdx < 0) {
                fromIdx += len;
            }
            for (;fromIdx > -1; fromIdx--) {
                if (fromIdx in arr && arr[fromIdx] === obj) {
                    return fromIdx;
                }
            }
            return -1;
        },
        /**
		 * 判断数组是否包含某元素
		 * @method contains
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Object} obj 元素，可以是任何类型
		 * @return {boolean} 如果元素存在于数组，则返回true，否则返回false
		 * @example
		 var arr=["a","b","c"];
		 alert(contains(arr,"c"));
		 */
        contains: function(arr, obj) {
            return ArrayH.indexOf(arr, obj) >= 0;
        },
        /**
		 * 清空一个数组
		 * @method clear
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @return {void}
		 */
        clear: function(arr) {
            arr.length = 0;
        },
        /**
		 * 将数组里的某(些)元素移除。
		 * @method remove
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Object} obj0 待移除元素
		 * @param {Object} obj1 … 待移除元素
		 * @return {number} 返回第一次被移除的位置。如果没有任何元素被移除，则返回-1.
		 * @example
		 var arr=["a","b","c"];
		 remove(arr,"a","c");
		 alert(arr);
		 */
        remove: function(arr, obj) {
            var idx = -1;
            for (var i = 1; i < arguments.length; i++) {
                var oI = arguments[i];
                for (var j = 0; j < arr.length; j++) {
                    if (oI === arr[j]) {
                        if (idx < 0) {
                            idx = j;
                        }
                        arr.splice(j--, 1);
                    }
                }
            }
            return idx;
        },
        /**
		 * 数组元素除重，得到新数据
		 * @method unique
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @return {void} 数组元素除重，得到新数据
		 * @example
		 var arr=["a","b","a"];
		 alert(unique(arr));
		 */
        unique: function(arr) {
            var rlt = [], oI = null, indexOf = Array.indexOf || ArrayH.indexOf;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (indexOf(rlt, oI = arr[i]) < 0) {
                    rlt.push(oI);
                }
            }
            return rlt;
        },
        /**
		 * 为数组元素进行递推操作。
		 * @method reduce
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数。
		 * @param {any} initial (Optional) 初始值，如果没有这初始，则从第一个有效元素开始。没有初始值，并且没有有效元素，会抛异常
		 * @return {any} 返回递推结果.
		 * @example
		 var arr=[1,2,3];
		 alert(reduce(arr,function(a,b){return Math.max(a,b);}));
		 */
        reduce: function(arr, callback, initial) {
            var len = arr.length;
            var i = 0;
            if (arguments.length < 3) {
                //找到第一个有效元素当作初始值
                var hasV = 0;
                for (;i < len; i++) {
                    if (i in arr) {
                        initial = arr[i++];
                        hasV = 1;
                        break;
                    }
                }
                if (!hasV) {
                    throw new Error("No component to reduce");
                }
            }
            for (;i < len; i++) {
                if (i in arr) {
                    initial = callback(initial, arr[i], i, arr);
                }
            }
            return initial;
        },
        /**
		 * 为数组元素进行逆向递推操作。
		 * @method reduceRight
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Function} callback 需要执行的函数。
		 * @param {any} initial (Optional) 初始值，如果没有这初始，则从第一个有效元素开始。没有初始值，并且没有有效元素，会抛异常
		 * @return {any} 返回递推结果.
		 * @example
		 var arr=[1,2,3];
		 alert(reduceRight(arr,function(a,b){return Math.max(a,b);}));
		 */
        reduceRight: function(arr, callback, initial) {
            var len = arr.length;
            var i = len - 1;
            if (arguments.length < 3) {
                //逆向找到第一个有效元素当作初始值
                var hasV = 0;
                for (;i > -1; i--) {
                    if (i in arr) {
                        initial = arr[i--];
                        hasV = 1;
                        break;
                    }
                }
                if (!hasV) {
                    throw new Error("No component to reduceRight");
                }
            }
            for (;i > -1; i--) {
                if (i in arr) {
                    initial = callback(initial, arr[i], i, arr);
                }
            }
            return initial;
        },
        /**
		 * 将一个数组扁平化
		 * @method expand
		 * @static
		 * @param arr {Array} 要扁平化的数组
		 * @return {Array} 扁平化后的数组
		 */
        expand: function(arr) {
            return [].concat.apply([], arr);
        },
        /**
		 * 将一个泛Array转化成一个Array对象。
		 * @method toArray
		 * @static
		 * @param {Array} arr 待处理的Array的泛型对象.
		 * @return {Array}
		 */
        toArray: function(arr) {
            var ret = [];
            for (var i = 0; i < arr.length; i++) {
                ret[i] = arr[i];
            }
            return ret;
        },
        /**
		 * 对数组进行包装。
		 * @method wrap
		 * @static
		 * @param {Array} arr 待处理的数组.
		 * @param {Class} constructor 构造器
		 * @returns {Object}: 返回new constructor(arr)
		 */
        wrap: function(arr, constructor) {
            return new constructor(arr);
        }
    };
    // mix to QNR not to Array
    for (var key in ArrayH) {
        (function(key) {
            if (!ArrayPro.hasOwnProperty(key)) {
                QNR[key] = ArrayH[key];
                //mix ArrayPro
                ArrayPro[key] = function() {
                    var arr = this;
                    return ArrayH[key].apply(null, [ arr ].concat([].slice.call(arguments, 0)));
                };
            } else {
                QNR[key] = function() {
                    var args = ArrayPro.slice.call(arguments, 0);
                    var arr = args.splice(0, 1)[0];
                    return ArrayPro[key].apply(arr, args);
                };
            }
        })(key);
    }
    for (var i in ArrayH) {
        (function(i) {
            if (!ArrayPro.hasOwnProperty(i)) {
                ArrayPro[i] = raiders.helper.methodize(ArrayH[i]);
            }
        })(i);
    }
    //兼容内部调用
    var forEach = QNR.forEach, some = QNR.some, indexOf = QNR.indexOf;
    var trim = function(text) {
        var str = text.toString();
        if (str.trim) {
            return str.trim();
        } else {
            return str.replace(trimLeft, "").replace(trimRight, "");
        }
    };
    var typeMap = {};
    forEach("Boolean Number String Function Array Date RegExp Object".split(" "), function(name, i) {
        typeMap["[object " + name + "]"] = name.toLowerCase();
    }, typeMap);
    var type = function(obj) {
        return obj == null ? String(obj) : typeMap[toString.call(obj)] || "object";
    };
    var isFunction = function(obj) {
        return type(obj) === "function";
    };
    var isArray = Array.isArray || function(obj) {
        return type(obj) === "array";
    };
    var isWindow = function(obj) {
        return obj && typeof obj === "object" && "setInterval" in obj;
    };
    var proxy = function(func, context) {
        var extArgs = ArrayPro.slice.call(arguments, 2);
        return function() {
            var args = ArrayPro.slice.call(arguments, 0);
            args = extArgs.concat(args);
            if (isFunction(func)) {
                return func.apply(context, args);
            } else {
                return function() {
                    console.error("proxy func is  not function");
                };
            }
        };
    };
    //自定义Event
    var QEvent = function() {
        this._eventList = {};
    };
    QEvent.prototype = {
        constructor: QEvent,
        _getOne: function(name) {
            return this._eventList[name] || (this._eventList[name] = []);
        },
        bind: function(name, func, context) {
            if (type(name) === "object") {
                for (var hn in name) {
                    this.bind(hn, name[hn], context);
                }
            } else {
                if (context) {
                    func = proxy(func, context);
                }
                var funcs = this._getOne(name);
                if (funcs.fired) {
                    func(funcs.args);
                    return this;
                }
                this._getOne(name).push(func);
                return this;
            }
        },
        unbind: function(name, func) {
            var list = this._getOne(name);
            if (func) {
                var poi = indexOf(list, func);
                if (poi > -1) {
                    list.slice(poi, 1);
                }
            } else {
                list.length = 0;
            }
        },
        trigger: function(name) {
            var funcs = this._getOne(name) || [];
            var args = ArrayPro.slice.call(arguments, 1);
            var that = this;
            var ret;
            forEach(this._getOne(name), function(func) {
                ret = func.apply(that, args);
                if (ret === false) return true;
            });
            return ret;
        },
        once: function(name, func, context) {
            var me = this;
            var handle = function() {
                func.apply(context || me, arguments);
                me.unbind(name, handle);
            };
            me.bind(name, handle);
            return handle;
        },
        delay: function(name, wait) {
            var args = ArrayPro.slice.call(arguments, 2);
            var me = this;
            return setTimeout(function() {
                me.trigger.apply(me, name.concat(args));
            }, wait || 10);
        },
        /**
	 	* triggerReady触发的事件的特点是，即使是事件已经触发，后续on注册的callback仍然会执行
	 	* 同时请注意，这类事件应该只触发一次，多次会导致逻辑混乱
	 	*/
        triggerReady: function(name) {
            var callbacks = this._getOne(name);
            var args = ArrayPro.slice.call(arguments, 1);
            forEach(callbacks, function(callback, i) {
                if (typeof callback != "function") {
                    return null;
                }
                return callback.apply(null, args);
            });
            callbacks.fired = true;
            callbacks.args = args;
        }
    };
    QEvent.prototype.fire = QEvent.prototype.trigger;
    QEvent.prototype.on = QEvent.prototype.bind;
    var extend = function(child, parent, proObj) {
        var T = function() {};
        T.prototype = parent.prototype;
        var pro = child.prototype;
        child.prototype = new T();
        child.prototype.constructor = child;
        child.$super = parent;
        mix(child.prototype, pro, proObj, true);
        return child;
    };
    var mix = function(elements) {
        var len = arguments.length;
        var isCopy = false;
        var copys = ArrayPro.slice.call(arguments, 1, len);
        if (type(arguments[len - 1]) === "boolean") {
            isCopy = arguments[len - 1];
            copys = ArrayPro.slice.call(arguments, 1, len - 1);
        }
        forEach(copys, function(source) {
            for (var key in source) {
                if (type(elements[key]) === "undefined" || isCopy) {
                    elements[key] = source[key];
                }
            }
        });
        return elements;
    };
    mix(QNR, {
        _config: {
            debug: true
        },
        type: type,
        trim: trim,
        extend: extend,
        mix: mix,
        proxy: proxy,
        Event: QEvent,
        isFunction: isFunction,
        isArray: isArray,
        isWindow: isWindow,
        isEmpty: function(obj) {
            if (isArray(obj) || type(obj) === "string") {
                return obj.length === 0;
            }
            for (var key in obj) if (hasOwnProperty.call(obj, key)) {
                return false;
            }
            return true;
        },
        HTMLEncode: function(str) {
            return (str || "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;");
        },
        countStr: function(str) {
            var num = 0;
            for (var i = 0, len = str.length; i < len; i++) {
                if (str.charCodeAt(i) > 128) {
                    num++;
                } else {
                    num += .5;
                }
            }
            return num;
        },
        subStr: function(str, maxlen, re) {
            if (!str) return "";
            var n = 0, ismuch = false, result = [];
            for (var i = 0, len = str.length; i < len; i++) {
                str.charCodeAt(i) > 127 ? n += 1 : n += .5;
                if (n > maxlen) {
                    ismuch = true;
                    break;
                }
                result.push(str.charAt(i));
            }
            return result.join("") + (ismuch ? typeof re !== "undefined" ? re : "..." : "");
        },
        getHashParams: function() {
            var hash = window.location.hash || "#", hash_param_obj = {};
            var hash_param_str = hash.replace(/.*?#.*?!/, "");
            forEach(hash_param_str.split("&"), function(str) {
                var t = str.split("=");
                hash_param_obj[t[0]] = t[1];
            });
            return hash_param_obj;
        },
        /**
			 * 格式化日期
			 * @method format
			 * @static
			 * @param {Date} d 日期对象
			 * @param {string} pattern 日期格式(y年M月d天h时m分s秒)，默认为"yyyy-MM-dd"
			 * @return {string}  返回format后的字符串
			 * @example
			 var d=new Date();
			 alert(format(d," yyyy年M月d日\n yyyy-MM-dd\n MM-dd-yy\n yyyy-MM-dd hh:mm:ss"));
			 */
        formatDate: function(d, pattern) {
            pattern = pattern || "yyyy-MM-dd";
            var y = d.getFullYear().toString(), o = {
                M: d.getMonth() + 1,
                //month
                d: d.getDate(),
                //day
                h: d.getHours(),
                //hour
                m: d.getMinutes(),
                //minute
                s: d.getSeconds()
            };
            pattern = pattern.replace(/(y+)/gi, function(a, b) {
                return y.substr(4 - Math.min(4, b.length));
            });
            for (var i in o) {
                pattern = pattern.replace(new RegExp("(" + i + "+)", "g"), function(a, b) {
                    return o[i] < 10 && b.length > 1 ? "0" + o[i] : o[i];
                });
            }
            return pattern;
        },
        plusDay: function(d, day) {
            var ONE_DAY = 24 * 60 * 60 * 1e3;
            return new Date(d.getTime() + day * ONE_DAY);
        }
    });
    /**
     * @开放this 可以call apply 之
     *
     * @return
     */
    QNR.namespace = function(ns, func) {
        if (!ns || !ns.length) {
            return null;
        }
        var names = ns.split(".");
        var i = names[0] == "QNR" ? 1 : 0;
        var len = names.length;
        var node = this;
        for (;i < len; i++) {
            if (type(node[names[i]]) === "undefined") {
                node[names[i]] = {};
            }
            node = node[names[i]];
        }
        if (isFunction(func)) {
            func.call(node, this);
        }
        return node;
    };
    //动态加载资源
    (function(Q) {
        var _loaded = {};
        // 已经加载的静态文件
        var _loading = {};
        // 正在加载中的静态文件
        var _callbacks = [];
        // 静态文件加载的回调列表
        var _links = [];
        // 加载中的css列表
        var _timer;
        // 轮询css加载状态的定时器
        var canonicalURI = function(src) {
            if (/^\/\/\/?/.test(src)) {
                src = location.protocol + src;
            }
            return src;
        };
        //只检测一次
        var _initResourceMap = function() {
            var allTags = document.getElementsByTagName("link"), len = allTags.length, tag;
            while (len) {
                tag = allTags[--len];
                if ((tag.rel == "stylesheet" || tag.type == "text/css") && tag.href) {
                    _loaded[canonicalURI(tag.href)] = true;
                }
            }
            allTags = document.getElementsByTagName("script");
            len = allTags.length;
            while (len) {
                tag = allTags[--len];
                if ((!tag.type || tag.type == "text/javascript") && tag.src) {
                    _loaded[canonicalURI(tag.src)] = true;
                }
            }
            _initResourceMap = function() {};
        };
        var _complete = function(uri) {
            var list = _callbacks, item, i;
            delete _loading[uri];
            _loaded[uri] = true;
            for (i = 0; i < list.length; i++) {
                item = list[i];
                delete item.resources[uri];
                if (Q.isEmpty(item.resources)) {
                    item.callback && item.callback();
                    list.splice(i--, 1);
                }
            }
        };
        var _poll = function() {
            var sheets = document.styleSheets, i = sheets.length, links = _links;
            while (i--) {
                var link = sheets[i], owner = link.ownerNode || link.owningElement, j = links.length;
                if (owner) {
                    while (j--) {
                        if (owner == links[j]) {
                            _complete(links[j]["data-href"]);
                            links.splice(j, 1);
                        }
                    }
                }
            }
            if (!links.length) {
                clearInterval(_timer);
                _timer = null;
            }
        };
        var _injectJS = function(uri) {
            var script = document.createElement("script");
            var callback = function() {
                script.onload = script.onerror = script.onreadystatechange = null;
                _complete(uri);
            };
            mix(script, {
                type: "text/javascript",
                src: uri
            }, true);
            script.onload = script.onerror = callback;
            script.onreadystatechange = function() {
                var state = this.readyState;
                if (state == "complete" || state == "loaded") {
                    callback();
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        };
        var _injectCSS = function(uri) {
            var link = document.createElement("link");
            mix(link, {
                type: "text/css",
                rel: "stylesheet",
                href: uri,
                "data-href": uri
            }, true);
            document.getElementsByTagName("head")[0].appendChild(link);
            if (link.attachEvent) {
                var callback = function() {
                    _complete(uri);
                };
                link.onload = callback;
            } else {
                _links.push(link);
                if (!_timer) {
                    _timer = setInterval(_poll, 20);
                }
            }
        };
        var _load = function(list, callback) {
            var resources = {}, uri, path, type, ret;
            _initResourceMap();
            list = isArray(list) ? list : [ list ];
            for (var i = 0, j = list.length; i < j; i++) {
                uri = canonicalURI(list[i]);
                resources[uri] = true;
                if (_loaded[uri]) {
                    setTimeout(proxy(_complete, null, uri), 0);
                } else if (!_loading[uri]) {
                    _loading[uri] = true;
                    //if (uri.indexOf('.css') > -1) {
                    if (uri.match(/[\?\.]css$/)) {
                        _injectCSS(uri);
                    } else {
                        _injectJS(uri);
                    }
                }
            }
            if (callback) {
                _callbacks.push({
                    resources: resources,
                    callback: callback
                });
            }
        };
        /**
		 * 加载JS文件
		 * @param {mixed} src JS文件绝对地址
		 * @param {function} callback js加载完成后回调函数
		 */
        Q.loadJS = function(src, callback) {
            _load(src, callback);
        };
        /**
		 * 加载CSS文件
		 * @param {mixed} uri css文件绝对地址
		 * @param {function} callback todo: 文件加载完成后回调函数
		 */
        Q.loadCSS = function(uri, callback) {
            _load(uri, callback);
        };
        Q.loadListJs = Q.loadSource = function(list, callback) {
            _load(list, callback);
        };
        //仅仅旅行下面用的LadyLoad ,_MODULES 是src 路径配置文件
        // key  : {status : "loaded",callback:[]}
        var LOADING = "LOADING", LOADED = "LOADED";
        var loadedModules = {};
        Q.loadModule = function(m_name, callback, _MODULES) {
            var _M = _MODULES || window.QZZ_TRAVEL_MODULES;
            if (!_M) {
                console.error("没有SRC的配置项");
                return;
            }
            if (getStatus(m_name) === LOADED) {
                var callbacks = loadedModules[m_name]["callbacks"];
                var func;
                while (func = callbacks.shift()) {
                    type(func) === "function" && func();
                }
                type(callback) === "function" && callback();
                return;
            }
            var module = _M[m_name], src, deps = {};
            if (type(module) === "string") {
                src = [ module ];
            } else if (type(module) === "array") {
                src = module;
            } else if (type(module) === "object") {
                src = module.src;
                var _deps = module.depends;
                if (type(_deps) === "array") {
                    forEach(_deps, function(m) {
                        deps[m] = m;
                    });
                } else if (type(_deps) === "string") {
                    deps[_deps] = _deps;
                }
            } else {
                console.error("需要加载的M格式错误 。。", m_name, module);
                return;
            }
            var _load = function() {
                if (!loadedModules[m_name]) {
                    loadedModules[m_name] = {
                        status: LOADING,
                        callbacks: []
                    };
                    if (type(callback) === "function") {
                        loadedModules[m_name]["callbacks"].push(callback);
                    }
                } else if (getStatus(m_name) === LOADING) {
                    callback && loadedModules[m_name]["callbacks"].push(callback);
                    if (type(callback) === "function") {
                        loadedModules[m_name]["callbacks"].push(callback);
                    }
                    return;
                }
                Q.loadSource(src, function() {
                    loadedModules[m_name]["status"] = LOADED;
                    var callbacks = loadedModules[m_name]["callbacks"];
                    var func;
                    while (func = callbacks.shift()) {
                        type(func) === "function" && func();
                    }
                });
            };
            if (!isEmpty(deps)) {
                for (var d_m_name in deps) {
                    (function(d_m_name) {
                        Q.loadModule(d_m_name, function() {
                            delete deps[d_m_name];
                            if (isEmpty(deps)) {
                                _load();
                            }
                        }, _M);
                    })(d_m_name);
                }
            } else {
                _load();
            }
        };
        function getStatus(key) {
            if (loadedModules[key]) {
                return loadedModules[key]["status"] || null;
            }
            return null;
        }
        function isEmpty(obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        }
    })(QNR);
    //浏览器判断
    var ua = window.navigator.userAgent.toLowerCase(), check = function(r) {
        return r.test(ua);
    };
    var isOpera = check(/opera/), isChrome = check(/\bchrome\b/), isWebKit = check(/webkit/), isSafari = !isChrome && isWebKit, isIE = check(/msie/) && document.all && !isOpera, isIE7 = check(/msie 7/), isIE8 = check(/msie 8/), isIE9 = check(/msie 9/), isIE10 = check(/msie 10/), isIE6 = isIE && !isIE7 && !isIE8 && !isIE9 && !isIE10, isGecko = check(/gecko/) && !isWebKit, isMac = check(/mac/);
    QNR.Browser = {
        isOpera: isOpera,
        isChrome: isChrome,
        isWebKit: isWebKit,
        isSafari: isSafari,
        isIE: isIE,
        isIE7: isIE7,
        isIE8: isIE8,
        isIE9: isIE9,
        isIE6: isIE6,
        isGecko: isGecko,
        isMac: isMac
    };
    QNR.clickLog = function(id, key) {
        var img = new Image();
        img.width = 1;
        img.height = 1;
        img.src = "http://bc.qunar.com/clk?s=" + id + "&a=" + key + "&t=" + Math.random();
    };
    /****
	 * 	重写日志
	 * **/
    QNR.DEBUG = false;
    if (!window.console) {
        window.console = {
            log: function() {},
            error: function() {},
            info: function() {}
        };
    }
    win.QN = win.QNR;
    if (typeof define === "function") {
        define("js/common/CD", [], function(require, exports, module) {
            module.exports = QNR;
        });
    }
    /* ***
	 * 设置domain 为qunar.com
	 * 方便Storage 通信  广告设置
	 * ***/
    //document.domain = "qunar.com";
    /* ***
	  * 全局事件
	  * ***/
    QNR.PubSub = new QNR.Event();
})(window);

define("js/common/util", [], function(require, exports, module) {
    var QNR = window.QNR;
    var Browser = QNR.Browser;
    var util = {
        getPages: function(pagger, _offset, _t_f_limit) {
            var max = pagger.max, now = pagger.now;
            var t_f_limit = _t_f_limit || 4, // 头部或尾部显示的个数
            f_offset = _offset, pages = [], gap = "...";
            if (t_f_limit >= max) {
                gap = "";
            }
            var s = Math.min(now + f_offset, max), l = Math.max(now - f_offset, 1);
            for (var i = l; i <= s; i++) {
                pages.push(i);
            }
            if (pages[0] > 2) {
                pages = [ 1, gap ].concat(pages);
            } else if (pages[0] == 2) {
                pages = [ 1 ].concat(pages);
            }
            var e_index = pages.length - 1, e_value = pages[e_index];
            if (e_value < max - 1) {
                pages.push(gap);
                pages.push(max);
            } else if (e_value == max - 1) {
                pages.push(max);
            }
            return pages;
        },
        bindInput: function() {
            //IE 下val("") 然后用Ctrl-V 触发不了 事件 待查
            if (Browser.isIE9) {
                return function(inp_dom, fn) {
                    var _timer = null;
                    var val;
                    inp_dom.bind("focus.inp", function() {
                        val = inp_dom.val();
                        _timer = setInterval(function() {
                            var now_val = inp_dom.val();
                            if (now_val !== val) {
                                val = now_val;
                                fn.call(inp_dom, now_val);
                            }
                        }, 100);
                        inp_dom.attr("inp_timer", _timer);
                    }).bind("blur.inp", function() {
                        val = null;
                        if (_timer) {
                            clearInterval(_timer);
                            _timer = null;
                        }
                        var now_val = inp_dom.val();
                        fn.call(inp_dom, now_val);
                    });
                };
            } else {
                return function(inp_dom, fn) {
                    var callback = function() {
                        var now_val = inp_dom.val();
                        fn.call(inp_dom, now_val);
                    };
                    inp_dom.bind({
                        "input.inp": callback,
                        "propertychange.inp": callback
                    });
                };
            }
        }(),
        fixImg: function(image, win_rect) {
            var width = image.width, height = image.height;
            var img_r = width / height;
            var win_r = win_rect.width / win_rect.height;
            var new_h, new_w;
            if (img_r > win_r) {
                new_h = Math.min(win_rect.height, height);
                new_w = new_h * img_r;
                image.style.marginLeft = -(new_w - win_rect.width) / 2 + "px";
                image.style.marginTop = -(new_h - win_rect.height) / 2 + "px";
            } else {
                new_w = Math.min(win_rect.width, width);
                //new_h = new_w * height / win_rect.height;
                new_h = new_w / img_r;
                image.style.marginLeft = -(new_w - win_rect.width) / 2 + "px";
                image.style.marginTop = -(new_h - win_rect.height) / 2 + "px";
            }
            image.style.width = new_w + "px";
            image.style.height = new_h + "px";
            image.style.maxWidth = "none";
        },
        imgLoad: function(img, callback) {
            if (img.complete) {
                callback.call(img);
                return;
            }
            img.onload = onerror = function() {
                callback.call(img);
            };
        },
        showMsg: function(msg, timer) {
            if (!msg_dlg) {
                msg_dlg = new QNR.Dialog({
                    content: html
                });
            }
            msg_dlg.getContent().html(msg);
            msg_dlg.show();
            var t = setTimeout(function() {
                msg_dlg.hide();
            }, timer || 3e3);
            return t;
        }
    };
    module.exports = util;
});
