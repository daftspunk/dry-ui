/*
 * SocialShare plugin
 * 
 * Data attributes:
 * - data-control="social-share" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').socialShare({ option: 'value' })
 *
 * Dependences:
 * - Some other plugin (filename.js)
 */

/*
 Usage:

    <div
        data-control="social-share"
        data-title="{{ title }}"
        data-description="{{ description }}"
        data-url="{{ url }}"
        data-picture="{{ picture }}">
        <div class="platform facebook">
            <img alt="Like us" class="facebook-icon" src="facebook-icon.png" />
        </div>
        <div class="platform twitter">
            <img alt="Tweet us" class="twitter-icon" src="twitter-icon.png" />
        </div>
        <div class="platform google">
            <div><img alt="Plus us" class="google-icon" src="gplus-icon.png" /></div>
        </div>
        <div class="platform pinterest">
            <img alt="Pin us" class="pinterest-icon" src="pinterest-icon.png" />
        </div>
    </div>
 */

+function ($) { "use strict";

    // SOCIAL SHARE CLASS DEFINITION
    // ============================

    var SocialShare = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Init
        this.init()
    }

    SocialShare.DEFAULTS = {
        option: 'default'
    }

    SocialShare.prototype.init = function() {

        var $self,
            description,
            facebookContainer,
            facebookHomepage,
            facebookWithTextContainer,
            fb_str,
            googleContainer,
            google_str,
            ie7Check,
            permalink,
            picture,
            pinItHref,
            pinterestContainer,
            pinterestDescription,
            pinterest_str,
            title,
            twitterContainer,
            twitter_str

        $self = this.$el
        permalink = $self.data("url")
        title = $self.data('title')
        picture = $self.data('picture')
        description = $self.data('description')
        facebookWithTextContainer = $self.find('.facebook-with-text')
        facebookHomepage = $self.find('.facebook-homepage')
        facebookContainer = $self.find('.facebook')
        twitterContainer = $self.find('.twitter')
        pinterestContainer = $self.find('.pinterest')
        googleContainer = $self.find('.google div')
        ie7Check = $('#ie7')

        if (facebookWithTextContainer.length && !facebookWithTextContainer.is('.active')) {
            facebookWithTextContainer.addClass("active");
            fb_str = '<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Ffacebook.com%2Fblackfridaydeals&amp;send=false&amp;layout=standard&amp;width=235&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=35" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:235px; height:45px;" allowTransparency="true"></iframe>';
            $(facebookWithTextContainer).html(fb_str);
        }
        if (facebookHomepage.length && !facebookHomepage.is('.active')) {
            facebookHomepage.addClass("active");
            fb_str = "<fb:like href=\"http%3A%2F%2Ffacebook.com%2Fblackfridaydeals\" layout=\"button_count\" send=\"false\" show_faces=\"false\"></fb:like>";
            $(facebookHomepage).html(fb_str);
            FB.XFBML.parse(document.getElementById(facebookHomepage));
        }
        if (facebookContainer.length && !facebookContainer.is('.active')) {
            facebookContainer.addClass("active");
            fb_str = "<fb:like href=\"" + permalink + "\" layout=\"button_count\" send=\"false\" show_faces=\"false\"></fb:like>";
            $(facebookContainer).html(fb_str);
            FB.XFBML.parse(document.getElementById(facebookContainer));
        }
        if (twitterContainer.length && !twitterContainer.is('.active')) {
            twitterContainer.addClass('active');
            twitter_str = '<span style="float:left;width:100px;margin-right:5px;"><iframe allowtransparency="true" frameborder="0" scrolling="no" src="https://platform.twitter.com/widgets/tweet_button.html?url=' + permalink + '&amp;text=' + escape(title) + '" style="width:130px; height:50px;" allowTransparency="true" frameborder="0"></iframe></span>';
            $(twitterContainer).html(twitter_str);
        }
        if (pinterestContainer.length && !pinterestContainer.is('.active')) {
            pinterestContainer.addClass('active');
            pinterestDescription = title.toUpperCase() + ' ' + description;
            pinterest_str = '<a href="https://pinterest.com/pin/create/button/?url=' + permalink + '&media=' + picture + '&description=' + escape(pinterestDescription) + '" class="pin-it-button" count-layout="horizontal"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>';
            $(pinterestContainer).html(pinterest_str);
            pinItHref = $self.find('.pinterest a').attr('href');
            $self.find('.pinterest a').on('click', function(ev) {
                window.open(pinItHref, '_blank', "menubar=0,location=0,height=350,width=665");
                ev.preventDefault();
                return false;
            });
        }
        if (!ie7Check.length) {
            if (googleContainer.length && !googleContainer.parent().is('.active')) {
                googleContainer.parent().addClass('active');
                google_str = '<div class="g-plusone"></div>';
                googleContainer.html(google_str);
                window.___gcfg = {
                    parsetags: 'explicit'
                };
                if (googlePluginLoaded) {
                    return gapi.plusone.render(googleContainer[0], {
                        href: permalink,
                        size: 'medium'
                    });
                } else {
                    return $.getScript('https://apis.google.com/js/plusone.js?callback=?', function() {
                        googlePluginLoaded = true;
                        return gapi.plusone.render(googleContainer[0], {
                            href: permalink,
                            size: 'medium'
                        });
                    });
                }
            }
        }

    }


    // SOCIAL SHARE PLUGIN DEFINITION
    // ============================

    var old = $.fn.socialShare

    $.fn.socialShare = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('ui.social-share')
            var options = $.extend({}, SocialShare.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('ui.social-share', (data = new SocialShare(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })
        
        return result ? result : this
    }

    $.fn.socialShare.Constructor = SocialShare

    // SOCIAL SHARE NO CONFLICT
    // =================

    $.fn.socialShare.noConflict = function () {
        $.fn.socialShare = old
        return this
    }

    // SOCIAL SHARE DATA-API
    // ===============

    $(document).on('mouseenter.ui.social-share', '[data-control="social-share"]', function() {
        $(this).socialShare()
    });

}(window.jQuery);

var googlePluginLoaded;

(function() {
    var s, x;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/all.js?ver=MU#xfbml=1';
    x = document.getElementsByTagName('script')[0];
    return x.parentNode.insertBefore(s, x);
})();

googlePluginLoaded = false;
