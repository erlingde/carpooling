import React from 'react';
import cheerio from 'cheerio';

const scrapeHtml = (data) => {
    const $ = cheerio.load(data);

    // Checks if the data is expired
    if ($('br').length === 8) {
        return undefined;
    }
    
    const seats = $('tr:nth-child(6)').children()[1].children[0] ? $('tr:nth-child(6)').children()[1].children[0].data : undefined;
    const name = $('tr:nth-child(7)').children()[1].children[0] ? $('tr:nth-child(7)').children()[1].children[0].data : undefined;
    const phone =  $('tr:nth-child(8)').children()[1].children[0] ? $('tr:nth-child(8)').children()[1].children[0].data : undefined;
    const mobile = $('tr:nth-child(9)').children()[1].children[0] ? $('tr:nth-child(9)').children()[1].children[0].data : undefined;
    const nonSmokeCar = $('tr:nth-child(11)').children()[1].children[0] ? $('tr:nth-child(11)').children()[1].children[0].data : undefined;
    const notes = $('tr:nth-child(12)').children()[1].children[0] ? $('tr:nth-child(12)').children()[1].children[0].data : undefined;

    return (
        <div>
            {seats && <p><b>Seats: </b>{seats}</p>}
            {name && <p><b>Name: </b> {name}</p>}
            {phone && <p><b>Phone: </b>{phone}</p>}
            {mobile && <p><b>Mobile: </b>{mobile}</p>}
            {nonSmokeCar && <p><b>Non Smoke Car: </b>{nonSmokeCar}</p>}
            {notes && <p><b>Notes: </b>{notes}</p> }    
        </div>
    );
}

export default { scrapeHtml };