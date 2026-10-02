d3.csv("ev-data - part-of-speech.csv").then(function(data) {
  const categories = [
    { name: "NOUNS", pos: "noun", columns: 41 },
    { name: "ADJECTIVES", pos: "adjective", columns: 10 },
    { name: "ADVERBS", pos: "adverb", columns: 10 },
    { name: "VERBS", pos: "verb", columns: 10 },
    { name: "OTHER", pos: "other", columns: 10 }
  ];
  const colors = {
    remained: "#e0dbc1",
    removed: "#f39f31",
    added: "#df78ff"
  };
  const svgWidth = 700;
  const svgHeight = 660;
  const plotX = 110;
  const cellSize = 5;
  const cellStep = 6;
  const categoryGap = 20;
  const firstRowBottom = 280;
  const secondRowTop = 316;

  data.forEach(function(d) {
    d.word = d.word.trim();
    d.set = d.set.trim().toLowerCase();
    d.pos = d.pos.trim().toLowerCase();
  });

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
    .attr("role", "img")
    .attr("aria-labelledby", "chart-title chart-description");
  const tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "word-tooltip")
    .attr("role", "tooltip");

  function positionTooltip(event) {
    const bounds = tooltip.node().getBoundingClientRect();
    let left = event.clientX + 14;
    let top = event.clientY - bounds.height - 12;

    if (left + bounds.width > window.innerWidth - 8) {
      left = event.clientX - bounds.width - 14;
    }
    if (top < 8) {
      top = event.clientY + 14;
    }

    left = Math.max(8, Math.min(left, window.innerWidth - bounds.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - bounds.height - 8));
    tooltip.style("left", `${left}px`).style("top", `${top}px`);
  }

  svg.append("title")
    .attr("id", "chart-title")
    .text("Changes in a word list from 1953 to 2023");
  svg.append("desc")
    .attr("id", "chart-description")
    .text("Each square represents one word, grouped by part of speech. Gray words are in both lists, orange words were removed, and magenta words were added.");

  const categoryPositions = [];
  let nextX = plotX;
  categories.forEach(function(category) {
    categoryPositions.push(nextX);
    nextX += category.columns * cellStep - 1 + categoryGap;
  });

  const legend = svg.append("g")
    .attr("transform", `translate(${plotX + 360}, 20)`);
  const legendItems = [
    { label: "IN BOTH LISTS", color: colors.remained },
    { label: "REMOVED FROM THE 1953 LIST", color: colors.removed },
    { label: "ADDED TO THE 2023 LIST", color: colors.added }
  ];

  legendItems.forEach(function(item, index) {
    const y = index * 17;
    legend.append("rect")
      .attr("x", 0)
      .attr("y", y + 2)
      .attr("width", 5)
      .attr("height", 5)
      .attr("fill", item.color);
    legend.append("text")
      .attr("x", 15)
      .attr("y", y + 9)
      .attr("fill", "#555550")
      .attr("font-family", "Courier New bold, monospace")
      .attr("font-size", 12)
      .text(item.label);
  });
  legend.append("line")
    .attr("x1", 0)
    .attr("x2", 213)
    .attr("y1", 54)
    .attr("y2", 54)
    .attr("stroke", "#deded2")
    .attr("stroke-width", 1);

  function drawLabel(text, x, y, anchor, size) {
    svg.append("text")
      .attr("x", x)
      .attr("y", y)
      .attr("text-anchor", anchor)
      .attr("fill", "#4f4f4b")
      .attr("font-family", "Courier New, monospace")
      .attr("font-size", size)
      .attr("font-weight", "bold")
      .text(text);
  }

  function drawWordTiles(words, category, x, rowTop, rowBottom, statusOrder, partialFirstRow) {
    const sortedWords = words.slice().sort(function(a, b) {
      const statusDifference = statusOrder.indexOf(a.set) - statusOrder.indexOf(b.set);
      return statusDifference || d3.ascending(a.word, b.word);
    });
    const rowCount = Math.ceil(sortedWords.length / category.columns);
    const startY = rowTop === null ? rowBottom - rowCount * cellStep : rowTop;
    const firstRowSize = sortedWords.length % category.columns || category.columns;

    const tiles = svg.append("g")
      .selectAll("rect")
      .data(sortedWords)
      .join("rect")
      .attr("x", function(d, index) {
        const tileIndex = partialFirstRow ? (index < firstRowSize ? index : index - firstRowSize) : index;
        return x + (tileIndex % category.columns) * cellStep;
      })
      .attr("y", function(d, index) {
        const tileIndex = partialFirstRow ? (index < firstRowSize ? 0 : index - firstRowSize + category.columns) : index;
        return startY + Math.floor(tileIndex / category.columns) * cellStep;
      })
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", function(d) { return colors[d.set]; });

    tiles
      .on("pointerenter", function(event, d) {
        d3.select(this).attr("stroke", "#765d3d").attr("stroke-width", 1);
        tooltip
          .style("display", "block")
          .style("background-color", colors[d.set])
          .text(d.word);
        positionTooltip(event);
      })
      .on("pointermove", positionTooltip)
      .on("pointerleave", function() {
        d3.select(this).attr("stroke", null).attr("stroke-width", null);
        tooltip.style("display", "none");
      });
  }

  const firstList = data.filter(function(d) {
    return d.set === "remained" || d.set === "removed";
  });
  const secondList = data.filter(function(d) {
    return d.set === "remained" || d.set === "added";
  });

  categories.forEach(function(category, index) {
    const categoryX = categoryPositions[index];
    const firstWords = firstList.filter(function(d) { return d.pos === category.pos; });
    const secondWords = secondList.filter(function(d) { return d.pos === category.pos; });

    drawWordTiles(firstWords, category, categoryX, null, firstRowBottom, ["remained", "removed"], category.pos !== "verb");
    drawWordTiles(secondWords, category, categoryX, secondRowTop, null, ["added", "remained"]);
    drawLabel(category.name, categoryX + (category.columns * cellStep - 1) / 2, 304, "middle", 12);
  });

  drawLabel("1953 LIST", plotX - 12, firstRowBottom - 2, "end", 16);
  drawLabel("2023 LIST", plotX - 12, secondRowTop + 12, "end", 16);

  const firstCount = firstList.length;
  const secondCount = secondList.length;
  d3.select("#caption").html(
    `The 2023 list contains more words overall (<strong>${d3.format(",")(secondCount)}</strong> vs. <strong>${d3.format(",")(firstCount)}</strong>). All changes mentioned in the text reflect each category's share of its list, not raw counts. Data source: NLTK (Natural Language Toolkit), with manual correction of mislabeled words.`
  );
}).catch(function(error) {
  d3.select("#chart")
    .append("p")
    .attr("role", "alert")
    .text("The word-list data could not be loaded. Open this page through a local web server and check that the CSV is beside index.html.");
  console.error(error);
});