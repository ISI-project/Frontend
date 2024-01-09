import React from "react";
import { useRef, useEffect, useState  } from "react";
import { loadModules } from 'esri-loader';


const MapView2 = () => {
    const mapStyle = {
        height: '500px', // Set to your desired height
        width: '800px', // Set to your desired width
        display: 'flex',
        flexDirection: 'row',
      };
    const mapRef = useRef();
    
    let view;

    const shelters = [
      { name: "Adapost Catei Odai", longitude: 26.026977, latitude: 44.522827, address: "Șoseaua Odăii 3-5, București" },
      { name: "ASPA", longitude: 26.096476, latitude: 44.435613, address: "Strada Constantin Mille 10, București 010142" },
      { name: "Red Panda Association - Adoption Center", longitude: 26.111482, latitude: 44.466335, address: "Str. Barbu Văcărescu 162-164, București 020284" },
      { name: "Steaua Speranței", longitude: 26.132178, latitude: 44.483980, address: "Strada Petricani 11A, București 077190" },
      { name: "Asociatia pentru protectia animalelor Hope", longitude: 26.150375, latitude: 44.409225, address: "Strada Anton Bacalbașa 7, București 077160" },
      { name: "Dog Rescue Shelter", longitude: 26.150887, latitude: 44.406746, address: "Bucharest" },
      { name: "Shelter Dogs Pallady", longitude: 26.181123, latitude: 44.409895, address: "Drumul Lunca Jariștei, București" },
    ];

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

    ])
    .then(([esriConfig, Map, MapView, Graphic, route, RouteParameters, FeatureSet, Search, PopupTemplate]) => {
      esriConfig.apiKey = 'AAPKc0c31702c4c249989cc8627d1083a28a331vBGXVA-bJzpwWdvOv94QiCqRazUZMgZEWCDbjOpTXGV0quFPH2tjTfTs8cOUt'; // Replace with your API key

      const map = new Map({
        basemap: 'arcgis/navigation'
      });

      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [26.1025, 44.4268], // Longitude, latitude
        zoom: 13,
      });

      function addShelters() {
        shelters.forEach(shelter => {
          // Create a point for each shelter
          const point = {
            type: "point",
            longitude: shelter.longitude,
            latitude: shelter.latitude,
          };
  
          // Create a popup template
          const popupTemplate = new PopupTemplate({
            title: shelter.name,
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "Address",
                    label: "Address",
                    visible: true,
                  },
                  // Add other fields if needed
                ],
              },
            ],
          });
        
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
            attributes: {
              Address: shelter.address, // Make sure 'address' is part of your shelter object
              // Add other attribute fields if needed
            },
            popupTemplate: popupTemplate,
          });
  
          view.graphics.add(pointGraphic);
        });
      }
      addShelters();

      const search = new Search({  //Add Search widget
        view: view
      });

      view.ui.add(search, "bottom-left"); //Add to the map

      const routeUrl = 'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';

      view.on('click', function(event) {
        if (view.graphics.length === 0) {
          addGraphic("origin", event.mapPoint);
        } else if (view.graphics.length === 1) {
          addGraphic("destination", event.mapPoint);
          getRoute(); // Call the route service
          addShelters();
        } else {
          view.graphics.removeAll();
          addGraphic("origin", event.mapPoint);
        }
      });

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

      function getRoute() {
        const routeParams = new RouteParameters({
          stops: new FeatureSet({
            features: view.graphics.toArray()
          }),
          returnDirections: true
        });
      
        route.solve(routeUrl, routeParams)
          .then(function(data) {
            data.routeResults.forEach(function(result) {
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
              features.forEach(function(result, i) {
                const direction = document.createElement("li");
                direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                directions.appendChild(direction);
              });
      
              view.ui.empty("top-right");
              view.ui.add(directions, "top-right");
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      

      // Additional logic...
    })
    .catch(err => console.error(err));

    return () => {
        if (view) {
          // Clean up the map view
          view.container = null;
        }
      };
  }, [view]);

  return (
  <div style={mapStyle}>
    <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
  </div>
  );
}

export default MapView2;