// spec.js
var PageData = function()   {
    this.logo = browser.findElement(by.xpath("//img[contains(@src,'logo.svg')]"));
    this.hostname = browser.findElement(by.xpath("//input[contains(@placeholder,'Hostname')]"));
    this.username = browser.findElement(by.xpath("//input[contains(@placeholder,'User')]"));
    this.password = browser.findElement(by.xpath("//input[contains(@placeholder,'Password')]"));
    this.rememberButton = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logButton = browser.findElement(by.xpath("//button[contains(.,'Log in')]"));
};
var InputData = function(hostname, username, password)  {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
};
function add() {
    var array = [];
    array.push(new InputData("test", "????", "qwe12"));               // Should say hostaname not correct
    array.push(new InputData("test", "????", "Qwer1234"));            // Should say hostname not correct
    array.push(new InputData("test", "username56", "qwe12"));     // Should say hostname not correct
    array.push(new InputData("test", "username56", "Qwer1234"));      // Should say hostname not correct
    array.push(new InputData("test.whatever.example.com", "????", "qwe12"));  // Should say username not correct
    array.push(new InputData("test.example.net", "????", "Qwer1234"));            // Should say username not correct
    array.push(new InputData("example.com", "username56", "Qwe12"));          // Should say password not correct - less that 8 chr.
    array.push(new InputData("example.com", "username56", "username56"));     // Should say password not correct - contains username
    array.push(new InputData("example.com", "mobile-app", "Qwer1234"));           // Correct data type !
    return array;
}
describe('Verify Page Layout', function() {
    it('Check:', function() {
        // it is ionic coupled with Angular, so ignore the angular load
        browser.ignoreSynchronization = true;
        // Open page
        browser.get('http://localhost:8100/#/login');
        var test = new PageData();
        var EC = protractor.ExpectedConditions;
        var data = add();

        for (var i = 0; i < data.length; i++){
            var item = data[i];
            test.hostname.sendKeys(item.hostname);
            test.username.sendKeys(item.username);
            test.password.sendKeys(item.password);
            test.logButton.click();
            var alertButton = element(by.xpath("//button[contains(.,'OK')]"));
            // We need to wait for the element visibility before clicking on it;
            // guessing a pause is not very reliable
            browser.wait(EC.visibilityOf(alertButton), 20000)
                .then(function(){
                    var alert = element(by.xpath("//span[contains(.,'A record with the supplied identity could not be found.')]"));
                    expect(alert.getText()).toEqual('A record with the supplied identity could not be found.');
                    alertButton.click();
                    browser.sleep(500);
                    test.hostname.clear();
                    test.username.clear();
                    test.password.clear();
                });
        }
    });
});