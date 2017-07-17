/**
 * Created by griga on 11/30/15.
 */
var config = {
    menu_speed: 200,

    smartSkin: "smart-style-2",

    apiRootUrl: "",
    buildUrl: "build",
    skins: [
        {
            name: "smart-style-0",
            logo: "styles/rs/img/logo.png",
            class: "btn btn-block btn-xs txt-color-white margin-right-5",
            style: {
                backgroundColor: '#4E463F'
            },
            label: "Smart Default"
        },

        {
            name: "smart-style-1",
            logo: "styles/rs/img/logo-white.png",
            class: "btn btn-block btn-xs txt-color-white",
            style: {
                background: '#3A4558'
            },
            label: "Dark Elegance"
        },

        {
            name: "smart-style-2",
            logo: "styles/rs/img/logo-blue.png",
            class: "btn btn-xs btn-block txt-color-darken margin-top-5",
            style: {
                background: '#fff'
            },
            label: "Ultra Light"
        },

        {
            name: "smart-style-3",
            logo: "styles/rs/img/logo-pale.png",
            class: "btn btn-xs btn-block txt-color-white margin-top-5",
            style: {
                background: '#f78c40'
            },
            label: "Google Skin"
        },

        {
            name: "smart-style-4",
            logo: "styles/rs/img/logo-pale.png",
            class: "btn btn-xs btn-block txt-color-white margin-top-5",
            style: {
                background: '#bbc0cf',
                border: '1px solid #59779E',
                color: '#17273D !important'
            },
            label: "PixelSmash"
        },

        {
            name: "smart-style-5",
            logo: "styles/rs/img/logo-pale.png",
            class: "btn btn-xs btn-block txt-color-white margin-top-5",
            style: {
                background: 'rgba(153, 179, 204, 0.2)',
                border: '1px solid rgba(121, 161, 221, 0.8)',
                color: '#17273D !important'
            },
            label: "Glass"
        },

        {
            name: "smart-style-6",
            logo: "styles/rs/img/logo-pale.png",
            class: "btn btn-xs btn-block txt-color-white margin-top-5",
            style: {
                background: 'rgba(153, 179, 204, 0.2)',
                border: '1px solid rgba(121, 161, 221, 0.8)',
                color: '#17273D !important'
            },
            beta: true,
            label: "MaterialDesign"
        }
    ]
};

config.script_path = "/rs/client";
config.sound_path = "sound/";
config.sound_on = true;

/*
 * DEBUGGING MODE
 * debugState = true; will spit all debuging message inside browser console.
 * The colors are best displayed in chrome browser.
 */
config.debugState = false;
config.debugStyle = 'font-weight: bold; color: #00f;';
config.debugStyle_green = 'font-weight: bold; font-style:italic; color: #46C246;';
config.debugStyle_red = 'font-weight: bold; color: #ed1c24;';
config.debugStyle_warning = 'background-color:yellow';
config.debugStyle_success = 'background-color:green; font-weight:bold; color:#fff;';
config.debugStyle_error = 'background-color:#ed1c24; font-weight:bold; color:#fff;';

config.voice_command = true;
config.voice_command_auto = false;

/*
 */
config.voice_command_lang = 'en-US';

/*
 *  Use localstorage to remember on/off (best used with HTML Version)
 */

config.voice_localStorage = false;

/*
 * Voice Commands
 * Defines all voice command variables and functions
 */
if (config.voice_command) {
    config.commands = {
    };
}

module.exports = config;
