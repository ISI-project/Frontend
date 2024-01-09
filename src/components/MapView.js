import React, { Component } from "react";
import { loadModules } from "esri-loader";

class ArcGISMap extends Component {
  componentDidMount() {
    loadModules(["esri/Map", "esri/views/MapView", "esri/Graphic", "esri/PopupTemplate",
  ])
      .then(([Map, MapView, Graphic, PopupTemplate]) => {
        this.map = new Map({
          basemap: "topo-vector",
        });

        this.view = new MapView({
          container: this.mapRef,
          map: this.map,
          center: [26.1025, 44.4268], // Longitude, latitude
          zoom: 13,
        });

        // Hardcoded points of animal shelters
        const shelters = [
          { name: "Adapost Catei Odai", longitude: 26.026977, latitude: 44.522827, address: "Șoseaua Odăii 3-5, București" },
          { name: "ASPA", longitude: 26.096476, latitude: 44.435613, address: "Strada Constantin Mille 10, București 010142" },
          { name: "Red Panda Association - Adoption Center", longitude: 26.111482, latitude: 44.466335, address: "Str. Barbu Văcărescu 162-164, București 020284" },
          { name: "Steaua Speranței", longitude: 26.132178, latitude: 44.483980, address: "Strada Petricani 11A, București 077190" },
          { name: "Asociatia pentru protectia animalelor Hope", longitude: 26.150375, latitude: 44.409225, address: "Strada Anton Bacalbașa 7, București 077160" },
          { name: "Dog Rescue Shelter", longitude: 26.150887, latitude: 44.406746, address: "Bucharest" },
          { name: "Shelter Dogs Pallady", longitude: 26.181123, latitude: 44.409895, address: "Drumul Lunca Jariștei, București" },
        ];

        // Create a simple marker symbol
        const markerSymbol = {
          type: "simple-marker",
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2,
          },
        };

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

          // Create a graphic and add the geometry, symbol, and popup to it
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
            attributes: {
              Address: shelter.address, // Make sure 'address' is part of your shelter object
              // Add other attribute fields if needed
            },
            popupTemplate: popupTemplate,
          });

          // Add the graphic to the view
          this.view.graphics.add(pointGraphic);
        });
        



        this.view.on("click", (event) => {
          // Create a point
          const point = {
            type: "point", // autocasts as new Point()
            longitude: event.mapPoint.longitude,
            latitude: event.mapPoint.latitude,
          };

          const postData = {
            animal: {
              name: "mock name",
              rasa: "mock rasa",
              description: "mock description",
              photoUrl: "mock photoUrl",
              found: true,
            },
            state: "true",
            id_user: "adoffbsdi",
            latitude: event.mapPoint.latitude,
            longitude: event.mapPoint.longitude,
          };

          fetch("http://localhost:8080/advertisement/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(postData),
          })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.log(error));

          // Create a simple marker symbol
          const markerSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [226, 119, 40],
            outline: {
              color: [255, 255, 255],
              width: 2,
            },
          };

          // Create a graphic and add the geometry and symbol to it
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
          });

          // Add the graphic to the view
          this.view.graphics.add(pointGraphic);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  componentWillUnmount() {
    if (this.view) {
      this.view.container = null;
    }
  }

  render() {
    return <div ref={(el) => (this.mapRef = el)} style={{ height: 650 }} />;
  }
}

export default ArcGISMap;
