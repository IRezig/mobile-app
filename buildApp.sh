#!/usr/bin/env bash

# break on first error
set -e

# bash buildApp.sh <android|ios>
if [ -z "$1" ]; then
    echo "Please specify android or ios";
    exit 1
elif [ "$1" = "ios" ]; then
    PLATFORM='ios'
    EXTENSION="ipa"
elif [ "$1" = "android" ]; then
    PLATFORM='android'
    EXTENSION="apk"
fi

if ! type "ionic" > /dev/null; then
    echo "You need to install ionic.\n Try using: npm install -g cordova ionic \n http://ionicframework.com/getting-started/"
else

    rm -rf spamexperts_mobile_app

    # create blank app
    while true; do echo n; done | ionic start spamexperts_mobile_app blank

    cd spamexperts_mobile_app

    # clear the blank assets
    rm -rf www/*

    # get the app
    git clone https://github.com/SpamExperts/mobile-app.git

    # build app assets
    cd mobile-app
    # build_assets
    bash build_assets.sh
    cd -

    # keep only the needed files
    mv mobile-app/index.html www/
    mv mobile-app/img www/
    mv mobile-app/minified www/

    # keep our config
    mv mobile-app/config.xml www/
    mv mobile-app/ionic.project www/

    # remove unused folder
    rm -rf mobile-app

    # add platform
    ionic platform add $PLATFORM

    # add cordova plugins
    cordova plugin add cordova-plugin-network-information

    # we need this plugin to allow connection on servers with self-signed certificates
    cordova plugin add cordova-plugin-http

    # remove debug plugin
    cordova plugin rm cordova-plugin-console

    # add jshybugger for debugging a production app
    if  [ -z "$3" ] && [ "$3" = "debug" ]; then
        ionic plugin add https://github.com/jsHybugger/cordova-plugin-jshybugger.git
    fi

    # clear default resources
    rm -rf resources/*

    # set config and resources
    cp www/img/spamexperts_logo.png resources/splash.png
    cp www/img/spamexperts_logo.png resources/icon.png

    # add own config
    mv www/config.xml .
    mv www/ionic.project .

    # build resources
    ionic resources

    # remove useless icon
    rm www/img/spamexperts_logo.png
    rm resources/splash.png
    rm resources/icon.png

    # build for platform
    OUTPUT="$(cordova build --release $PLATFORM | tail -n 1)"

    # get the apk/ipa file
    mv $OUTPUT ../unsigned_spamexperts_app.$EXTENSION

    # cleanup
    cd ..
    rm -rf spamexperts_mobile_app

    if [ "$PLATFORM" = "android" ] && ! [ -z "$2" ]; then
        jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $2 unsigned_spamexperts_app.apk spamexperts_app
        zipalign -v 4 unsigned_spamexperts_app.apk spamexperts_app.apk
        rm unsigned_spamexperts_app.apk
    fi

fi