Promise.all([
  d3.csv("Artists.txt"),
  d3.csv("19artists.txt")
]).then(function([allArtists, featuredArtists]) {
  const regions = [
    "United States",
    "Other Americas",
    "Europe",
    "Asia",
    "Africa",
    "Oceania",
    "Unclassified"
  ];
  const regionColors = {
    "United States": "#e76f51",
    "Other Americas": "#e9a23b",
    Europe: "#568f82",
    Asia: "#5277a8",
    Africa: "#a16b9a",
    Oceania: "#829447",
    Unclassified: "#929292"
  };
  const regionAssignments = {
    "United States": [
      "American", "United States", "Native American"
    ],
    "Other Americas": [
      "Argentine", "Argentinian", "Bahamian", "Barbadian", "Belizean",
      "Bermudian", "Bolivian", "Brazilian", "Canadian", "Chilean",
      "Colombian", "Costa Rican", "Cuban", "Dominican", "Ecuadorian",
      "Guatemalan", "Haitian", "Honduran", "Jamaican", "Mexican",
      "Nicaraguan", "Panamanian", "Paraguayan", "Peruvian", "Puerto Rican",
      "Salvadoran", "Trinidadian", "Uruguayan", "Venezuelan"
    ],
    Europe: [
      "Albanian", "Austrian", "Belgian", "British", "Bulgarian", "Catalan",
      "Croatian", "Cypriot", "Czech", "Danish", "Dutch", "English",
      "Estonian", "Finnish", "French", "Georgian", "German", "Greek",
      "Hungarian", "Icelandic", "Irish", "Italian", "Latvian", "Lithuanian",
      "Luxembourgish", "Macedonian", "Maltese", "Moldovan", "Montenegrin",
      "Norwegian", "Polish", "Portuguese", "Romanian", "Russian", "Scottish",
      "Serbian", "Slovak", "Slovenian", "Spanish", "Swedish", "Swiss",
      "Ukrainian", "Welsh", "Yugoslav"
    ],
    Asia: [
      "Afghan", "Armenian", "Azerbaijani", "Bangladeshi", "Bhutanese",
      "Burmese", "Cambodian", "Chinese", "Filipino", "Indian", "Indonesian",
      "Iranian", "Iraqi", "Israeli", "Japanese", "Jordanian", "Kazakh",
      "Korean", "Kuwaiti", "Kyrgyz", "Laotian", "Lebanese", "Malaysian",
      "Mongolian", "Nepalese", "Pakistani", "Palestinian", "Singaporean",
      "Sri Lankan", "Syrian", "Taiwanese", "Thai", "Tibetan", "Turkish",
      "Uzbek", "Vietnamese", "Yemeni"
    ],
    Africa: [
      "Algerian", "Angolan", "Beninese", "Botswanan", "Burkinabé",
      "Cameroonian", "Congolese", "Egyptian", "Eritrean", "Ethiopian",
      "Ghanaian", "Ivorian", "Kenyan", "Libyan", "Malagasy", "Malian",
      "Moroccan", "Mozambican", "Nigerian", "Senegalese", "Somali",
      "South African", "Sudanese", "Tanzanian", "Tunisian", "Ugandan",
      "Zambian", "Zimbabwean"
    ],
    Oceania: [
      "Australian", "Fijian", "Maori", "New Zealander", "Papua New Guinean"
    ]
  };
  const regionByNationality = new Map();

  regions.slice(0, -1).forEach(function(region) {
    regionAssignments[region].forEach(function(nationality) {
      regionByNationality.set(nationality.toLowerCase(), region);
    });
  });

  function assignRegion(nationality) {
    return regionByNationality.get((nationality || "").trim().toLowerCase()) || "Unclassified";
  }

  function countByRegion(rows) {
    const counts = new Map(regions.map(function(region) {
      return [region, 0];
    }));

    rows.forEach(function(row) {
      counts.set(assignRegion(row.Nationality), counts.get(assignRegion(row.Nationality)) + 1);
    });

    return counts;
  }

  const allCounts = countByRegion(allArtists);
  const featuredCounts = countByRegion(featuredArtists);
  const allTotal = allArtists.length;
  const featuredTotal = featuredArtists.length;
  const data = regions.map(function(region) {
    const allCount = allCounts.get(region);
    const featuredCount = featuredCounts.get(region);
    return {
      region: region,
      allCount: allCount,
      featuredCount: featuredCount,
      allShare: allCount / allTotal,
      featuredShare: featuredCount / featuredTotal
    };
  });
  const width = 860;
  const height = 520;
  const margin = { top: 82, right: 32, bottom: 100, left: 76 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "chart-title chart-description");

  svg.append("title")
    .attr("id", "chart-title")
    .text("Nationality regions of MoMA featured artists compared with all artists");
  svg.append("desc")
    .attr("id", "chart-description")
    .text("Overlaid percentage bars compare each region's share of the 19 featured artists with its share of all artists in the MoMA Artists dataset. A pie chart shows the featured artists' share of the overall dataset.");

  const plot = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const x = d3.scaleBand()
    .domain(regions)
    .range([0, innerWidth])
    .padding(0.28);
  const y = d3.scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0]);
  const percent = d3.format(".0%");

  plot.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(percent));
  plot.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));
  plot.selectAll(".domain, .tick line")
    .attr("stroke", "#c9c7c0");
  plot.selectAll(".tick text")
    .attr("fill", "#4b4b48")
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", 12);
  plot.selectAll(".y-axis .tick line")
    .attr("x2", innerWidth)
    .attr("stroke", "#e7e5df");
  plot.selectAll(".y-axis .domain").attr("stroke", "none");

  plot.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -54)
    .attr("text-anchor", "middle")
    .attr("fill", "#4b4b48")
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", 13)
    .text("Share of artists in each dataset");

  const tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "chart-tooltip")
    .attr("role", "tooltip");
  const groups = plot.selectAll(".region-group")
    .data(data)
    .join("g")
    .attr("class", "region-group")
    .attr("transform", function(d) { return `translate(${x(d.region)},0)`; });
  const allBarWidth = x.bandwidth() * 0.44;
  const featuredBarWidth = x.bandwidth() * 0.44;

  function showTooltip(event, d, series) {
    const count = series === "all" ? d.allCount : d.featuredCount;
    const share = series === "all" ? d.allShare : d.featuredShare;
    const total = series === "all" ? allTotal : featuredTotal;
    tooltip
      .style("display", "block")
      .text(`${d.region} — ${series === "all" ? "All artists" : "Featured artists"}: ${count} of ${total} (${percent(share)})`);
    const bounds = tooltip.node().getBoundingClientRect();
    const left = Math.min(event.clientX + 12, window.innerWidth - bounds.width - 8);
    const top = Math.max(8, event.clientY - bounds.height - 10);
    tooltip.style("left", `${Math.max(8, left)}px`).style("top", `${top}px`);
  }

  groups.append("rect")
    .attr("class", "all-bar")
    .attr("x", x.bandwidth() * 0.08)
    .attr("y", function(d) { return y(d.allShare); })
    .attr("width", allBarWidth)
    .attr("height", function(d) { return innerHeight - y(d.allShare); })
    .attr("fill", function(d) { return regionColors[d.region]; })
    .attr("opacity", 0.33)
    .on("pointerenter", function(event, d) { showTooltip(event, d, "all"); })
    .on("pointermove", function(event, d) { showTooltip(event, d, "all"); })
    .on("pointerleave", function() { tooltip.style("display", "none"); });

  groups.append("rect")
    .attr("class", "featured-bar")
    .attr("x", x.bandwidth() * 0.35)
    .attr("y", function(d) { return y(d.featuredShare); })
    .attr("width", featuredBarWidth)
    .attr("height", function(d) { return innerHeight - y(d.featuredShare); })
    .attr("fill", function(d) { return regionColors[d.region]; })
    .attr("opacity", .85)
    .on("pointerenter", function(event, d) { showTooltip(event, d, "featured"); })
    .on("pointermove", function(event, d) { showTooltip(event, d, "featured"); })
    .on("pointerleave", function() { tooltip.style("display", "none"); });

  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${margin.left},28)`);
  [
    { label: "All artists", opacity: 0.33 },
    { label: "19 featured artists", opacity: .85 }
  ].forEach(function(item, index) {
    const xPosition = index * 190;
    legend.append("rect")
      .attr("x", xPosition)
      .attr("y", 0)
      .attr("width", 18)
      .attr("height", 14)
      .attr("fill", "#568f82")
      .attr("opacity", item.opacity);
    legend.append("text")
      .attr("x", xPosition + 26)
      .attr("y", 12)
      .attr("fill", "#4b4b48")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", 13)
      .text(item.label);
  });

  const remainingTotal = allTotal - featuredTotal;
  const featuredOverallShare = featuredTotal / allTotal;
  const overallPercent = d3.format(".2%");
  const pieGroup = svg.append("g")
    .attr("class", "subset-pie")
    .attr("transform", `translate(${width - 168},43)`);
  const pieData = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; })([
      { label: "Featured artists", value: featuredTotal },
      { label: "Other artists", value: remainingTotal }
    ]);
  const pieArc = d3.arc()
    .innerRadius(0)
    .outerRadius(25);
  const pieColors = ["#568f82", "#deded8"];

  pieGroup.selectAll("path")
    .data(pieData)
    .join("path")
    .attr("d", pieArc)
    .attr("fill", function(d, index) { return pieColors[index]; })
    .attr("stroke", "#fffff6")
    .attr("stroke-width", 0.7)
    .append("title")
    .text(function(d) {
      return `${d.data.label}: ${d.data.value} (${overallPercent(d.data.value / allTotal)})`;
    });

  pieGroup.append("text")
    .attr("x", 34)
    .attr("y", -5)
    .attr("fill", "#4b4b48")
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .text("Share of all artists");
  pieGroup.append("text")
    .attr("x", 34)
    .attr("y", 10)
    .attr("fill", "#4b4b48")
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", 12)
    .text(`${overallPercent(featuredOverallShare)} featured`);
  pieGroup.append("text")
    .attr("x", 34)
    .attr("y", 25)
    .attr("fill", "#77766e")
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", 11)
    .text(`${d3.format(",")(featuredTotal)} of ${d3.format(",")(allTotal)} records`);

  d3.select("#caption").text(
    `Each bar shows a region's percentage of its dataset (${d3.format(",")(allTotal)} artist records overall; ${featuredTotal} featured artists). Nationality labels are grouped into regions; the featured artists are part of the full dataset, not an independent sample. Unmapped nationality labels are shown as Unclassified. Source: MoMA Artists dataset.`
  );
}).catch(function(error) {
  d3.select("#chart")
    .append("p")
    .attr("role", "alert")
    .text("The artist data could not be loaded. Open this page through a local web server and check that Artists.txt and 19artists.txt are beside index.html.");
  console.error(error);
});
