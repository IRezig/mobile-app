var PageData = function()   {
    this.logo = element(by.xpath("//img[contains(@src,'logo.svg')]"));
    this.hostname = element(by.xpath("//input[contains(@placeholder,'Hostname')]"));
    this.username = element(by.xpath("//input[contains(@placeholder,'User')]"));
    this.password = element(by.xpath("//input[contains(@placeholder,'Password')]"));
    this.rememberButton = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logButton = element(by.xpath("//button[contains(.,'Log in')]"));
}

var InputData = function(hostname, username, password)  {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
}

function field_cleaner(test) {
    //browser.sleep(10000);
    test.hostname.clear();
    test.password.clear();
    test.username.clear();
}

function checkIncomingPage(){

    var name = element(by.xpath("(//div[@ng-if='searchDomain'])[1]")); 
    var content = element(by.xpath("(//ion-item[contains(.,'No entries. Pull to refresh...')])[1]"));
    var menuButton = element(by.xpath("(//button[contains(@on-tap,'toggleLeftMenu($event)')])[1]"));
    var timeDate = element(by.xpath("(//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')])[1]"));
    var currentDate = new Date();
    var day = currentDate.getDate().toString();
    var month = months[currentDate.getMonth()];
    var year = currentDate.getFullYear().toString();

    expect(name.getText()).toEqual(domainData.username);
    expect(content.getText()).toEqual("No entries. Pull to refresh...");
    expect(menuButton.isPresent()).toBe(true);
    expect(timeDate.isPresent()).toBe(true);

    var buildDate = (((day.concat(" ", month)).concat(" - ", day)).concat(" ", month)).concat(" ", year);
    expect(timeDate.getText()).toEqual(buildDate);
}

function checkOutgoingPage(){

    var name = element(by.xpath("(//div[@ng-if='searchDomain'])[2]")); 
    var content = element(by.xpath("(//ion-item[contains(.,'No entries. Pull to refresh...')])[2]"));
    var menuButton = element(by.xpath("(//button[contains(@on-tap,'toggleLeftMenu($event)')])[2]"));
    var timeDate = element(by.xpath("(//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')])[2]"));
    var currentDate = new Date();
    var day = currentDate.getDate().toString();
    var month = months[currentDate.getMonth()];
    var year = currentDate.getFullYear().toString();

    expect(name.getText()).toEqual(domainData.username);
    expect(content.getText()).toEqual("No entries. Pull to refresh...");
    expect(menuButton.isPresent()).toBe(true);
    expect(timeDate.isPresent()).toBe(true);

    var buildDate = (((day.concat(" ", month)).concat(" - ", day)).concat(" ", month)).concat(" ", year);
    expect(timeDate.getText()).toEqual(buildDate);
}

function checkSearchMenu(){

    var backTitle = element(by.xpath("//div[contains(.,'Back to results')]"));  
    var searchText = element(by.xpath("//h4[contains(.,'Search messages')]")); 
    var sender = element(by.xpath("//input[contains(@placeholder,'Sender')]"));
    var recipient = element(by.xpath("//input[contains(@placeholder,'Recipient')]"));
    var dateTitle = element(by.xpath("//span[contains(@aria-label,'Sent')]"));
    var p24HButton = element(by.xpath("//button[contains(@on-tap,'past24Hours()')]"));
    var pWeekButton = element(by.xpath("//button[contains(@on-tap,'pastWeek()')]"));
    var pMonthButton = element(by.xpath("//button[contains(@on-tap,'pastMonth()')]"));   
    var customTitle = element(by.xpath("//span[contains(@aria-label,'Custom timeframe')]"));
    var fromDateTitle = element(by.xpath("//span[contains(.,'From date')]"));
    var toDateTitle = element(by.xpath("//span[contains(.,'To date')]"));
    var fromDateField = element.all(by.xpath("//div[contains(@class,'time ng-binding')]")).get(0);
    var toDateField = element.all(by.xpath("//div[contains(@class,'time ng-binding')]")).get(1);
    var doSearch = element(by.xpath("//button[contains(@on-tap,'doSearch()')]"));
    var doClear = element(by.xpath("//button[@on-tap='clearSearch()']"));

    expect(backTitle.getText()).toEqual("Back to results");
    expect(searchText.getText()).toEqual("Search messages");
    expect(sender.isPresent()).toBe(true);
    expect(recipient.isPresent()).toBe(true);
    expect(dateTitle.isPresent()).toBe(true);
    expect(p24HButton.getText()).toEqual("Past 24H");
    expect(pWeekButton.getText()).toEqual("Past Week");
	expect(pMonthButton.getText()).toEqual("Past Month");
	expect(customTitle.getText()).toEqual("Custom timeframe");
	expect(fromDateTitle.getText()).toEqual("From date");
	expect(toDateTitle.getText()).toEqual("To date");
    expect(fromDateField.isPresent()).toBe(true);
    expect(toDateField.isPresent()).toBe(true);
    expect(doSearch.isPresent()).toBe(true);
    expect(doClear.isPresent()).toBe(true);
}

