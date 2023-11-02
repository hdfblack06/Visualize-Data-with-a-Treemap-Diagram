const width = 1000;
const height = 800;
const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height + 200);
const legend = d3.create("svg").attr("id", "legend");
const tooltip = d3
  .select("#container")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);
const DATASETS = {
  videogames: {
    TITLE: "Video Game Sales",
    DESCRIPTION: "Top 100 Most Sold Video Games Grouped by Platform",
    FILE_PATH:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  },
  movies: {
    TITLE: "Movie Sales",
    DESCRIPTION: "Top 100 Highest Grossing Movies Grouped By Genre",
    FILE_PATH:
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json",
  },
  kickstarter: {
    TITLE: "Kickstarter Pledges",
    DESCRIPTION:
      "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
    FILE_PATH:
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json",
  },
};
const DEFAULT_DATASET = "videogames";
const DataSetHref = document.querySelectorAll(".dataSet");
DataSetHref.forEach((a) => {
  a.addEventListener("click", handleClickEvent);
});

function handleClickEvent(event) {
  event.preventDefault();
  const dataSet = event.target.dataset.dataset;
  fetchData(dataSet);
}

const color = d3
  .scaleOrdinal()
  .range([
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#e6beff",
    "#9a6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#808080",
  ]);

function fetchData(dataSet) {
  const DATASET = DATASETS[dataSet || DEFAULT_DATASET];
  title.textContent = DATASET.TITLE;
  description.textContent = DATASET.DESCRIPTION;
  svg.selectAll("*").remove();
  legend.selectAll("*").remove();
  fetch(DATASET.FILE_PATH)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const root = d3
        .treemap()
        .size([width, height + 200])
        .paddingInner(1)(
        d3
          .hierarchy(data)
          .sum((d) => {
            return d.value;
          })
          .sort((a, b) => {
            return b.height - a.height || b.value - a.value;
          })
      );
      const cell = svg
        .selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("class", "groub")
        .attr("transform", (d) => {
          return `translate(${d.x0},${d.y0})`;
        });
      cell
        .append("rect")
        .attr("class", "tile")
        .attr("width", (d) => {
          return d.x1 - d.x0;
        })
        .attr("height", (d) => {
          return d.y1 - d.y0;
        })
        .attr("data-name", (d) => {
          return d.data.name;
        })
        .attr("data-category", (d) => {
          return d.data.category;
        })
        .attr("data-value", (d) => {
          return d.data.value;
        })
        .style("fill", (d) => {
          return color(d.data.category);
        })
        .on("mousemove", (event, d) => {
          tooltip
            .attr("data-value", d.data.value)
            .style("opacity", 0.9)
            .style("left", `${event.pageX + 20}px`)
            .style("top", `${event.pageY - 20}px`)
            .style("background-color", "#E7ECEF")
            .style("position", "absolute");
          tooltip.html(
            `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`
          );
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0).style("left", `0px`).style("top", `0px`);
        });
      cell
        .append("text")
        .selectAll("tspan")
        .data((d) => {
          return d.data.name.split(/(?=[A-Z][a-z])|\s+/g);
        })
        .enter()
        .append("tspan")
        .attr("x", 5)
        .attr("y", (d, i) => {
          return 10 + i * 8;
        })
        .text((d) => {
          return d;
        })
        .style("font-size", "10px");
      const categories = new Set(
        root.leaves().map((d) => {
          return d.data.category;
        })
      );
      const category = Array.from(categories);
      const legendItems = legend
        .selectAll("g")
        .data(category)
        .enter()
        .append("g")
        .attr(
          "transform",
          (d, i) => `translate(${(i % 3) * 160},${Math.floor(i / 3) * 25})`
        );
      legendItems
        .append("rect")
        .attr("class", "legend-item")
        .attr("width", 20)
        .attr("height", 20)
        .attr("y", 5)
        .style("fill", (d) => {
          return color(d);
        });
      legendItems
        .append("text")
        .text((d) => d)
        .attr("transform", `translate(25,20)`);
    })

    .catch((err) => {
      console.log(err);
    });
}
fetchData(DEFAULT_DATASET);
treeHolder.append(svg.node());
treeHolder.append(legend.node());
