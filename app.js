const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const pdf = require('pdf-parse');

const invoiceFolder = './invoices'; // Replace with the path to your invoice folder
const csvFilePath = 'invoices.csv';

// Define the CSV writer with the desired header fields
const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'restaurantName', title: 'Restaurant Name' },
        { id: 'invoiceNo', title: 'Invoice No' },
        { id: 'invoiceDate', title: 'Invoice Date' },
        { id: 'invoiceTotal', title: 'Invoice Total' },
    ],
    append: true,
});

// Function to process each invoice file
async function processInvoiceFile(file) {
    const contentBuffer = fs.readFileSync(`${invoiceFolder}/${file}`);

    try {
        const data = await pdf(contentBuffer);

        // Extracting data using regular expressions (customize these for your invoice format)
        const text = data.text;
        const restaurantNameMatch = text.match(/Restaurant Name:\s+(.+)/);
        const invoiceNoMatch = text.match(/Invoice No:\s*([\s\S]*?)\n/);
        const invoiceDateMatch = text.match(/Date of Invoice:\s*([\s\S]*?)\n/);
        const invoiceTotalMatch = text.match(/Invoice Total\s*([\s\S]*?)\n/);
        // console.log(invoiceTotalMatch[1]);

        if (
            restaurantNameMatch &&
            invoiceNoMatch &&
            invoiceDateMatch &&
            invoiceTotalMatch
        ) {
            const restaurantName = restaurantNameMatch[1];
            const invoiceNo = invoiceNoMatch[1];
            const invoiceDate = invoiceDateMatch[1];
            const invoiceTotal = invoiceTotalMatch[1];
            // console.log({ restaurantName });

            return { restaurantName, invoiceNo, invoiceDate, invoiceTotal };
        } else {
            console.error(`Incomplete data in ${file}`);
            return null;
        }
    } catch (error) {
        console.error(`Error processing ${file}: ${error.message}`);
        return null;
    }
}

// Read all files in the invoice folder
fs.readdirSync(invoiceFolder).forEach(file => {
    if (file.endsWith('.pdf')) {
        processInvoiceFile(file)
            .then(invoiceData => {
                if (invoiceData) {
                    // Write the extracted data to the CSV file
                    csvWriter.writeRecords([invoiceData]).then(() => {
                        console.log(
                            `Data from ${file} has been written to ${csvFilePath}`
                        );
                    });
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
});
