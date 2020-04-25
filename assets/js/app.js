// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin={
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating an SVG wrapper and appending an SVG group that will hold our chart,
// and shift the latter by left and top margins
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Importing data
d3.csv("../assets/data/data.csv").then(function(data){

    // Parsing Data as numbers
    data.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    })
    
    // Creating scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(data, d => d.healthcare)])
        .range([height, 0]);
    
    // Creating axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Appending axes to the scatter chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    // Creating circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", ".5")

    // Initializing tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
        })

    // Creating tooltip in the chart
    chartGroup.call(toolTip)

    // Creating event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    // Creating axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left +40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)")

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");    
    
    // Creating state abbreviations in circles
    chartGroup.append("text")
        .attr("class", "state")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .selectAll("tspan")
        .data(data)
        .enter()
        .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty - 0.1);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare - 0.1);
        })
        .text(function(data) {
            return data.abbr
        });

})