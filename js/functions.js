/**
 * Created by prachikate on 12/4/16.
 */
//function mainScoreScatterPlot(){
//
//
//    var margin = {top: 20, right: 20, bottom: 30, left: 40},
//        width = 960 - margin.left - margin.right,
//        height = 500 - margin.top - margin.bottom;
//
//    /*
//     * value accessor - returns the value to encode for a given data object.
//     * scale - maps value to a visual display encoding, such as a pixel position.
//     * map function - maps from data value to display value
//     * axis - sets up axis
//     */
//    // add the graph canvas to the body of the webpage
//    var svg = d3.select("#morris-area-chart").append("svg")
//        .attr("width", width + margin.left + margin.right)
//        .attr("height", height + margin.top + margin.bottom)
//        .append("g")
//        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//// setup x
//    var xValue = function(d) { return d.imdb_score;}, // data -> value
//        xScale = d3.scale.linear().range([0, width]), // value -> display
//        xMap = function(d) { return xScale(xValue(d));}, // data -> display
//        xAxis = d3.svg.axis().scale(xScale).orient("bottom");
//
//// setup y
//    var yValue = function(d) { return d["movie_facebook_likes"];}, // data -> value
//        yScale = d3.scale.linear().range([height, 0]), // value -> display
//        yMap = function(d) { return yScale(yValue(d));}, // data -> display
//        yAxis = d3.svg.axis().scale(yScale).orient("left");
//
//// setup fill color
//    var cValue = function(d) { return d.title_year;},
//        color = d3.scale.category10();
//
//
//
//// add the tooltip area to the webpage
//    var tooltip = d3.select("#morris-area-chart").append("div")
//        .attr("class", "tooltip")
//        .style("opacity", 0);
//
//// load data
//    d3.csv("movie_metadata.csv", function(error, data) {
//
//        // change string (from CSV) into number format
//        data.forEach(function(d) {
//            d.imdb_score = +d.imdb_score;
//            d["movie_facebook_likes"] = +d["movie_facebook_likes"];
////    console.log(d);
//        });
//
//        // don't want dots overlapping axis, so add in buffer to data domain
//        xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
//        yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
//
//        // x-axis
//        svg.append("g")
//            .attr("class", "x axis")
//            .attr("transform", "translate(0," + height + ")")
//            .call(xAxis)
//            .append("text")
//            .attr("class", "label")
//            .attr("x", width)
//            .attr("y", -6)
//            .style("text-anchor", "end")
//            .text("Movie IMDB score");
//
//        // y-axis
//        svg.append("g")
//            .attr("class", "y axis")
//            .call(yAxis)
//            .append("text")
//            .attr("class", "label")
//            .attr("transform", "rotate(-90)")
//            .attr("y", 6)
//            .attr("dy", ".71em")
//            .style("text-anchor", "end")
//            .text("Movie FB likes");
//
//        // draw dots
//        svg.selectAll(".dot")
//            .data(data)
//            .enter().append("circle")
//            .attr("class", "dot")
//            .attr("r", 5)
//            .attr("cx", xMap)
//            .attr("cy", yMap)
//            .style("fill", function(d) { return color(cValue(d));})
//            .on("mouseover", function(d) {
//                tooltip.transition()
//                    .duration(200)
//                    .style("opacity", .9);
//                tooltip.html(d["movie_title"] + "<br/> (" + xValue(d)
//                        + ", " + yValue(d) + ")")
//                    .style("left", (d3.event.pageX + 5) + "px")
//                    .style("top", (d3.event.pageY - 28) + "px");
//            })
//            .on("mouseout", function(d) {
//                tooltip.transition()
//                    .duration(500)
//                    .style("opacity", 0);
//            });
//
//        // draw legend
//        var legend = svg.selectAll(".legend")
//            .data(color.domain())
//            .enter().append("g")
//            .attr("class", "legend")
//            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//
//        // draw legend colored rectangles
//        legend.append("rect")
//            .attr("x", width - 18)
//            .attr("width", 18)
//            .attr("height", 18)
//            .style("fill", color);
//
//        // draw legend text
//        legend.append("text")
//            .attr("x", width - 24)
//            .attr("y", 9)
//            .attr("dy", ".35em")
//            .style("text-anchor", "end")
//            .text(function(d) { return d;})
//    });
//
//}

