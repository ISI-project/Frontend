import React, {useEffect, useRef, useState} from "react";
import {loadModules} from 'esri-loader';


const MapView2 = ({isToggled}) => {
    const mapStyle = {
        height: '800px', // Set to your desired height
        width: '1270px', // Set to your desired width
        display: 'flex',
        flexDirection: 'row',
    };
    const mapRef = useRef();

    const [internalToggled, setInternalToggled] = useState(isToggled);
    const [data, setData] = useState([]);
    const mapViewRef = useRef(null);
    const [clickTrigger, setClickTrigger] = useState(false);

    let view;

    const markerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        outline: {
            color: [255, 255, 255],
            width: 2,
        },
    };

    useEffect(() => {
        loadModules([
            'esri/config',
            'esri/Map',
            'esri/views/MapView',
            'esri/Graphic',
            'esri/rest/route',
            'esri/rest/support/RouteParameters',
            'esri/rest/support/FeatureSet',
            'esri/widgets/Search',
            'esri/PopupTemplate',
            'esri/widgets/Locate',
            'esri/layers/FeatureLayer',
            'esri/layers/GraphicsLayer'

        ])
            .then(([esriConfig, Map, MapView, Graphic, route, RouteParameters, FeatureSet, Search, PopupTemplate, Locate, FeatureLayer, GraphicsLayer]) => {
                esriConfig.apiKey = 'AAPKc0c31702c4c249989cc8627d1083a28a331vBGXVA-bJzpwWdvOv94QiCqRazUZMgZEWCDbjOpTXGV0quFPH2tjTfTs8cOUt'; // Replace with your API key
                const markerLayer = new GraphicsLayer()

                if (mapViewRef.current) {
                    mapViewRef.current.container = null;
                }

                const initialMap = new Map({
                    basemap: 'arcgis/navigation'
                });

                const fetchData = async () => {
                    try {
                        const response = await fetch('http://localhost:8080/advertisement/get/false');
                        const result = await response.json();
                        setData(result);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };

                fetchData().then(r => {
                        data.map((item) => {

                            const pointGraphic = createPointGraphic(item);
                            markerLayer.add(pointGraphic);
                        })

                        initialMap.add(markerLayer)

                    }
                )

                const view = new MapView({
                    container: mapRef.current,
                    map: initialMap,
                    center: [26.1025, 44.4268], // Longitude, latitude
                    zoom: 13,
                });

                mapViewRef.current = view;

                const trailheadsLayer = new FeatureLayer({
                    url: "https://services3.arcgis.com/wdx7FlcP4yvxXvlS/arcgis/rest/services/Lista_Adaposturi_Animale_Romania/FeatureServer/0"
                });
                initialMap.add(trailheadsLayer)

                const search = new Search({  //Add Search widget
                    view: view
                });

                view.ui.add(search, "bottom-left"); //Add to the map

                const routeUrl = 'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';

                const clickHandler = async (event) => {
                    if (internalToggled) {
                        // Handle click when toggled on
                        console.log('Button is currently ON. Handling click when ON.');
                        if (view.graphics.length === 0) {
                            addGraphic("origin", event.mapPoint);
                        } else if (view.graphics.length === 1) {
                            addGraphic("destination", event.mapPoint);
                            getRoute(); // Call the route service
                        } else {
                            view.graphics.removeAll();
                            addGraphic("origin", event.mapPoint);
                        }
                        // Add your specific logic for the ON state here
                    } else {
                        // Handle click when toggled off
                        const postData = {
                            animal: {
                                name: "mock name",
                                rasa: "mock rasa",
                                description: "mock description",
                                photoUrl: "mock photoUrl",
                                found: true,
                            },
                            state: "false",
                            id_user: "adoffbsdi",
                            latitude: event.mapPoint.latitude,
                            longitude: event.mapPoint.longitude,
                        };

                        await fetch("http://localhost:8080/advertisement/add", {
                            method: "POST",
                            body: JSON.stringify(postData),
                        })

                        await fetchData().then(r => {
                                data.map((item) => {
                                    const pointGraphic = createPointGraphic(item);
                                    markerLayer.add(pointGraphic);
                                })
                            }
                        )

                        clickTrigger ? setClickTrigger(false) : setClickTrigger(true);
                    }

                };

                view.on('click', clickHandler);

                function addGraphic(type, point) {
                    const graphic = new Graphic({
                        symbol: {
                            type: "simple-marker",
                            color: (type === "origin") ? "white" : "black",
                            size: "8px"
                        },
                        geometry: point
                    });
                    view.graphics.add(graphic);
                }

                const locate = new Locate({
                    view: view,
                    useHeadingEnabled: false,
                    goToOverride: function (view, options) {
                        options.target.scale = 1500;
                        return view.goTo(options.target);
                    }
                });

                view.ui.add(locate, "top-left");

                function getRoute() {
                    const routeParams = new RouteParameters({
                        stops: new FeatureSet({
                            features: view.graphics.toArray()
                        }),
                        returnDirections: true
                    });

                    route.solve(routeUrl, routeParams)
                        .then(function (data) {
                            data.routeResults.forEach(function (result) {
                                result.route.symbol = {
                                    type: "simple-line",
                                    color: [5, 150, 255],
                                    width: 3
                                };
                                view.graphics.add(result.route);
                            });

                            // Display directions
                            if (data.routeResults.length > 0) {
                                const directions = document.createElement("ol");
                                directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                                directions.style.marginTop = "0";
                                directions.style.padding = "15px 15px 15px 30px";
                                const features = data.routeResults[0].directions.features;

                                // Show each direction
                                features.forEach(function (result, i) {
                                    const direction = document.createElement("li");
                                    direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                                    directions.appendChild(direction);
                                });

                                view.ui.empty("top-right");
                                view.ui.add(directions, "top-right");
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }

                function createPointGraphic(item) {
                    const point = {
                        type: "point",
                        longitude: item.longitude,
                        latitude: item.latitude
                    };

                    const attributes = {
                        name: item.animal.name,
                        rasa: item.animal.rasa,
                        description: item.animal.description,
                        photoUrl: item.animal.photoUrl,
                        found: item.animal.found,
                        id_animal: item.id_animal,
                        id_user: item.id_user
                    };

                    const popupTemplate = new PopupTemplate({
                        title: "{name}",
                        content: [{
                            type: "text",
                            text: "<div>" +
                                "<table style='width:100%; border-collapse: collapse;'>" +
                                "<tr><th style='border: 1px solid black;'>ID User</th></tr>" +
                                "<tr><td style='border: 1px solid black;'>{id_user}</td></tr>" +
                                "</table>" +
                                "<br><br>" +
                                "<div> </div>" +
                                "<div> </div>" +
                                "<div> </div>" +
                                "<div> </div>" +
                                "<div> </div>" +
                                "<div></div>" +
                                "</div>"
                        }]
                    });

                    return new Graphic({
                        geometry: point,
                        symbol: markerSymbol,
                        attributes: attributes,
                        popupTemplate: popupTemplate
                    });
                }

                // Additional logic...
            })
            .catch(err => console.error(err));

        function timeout(delay) {
            return new Promise( res => setTimeout(res, delay) );
        }

        return () => {
            if (view) {
                // Clean up the map view
                if (mapViewRef.current) {
                    mapViewRef.current.container = null;
                }
            }
        };
    }, [internalToggled, view, clickTrigger]);

    useEffect(() => {
        setInternalToggled(isToggled);
    }, [isToggled]);

    return (
        <div style={mapStyle}>
            <div ref={mapRef} style={{height: '100%', width: '100%'}}/>
        </div>
    );
}


export default MapView2;