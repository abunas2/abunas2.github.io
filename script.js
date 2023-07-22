// Sample data for the bar chart
const dataset = [10, 25, 15, 30, 20];

// Visualization: Create the bar chart
const width = 400; // Replace 400 with your desired width
const height = 300; // Replace 300 with your desired height

// Append the SVG container to the div with id "visualization-container"
const svg = d3.select("#visualization-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Create the bars
svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 50) // Horizontal position of each bar (spacing of 50 between bars)
  .attr("y", (d) => height - d * 10) // Vertical position of each bar (scale height by 10 for better visualization)
  .attr("width", 40) // Width of each bar
  .attr("height", (d) => d * 10) // Height of each bar (scaled by 10 for better visualization)
  .attr("fill", "steelblue"); // Color of the bars
