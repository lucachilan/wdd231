const getString = window.location.search;

const myINFO = new URLSearchParams(getString);

document.querySelector('#results').innerHTML = `
<p>Appoinment for ${myINFO.get('first')} ${myINFO.get('last')} </p>
<p>${myINFO.get('ordinance')} on ${myINFO.get('date')} in the ${myINFO.get('location')} Temple</p>
<p>Your Phone: ${myINFO.get('phone')}</p>
<p>Your email: ${myINFO.get('email')}</p>
`