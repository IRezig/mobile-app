exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [   
        'superAdminLevelFunctionality.js', 
        'domainLevelFunctionality.js',
        'emailLevelFunctionality.js',
        'searchPanelQuickSelect.js',
        'searchPanelCalendarSettings.js' 
    ],
    onPrepare: function() {
        browser.driver.manage().window().setSize(350, 780);
    },
    capabilities: {
        browserName: 'chrome',
        name: 'Mobile app tests',
        count: 1,
        shardTestFiles: false,
        maxInstances: 10,
        chromeOptions: {
            'mobileEmulation': {
                'deviceName': 'Galaxy S5'
            }
        }
    },
}