function zoomableScatterPlotForRatingsByIncome(){

    var margin = { top: 30, right: 300, bottom: 30, left: 50 },
        outerWidth = 900,
        outerHeight = 400,
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]).nice();

    var y = d3.scale.linear()
        .range([height, 0]).nice();

    //setup fill color
    var cValue = function(d) { return d.color;},
        color = d3.scale.category10();

    var xCat = "budget",
        yCat = "gross",
        rCat = "imdb_score",
        colorCat = "color";

    d3.csv("movie_metadata.csv", function(data) {
        data.forEach(function(d) {
            d.budget = +d.budget;
            d.gross = +d.gross;
            d["movie_title"] = +d["movie_title"];
            d.imdb_score = +d.imdb_score;
            d["color"] = +d["color"];
            /*d["Serving Size Weight"] = +d["Serving Size Weight"];
            d.Sodium = +d.Sodium;
            d.Sugars = +d.Sugars;
            d["Vitamins and Minerals"] = +d["Vitamins and Minerals"];*/
        });

        var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
            xMin = d3.min(data, function(d) { return d[xCat]; }),
            xMin = xMin > 0 ? 0 : xMin,
            yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
            yMin = d3.min(data, function(d) { return d[yCat]; }),
            yMin = yMin > 0 ? 0 : yMin;

        x.domain([xMin, xMax]);
        y.domain([yMin, yMax]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickSize(-width);

        var color = d3.scale.category10();

        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d) {
                return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
            });

        var zoomBeh = d3.behavior.zoom()
            .x(x)
            .y(y)
            .scaleExtent([0, 500])
            .on("zoom", zoom);

        var svg = d3.select("#flot-line-chart")
            .append("svg")
            .attr("width", outerWidth)
            .attr("height", outerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoomBeh);

        svg.call(tip);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .classed("label", true)
            .attr("x", width)
            .attr("y", margin.bottom - 10)
            .style("text-anchor", "end")
            .text(xCat);

        svg.append("g")
            .classed("y axis", true)
            .call(yAxis)
            .append("text")
            .classed("label", true)
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yCat);

        var objects = svg.append("svg")
            .classed("objects", true)
            .attr("width", width)
            .attr("height", height);

        objects.append("svg:line")
            .classed("axisLine hAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("transform", "translate(0," + height + ")");

        objects.append("svg:line")
            .classed("axisLine vAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height);

        objects.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .classed("dot", true)
            //.attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
            .attr("r", 5)
            .attr("transform", transform)
            .style("fill", function(d) { return color(cValue(d));})
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .classed("legend", true)
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("circle")
            .attr("r", 3.5)
            .attr("cx", width + 20)
            .attr("fill", color);

        legend.append("text")
            .attr("x", width + 26)
            .attr("dy", ".35em")
            .text(function(d) { return d; });

        d3.select("input").on("click", change);

        function change() {
            xCat = "imdb_score";
            xMax = d3.max(data, function(d) { return d[xCat]; });
            xMin = d3.min(data, function(d) { return d[xCat]; });

            zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

            var svg = d3.select("#flot-line-chart").transition();

            svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

            objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
        }

        function zoom() {
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            svg.selectAll(".dot")
                .attr("transform", transform);
        }

        function transform(d) {
            return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
        }
    });

}

function scatterMatrix(){
    var width = 960,
        size = 230,
        padding = 40;

    var x = d3.scale.linear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scale.linear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(6);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(6);

    var color = d3.scale.category10();
    var xCat = "movie_facebook_likes",
       yCat = "imdb_score",
        zCat = "movie_title",
        wCat = "cast_total_facebook_likes";


    d3.csv("scatterMatrixData.csv", function(error, data) {
        if (error) throw error;

        var domainByTrait = {},
            traits = d3.keys(data[0]).filter(function(d) { return d !== "movie_title"; }),
            n = traits.length;

        traits.forEach(function(trait) {
            domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
        });

        xAxis.tickSize(size * n);
        yAxis.tickSize(-size * n);

        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
           .html(function(d) {
                return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat] + "<br>" + zCat + ":" +d[zCat] + "<br>" + wCat + ":" +d[wCat];
            });
        var brush = d3.svg.brush()
            .x(x)
            .y(y)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

        var svg = d3.select("#morris-area-chart").append("svg")
            .attr("width", size * n + padding)
            .attr("height", size * n + padding)
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 5 + ")");

        svg.call(tip);

        svg.selectAll(".x.axis")
            .data(traits)
            .enter().append("g")
            .attr("class", "x axis")
            .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
            .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

        svg.selectAll(".y.axis")
            .data(traits)
            .enter().append("g")
            .attr("class", "y axis")
            .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
            .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

        var cell = svg.selectAll(".cell")
            .data(cross(traits, traits))
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
            .each(plot);

        // Titles for the diagonal.
        cell.filter(function(d) { return d.i === d.j; }).append("text")
            .attr("x", padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text(function(d) { return d.x; });

        cell.call(brush);

        function plot(p) {
            var cell = d3.select(this);

            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);

            cell.append("rect")
                .attr("class", "frame")
                .attr("x", padding / 2)
                .attr("y", padding / 2)
                .attr("width", size - padding)
                .attr("height", size - padding);

            cell.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("cx", function(d) { return x(d[p.x]); })
                .attr("cy", function(d) { return y(d[p.y]); })
                .attr("r", 4)
                //.style("fill", function(d) { return color(d.movie_title); })
                .style("fill", "steelblue")
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);
        }

        var brushCell;

        // Clear the previously-active brush, if any.
        function brushstart(p) {
            if (brushCell !== this) {
                d3.select(brushCell).call(brush.clear());
                x.domain(domainByTrait[p.x]);
                y.domain(domainByTrait[p.y]);
                brushCell = this;
            }
        }

        // Highlight the selected circles.
        function brushmove(p) {
            var e = brush.extent();
            svg.selectAll("circle").classed("hidden", function(d) {
                return e[0][0] > d[p.x] || d[p.x] > e[1][0]
                    || e[0][1] > d[p.y] || d[p.y] > e[1][1];
            });
        }

        // If the brush is empty, select all circles.
        function brushend() {
            if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
        }
    });

    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
        return c;
    }
}

