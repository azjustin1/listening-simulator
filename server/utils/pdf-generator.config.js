const puppeteer = require("puppeteer");
const path = require("path");

const generatePDF = async (htmlString, fileName) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  const filePath = path.join(__dirname, "../upload", `${fileName}.pdf`);

  await page.setContent(htmlString);
  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return filePath; // Return the path of the generated PDF
};

module.exports = generatePDF;
