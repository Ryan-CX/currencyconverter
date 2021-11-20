const axios = require('axios');
require('dotenv').config();

//https://fixer.io
const FIXER_API_KEY = process.env.FIXER_API;
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

//https://restcoutires.eu

const REST_COUNTRIES_API = 'https://restcountries.eu/rest/v2/currency';

//async/await

//fetch data about currencies
const getExchangeRate = async (fromCurrency, toCurrency) => {
	try {
		const res = await axios.get(FIXER_API);

		const rates = res.data.rates;
		const euro = 1 / rates[fromCurrency];
		const exchangeRate = euro * rates[toCurrency];

		return exchangeRate;
	} catch (error) {
		throw new Error(
			`Unable to get currency ${fromCurrency} and  ${toCurrency}`
		);
	}
};

//fetch data about countries and return a list of country names.
const getCountries = async (currencyCode) => {
	try {
		const { data } = await axios.get(`${REST_COUNTRIES_API}/${currencyCode}`);
		return data.map(({ country }) => country);
	} catch (error) {
		console.log(error);
	}
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
	fromCurrency = fromCurrency.toUpperCase(); //cuz the API doesn't work with lower case...
	toCurrency = toCurrency.toUpperCase();

	const [exchangeRate, countries] = await Promise.all([
		getExchangeRate(fromCurrency, toCurrency),
		getCountries(toCurrency),
	]);

	const convertedAmount = (amount * exchangeRate).toFixed(2);
	return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}, and you can spend these in following countries: ${countries}`;
};

convertCurrency('USD', 'HRK', 20)
	.then((result) => console.log(result))
	.catch((err) => console.log(err));

//
