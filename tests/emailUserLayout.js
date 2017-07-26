var LoginPage = function() { //create an object with the 6 elements from the log in page, extracting their position. Will be useful in the future.

    this.logo = element(by.xpath("//img[contains(@class,'se-icon')]"));
    this.hostname = element(by.xpath("//input[contains(@ng-model,'data.hostname')]"));
    this.user = element(by.xpath("//input[contains(@ng-model,'data.username')]"));
    this.password = element(by.xpath("//input[contains(@ng-model,'data.password')]"));
    this.reminder = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logbutton = element(by.xpath("//button[contains(@on-tap,'login(data)')]"));
};
var dashPage = function() {
    this.leftButton = element(by.xpath("//button[contains(@class,'button button-icon icon ion-navicon')]"));
    this.logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    this.loginCheck = element.all(by.xpath("//h4[contains(.,'Your available products')]")).get(0);
    this.incoming = element(by.xpath("//ion-list//a[contains(.,'Incoming Filtering Quarantine')]"));
    this.outgoing = element(by.xpath("//ion-list//a[contains(.,'Outgoing Filtering Quarantine')]"));
    this.bigIncoming = element(by.xpath("//a[@ui-sref='main.incomingLogSearch']"));
    this.bigOutgoing = element(by.xpath("//a[@ui-sref='main.outgoingLogSearch']"));
    this.right_arrow = element(by.xpath("//button[@class='button button-icon icon ion-ios-arrow-right']"));
    this.left_arrow = element(by.xpath("//button[@class='button button-icon icon ion-ios-arrow-left']"));
    this.fromdate = element(by.xpath("//span[@aria-label='From date']"));
    this.todate = element(by.xpath("//span[@aria-label='To date']"));
    this.ioleftButton = element(by.xpath("//button[@class='button button-icon icon ion-navicon disable-user-behavior']"));
    this.ibuttonMessage = element(by.xpath("//div/div/div/div[contains(.,'Incoming spam messages')]"));
    this.obuttonMessage = element(by.xpath("//div/div/div/div[contains(.,'Outgoing spam messages')]"));
    this.iRefresher = element(by.xpath("(//ion-item[@ng-if='!loadingEntries && !messageEntries.length'])[1]"));
    this.oRefresher = element(by.xpath("(//ion-item[@ng-if='!loadingEntries && !messageEntries.length'])[2]"));
    this.isearchdate = element(by.xpath("(//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')])[1]"));
    this.osearchdate = element(by.xpath("(//div[@class='col col-30 col-center text-right top-date ng-binding'])[2]"));
    this.suggestionMessage = element(by.xpath("//div[contains(@ng-bind-html,'notice|trust')]"));
};


var iSearchPanel = function() {

    this.isearchButton = element(by.xpath("(//button[@on-tap='toggleRightMenu($event)'])[1]"));
    this.osearchButton = element(by.xpath("(//button[@on-tap='toggleRightMenu($event)'])[2]"));
    this.idomainSearch = element(by.xpath("//input[contains(@placeholder,'Domain')]"));
    this.isenderSearch = element(by.xpath("//input[contains(@placeholder,'Sender')]"));
    this.irecipientSearch = element(by.xpath("//input[contains(@placeholder,'Recipient')]"));
    this.ihourSearch = element(by.xpath("//button[contains(@on-tap,'past24Hours()')]"));
    this.iweekSearch = element(by.xpath("//button[contains(@on-tap,'pastWeek()')]"));
    this.imonthSearch = element(by.xpath("//button[contains(@on-tap,'pastMonth()')]"));
    this.iclearSearch = element(by.xpath("//button[contains(@on-tap,'clearSearch()')]"));
    this.istartSearch = element(by.xpath("//button[contains(@on-tap,'doSearch()')]"));
};


var dashAlert = function() {
    this.alertButtonOk = element(by.xpath("//button[contains(@class,'button ng-binding button-positive')]"));
};

function extract_data(formatedDate, currentDate) {
    formatedDate[0] = currentDate[8];
    formatedDate[1] = currentDate[9];
    formatedDate[2] = " ";
    formatedDate[3] = currentDate[4];
    formatedDate[4] = currentDate[5];
    formatedDate[5] = currentDate[6];
}

function field_cleaner(Obj) {
    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}

function addCredentials(Obj, host, user, pwd) {
    //The three fields should be provided with valid data
    Obj.hostname.sendKeys(host);
    Obj.user.sendKeys(user);
    Obj.password.sendKeys(pwd);
}
var data = require("./dataForUserRestrictedLogin.json");
describe('mobile app login page', function() {

    var Obj = new LoginPage(); // initialize an object//
    var alert = new dashAlert(); //initialize the Popup//
    var logged = new dashPage();
    var search = new iSearchPanel();
    var EC = protractor.ExpectedConditions;


    it('should display sugestive error messages', function() {

        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);
        var currentDate = Date();
        var formatedDate = new Array();
        extract_data(formatedDate, currentDate);
        // console.log(formatedDate);

        addCredentials(Obj, data.emailH, data.emailU, data.emailP);
        Obj.logbutton.click();
        //Incoming Layout Check
        browser.wait(EC.visibilityOf(logged.loginCheck), 20000)
            .then(function() {
                expect(logged.loginCheck.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.bigIncoming), 20000)
            .then(function() {
                expect(logged.bigIncoming.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.leftButton), 20000)
            .then(function() {
                expect(logged.leftButton.isPresent()).toBeTruthy();
            });
        logged.leftButton.click();

        browser.wait(EC.visibilityOf(logged.right_arrow), 20000)
            .then(function() {
                expect(logged.right_arrow.isPresent()).toBeTruthy();
            });

        browser.wait(EC.visibilityOf(logged.incoming), 20000)
            .then(function() {
                expect(logged.incoming.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.logoutButton), 20000)
            .then(function() {
                expect(logged.logoutButton.isPresent()).toBeTruthy();
            });

        logged.incoming.click();
        browser.ignoreSynchronization = true;

        expect(logged.ibuttonMessage.isPresent()).toBeTruthy();
        expect(logged.isearchdate.isPresent()).toBeTruthy();

        browser.wait(EC.visibilityOf(logged.iRefresher), 20000)
            .then(function() {
                expect(logged.iRefresher.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(search.isearchButton), 20000)
            .then(function() {
                expect(search.isearchButton.isPresent()).toBeTruthy();
            });

        search.isearchButton.click();

        expect(logged.left_arrow.isPresent()).toBeTruthy();
        expect(logged.fromdate.isPresent()).toBeTruthy();
        expect(logged.todate.isPresent()).toBeTruthy();
        expect(search.isenderSearch.isPresent()).toBeTruthy();




        expect(search.ihourSearch.isPresent()).toBeTruthy();
        expect(search.iweekSearch.isPresent()).toBeTruthy();
        expect(search.imonthSearch.isPresent()).toBeTruthy();
        expect(search.iclearSearch.isPresent()).toBeTruthy();
        expect(search.istartSearch.isPresent()).toBeTruthy();
        browser.refresh();
    });
});