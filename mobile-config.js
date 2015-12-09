
App.info({
    name: 't1de',
    description: 'An iOS app built with Meteor',
    version: '0.0.1'
});

App.icons({
    'iphone': 'resources/icons/icon-60.png',
    'iphone_2x': 'resources/icons/icon-60@2x.png'
});

App.launchScreens({
    // iOS
    'iphone': 'resources/splash/Default~iphone.png',
    'iphone_2x': 'resources/splash/Default@2x~iphone.png',
    'iphone5': 'resources/splash/Default-568h@2x~iphone.png',
    'iphone6': 'resources/splash/Default-568h@2x~iphone.png',
    'iphone6p_portrait': 'resources/splash/Default-568h@2x~iphone.png',
    'iphone6p_landscape': 'resources/splash/Default-568h@2x~iphone.png'
});

App.accessRule("*");