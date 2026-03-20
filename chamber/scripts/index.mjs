import { dateFooter } from './date.mjs';
dateFooter();

import { dislpayNavigation } from './navigation.mjs';
dislpayNavigation();


import { apiFetch, apiFetchForecast } from './weather.mjs';
apiFetch()
apiFetchForecast()

import { getMembersFiltered } from './business.mjs';
getMembersFiltered()