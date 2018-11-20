import cheerio from 'cheerio';

const scrapeHtml = (data) => {
    const $ = cheerio.load(data);
    const details = $('tr').next().next().next().next().next().text();

    return details;
}

export default { scrapeHtml };