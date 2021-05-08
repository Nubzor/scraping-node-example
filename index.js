const jsdom = require('jsdom');
const fs = require('fs');

const { JSDOM } = jsdom;

function countWordOccurances(text, word) {
    // When you break text by a word then you are getting
    // n + 1 occurances of the word in the string
    return text.split(word).length - 1;
}

function printNumberOfImgsAndTheirUrls(document) {
    const imgs = document.querySelectorAll('img');

    console.log(`Na stronie jest ${imgs.length} obrazków, a ich url to: `)

    imgs.forEach(img => {
            console.log(img.src);
    })
}

function writeToFile(content) {
    const fileName = `scrapper_${new Date().toISOString().slice(0, 19)}.txt`;

    fs.writeFile(`./${fileName}`, content, function(error) {
        if (error) {
            return console.error(`Couldn't save data to file!`, error);
        }

        console.info(`Data has been saved sucessfuly, filename: ${fileName}`);
    });
}

function getFromXPath(dom, XPath) {
    const { window } = dom;
    const { document } = window;
    
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate
    // tl;dr it returns iterator for findings
    return document.evaluate(XPath, document, null, window.XPathResult.ANY_TYPE, null);
}

JSDOM
    .fromURL(`https://pl.wikipedia.org/wiki/Gdańsk`, {})
    .then(dom => {
        const { window: { document }} = dom; // const document = dom.window.document;
        const { body } = document; // const body = document.body;

        const gdansk_count = countWordOccurances(body.textContent, 'Gdańsk');

        console.log(`Słowo Gdańsk występuje: ${gdansk_count} razy`);

        printNumberOfImgsAndTheirUrls(document);

        const element = getFromXPath(dom, `//*[@id="mw-content-text"]/div[1]/p[51]`);

        const paragraph = element.iterateNext();

        writeToFile(`Content paragrafu pod danym XPathem: ${paragraph && paragraph.textContent}`);
    })
    .catch(console.error);