// CSV data
d3.csv("data.csv").then(function(data) {
  const carData = data;
  console.log(carData);

  // SLIDE 1: general overview
  function slide1(carData) {
    d3.select("#slide-container").selectAll("*").remove();
  
    const tableContainer = d3.select("#slide-container")
      .append("div")
      .style("width", "800px")
      .style("margin", "0 auto");
  
    // Add chart title
    tableContainer.append("div")
      .style("text-align", "center")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("General Overview of Car Features and MSRP");
  
    // HTML table element
    const table = tableContainer.append("table")
      .style("width", "100%")
      .style("border-collapse", "collapse");
  
    // table headers
    const headers = ["Make", "Model", "Year", "MSRP"];
    const thead = table.append("thead");
    thead.append("tr")
      .selectAll("th")
      .data(headers)
      .enter()
      .append("th")
      .text((d) => d)
      .style("border", "1px solid black")
      .style("padding", "8px")
      .style("background-color", "lightgray");
  
      const selectedRowsIndices = [1023, 46, 118, 7615];

      const carFeatures = selectedRowsIndices.map((index) => ({
        make: carData[index].Make,
        model: carData[index].Model,
        year: carData[index].Year,
        msrp: +carData[index].MSRP, 
      }));
  
    // create table rows
    const tbody = table.append("tbody");
    const rows = tbody.selectAll("tr.row")
      .data(carFeatures)
      .enter()
      .append("tr")
      .attr("class", "row");
  
    // cells
    const cells = rows.selectAll("td")
      .data((d) => Object.values(d))
      .enter()
      .append("td")
      .text((d) => (typeof d === "number" ? `$${d.toLocaleString()}` : d))
      .style("border", "1px solid black")
      .style("padding", "8px");
  }
  

  // SLIDE 2: Comparison of highway MPG and city MPG
function slide2(carData) {
  d3.select("#slide-container").selectAll("*").remove();

  const selectedMakes = ["Honda", "BMW", "Audi", "Mazda"];
  const allCarsData = carData.filter((d) => selectedMakes.includes(d.Make));

  const svg = d3.select("#slide-container")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 700);

  const margin = { top: 40, right: 20, bottom: 50, left: 80 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

    
  // scales for x and y axes
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(allCarsData, (d) => +d["highway MPG"])])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allCarsData, (d) => +d["city mpg"])])
    .range([height, 0]);

    // Add x-axis
  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
    .call(xAxis);

  // Add y-axis
  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);

  // scatter plot highway MPG vs city MPG
  const circles = svg.selectAll("circle")
    .data(allCarsData)
    .enter()
    .append("circle")
    .attr("cx", (d) => margin.left + xScale(+d["highway MPG"]))
    .attr("cy", (d) => margin.top + yScale(+d["city mpg"]))
    .attr("r", 5)
    .attr("fill", "steelblue");

    circles.on("mouseover", function (event, d) {
      d3.select(this).attr("r", 8); // Increases on hover
      svg.append("text")
        .attr("class", "hover-label")
        .attr("x", margin.left + xScale(+d["highway MPG"]) + 8)
        .attr("y", margin.top + yScale(+d["city mpg"]) - 8)
        .text(`${d.Make}, MSRP: $${d.MSRP.toLocaleString()}`)
        .attr("font-size", "10px")
        .attr("fill", "black");
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 5); // circle size to normal on mouseout
      svg.selectAll(".hover-label").remove(); 
    });

  // chart title
  svg.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", margin.top - 10)
    .attr("text-anchor", "middle")
    .text("Comparison of Highway MPG and City MPG")
    .attr("font-size", "16px")
    .attr("font-weight", "bold");

  // x-axis label
  svg.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + margin.bottom - 5)
    .attr("text-anchor", "middle")
    .text("Highway MPG")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

  // y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2 - margin.top)
    .attr("y", margin.left - 55)
    .attr("text-anchor", "middle")
    .text("City MPG")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
}


  // SLIDE 3: average msrp vs horsepower by car style
