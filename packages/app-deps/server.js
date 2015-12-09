/* global Npm, Dependencies:true */

// Import client-side npm modules and put them into the Dependencies object.
// We can then access `Dependences` elsewhere in server-side code to use
// these modules.

Dependencies = {
    _: Npm.require('lodash'),
    moment: Npm.require('moment'),
    nux: Npm.require('nutritionix')({
        appId: 'd777a3a8',
        appKey: 'c657dfac9946c562366e1d592ef3d97f'
    }, false),
    Swipeable: Npm.require('react-swipeable'),
    SwipeToRevealOptions: Npm.require('react-swipe-to-reveal-options')

};
