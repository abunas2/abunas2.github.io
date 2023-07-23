// CSV data
d3.csv("AB_NYC_2019.csv").then(function(data) {
  const listingsData = data;
  console.log(listingsData);

  // neighborhood
  const priceComparisonData = d3.group(listingsData, (d) => d.neighbourhood_group);

  // average price for each neighborhood group
    const neighborhoodAveragePrices = Array.from(priceComparisonData, ([neighborhood, listings]) => {
    const totalPrice = d3.sum(listings, (d) => +d.price); 
    const averagePrice = totalPrice / listings.length;
    return { neighborhood, averagePrice };
  });
});


// Load the GeoJSON data
d3.json("Boundaries - Neighborhoods.geojson").then(function(geojson) {
  // Log the GeoJSON data to the console
  console.log(geojson);

});

// Load the GeoJSON data
d3.json("Boundaries - Neighborhoods.geojson").then(function(geojson) {
  // Set up the map dimensions and projection
  const width = 1000; 
  const height = 800; 
  const projection = d3.geoMercator().fitSize([width, height], geojson);

  // Create an SVG container for the map
  const svg = d3.select("#map-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create a path generator for the GeoJSON features
  const path = d3.geoPath().projection(projection);

  // Draw the map features
  svg.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "lightblue") 
    .attr("stroke", "white"); 

    // Add labels for neighborhood names
  svg.selectAll("text")
  .data(geojson.features)
  .enter()
  .append("text")
  .attr("transform", (d) => `translate(${path.centroid(d)})`)
  .attr("text-anchor", "middle")
  .attr("font-size", "5px")
  .text((d) => d.properties.pri_neigh); 



});




