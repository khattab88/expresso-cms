export const displayMap = (location) => {
    // console.log("location: ", location);

    //mapboxgl.accessToken = 'pk.eyJ1IjoiZXhwcmVzc28tYXBwIiwiYSI6ImNrajIxdWJvMzM2czMyeHNja2N3cjZ4MG4ifQ.dNAHPe2ukL_MefjI8G1Ygg';
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXhwcmVzc28tYXBwIiwiYSI6ImNrajIyOWQ4ZDBwMzEzMHA4b2dpdnh5dWwifQ.GShzOatTtqs3c_s5kndAcA';

    var map = new mapboxgl.Map({
        container: 'map',
        // style: 'mapbox://styles/mapbox/streets-v11',
        style: 'mapbox://styles/expresso-app/ckj23mh262i2419o444foq19p',
        // scrollZoom: false, // disable zooming when scroll
        center: location, // starting position [lng, lat]
        zoom: 14, // starting zoom
        interactive: true,
    });

    var marker = new mapboxgl.Marker({
        color: "#009a9a",
        draggable: true
    }).setLngLat(location)
        .addTo(map);

    var branch = document.getElementById("map").dataset.branch;
    var popup = new mapboxgl.Popup({ offset: 30 })
        .setLngLat(location)
        .setHTML(`<p>${branch}</p>`)
        .addTo(map);


    var mapControls = document.getElementsByClassName("mapboxgl-control-container")[0];
    mapControls.style.display = "none";

    var mapElement = document.getElementById("map");
    mapElement.style.position = "absolute";
    mapElement.style.overflow = "visible";

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    var mapCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
    mapCanvas.style.width = "530px";
};