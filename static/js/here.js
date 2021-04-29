// import { hereCredentials } from './config.js';
import { router, geocoder } from './index.js';

const requestGeocode = (locationid) => {
   return new Promise((resolve, reject) => {
      geocoder.geocode(
         { locationid },
         res => {

            console.log(res);
            const coordinates = res.Response.View[0].Result[0].Location.DisplayPosition;
            resolve(coordinates);
         },
         err => reject(err)
      )
   })
}

const autocompleteGeocodeUrl = (query) => 
`https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?apiKey=DHpePUwM9TPEpJa9v4b35M171mOzu6RlOf6j3V-8w3g
&resultType=areas
&query=${query}`


export { 
   autocompleteGeocodeUrl,
   requestGeocode
}