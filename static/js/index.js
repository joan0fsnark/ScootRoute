import Search from './search.js';
// document.addEventListener('DOMContentLoaded', function() {
//   console.log('DOM is ready');


const platform = new H.service.Platform({
  apikey: 'DHpePUwM9TPEpJa9v4b35M171mOzu6RlOf6j3V-8w3g'
});

const defaultLayers = platform.createDefaultLayers();
const router = platform.getRoutingService(null, 8);
const geocoder = platform.getGeocodingService();


//Create Map and set it to center above the USA
var map = new H.Map(
  document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat: 39.8283, lng: -98.5795},
  zoom: 3.5
  ,
  pixelRatio: window.devicePixelRatio || 1
  }); 

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const provider = map.getBaseLayer().getProvider();
var ui = H.ui.UI.createDefault(map, defaultLayers); 
var routeInstructionsContainer = document.getElementById('directions');

//Reference to any infobubble opened
// var bubble;

// let polygon;

//Setup marker
// const marker = new H.map.Marker(map.getCenter(), { volatility: true });
// marker.draggable = true;
// map.addObject(marker);

// // Add event listeners for marker movement
// map.addEventListener('dragstart', evt => {
//   if (evt.target instanceof H.map.Marker) behavior.disable();
// }, false);

// map.addEventListener('drag', evt => {
//   const pointer = evt.currentPointer;
//   if (evt.target instanceof H.map.Marker) {
//     evt.target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY));
//   }
// }, false);

// map.addEventListener('dragend', evt => {
//   if (evt.target instanceof H.map.Marker) {
//     behavior.enable();
//     calculateIsoline();
//   }
// }, false);

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());


/**
 * This function will be called once the Routing REST API provides a response
 * @param  {Object} result          A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onSuccess(result) {
  var route = result.routes[0];
  /*
   * The styling of the route response on the map is entirely under the developer's control.
   * A representitive styling can be found the full JS + HTML code of this example
   * in the functions below:
   */
  // addRouteShapeToMap(route);
  // addManueversToMap(route);
  // addWaypointsToPanel(route);
  // addManueversToPanel(route);
  // addSummaryToPanel(route);
  // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

/**
 * Calculates and displays a car route from the Brandenburg Gate in the centre of Berlin
 * to Friedrichstraße Railway Station.
 *
 * A full list of available request parameters can be found in the Routing API documentation.
 * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function calculateRouteFromAtoB(platform, orig, dest) {
  var routeRequestParams = {
    routingMode: 'fast',
    transportMode: 'scooter', //
    origin: orig, // Brandenburg Gate
    destination: dest,  // Friedrichstraße Railway Station
    return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
  };


  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}

var search_from = new Search("USA");
// var search_to = new Search();

function success(pos) {


  const latitude = pos.coords.latitude;
  const longitude = pos.coords.longitude;

  // get the location based 
  fetch(`https://autosuggest.search.hereapi.com/v1/autosuggest?apiKey=DHpePUwM9TPEpJa9v4b35M171mOzu6RlOf6j3V-8w3g&at=${latitude},${longitude}&limit=1&lang=en&q=close`).then(response => {

    map.setCenter({
      lat: latitude,
      lng: longitude
    });

    map.setZoom(13);

    //OMG this was such a pain!
    response.json().then(data =>{
      $('.city-field')[0].innerHTML = data.items[0].title;
    });

    
  }).catch(err => console.error(err));
}


function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};


// Get current posisition of the user
navigator.geolocation.getCurrentPosition(success, error, options);



//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)


/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position,
      // The FO property holds the province name.
      { content: text });
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}


/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route) {
  route.sections.forEach((section) => {
    // decode LineString from the flexible polyline
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    // Create a polyline to display the route:
    let polyline = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });

    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: polyline.getBoundingBox()
    });
  });
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
// function addManueversToMap(route) {
//   var svgMarkup = '<svg width="18" height="18" ' +
//     'xmlns="http://www.w3.org/2000/svg">' +
//     '<circle cx="8" cy="8" r="8" ' +
//     'fill="#1b468d" stroke="white" stroke-width="1"  />' +
//     '</svg>',
//     dotIcon = new H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } }),
//     group = new H.map.Group(),
//     i,
//     j;
//   route.sections.forEach((section) => {
//     let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();

//     let actions = section.actions;
//     // Add a marker for each maneuver
//     for (i = 0; i < actions.length; i += 1) {
//       let action = actions[i];
//       var marker = new H.map.Marker({
//         lat: poly[action.offset * 3],
//         lng: poly[action.offset * 3 + 1]
//       },
//         { icon: dotIcon });
//       marker.instruction = action.instruction;
//       group.addObject(marker);
//     }

//     group.addEventListener('tap', function (evt) {
//       map.setCenter(evt.target.getGeometry());
//       openBubble(
//         evt.target.getGeometry(), evt.target.instruction);
//     }, false);

//     // Add the maneuvers group to the map
//     map.addObject(group);
//   });
// }


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addWaypointsToPanel(route) {
  var nodeH3 = document.createElement('h3'),
    labels = [];

  route.sections.forEach((section) => {
    labels.push(
      section.turnByTurnActions[0].nextRoad.name[0].value)
    labels.push(
      section.turnByTurnActions[section.turnByTurnActions.length - 1].currentRoad.name[0].value)
  });

  nodeH3.textContent = labels.join(' - ');
  routeInstructionsContainer.innerHTML = '';
  routeInstructionsContainer.appendChild(nodeH3);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addSummaryToPanel(route) {
  let duration = 0,
    distance = 0;

  route.sections.forEach((section) => {
    distance += section.travelSummary.length;
    duration += section.travelSummary.duration;
  });

  var summaryDiv = document.createElement('div'),
    content = '';
  content += '<b>Total distance</b>: ' + distance + 'm. <br/>';
  content += '<b>Travel Time</b>: ' + duration.toMMSS() + ' (in current traffic)';


  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft = '5%';
  summaryDiv.style.marginRight = '5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToPanel(route) {
  var nodeOL = document.createElement('ol');

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft = '5%';
  nodeOL.style.marginRight = '5%';
  nodeOL.className = 'directions';

  route.sections.forEach((section) => {
    section.actions.forEach((action, idx) => {
      var li = document.createElement('li'),
        spanArrow = document.createElement('span'),
        spanInstruction = document.createElement('span');

      spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
      spanInstruction.innerHTML = section.actions[idx].instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    });
  });

  routeInstructionsContainer.appendChild(nodeOL);
}

Number.prototype.toMMSS = function () {
  return Math.floor(this / 60) + ' minutes ' + (this % 60) + ' seconds.';
}

//Get current center of the map
const center = () => { return map.center}

// Now use the map as required...
// calculateRouteFromAtoB(platform);
// });

export { geocoder, router, center }