describe('Verify Domain User Layout', function() {

  it('Check:', function() {

    //	Open page
    browser.get('http://localhost:8100/#/login');

    var test = new PageData();
    var data = require('./dataForUserRestrictedLogin.json');
    EC = protractor.ExpectedConditions;
    domainData = new InputData(data.domainH, data.domainU, data.domainP);
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    //	Login
    field_cleaner(test);
    test.hostname.sendKeys(domainData.hostname);
    test.username.sendKeys(domainData.username);
    test.password.sendKeys(domainData.password);
    test.logButton.click();

    //	Check Dashboard

    var header = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/div/div/h3"));
    var role = element(by.xpath("(//span[contains(.,'Domain User')])[1]"));
 	var incoming = element(by.xpath("//a[contains(@ui-sref,'main.incomingLogSearch')]"));
    var outgoing = element(by.xpath("//a[contains(@ui-sref,'main.outgoingLogSearch')]"));
    var title = element(by.xpath("//div[@class='dashboard']//h4[contains(.,'Your available products')]"));
 	var credit = element.all(by.xpath("//div[@class='col text-center ng-binding']")).get(0);
 	var menuButton = element(by.xpath("//ion-header-bar//button[contains(@class,'ion-navicon')]"));

 	//	Check Header
    browser.wait(EC.visibilityOf(header), 5000).then(function(){   
        expect(header.getText()).toEqual("Hello".concat(" ", domainData.username));
    });
    //	Check role 
    expect(role.getText()).toEqual("DOMAIN USER");
 	// Check categories
    expect(incoming.isPresent()).toBe(true);
    expect(outgoing.isPresent()).toBe(true);
    //	Check Title
    expect(title.isPresent()).toBe(true);
    //	Check credit    
    expect(credit.getText()).toEqual("© 2017 SpamExperts");
    //	Check menuButton   
    expect(menuButton.isPresent()).toBe(true);


    //	Enter Incoming Menu
    incoming.click();
    //browser.ignoreSynchronization = true;

    //	Check Incoming Page
    var inHeader = element(by.xpath("//div/div/div/div[contains(.,'Incoming spam messages')]"));
    browser.wait(EC.visibilityOf(inHeader), 5000).then(function(){   
        expect(inHeader.getText()).toEqual("Incoming spam messages");
    });
    checkIncomingPage();

    //	Enter inSearch Menu
    var searchButton = element(by.xpath("(//button[contains(@on-tap,'toggleRightMenu($event)')])[1]"));
    browser.wait(EC.visibilityOf(searchButton), 5000).then(function(){
       expect(searchButton.isPresent()).toBe(true);
    });
    browser.wait(EC.elementToBeClickable(searchButton), 5000).then(function(){
        searchButton.click();
    });

    //	Check inSearch Menu
    var backButton = element(by.xpath("//button[contains(@class,'button button-icon icon ion-ios-arrow-left')]"));
    browser.wait(EC.visibilityOf(backButton), 5000).then(function(){
       expect(backButton.isPresent()).toBe(true);
    });
    checkSearchMenu();

    //	Go back to Incoming Page
    browser.wait(EC.elementToBeClickable(backButton), 5000).then(function(){
        backButton.click();
    });

    //	Go back to dashboard
    browser.navigate().back();
    //browser.ignoreSynchronization = false;

     //	Enter Outgoing Menu

/*    outgoing.click();
    //browser.ignoreSynchronization = true;

    //	Check Outgoing Page
    var outHeader = element(by.xpath("//div/div/div/div[contains(.,'Outgoing spam messages')]"));
    browser.wait(EC.visibilityOf(outHeader), 5000).then(function(){   
        expect(outHeader.getText()).toEqual("Outgoing spam messages");
    });
    checkOutgoingPage();

    //	Enter outSearch Menu
    searchButton = element(by.xpath("(//button[@on-tap='toggleRightMenu($event)'])[2]"));
    browser.wait(EC.visibilityOf(searchButton), 5000).then(function(){
       expect(searchButton.isPresent()).toBe(true);
    });
    browser.wait(EC.elementToBeClickable(searchButton), 5000).then(function(){
        searchButton.click();
    });

    //	Check outSearch Menu
    backButton = element(by.xpath("//button[contains(@class,'button button-icon icon ion-ios-arrow-left')]"));
    browser.wait(EC.visibilityOf(backButton), 5000).then(function(){
       expect(backButton.isPresent()).toBe(true);
    });
    checkSearchMenu();

    //	Go back to Outgoing Page
    browser.wait(EC.elementToBeClickable(backButton), 5000).then(function(){
        backButton.click();
    });

    //	Go back to dashboard
    browser.navigate().back();
    //browser.ignoreSynchronization = false;	
*/

    //	Log out
    browser.wait(EC.visibilityOf(menuButton), 5000).then(function(){
       expect(menuButton.isPresent()).toBe(true);
    });
    browser.wait(EC.elementToBeClickable(menuButton), 5000).then(function(){
	   menuButton.click();
    });

    var logArrow = element(by.xpath("//button[contains(@class,'button button-icon icon ion-ios-arrow-right')]"));
    var logHead = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu[1]/div/div/h3"));
    var logRole = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu[1]/div/div/div/span"));
    var logTitle = element.all(by.xpath("//h4[contains(.,'Your available products')]")).get(1);
    var logIncoming = element.all(by.xpath("//a[contains(@class,'item-content ng-binding')]")).get(0);
    var logOutgoing = element.all(by.xpath("//a[contains(@class,'item-content ng-binding')]")).get(1);
	var logCredit = element.all(by.xpath("//div[@class='col text-center ng-binding']")).get(1);
	var logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
	var OKButton = element(by.xpath("//button[contains(.,'OK')]"));

    browser.wait(EC.visibilityOf(logHead), 5000).then(function(){
        expect(logHead.getText()).toEqual(domainData.username);
    });
    expect(logArrow.isPresent()).toBe(true);
    expect(logRole.getText()).toEqual("DOMAIN USER");
	expect(logTitle.getText()).toEqual("Your available products");
	expect(logIncoming.isPresent()).toBe(true);
	expect(logOutgoing.isPresent()).toBe(true);
	expect(logCredit.getText()).toEqual("© 2017 SpamExperts");
    browser.wait(EC.elementToBeClickable(logoutButton), 5000).then(function(){
        logoutButton.click();
    });
    browser.wait(EC.elementToBeClickable(OKButton), 5000).then(function(){
        OKButton.click();
    });
    browser.wait(EC.visibilityOf(test.logButton), 5000).then(function(){
        browser.sleep(800);
        test.hostname.clear();
        test.username.clear();
        test.password.clear();
    });

  });

});