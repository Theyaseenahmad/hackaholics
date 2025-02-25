// import { NextResponse } from "next/server";

import puppeteer from "puppeteer";

// export async function GET(req) {
//   try {
//     // Extract commodity from query params
//     const { searchParams } = new URL(req.url);
//     const commodity = searchParams.get("commodity");

//     if (!commodity) {
//       return NextResponse.json({ message: "Commodity is required" }, { status: 400 });
//     }

//     const apiKey = process.env.API_NINJA_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json({ message: "API Key is missing" }, { status: 500 });
//     }

//     // Fetch commodity price
//     const response = await fetch(
//       `https://api.api-ninjas.com/v1/commodityprice?name=${commodity}`,
//       {
//         method: "GET",
//         headers: { "X-Api-Key": apiKey },
//       }
//     );

//     // Parse response as JSON
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || `API Error: ${response.statusText}`);
//     }

//     // Return API data
//     return NextResponse.json({ price: data }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching commodity price:", error);

//     return NextResponse.json(
//       { message: error.message || "Failed to get pricing" },
//       { status: 500 }
//     );
//   }
// }




const scrapeAgmarknet = async (commodity, state) => {
  const url = `https://agmarknet.gov.in/SearchCmmMkt.aspx`;

  const browser = await puppeteer.launch({
    headless: false, // Set to true once tested
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // ✅ Check if an ad/pop-up exists and close it
    const popupSelector = ".popup-close-button"; // Update selector if needed
    if (await page.$(popupSelector)) {
      await page.click(popupSelector);
      console.log("Closed ad popup.");
    }

    // ✅ Select commodity from dropdown
    await page.select("#cphBody_ddlCommodity", commodity);

    // ✅ Select state from dropdown
    await page.select("#cphBody_ddlState", state);

    // ✅ Click the search button
    await page.click("#cphBody_btnSearch");

    // ✅ Wait for the results to load
    await page.waitForSelector("#cphBody_GridRecords tr", { timeout: 30000 });

    // ✅ Extract data
    const prices = await page.evaluate(() => {
      let rows = Array.from(document.querySelectorAll("#cphBody_GridRecords tr"));
      return rows.slice(1).map(row => {
        let cells = row.querySelectorAll("td");
        return {
          market: cells[1]?.innerText.trim() || "N/A",
          minPrice: cells[2]?.innerText.trim() || "N/A",
          maxPrice: cells[3]?.innerText.trim() || "N/A",
          modalPrice: cells[4]?.innerText.trim() || "N/A",
          arrivalDate: cells[5]?.innerText.trim() || "N/A",
        };
      });
    });

    console.log("Extracted Prices:", prices);

    await browser.close();
    return prices;
  } catch (error) {
    console.error("Scraping Error:", error);
    await page.screenshot({ path: "error.png" }); // Save error screenshot
    await browser.close();
    throw new Error("Failed to scrape data from Agmarknet.");
  }
};




export async function POST(req) {
  try {
    const { state, commodity } = await req.json();

    if (!state || !commodity) {
      return Response.json({ message: "State and Commodity are required" }, { status: 400 });
    }

    const prices = await scrapeAgmarknet(commodity, state);

    console.log("Final API Response:", prices); // Debugging

    return Response.json({ prices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching market data:", error);
    return Response.json({ message: "Error fetching data", error: error.message }, { status: 500 });
  }
}