function actorDirectorLikesBarChart(movieTitle){

    var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
        })

    var svg = d3.select("#morris-bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.tsv("movie_metadata.csv", type, function(error, data) {

        x.domain(data.map(function(d) { return d.letter; }));
        y.domain([0, d3.max(data, function(d) { return d.actor_1_facebook_likes; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.letter); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.frequency); })
            .attr("height", function(d) { return height - y(d.frequency); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

    });

    function type(d) {
        d.frequency = +d.frequency;
        return d;
    }
}


function zoomableScatterPlotForRatingsBySocialMedia(){

    var margin = { top: 50, right: 300, bottom: 50, left: 50 },
        outerWidth = 1050,
        outerHeight = 500,
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]).nice();

    var y = d3.scale.linear()
        .range([height, 0]).nice();

    //setup fill color
    var cValue = function(d) { return d.color;},
        color = d3.scale.category10();

    var xCat = "movie_facebook_likes",
        yCat = "imdb_score",
        rCat = "color",
        colorCat = "content_rating";

    d3.csv("movie_metadata.csv", function(data) {
        data.forEach(function(d) {
            d.imdb_score = +d.imdb_score;
            d.cast_total_facebook_likes = +d.cast_total_facebook_likes;
            d["movie_title"] = +d["movie_title"];
            d.movie_facebook_likes = +d.movie_facebook_likes;
            d["content_rating"] = +d["content_rating"];
            /*d["Serving Size Weight"] = +d["Serving Size Weight"];
             d.Sodium = +d.Sodium;
             d.Sugars = +d.Sugars;
             d["Vitamins and Minerals"] = +d["Vitamins and Minerals"];*/
        });

        var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
            xMin = d3.min(data, function(d) { return d[xCat]; }),
            xMin = xMin > 0 ? 0 : xMin,
            yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
            yMin = d3.min(data, function(d) { return d[yCat]; }),
            yMin = yMin > 0 ? 0 : yMin;

        x.domain([xMin, xMax]);
        y.domain([yMin, yMax]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickSize(-width);

        var color = d3.scale.category10();

        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d) {
                return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
            });

        var zoomBeh = d3.behavior.zoom()
            .x(x)
            .y(y)
            .scaleExtent([0, 500])
            .on("zoom", zoom);

        var svg = d3.select("#morris-area-chart")
            .append("svg")
            .attr("width", outerWidth)
            .attr("height", outerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoomBeh);

        svg.call(tip);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .classed("label", true)
            .attr("x", width)
            .attr("y", margin.bottom - 10)
            .style("text-anchor", "end")
            .text(xCat);

        svg.append("g")
            .classed("y axis", true)
            .call(yAxis)
            .append("text")
            .classed("label", true)
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yCat);

        var objects = svg.append("svg")
            .classed("objects", true)
            .attr("width", width)
            .attr("height", height);

        objects.append("svg:line")
            .classed("axisLine hAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("transform", "translate(0," + height + ")");

        objects.append("svg:line")
            .classed("axisLine vAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height);

        objects.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .classed("dot", true)
            //.attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
            .attr("r", 5)
            .attr("transform", transform)
            .style("fill", function(d) { return color(cValue(d));})
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .classed("legend", true)
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("circle")
            .attr("r", 3.5)
            .attr("cx", width + 20)
            .attr("fill", color);

        legend.append("text")
            .attr("x", width + 26)
            .attr("dy", ".35em")
            .text(function(d) { return d; });

        d3.select("input").on("click", change);

        function change() {
            xCat = "cast_total_facebook_likes";
            xMax = d3.max(data, function(d) { return d[xCat]; });
            xMin = d3.min(data, function(d) { return d[xCat]; });

            zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

            var svg = d3.select("#morris-area-chart").transition();

            svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

            objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
        }

        function zoom() {
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            svg.selectAll(".dot")
                .attr("transform", transform);
        }

        function transform(d) {
            return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
        }
    });

}