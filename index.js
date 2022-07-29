const webdriver = require('selenium-webdriver');
const until = require("selenium-webdriver/lib/until");
const {By} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome');
const dotenv = require("dotenv")
const fs = require('fs')


dotenv.config()

const delay = ms => new Promise(res => setTimeout(res, ms));

let driver = new webdriver.Builder()
    .forBrowser(webdriver.Browser.CHROME)
    .setChromeOptions("--user-data-dir=C:\Users\Yaman\AppData\Local\Google\Chrome\User Data\'")
    .build();

console.log("Driver Built !!")


async function login() {

    const response = await driver.get("https://twitter.com/i/flow/login");
    let usernameArea = By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/div[5]/label/div/div[2]/div/input");
    await driver.wait(webdriver.until.elementLocated(usernameArea,10000));
    console.log("Username Input Detected!");
    
    const usernameInput = await driver.findElement(usernameArea);
    await usernameInput.sendKeys(process.env.tw_username);

    
    let nextButtonElement = By.xpath("//*[contains(text(),'Next')]");
    const nextButton = await driver.findElement(nextButtonElement);
    nextButton.click();

    let passwordArea = By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[3]/div/label/div/div[2]/div[1]/input");
    await driver.wait(webdriver.until.elementLocated(passwordArea,10000));
    console.log("Password Input Detected!");

    const passwordInput = await driver.findElement(passwordArea);
    await passwordInput.sendKeys(process.env.tw_pass);

    let loginButtonElement = By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]/div/div/div");
    const loginButton = await driver.findElement(loginButtonElement);
    loginButton.click();


}   

async function get_user_followers(username) {

    let response = await driver.get("https://twitter.com/i/flow/login");
    let usernameArea = By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/div[5]/label/div/div[2]/div/input");
    await driver.wait(webdriver.until.elementLocated(usernameArea,10000));
    console.log("Login Page Detected!");
    
    const usernameInput = await driver.findElement(usernameArea);
    await usernameInput.sendKeys(process.env.tw_username);

    
    let nextButtonElement = By.xpath("//*[contains(text(),'Next')]");
    const nextButton = await driver.findElement(nextButtonElement);
    nextButton.click();

    let passwordArea = By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[3]/div/label/div/div[2]/div[1]/input");
    await driver.wait(webdriver.until.elementLocated(passwordArea,10000));
    //console.log("Password Input Detected!");

    const passwordInput = await driver.findElement(passwordArea);
    await passwordInput.sendKeys(process.env.tw_pass);

    let loginButtonElement = By.xpath("/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]/div/div/div");
    const loginButton = await driver.findElement(loginButtonElement);
    //console.log(await loginButton.getRect())
    loginButton.click();

    let homePage = By.xpath("/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/div[1]/div[1]/div/div/div/div/div[1]/div/h2/span")
    await driver.wait(webdriver.until.elementLocated(homePage,10000))

    response = await driver.get("https://twitter.com/"+username+"/followers")


    let follower_container = By.xpath("/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div");
                    
    await driver.wait(webdriver.until.elementLocated(follower_container,10000));
    //console.log("Follower container detected.");

    let storage = []
    let follower_divs;
    let tried = 0;
    let startvar;

    while (tried < 12) {
        startvar = storage.length

        //console.log("looking for new divs");
        await driver.wait(webdriver.until.elementLocated(By.xpath(`/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div/div`),10000))
        
        follower_divs = await driver.findElements(By.xpath("/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div/div"));
        //console.log(follower_divs.length);

        for (i=0;i < follower_divs.length ;i++) {

            try {

                let follower_username = await follower_divs[i].findElement(By.xpath(".//a")).getAttribute('href');
        
                if (!(storage.includes(follower_username))) {

                    storage.push(follower_username);
                    //console.log("Pushed "+follower_username);
                    let scrollby = "window.scrollBy(0, "+ (await follower_divs[i].getRect()).height.toString()+");"
                    await driver.executeScript(scrollby);
                    
                    fs.appendFile('./result.txt', follower_username+"\n", err => {
                        if (err) {
                          console.error(err)
                          return
                        }
                    })

                }
            }
            catch (err) {
                continue
            }
            
        }
        endvar = storage.length

        if (endvar == startvar) {
            tried += 1;
        }
        else {
            tried = 0;
            console.log("Storage Amount: " + storage.length.toString());
        }
        

        //console.log(storage.length)
    }
}


get_user_followers("DaJenus")

console.log("Results saved in result.txt..")