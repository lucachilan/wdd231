import { dateFooter } from './date.mjs';
import { dislpayNavigation } from './navigation.mjs';
import { apiFetch } from './weather.mjs';
import { getMembersFiltered } from './business.mjs';

dateFooter()

dislpayNavigation()

apiFetch("forecast")
apiFetch("current")


getMembersFiltered()