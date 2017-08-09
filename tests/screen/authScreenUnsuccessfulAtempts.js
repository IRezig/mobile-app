var LoginPage = require('.././dependencies/LoginPageObject.js');
var AlertPage = require('.././dependencies/AlertLogPageObject.js');

var InputData = function(hostname, username, password) {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
};

function field_cleaner(test) {
    test.hostname.clear();
    test.user.clear();
    test.password.clear();
}

function add() {

    var array = [];
    array.push(new InputData("test", "????", "qwe12"));
    array.push(new InputData("test", "????", "Qwer1234"));
    array.push(new InputData("test", "username56", "qwe12"));
    array.push(new InputData("test", "username56", "Qwer1234"));
    array.push(new InputData("test.whatever.example.com", "????", "qwe12"));
    array.push(new InputData("test.example.net", "????", "Qwer1234"));
    array.push(new InputData("example.com", "username56", "Qwe12"));
    array.push(new InputData("example.com", "username56", "username56"));
    array.push(new InputData("example.com", "mobile-app", "Qwer1234"));
    return array;
}

describe('Verify data type', function() {
    it('Check:', function() {

        // Open page
        browser.get('http://localhost:8100/#/login');

        // It is ionic coupled with Angular, so ignore the angular load
        browser.ignoreSynchronization = true;

        // Take elements
        test = new LoginPage();
        alert = new AlertPage();

        var EC = protractor.ExpectedConditions;
        var data = add();

        for (var i = 0; i < data.length; i++) {

            var item = data[i];

            //  Try log in
            test.hostname.sendKeys(item.hostname);
            test.user.sendKeys(item.username);
            test.password.sendKeys(item.password);
            test.logbutton.click();

            //  We need to wait for the element visibility before clicking on it;
            //  guessing a pause is not very reliable
            browser.wait(EC.visibilityOf(alert.alertButton), 5000).then(function() {
                expect(alert.alertBody.getText()).toEqual('A record with the supplied identity could not be found.');
                alert.alertButton.click();
            });

            browser.refresh();

            //  Clear fields
            field_cleaner(test);
        }
    });
});