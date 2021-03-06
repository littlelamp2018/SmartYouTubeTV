/*
Description: Imitate press on OK button after seek
*/

console.log("Scripts::Running script device_utils.js");

var DeviceUtils = {
    WEBM: 'webm',
    MP4: 'mp4',
    WEBVIEW: 'WebView',
    XWALK: 'XWalk',

    init: function() {
        // do init here
    },

    forceEnableAllCodecs: function() {
        if (!window.MediaSource) {
            console.log('DeviceUtils::disableCodec: MediaSource is null');
            return;
        }

        window.MediaSource.isTypeSupported = function(native) {
            return function(str) {
                if (str.indexOf('3840') != -1) {
                    console.log('DeviceUtils::force enable ' + str + ' codec');
                    return true;
                }
                return native.call(window.MediaSource, str);
            }
        }(window.MediaSource.isTypeSupported);
    },

    disableCodec: function(codec) {
        if (!codec) {
            console.log('DeviceUtils::disableCodec: codec is null');
            return;
        }
        if (!window.MediaSource) {
            console.log('DeviceUtils::disableCodec: MediaSource is null');
            return;
        }

        console.log('DeviceUtils::disableCodec: ' + codec + ' on ' + window.thisDevice + ' device');

        var $this = this;
        window.MediaSource.isTypeSupported = function(native) {
            return function(fullCodec) {
                // console.log('DeviceUtils::isTypeSupported ' + fullCodec);
                // YouTube's 4K videos encoded exclusively in WEBM codec
                if ($this.specCmp(fullCodec, codec) && !$this.is4KCodec(codec))
                    return false;
                return native.call(window.MediaSource, fullCodec);
            }
        }(window.MediaSource.isTypeSupported);
    },

    disableWebmCodec: function() {
        this.disableCodec(this.WEBM);
    },

    disableMP4Codec: function() {
        this.disableCodec(this.MP4);
    },

    /**
     * Compare special strings.
     * Returns true even when the second string is empty: this.specCmp('abc', '') == true
     * Or when strings partially matched: this.specCmp('abc', 'ab') == true
     */
    specCmp: function(fullCodec, codec) {
        fullCodec = fullCodec.toLowerCase();
        codec = codec.toLowerCase();
        return fullCodec.indexOf(codec) >= 0;
    },

    getApp: function() {
        if (!window.app) {
            console.log("DeviceUtils::global var 'app' isn't defined");
        }

        return window.app;
    },

    getEngineType: function() {
        return this.getApp().getEngineType();
    },

    getDeviceName: function() {
        return this.getApp().getDeviceName();
    },
    
    isWebView: function() {
        var type = this.getEngineType();
        return type == this.WEBVIEW;
    },
    
    isXWalk: function() {
        var type = this.getEngineType();
        return type == this.XWALK;
    },

    /**
     * YouTube's 4K videos encoded exclusively in WEBM codec
     */
    is4KCodec: function(codec) {
        if (codec.indexOf('width=3840') != -1) {
            console.log('DeviceUtils::force enable ' + codec + ' codec');
            return true;
        }

        return false;
    },

    supportsVideoType: function(type) {
        var video = Utils.$('video');

        if (!video) {
            console.log("DeviceUtils::supportsVideoType: video element is not initialized");
            return;
        }

        // Allow user to create shortcuts, i.e. just "webm"
        let formats = {
            ogg: 'video/ogg; codecs="theora"',
            h264: 'video/mp4; codecs="avc1.42E01E"',
            webm: 'video/webm; codecs="vp8, vorbis"',
            vp9: 'video/webm; codecs="vp9"',
            hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
        };

        return video.canPlayType(formats[type] || type);
    }
};

DeviceUtils.init();
