const puppeteer = require("puppeteer");
const fs = require("fs/promises");


const Justifier_Absence = async(msg) => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = "https://www.hdmnetwork.be/";
    await page.goto(url);
    await page.setDefaultNavigationTimeout(0);
    await page.type("#login", "sami.abdulhalim@hetic.net"); // mail
    await page.type("#password", "Alzaimer.70"); // mot de passe s

    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click("#boutonLogIn"),
    ]);


    await page.waitForSelector("#menuContainer > .titreMenu", { timeout: 60000 });
    await page.evaluate(() => {
        let titreMenu = document.querySelector("#menuContainer > .titreMenu");
        if (titreMenu) {
            titreMenu.click();
        } else {
            console.log(".titreMenu not found");
        }
    });


    await page.waitForSelector('div[data-menu="stage"]', { timeout: 60000 });
    await page.click("#menuContainer > div:nth-child(6) > p");


    await page.waitForSelector(".justifyThat")

    await page.$eval(".justifyThat", (el) => el.click());

    await page.type("#motif", msg)

    await page.$eval("#submit", (el) => el.click());


    await browser.close();


}

Justifier_Absence("j'ai oublier de pointer") // mettre le motif absence ici