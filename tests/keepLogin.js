// var LoginPage = function() { //create an object with the 6 elements from the log in page, extracting their position. Will be useful in the future.

//     this.logo = element(by.xpath("//img[contains(@class,'se-icon')]"));
//     this.hostname = element(by.xpath("//input[contains(@ng-model,'data.hostname')]"));
//     this.user = element(by.xpath("//input[contains(@ng-model,'data.username')]"));
//     this.password = element(by.xpath("//input[contains(@ng-model,'data.password')]"));
//     this.reminder = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
//     this.logbutton = element(by.xpath("//button[contains(@on-tap,'login(data)')]"));
// };
var LoginPage=require('./dependencies/LoginPageObject.js');
var dashPage = function() {
    this.leftButton = element(by.xpath("//button[contains(@class,'button button-icon icon ion-navicon')]"));
    this.logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    this.loginCheck = element.all(by.xpath("//h4[contains(.,'Your available products')]")).get(0);
};
var dashAlert = function() {
    this.alertButtonOk = element(by.xpath("//button[contains(@class,'button ng-binding button-positive')]"));
};
var AlertPop_up = function() {

    this.alertBody = element(by.xpath("//div[contains(@class,'popup-body')]"));
    this.alertButton = element(by.xpath("//button[contains(@ng-click,'event)')]"));
};

function log_check_close(Obj, alert) {

    Obj.logbutton.click();
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(alert.alertButton), 20000)
        .then(function() {
            expect(alert.alertBody.getText()).toEqual('Oops! Something went wrong! Please try again later!');
            alert.alertButton.click(); //close the alert
        });
}

function addCredentials(Obj, host, user, pwd) {
    //The three fields should be provided with valid data
    Obj.hostname.sendKeys(host);
    Obj.user.sendKeys(user);
    Obj.password.sendKeys(pwd);
}

function field_cleaner(Obj) {
    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}
var data = require("./dataForUserRestrictedLogin");

//The error message that is checked it's the one the application returns at the moment the test are written. 
//If there will be an update the error message could be changed depending on the
//case it envolves.
//Here should be a feature allowing the soft to detect an inexisting user

describe('mobile app login page', function() {

    var Obj = new LoginPage(); // initialize an object//
    var alert = new AlertPop_up(); //initialize the Popup//
    var alreadyLogged = new dashPage();
    var dashA = new dashAlert();

    it('should keep the user logged if the button is checked and not logged otherwise', function() {

        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);
        //for being able to login, the .json file must have valid user, and password on the second element of the arrays.
        addCredentials(Obj, data.superAdminH, data.superAdminU, data.superAdminP);
        Obj.reminder.click();
        Obj.logbutton.click();
        var EC = protractor.ExpectedConditions;

        browser.wait(EC.visibilityOf(alreadyLogged.loginCheck), 20000)
            .then(function() {
                expect(alreadyLogged.loginCheck.isPresent()).toBeTruthy();

            });

        browser.refresh();
        browser.wait(EC.visibilityOf(alreadyLogged.loginCheck), 20000)
            .then(function() {
                expect(alreadyLogged.loginCheck.isPresent()).toBeTruthy();
            });
        alreadyLogged.leftButton.click();

        alreadyLogged.logoutButton.click();
        dashA.alertButtonOk.click();

        browser.wait(EC.visibilityOf(Obj.logbutton), 20000)
            .then(function() {
                field_cleaner(Obj);
            });
        Obj.reminder.click();
        addCredentials(Obj, data.superAdminH, data.superAdminU, data.superAdminP);

        Obj.logbutton.click();
        browser.wait(EC.visibilityOf(alreadyLogged.loginCheck), 20000)
            .then(function() {
                expect(alreadyLogged.loginCheck.isPresent()).toBeTruthy();
            });
        browser.refresh();
        field_cleaner(Obj);
        expect(alreadyLogged.loginCheck.isPresent()).toBeFalsy();

    });
});
