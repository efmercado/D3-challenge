// @TODO: YOUR CODE HERE!

// The code for the cart is wrapped inside a function that automatically resized the chart
function makeResponsive() {
    
    // if the SVG area isnt empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    // clear if svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove()
    };

    // SVG wrapper dimesions are determined by the current width and height of the browser window
    var svgWidth = window.innerWidth*.5;
    var svgHeight = window.innerHeight*.7;

    var margin={
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
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
            .domain([8.5, d3.max(data, d => d.poverty)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([4.2, d3.max(data, d => d.healthcare)])
            .range([height, 0]);
        
        // Creating axis functions
        var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(11);

        // Appending axes to the scatter chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        
        chartGroup.append("g")
            .call(leftAxis);

        // Creating state abbreviations in circles
        chartGroup.append("text")
            .attr("class", "state")
            .style("font-size", "8px")
            .style("font-weight", "bold")
            .style("color", "white")
            .selectAll("tspan")
            .data(data)
            .enter()
            .append("tspan")
            .attr("x", data => xLinearScale(data.poverty) - 6)
            .attr("y", data => yLinearScale(data.healthcare) + 3)
            .text(data => data.abbr);

        // Creating circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "11")
            .attr("fill", "lightblue")
            .attr("opacity", ".5")

        // Initializing tool tip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .style("display", "block")
            .offset([120, -80])
            .html(function(d) {
                return (`${d.state}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
            })

        // Creating tooltip in the chart
        chartGroup.call(toolTip)

        // Creating event listeners to display and hide the tooltip
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            // onmouseout event
            .on("mouseout", function(data, index) {
            toolTip.hide(data);
            });

        // Creating axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height*.6))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)")

        chartGroup.append("text")
            .attr("transform", `translate(${width * 0.5}, ${height + 35})`)
            .attr("class", "axisText")
            .attr("anchor-text", "middle")
            .text("In Poverty (%)");

    }).catch(error => console.log(error))

}

// When the browser loads, makeResponsive() is called
makeResponsive();

//When the browser window is resized, makeResponsive() is called
d3.select(window).on("resize", makeResponsive);