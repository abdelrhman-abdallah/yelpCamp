mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: showedCamp.geometry.coordinates,
  zoom: 9,
});

map.addControl(new mapboxgl.NavigationControl());

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h3>${showedCamp.title}</h3>
  <p>${showedCamp.location}</p>`
);

const marker = new mapboxgl.Marker()
  .setLngLat(showedCamp.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