function slide3(carData) {
  d3.select("#slide-container").selectAll("*").remove();

  // filter
  const makesToCompare = ["Honda", "BMW", "Audi", "Mazda"];
  const allCarsData = carData.filter((d) => makesToCompare.includes(d.Make));

  const svg = d3.select("#slide-container")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 700);

    const margin = { top: 40, right: 20, bottom: 50, left: 100 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // calculations
  const groupedData = d3.group(allCarsData, (d) => d["Vehicle Style"]);
  const averageData = Array.from(groupedData, ([vehicleStyle, cars]) => {
    const msrpSum = cars.reduce((sum, car) => sum + +car.MSRP, 0);
    const horsepowerSum = cars.reduce((sum, car) => sum + +car["Engine HP"], 0);
    const averageMSRP = msrpSum / cars.length;
    const averageHorsepower = horsepowerSum / cars.length;
    return { vehicleStyle, averageMSRP, averageHorsepower };
  });


  const xScale = d3.scaleBand()
    .domain(averageData.map((d) => d.vehicleStyle))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(averageData, (d) => Math.max(d.averageMSRP, d.averageHorsepower))])
    .range([height, 0]);

    // tooltips for the bars
  const tooltip = d3.select("#slide-container")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("padding", "8px")
  .style("background-color", "white")
  .style("border", "1px solid #ccc")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("opacity", 0); // Initially hidden

 // bar chart for MSRP
 svg.selectAll(".msrp-bar")
 .data(averageData)
 .enter()
 .append("rect")
 .attr("class", "msrp-bar")
 .attr("x", (d) => margin.left + xScale(d.vehicleStyle))
 .attr("y", (d) => margin.top + yScale(d.averageMSRP))
 .attr("width", xScale.bandwidth() / 2)
 .attr("height", (d) => height - yScale(d.averageMSRP))
 .attr("fill", "steelblue")
 // Show tooltip on hover
 .on("mouseover", (event, d) => {
   tooltip.transition().duration(200).style("opacity", 1);
   tooltip.html(`Vehicle Style: ${d.vehicleStyle}<br>MSRP: $${d.averageMSRP.toFixed(2)}`)
     .style("left", event.pageX + "px")
     .style("top", (event.pageY - 30) + "px"); // Position the tooltip above the bar
 })
 // Hide tooltip on mouseout
 .on("mouseout", () => {
   tooltip.transition().duration(200).style("opacity", 0);
 });

  // bar chart for avg. horsepower
  svg.selectAll(".horsepower-bar")
    .data(averageData)
    .enter()
    .append("rect")
    .attr("class", "horsepower-bar")
    .attr("x", (d) => margin.left + xScale(d.vehicleStyle) + xScale.bandwidth() / 2)
    .attr("y", (d) => margin.top + yScale(d.averageHorsepower))
    .attr("width", xScale.bandwidth() / 2)
    .attr("height", (d) => height - yScale(d.averageHorsepower))
    .attr("fill", "orange")
    // Show tooltip on hover
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`Vehicle Style: ${d.vehicleStyle}<br>Horsepower: ${d.averageHorsepower.toFixed(2)}`)
        .style("left", event.pageX + "px")
        .style("top", (event.pageY - 30) + "px"); // Position the tooltip above the bar
    })
    // Hide tooltip on mouseout
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  // annotations
  svg.selectAll(".label")
    .data(averageData)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => margin.left + xScale(d.vehicleStyle) + xScale.bandwidth() / 2)
    .attr("y", (d) => margin.top + yScale(d.averageHorsepower) - 18) // Adjust the y-coordinate for the horsepower annotation
    .text((d) => `HP: ${d.averageHorsepower.toFixed(2)}`)
    .attr("font-size", "10px")
    .attr("fill", "black");

  

  // chart title
  svg.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", margin.top - 10)
    .attr("text-anchor", "middle")
    .text("Comparison of Average MSRP and Horsepower by Vehicle Style")
    .attr("font-size", "16px")
    .attr("font-weight", "bold");

    // axis rotation
    svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)"); 


  // x-axis label
  svg.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + margin.bottom + 50)
    .attr("text-anchor", "middle")
    .text("Vehicle Style (Honda, BMW, Audi, Mazda)")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

  // y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2 - margin.top)
    .attr("y", margin.left - 55)
    .attr("text-anchor", "middle")
    .text("Average MSRP / Horsepower")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
}


  // current slide tracker
  let currentSlide = 1;

  function updateSlide() {
    if (currentSlide === 1) {
      slide1(carData);
    } else if (currentSlide === 2) {
      slide2(carData);
    } else if (currentSlide === 3) {
      slide3(carData);
    }
  }

  function nextSlide() {
    currentSlide++;
    if (currentSlide > 3) {
      currentSlide = 1;
    }
    updateSlide();
  }

  function prevSlide() {
    currentSlide--;
    if (currentSlide < 1) {
      currentSlide = 3;
    }
    updateSlide();
  }

  updateSlide();

  // buttons
  d3.select("body").append("button")
    .text("Next")
    .on("click", nextSlide);

  d3.select("body").append("button")
    .text("Previous")
    .on("click", prevSlide);
});