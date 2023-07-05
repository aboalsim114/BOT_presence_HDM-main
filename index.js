const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function start() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const url = "https://www.hdmnetwork.be/";
    await page.goto(url);

    await page.type("#login", "ton mail ");
    await page.type("#password", "ton mdp");

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
    await page.click("#menuContainer > div:nth-child(4) > p");

    // Calculate the target timestamps
    const targetTimestamps = [
        { hour: 8, minute: 18 },
        { hour: 12, minute: 0 },
        { hour: 12, minute: 45 },
        { hour: 16, minute: 30 },
    ];

    while (true) {
        let currentTime = await page.evaluate(() => {
            let now = new Date();
            let hours = now.getHours().toString().padStart(2, "0");
            let minutes = now.getMinutes().toString().padStart(2, "0");
            let seconds = now.getSeconds().toString().padStart(2, "0");
            return `${hours}:${minutes}:${seconds}`;
        });

        console.log(`Current time in the browser: ${currentTime}`);

        let [currentHour, currentMinute] = currentTime.split(":");

        currentHour = parseInt(currentHour);
        currentMinute = parseInt(currentMinute);

        for (let target of targetTimestamps) {
            let targetHour = target.hour;
            let targetMinute = target.minute;

            if (currentHour === targetHour && currentMinute === targetMinute) {
                await page.evaluate(() => {
                    let buttons = document.querySelectorAll(".containerPresence > .buttonCheck");
                    let alertCloseButton = document.querySelector("#alertCloseButton");
                    for (let button of buttons) {
                        button.click();
                        alertCloseButton && alertCloseButton.click();
                    }
                });
                break; // Exit the loop after clicking the buttons
            }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await browser.close();
}

setInterval(start, 5 * 1000);
