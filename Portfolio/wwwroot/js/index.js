'use strict';

(function () {

    var windowDimensions = [];

    windowDimensions = resizeDiv();

    $('#nav').affix({
        offset: {
            top: windowDimensions[0].vph - windowDimensions[0].navHeight
        }
    });

    $('#nav').on('affix.bs.affix', function () {
        $('#nav + .container-fluid').css('margin-top', windowDimensions[0].navHeight);
        $(".navbar-fixed-top").addClass("top-nav-collapse");
        $('#custom-nav').addClass('affix');
        $('header').css('margin-top', windowDimensions[0].navHeight);
        $('.navbar-brand').css('color', '#04292d');
    });

    $('#nav').on('affix-top.bs.affix', function () {
        $('#nav + .container-fluid').css('margin-top', windowDimensions[0].navHeight);
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
        $('#custom-nav').removeClass('affix');
        $('header').css('margin-top', 0);
        $('.navbar-brand').css('color', '#fff');
    });

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: windowDimensions[0].navHeight
    });

     $('a.page-scroll').bind('click', function (event) {
         var $ele = $(this);
         $('html, body').stop().animate({
             scrollTop: ($($ele.attr('href')).offset().top - windowDimensions[0].navHeight)
         }, 1450, 'easeInOutQuad');
         event.preventDefault();
     });

    $('.navbar-collapse ul li a').click(function () {
        /* always close responsive nav after click */
        $('.navbar-toggle:visible').click();
    });

    $('#gallerymodal').on('show.bs.modal', function (e) {
        $('#galleryimage').attr("src", $(e.relatedtarget).data("src"));
    });

    $('#aboutmodal').on('shown', function () {
        $(document).off('focusin.modal');
    });

    $(document).on('click', '.navbar-collapse.in', function (e) {
        if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
            $(this).collapse('hide');
        }
    });

})();

(function ($) {
    'use strict';

    $.srSmoothscroll = function (options) {

        var self = $.extend({
            step: 55,
            speed: 400,
            ease: "swing"
        }, options || {});

        // private fields & init
        var win = $(window),
            doc = $(document),
            top = 0,
            step = self.step,
            speed = self.speed,
            viewport = win.height(),
            body = (navigator.userAgent.indexOf('AppleWebKit') !== -1) ? $('body') : $('html'),
            wheel = false;

        // events
        //$('body').mousewheel(function (event, delta) {

        //    wheel = true;

        //    if (delta < 0) // down
        //        top = (top + viewport) >= doc.height() ? top : top += step;

        //    else // up
        //        top = top <= 0 ? 0 : top -= step;

        //    body.stop().animate({ scrollTop: top }, speed, self.ease, function () {
        //        wheel = false;
        //    });

        //    return false;
        //});

        win
            .on('resize', function (e) {
                viewport = win.height();
            })
            .on('scroll', function (e) {
                if (!wheel)
                    top = win.scrollTop();
            });

    };
})(jQuery);

$(function () {
    $(document).ready(function () {
        $.srSmoothscroll();
    });
});

window.onresize = function (event) {
    resizeDiv();
}

function resizeDiv() {
    var windowDimensions = [];
    windowDimensions.push({
        vpw: window.innerWidth,
        vph: $(window).height(),
        navHeight: $('.navbar').outerHeight(true)
    });
    $('header').css({ 'min-height': windowDimensions[0].vph - windowDimensions[0].navHeight });
    $('.parallax-container').css({ 'height': windowDimensions[0].vph });
    $('.cover').css({ 'top': windowDimensions[0].vph });
    if (windowDimensions[0].vpw <= 701) {
        $('#header-nav').before($('.logo').html());
        $('.logo').replaceWith('<br/>');
    }

    if (windowDimensions[0].vpw <= 768) {
        $('.parallax-container').remove();
    }
    return windowDimensions;
}
