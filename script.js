d3.csv("anscombe.csv").then(function(data) {


  data.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
  });

  
  const dataset1 = data.filter(function(d) {
    return d.dataset === "I";
  });

  const dataset2 = data.filter(function(d) {
    return d.dataset === "II";
  });

  const dataset3 = data.filter(function(d) {
    return d.dataset === "III";
  });

  const dataset4 = data.filter(function(d) {
    return d.dataset === "IV";
  });


  
  function drawScatterplot(dataset, label, color) {

    const width = 500;
    const height = 500;

    const panel = d3.select("#chart")
      .append("div")
      .attr("class", "panel")
      .style("background-color", color + "36");

    const title = panel.append("div")
      .attr("class", "label")
      .text(label)
      .style("color", color);

    const svg = panel.append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleLinear()
      .domain([0, 20])
      .range([50, 450]);

    const yScale = d3.scaleLinear()
      .domain([0, 12])
      .range([450, 50]);

    
    svg.selectAll("circle")
      .data(dataset)
      .join("circle")
      .attr("cx", function(d) {
        return xScale(d.x);
      })
      .attr("cy", function(d) {
        return yScale(d.y);
      })
      .attr("r", 7)
      .attr("fill", color)
      .attr("opacity", 0.6)
  
    
    const xAxis = svg.append("g")
      .attr("transform", "translate(0, 450)")
      .call(d3.axisBottom(xScale));

    const yAxis = svg.append("g")
      .attr("transform", "translate(50, 0)")
      .call(d3.axisLeft(yScale));


    xAxis.select(".domain")
      .attr("stroke", color)
      .attr("stroke-width", 1);

    xAxis.selectAll(".tick line")
      .attr("stroke", color)
      .attr("stroke-width", 1);

    xAxis.selectAll(".tick text")
      .attr("fill", color)
      .attr("font-size", 12);

    yAxis.select(".domain")
      .attr("stroke", color)
      .attr("stroke-width", 1);

    yAxis.selectAll(".tick line")
      .attr("stroke", color)
      .attr("stroke-width", 1);

    yAxis.selectAll(".tick text")
      .attr("fill", color)
      .attr("font-size", 12);
  }


  
  drawScatterplot(dataset1, "Dataset 1", "#1f77b4");
  drawScatterplot(dataset2, "Dataset 2", "#ff7f0e");
  drawScatterplot(dataset3, "Dataset 3", "#2ca02c");
  drawScatterplot(dataset4, "Dataset 4", "#d62728");

});
