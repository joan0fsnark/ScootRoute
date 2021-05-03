import { $, apiKey } from './helpers.js';
import { geocoder, updateRoute } from './index.js';

class Search {

    constructor(startLocation, rootElementId, endPoint) {

        this.endPoint = endPoint;
        this.active = 0;
        this.matches = [];
        this.container = document.getElementById(rootElementId);
        this.input = this.container.getElementsByClassName('city-field')[0];
        this.suggestions = this.container.getElementsByClassName('city-field-suggestion')[0];
        this.input.innerText = startLocation;
        this.input.oninput = (evt) => this.updateField(evt);
        this.input.onkeydown = (evt) => this.onkeyinput(evt);
        this.label = this.container.getElementsByTagName('h2')[0];
    }

    async updateField(evt) {
        const value = evt.target.innerText;

        if (evt.data === null || value.length === 0 || value === "") {
            return;
        }

        // console.log(this.endPoint);

        this.matches = await fetch(`https://autosuggest.search.hereapi.com/v1/autosuggest` +
            `?at=${this.endPoint.lat},${this.endPoint.lng}` +
            `&limit=10` +
            `&apikey=${apiKey}` +
            `&resultType=areas` +
            `&q=${value}`
        ).then(res => res.json());

        const match = this.matches.items[0];

        // console.log(match.position);
        if (match === undefined) {// No matches
            this.suggestions.innerText = '';
        } else {// Matches

            console.log(match.position);
            this.label = match.title;

            // + ', ' + match.countryCode;
            this.endPoint = {lat: match.position.lat, lng: match.position.lng};

            this.suggestions.innerText = value + this.label.substring(value.length, this.label.length);

        }
    }

    onkeyinput(evt) {
        const code = evt.keyCode;
        if (code === 13 || code === 9) {
            this.input.innerText = this.label;
            this.suggestions.innerText = '';
            evt.preventDefault();

            
            console.log("The endPoint:" + this.endPoint.lat + "," + this.endPoint.lng);
            // console.log(this.active);
            // this.selectMatch(this.endPoint.lat, this.endPoint.lat);
            updateRoute();
        }
    }

    // async selectMatch(latitude, longitude) {
    //     // const { Latitude: lat, Longitude: lng } = await requestGeocode(this.active);
    //     center.lat = latitude;
    //     center.lng = longitude;

   

        // searchAndAutoComplete(lat, lng)
        // console.log(center);
        // marker.setGeometry(center);
        // calculateIsoline();
    }

    // searchAndAutoComplete(latitude, longitude) {

    //     fetch(`https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=${apiKey}&at=${latitude},${longitude}&lang=en-US`).then(res => {

    //         res.json().then(data => {
    //             // field.innerHTML = data.items[0].title;

    //             map.setCenter({
    //                 lat: latitude,
    //                 lng: longitude
    //             });

    //             map.setZoom(13);
    //         })
    //     }).catch(err => console.error(err));
    // }
// }

// const requestGeocode = (locationid) => {
//     return new Promise((resolve, reject) => {
//         geocoder.geocode(
//             { locationid },
//             res => {

//                 console.log(res);
//                 const coordinates = res.Response.View[0].Result[0].Location.DisplayPosition;
//                 resolve(coordinates);
//             },
//             err => reject(err)
//         )
//     })
// }


export default Search;