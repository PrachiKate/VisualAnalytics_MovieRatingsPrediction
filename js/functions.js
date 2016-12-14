/**
 * Created by prachikate on 12/4/16.
 */


function zoomableScatterPlotForRatingsByIncome(){

    var margin = { top: 50, right: 300, bottom: 50, left: 50 },
        outerWidth = 900,
        outerHeight = 320,
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    var formatSi = (d3.format(".0s"));

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

    d3.csv("movie_metadata.csv", function(error, data) {
        data.forEach(function(d) {
            d.budget = +d.budget;
            d.gross = +d.gross;
            d.movie_title = +d.movie_title;
            d.imdb_score = +d.imdb_score;
            d.color = +d.color;
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
            .tickSize(-height)
            .tickFormat(formatSi);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickSize(-width)
            .tickFormat(formatSi);

        var color = d3.scale.category10();

        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d) {
                return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat] ;
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
            .text(xCat)


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
            .attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
            //.attr("r", 5)
            .attr("transform", transform)
            .style("fill", function(d) { return color(cValue(d));})
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        //var legend = svg.selectAll(".legend")
        //    .data(color.domain())
        //    .enter().append("g")
        //    .classed("legend", true)
        //    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        //
        //legend.append("circle")
        //    .attr("r", 3.5)
        //    .attr("cx", width + 20)
        //    .attr("fill", color);
        //
        //legend.append("text")
        //    .attr("x", width + 26)
        //    .attr("dy", ".35em")
        //    .text(function(d) { return d; });

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
        //zCat = "movie_title"
        rCat = "color",
        colorCat = "content_rating";

    d3.csv("movie_metadata.csv", function(error, data) {
        if (error) throw error;
        data.forEach(function(d) {
            d.imdb_score = +d.imdb_score;
            d.cast_total_facebook_likes = +d.cast_total_facebook_likes;
            d.movie_title = +d.movie_title;
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

        //var tip = d3.tip()
        //    .attr("class", "d3-tip")
        //    .offset([-10, 0])
        //    .html(function(d) {
        //        return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
        //    });
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

        //var legend = svg.selectAll(".legend")
        //    .data(color.domain())
        //    .enter().append("g")
        //    .classed("legend", true)
        //    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        //
        //legend.append("circle")
        //    .attr("r", 3.5)
        //    .attr("cx", width + 20)
        //    .attr("fill", color);
        //
        //legend.append("text")
        //    .attr("x", width + 26)
        //    .attr("dy", ".35em")
        //    .text(function(d) { return d; });

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

function scatterMatrixForCorrelation(){
    var width = 960,
        size = 230,
        padding = 40,
        formatSi = (d3.format(".0s"));

    var x = d3.scale.linear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scale.linear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(6)
        .tickFormat(formatSi);


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(6)
        .tickFormat(formatSi);

    var color = d3.scale.category10();
    var xCat = "duration",
        yCat = "gross",
        zCat = "movie_title",
        wCat = "budget";


    d3.csv("scatterMatrixDataForCorrelation.csv", function(error, data) {
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

        var svg = d3.select("#flot-line-chart1").append("svg")
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
                .style("fill", "green")
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


function selectedMovieSocialMediaLikesDonut(movieTitle){

    $('#morris-donut-chart').empty();
    //d3.select("input[value=\"total\"]").property("checked", true);
    d3.csv("SocialMediaLikes.csv", function (error, data) {
        data.forEach(function (d) {
            var movie = d.movie_title;
            if ((movie).match(movieTitle)) {

                directorLikes = +d["director_facebook_likes"];
                actor1Likes = +d["actor_1_facebook_likes"];
                actor2Likes = +d["actor_2_facebook_likes"];
                actor3Likes = +d["actor_3_facebook_likes"];

                var stateObject = [{"label": "Director", "value": directorLikes},
                    {"label": "Actor1", "value": actor1Likes},
                    {"label": "Actor2", "value": actor2Likes},
                    {"label": "Actor3", "value": actor3Likes}];

                var height = 500;
                var svg = d3.select("#morris-donut-chart")
                    .append("svg")
                    .attr("height", height)
                    .append("g")


                svg.append("g")
                    .attr("class", "slices");
                svg.append("g")
                    .attr("class", "labelName");
                svg.append("g")
                    .attr("class", "labelValue");
                svg.append("g")
                    .attr("class", "lines");

                var width = 400,
                    height = 400,
                    radius = 300 / 2,
                    donutWidth = 80;

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function (d) {
                        return d.value;
                    });

                var arc = d3.svg.arc()
                    //.outerRadius(radius * 0.8)
                    //.innerRadius(radius * 0.4);
                    .outerRadius(radius)
                    .innerRadius(radius - donutWidth);

                var outerArc = d3.svg.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9);

                var legendRectSize = (radius * 0.05);
                var legendSpacing = radius * 0.02;


                var div = d3.select("#morris-donut-chart").append("div").attr("class", "toolTip");

                svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var colorRange = d3.scale.category20();
                var color = d3.scale.ordinal()
                    .range(colorRange.range());


                change(stateObject);


                //d3.selectAll("input")
                //    .on("change", selectDataset);
                //
                //function selectDataset() {
                //    var value = this.value;
                //    if (value == "total") {
                //        change(stateObject);
                //    }
                //    else if (value == "option1") {
                //        change(stateObject);
                //    }
                //    else if (value == "option2") {
                //        change(stateObject);
                //    }
                //}

                function change(data) {

                    /* ------- PIE SLICES -------*/
                    var slice = svg.select(".slices").selectAll("path.slice")
                        .data(pie(stateObject), function (d) {
                            return d.data.label
                        });

                    slice.enter()
                        .insert("path")
                        .style("fill", function (d) {
                            return color(d.data.label);
                        })
                        .attr("class", "slice");

                    slice
                        .transition().duration(1000)
                        .attrTween("d", function (d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                return arc(interpolate(t));
                            };
                        })
                    slice
                        .on("mousemove", function (d) {
                            div.style("left", d3.event.pageX + 10 + "px");
                            div.style("top", d3.event.pageY - 25 + "px");
                            div.style("display", "inline-block");
                            div.html((d.data.label) + "<br>" + (d.data.value) + "%");
                        });
                    slice
                        .on("mouseout", function (d) {
                            div.style("display", "none");
                        });

                    slice.exit()
                        .remove();

                    var legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function (d, i) {
                            var height = legendRectSize + legendSpacing;
                            var offset = height * color.domain().length / 2;
                            var horz = -3 * legendRectSize;
                            var vert = i * height - offset;
                            return 'translate(' + horz + ',' + vert + ')';
                        });

                    legend.append('rect')
                        .attr('width', legendRectSize)
                        .attr('height', legendRectSize)
                        .style('fill', color)
                        .style('stroke', color);

                    legend.append('text')
                        .attr('x', legendRectSize + legendSpacing)
                        .attr('y', legendRectSize - legendSpacing)
                        .text(function (d) {
                            return d;
                        });

                    /* ------- TEXT LABELS -------*/

                    var text = svg.select(".labelName").selectAll("text")
                        .data(pie(stateObject), function (d) {
                            return d.data.label
                        });

                    text.enter()
                        .append("text")
                        .attr("dy", ".35em")
                        .text(function (d) {
                            return (d.data.label + ": " + d.value + "%");
                        });

                    function midAngle(d) {
                        return d.startAngle + (d.endAngle - d.startAngle) / 2;
                    }

                    text
                        .transition().duration(1000)
                        .attrTween("transform", function (d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                var d2 = interpolate(t);
                                var pos = outerArc.centroid(d2);
                                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                                return "translate(" + pos + ")";
                            };
                        })
                        .styleTween("text-anchor", function (d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                var d2 = interpolate(t);
                                return midAngle(d2) < Math.PI ? "start" : "end";
                            };
                        })
                        .text(function (d) {
                            return (d.data.label + ": " + d.value );
                        });


                    text.exit()
                        .remove();

                    /* ------- SLICE TO TEXT POLYLINES -------*/

                    var polyline = svg.select(".lines").selectAll("polyline")
                        .data(pie(stateObject), function (d) {
                            return d.data.label
                        });

                    polyline.enter()
                        .append("polyline");

                    polyline.transition().duration(1000)
                        .attrTween("points", function (d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                var d2 = interpolate(t);
                                var pos = outerArc.centroid(d2);
                                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                                return [arc.centroid(d2), outerArc.centroid(d2), pos];
                            };
                        });

                    polyline.exit()
                        .remove();
                };
            }
        });
    });
}



function selectedMovieReviewsDonut(movieTitle){

    $('#morris-donut-chart1').empty();

    //d3.select("input[value=\"total\"]").property("checked", true);
    d3.csv("Reviews.csv", function (error, data) {
        data.forEach(function (d) {
            if (d.movie_title == movieTitle) {

                criticReviews = +d["num_critic_for_reviews"];
                userReviews = +d["num_user_for_reviews"];


                var stateObject = [{"label": "Critics", "value": criticReviews},
                    {"label": "Users", "value": userReviews}];

                var height = 500;
                var svg = d3.select("#morris-donut-chart1")
                    .append("svg")
                    .attr("height", height)
                    .append("g")


                svg.append("g")
                    .attr("class", "slices");
                svg.append("g")
                    .attr("class", "labelName");
                svg.append("g")
                    .attr("class", "labelValue");
                svg.append("g")
                    .attr("class", "lines");

                var width = 400,
                    height = 400,
                    radius = 300 / 2,
                    donutWidth = 80;

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function (d) {
                        return d.value;
                    });

                var arc = d3.svg.arc()
                    //.outerRadius(radius * 0.8)
                    //.innerRadius(radius * 0.4);
                    .outerRadius(radius)
                    .innerRadius(radius - donutWidth);

                var outerArc = d3.svg.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9);

                var legendRectSize = (radius * 0.05);
                var legendSpacing = radius * 0.02;


                var div = d3.select("#morris-donut-chart1").append("div").attr("class", "toolTip");

                svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var colorRange = d3.scale.category20();
                var color = d3.scale.ordinal()
                    .range(colorRange.range());


                change(stateObject);


                //d3.selectAll("input")
                //    .on("change", selectDataset);
                //
                //function selectDataset() {
                //    var value = this.value;
                //    if (value == "total") {
                //        change(stateObject);
                //    }
                //    else if (value == "option1") {
                //        change(stateObject);
                //    }
                //    else if (value == "option2") {
                //        change(stateObject);
                //    }
                //}

                function change(data) {

                    /* ------- PIE SLICES -------*/
                    var slice = svg.select(".slices").selectAll("path.slice")
                        .data(pie(stateObject), function (d) {
                            return d.data.label
                        });

                    slice.enter()
                        .insert("path")
                        .style("fill", function (d) {
                            return color(d.data.label);
                        })
                        .attr("class", "slice");

                    slice
                        .transition().duration(1000)
                        .attrTween("d", function (d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                return arc(interpolate(t));
                            };
                        })
                    slice
                        .on("mousemove", function (d) {
                            div.style("left", d3.event.pageX + 10 + "px");
                            div.style("top", d3.event.pageY - 25 + "px");
                            div.style("display", "inline-block");
                            div.html((d.data.label) + "<br>" + (d.data.value) + "%");
                        });
                    slice
                        .on("mouseout", function (d) {
                            div.style("display", "none");
                        });

                    slice.exit()
                        .remove();

                    var legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function (d, i) {
                            var height = legendRectSize + legendSpacing;
                            var offset = height * color.domain().length / 2;
                            var horz = -3 * legendRectSize;
                            var vert = i * height - offset;
                            return 'translate(' + horz + ',' + vert + ')';
                        });

                    legend.append('rect')
                        .attr('width', legendRectSize)
                        .attr('height', legendRectSize)
                        .style('fill', color)
                        .style('stroke', color);

                    legend.append('text')
                        .attr('x', legendRectSize + legendSpacing)
                        .attr('y', legendRectSize - legendSpacing)
                        .text(function (d) {
                            return d;
                        });

                    /* ------- TEXT LABELS -------*/

                    var text = svg.select(".labelName").selectAll("text")
                        .data(pie(stateObject), function (d) {
                            return d.data.label
                        });

                    text.enter()
                        .append("text")
                        .attr("dy", ".35em")
                        .text(function (d) {
                            return (d.data.label + ": " + d.value + "%");
                        });

                    function midAngle(d) {
                        return d.startAngle + (d.endAngle - d.startAngle) / 2;
                    }

                    text
                        .transition().duration(1000)
                        .attrTween("transform", function (d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                var d2 = interpolate(t);
                                var pos = outerArc.centroid(d2);
                                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                                return "translate(" + pos + ")";
                            };
                        })
                        .styleTween("text-anchor", function (d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                var d2 = interpolate(t);
                                return midAngle(d2) < Math.PI ? "start" : "end";
                            };
                        })
                        .text(function (d) {
                            return (d.data.label + ": " + d.value );
                        });


                    text.exit()
                        .remove();

                    /* ------- SLICE TO TEXT POLYLINES -------*/

                    var polyline = svg.select(".lines").selectAll("polyline")
                        .data(pie(stateObject), function (d) {
                            return d.data.label
                        });

                    polyline.enter()
                        .append("polyline");

                    polyline.transition().duration(1000)
                        .attrTween("points", function (d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                var d2 = interpolate(t);
                                var pos = outerArc.centroid(d2);
                                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                                return [arc.centroid(d2), outerArc.centroid(d2), pos];
                            };
                        });

                    polyline.exit()
                        .remove();
                };
            }
        });
    });
}

function countyDropdownload() {

    var dataset = []
    d3.csv("Movies.csv", function (data) {
        dataset = data.map(function (d) {
            return d["movie_title"]
        });
        //console.log(dataset)
        $.each(dataset, function (i, option) {
            $('#movieSelectionWidget').append($('<option></option>').val(option).html(option));
            $('#movieSelectionWidget1').append($('<option></option>').val(option).html(option));
        });
    });
}

function onDropdownSelect(){
    var movieTitle = $("#movieSelectionWidget option:selected").text();
    //var state2 = $("#stateSelectionWidget2 option:selected").text();

    selectedMovieSocialMediaLikesDonut(movieTitle);
}

function onDropdownSelect1(){
    var movieTitle = $("#movieSelectionWidget1 option:selected").text();
    //var state2 = $("#stateSelectionWidget2 option:selected").text();

    selectedMovieReviewsDonut(movieTitle);
}

