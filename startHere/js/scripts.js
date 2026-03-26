const getString = window.location.search;
console.log(getString);

const myINFO = new URLSearchParams(getString);
console.log(myINFO);

console.log(myINFO.get('first'));
console.log(myINFO.get('last'));
console.log(myINFO.get('ordinance'));
console.log(myINFO.get('date'));
console.log(myINFO.get('location'));
console.log(myINFO.get('phone'));
console.log(myINFO.get('email'));

document.querySelector('#results').innerHTML = `
<p>Appoinment for ${myINFO.get('first')} ${myINFO.get('last')} </p>
<p>${myINFO.get('ordinance')} on ${myINFO.get('date')} in the ${myINFO.get('location')} Temple</p>
<p>Your Phone: ${myINFO.get('phone')}</p>
<p>Your email: ${myINFO.get('email')}</p>
`