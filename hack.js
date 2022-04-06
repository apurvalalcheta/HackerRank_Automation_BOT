//node hack.js --url=https://www.hackerrank.com/ --config=config.json
//npm init -y
//npm install minimist
// npm install puppeteer

let minimist=require("minimist");
let puppeteer=require("puppeteer");
let fs=require("fs");

let args=minimist(process.argv);

//Convert json file into object

let jf=fs.readFileSync(args.config,"utf-8");
let fsJSO=JSON.parse(jf);
//console.log(fsJSO.userid);
//console.log(fsJSO.password);
//console.log(fsJSO.moderator);

// Async function to be used whenever using await and await is to be used whenever promise is given so that we don't have to write .then()
async function Trigger(){
    let browser= await puppeteer.launch({
        headless:false,
        args:['--start-maximized']
            ,
        defaultViewport:null
    })
    let pages=await browser.pages();
    let page=pages[0];

    await page.goto(args.url);

    //page 1
    await page.waitForSelector("a[href='https://www.hackerrank.com/access-account/']");
    await page.click("a[href='https://www.hackerrank.com/access-account/']");

    //page 2
    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");

    //login type 
    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']",fsJSO.userid,{delay : 300});

    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']",fsJSO.password,{delay : 300});

    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");

    //Compete tab
    await page.waitForSelector("a[data-analytics='NavBarContests']"); //href not working as not full link only contests
    await page.click("a[data-analytics='NavBarContests']");

    // Manage contests
    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");

    // Edit contest details (Click on first contest)
    await page.waitForSelector("a[href='/administration/contests/edit/159419']");
    await page.click("a[href='/administration/contests/edit/159419']");
    await page.waitFor(3000);

    // To avoid save pop up
    //await page.waitForSelector("div.clearfix");
   // await page.click("div.clearfix");

    //Edit moderators
    await page.waitForSelector("li[data-tab='moderators']");
    await page.click("li[data-tab='moderators']");

    //Add Moderator
    await page.waitForSelector("input#moderator");
    await page.type("input#moderator",fsJSO.moderator,{delay:300});

    await page.keyboard.press("Enter");
    
}

Trigger();
