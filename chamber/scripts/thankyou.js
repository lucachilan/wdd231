import { dateFooter } from './date.mjs';
dateFooter();
import { dislpayNavigation } from './navigation.mjs';
dislpayNavigation();

const getString = window.location.search;
console.log(getString)
const myINFO = new URLSearchParams(getString);
console.log(myINFO);

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) return 'th';

    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

const fullDate = myINFO.get('timestamp');
const dateObj = new Date(fullDate);

const day = dateObj.getDate();
const suffix = getDaySuffix(day);

const month = dateObj.toLocaleString('en-US', { month: 'long' });
const year = dateObj.getFullYear();

const myDate = `${month} ${day}${suffix}, ${year}`;

let membership;
if (myINFO.get('membership') === 'np') {
    membership = 'Non Profit';
} else {
    membership = myINFO.get('membership');
}

// first name, last name, email, mobile number, business name, and current date timestamp from the hidden field
document.querySelector('#results').innerHTML = `
<h2 class="name">${myINFO.get('first')} ${myINFO.get('last')},</h2>
<p>${myINFO.get('org-name')} is now a ${membership} member of the Rivera Chamber of Commerce</p>
<p>In case we need it, we will contact you at: </p>
<div class="contact-info">
    <p>Your email: ${myINFO.get('email')}</p>
    <p>Your phone number: ${myINFO.get('phone-number')}</p>
</div>
<p class="date-join">Joined - ${myDate}</p>
`;