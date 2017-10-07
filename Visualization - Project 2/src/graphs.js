var mds_corr = false;
var mds_euc = false;
var pca2 = true;
var pca3 = false;
var scree_l =false;
var scree_e =false;
var kmeans = false;

var random = true;
var stratified = true;

function load(val){
  if(kmeans){
    elbow_plot('data/kmean.csv');
  }
  if(val==1){
    random = true;
    stratified = false;
    if(mds_euc) scatter_plot('data/mds_euc.csv');
    if(mds_corr) scatter_plot('data/mds_corr.csv');
    if(pca3) pca3_plot('data/PCA2_random.csv');
    if(pca2) scatter_plot('data/PCA2_random.csv');
    if(scree_l) loading_plot('data/scree_loadings_random.csv');
    if(scree_e) loading_plot('data/pca_eigen_values1.csv');
  }
  else{
    random = false;
    stratified = true;
    if(mds_euc) scatter_plot('data/mds_euc_stratified.csv');
    if(mds_corr) scatter_plot('data/mds_corr_stratified.csv');
    if(pca3) pca3_plot('data/PCA2_stratified.csv');
    if(pca2) scatter_plot('data/PCA2_stratified.csv');
    if(scree_l) loading_plot('data/scree_loadings_stratified.csv');
    if(scree_e) loading_plot('data/pca_eigen_values2.csv');
  }
}

function create(val){
  if(val==1){
    mds_corr = false; mds_euc = false; pca2 = false;
    pca3 = false; scree_l =false; scree_e =false;
    kmeans = true;
    elbow_plot('data/kmean.csv');
  }
  if(val==2){
    mds_corr = false; mds_euc = false; pca2 = false;
    pca3 = false; scree_l =false; scree_e =true;
    kmeans = false;
  }
  if(val==3){
    mds_corr = false; mds_euc = false; pca2 = false;
    pca3 = false; scree_l =true; scree_e =false;
    kmeans = false;
  }
  if(val==4){
    mds_corr = false; mds_euc = false; pca2 = true;
    pca3 = false; scree_l =false; scree_e =false;
    kmeans = false;
  }
  if(val==5){
    mds_corr = false; mds_euc = true; pca2 = false;
    pca3 = false; scree_l =false; scree_e =false;
    kmeans = false;
  }
  if(val==6){
    mds_corr = true; mds_euc = false; pca2 = false;
    pca3 = false; scree_l =false; scree_e =false;
    kmeans = false;
  }
  if(val==7){
    mds_corr = false; mds_euc = false; pca2 = false;
    pca3 = true; scree_l =false; scree_e =false;
    kmeans = false;
  }
  if(random){load(1);}
  if(stratified){load(2);}
}


function scatter_plot(file_name) {
    
    document.getElementById("pca3").innerHTML = '';
    document.getElementById("graph").innerHTML = '';


    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = window.innerWidth - 600 - margin.left - margin.right,
        height = window.innerHeight - 250 - margin.top - margin.bottom;

    // add the graph canvas to the body of the webpage
    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("#graph").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var xScale = d3.scale.linear().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    // load data
    console.log(file_name);
    d3.csv(file_name, function(error, data) {
      // change string (from CSV) into number format
      console.log(data);
      arr = d3.keys(data[0]);
      console.log(arr);
      k1 = arr[1];
      k2 = arr[2];

      data.forEach(function(d) {
                //console.log(d);
                d.a1 = Number(d[k1]);
                d.a2 = Number(d[k2]);
            });

      xScale.domain([d3.min(data, function(d){return d.a1;})-1, d3.max(data, function(d){return d.a1;})+1]);
      yScale.domain([d3.min(data, function(d){return d.a2;})-1, d3.max(data, function(d){return d.a2;})+1]);

      // x-axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Component 1");

      // y-axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("class", "label")
          .attr("x",1)
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "start")
          .text("Component 2");

      // draw dots
      svg.selectAll(".dot")
          .data(data)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 3)
          .attr("cx", function(d){
                return xScale(d.a1);
            })
          .attr("cy", function(d){
                return yScale(d.a2);
            })
          .style("fill", "black")
          .on("mouseover", function(d) {
              svg.append("text")
               .attr("id", "tooltip")
               .attr("x", (xScale(d.a1)))
               .attr("y", yScale(d.a2)-10)
               .attr("text-anchor", "middle")
               .attr("font-size", "14px")
               .attr("fill", "black")
               .text(parseFloat(d.a1).toFixed(2)+','+parseFloat(d.a2).toFixed(2));
                  })
          .on("mouseout", function(d) {
                d3.select("#tooltip").remove();
          });

    });
}

function pca3_plot(file_name) {
    document.getElementById("pca3").innerHTML = '';
    document.getElementById("graph").innerHTML = '';

    var width = 960,
    size = 230,
    padding = 20;

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

d3.csv(file_name, function(error, data) {
  if (error) throw error;

  var domainByTrait = {},
      traits = d3.keys(data[0]).filter(function(d) { return d !== ""; }),
      n = traits.length;
  console.log(traits);
  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { return Number(d[trait]); });
  });

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  var svg = d3.select("#pca3").append("svg")
      .attr("width", size * n + padding)
      .attr("height", size * n + padding)
    .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

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
      .text(function(d) { console.log(d.i + "," + d.j + "," + d.x); return d.x; });

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
        .attr("cx", function(d) { console.log(p.x); return x(d[p.x]); })
        .attr("cy", function(d) { return y(d[p.y]); })
        .attr("r", 4)
        .style("fill", "steelblue");
  }
});

function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}

}


function loading_plot(file_name) {
    document.getElementById("pca3").innerHTML = '';
    document.getElementById("graph").innerHTML = '';


    var margin = {top: 30, right: 40, bottom: 50, left: 100},
      width = window.innerWidth - 600 - margin.left - margin.right,
      height = window.innerHeight - 250 - margin.top - margin.bottom;

    
    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal().rangeRoundPoints([0 , width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var v = d3.svg.line()
        .x(function(d) { return x(d.a1); })
        .y(function(d) { return y(d.a2); })
        .interpolate("linear");

    d3.csv(file_name, function(error, data) {

        arr = d3.keys(data[0]);
        console.log(arr);
        k1 = arr[1];
        k2 = arr[2];

        data.forEach(function(d) {
            d.a1 = d[k1];
            d.a2 = +d[k2];
        });
        console.log(data);

        
        x.domain(data.map(function(d) { return d.a1; }));
        y.domain([0, d3.max(data, function(d) { return d.a2; })]);

        svg.append("path")      // Add the valueline1 path.
            .attr("class", "line")
            .attr("d", v(data));

        svg.append("g")         // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("id", "t")
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(k1);

        svg.append("g")         // Add the Y Axis
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x",1)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(k2);

        if(scree_l){
          svg.selectAll("#t")
            .attr("transform", "rotate(-45)")
            .attr("dx", "-.8em")
            //.attr("dy", "7.50em")
        }
        // draw dots
        svg.selectAll(".dot")
          .data(data)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 3.5)
          .attr("cx", function(d){return x(d.a1);})
          .attr("cy", function(d){return y(d.a2);})
          .style("fill", "black")//console.log(d.type*20); return color(d.type*20);}) 
          .on("mouseover", function(d) {
              svg.append("text")
               .attr("id", "tooltip")
               .attr("x", (x(d.a1)))
               .attr("y", y(d.a2)-10)
               .attr("text-anchor", "middle")
               .attr("font-size", "14px")
               .attr("fill", "black")
               .text((d.a1)+','+parseFloat(d.a2).toFixed(2));
                  })
          .on("mouseout", function(d) {
                d3.select("#tooltip").remove();
          });

          if(scree_e){
            svg.append("line").attr("x1", 0).attr("y1", y(1.0)).attr("x2", width).attr("y2", y(1.0))
              .attr("stroke-width", 2).attr("stroke", "green").style("stroke-dasharray", ("3, 3"));
          }
          else{
            svg.append("line").attr("x1", 0).attr("y1", y(0.3)).attr("x2", width).attr("y2", y(0.3))
              .attr("stroke-width", 2).attr("stroke", "green").style("stroke-dasharray", ("3, 3"));
          }

    });

}

function elbow_plot(file_name) {
    document.getElementById("pca3").innerHTML = '';
    document.getElementById("graph").innerHTML = '';

    var margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = window.innerWidth-margin.left-margin.right-200; 
      height = window.innerHeight-margin.top-margin.bottom-200; 

    
    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.cluster_size); })
        .y(function(d) { return y(d.value); });

    d3.csv(file_name, function(error, data) {

        arr = d3.keys(data[0]);
        console.log(arr);
        k1 = arr[0];
        k2 = arr[1];

        data.forEach(function(d) {
            d.cluster_size = +d[k1];
            d.value = +d[k2];
        });

        x.domain([0, d3.max(data, function(d) { return d.cluster_size; })]);
        y.domain([d3.min(data, function(d) { return d.value; })-1000, d3.max(data, function(d) { return d.value; })]);

        svg.append("path")     
            .attr("class", "line")
            .style("stroke", "steelblue")
            .attr("d", valueline(data));

        svg.append("g")         
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Cluster Size");

        svg.append("g")         // Add the Y Axis
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x",1)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Squared Sum Error");

        // draw dots
        svg.selectAll(".dot")
          .data(data)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 3.5)
          .attr("cx", function(d){return x(d.cluster_size);})
          .attr("cy", function(d){return y(d.value);})
          .style("fill", "black")//console.log(d.type*20); return color(d.type*20);}) 
          .on("mouseover", function(d) {
              svg.append("text")
               .attr("id", "tooltip")
               .attr("x", x(d.cluster_size))
               .attr("y", y(d.value)-10)
               .attr("text-anchor", "middle")
               .attr("font-size", "14px")
               .attr("fill", "black")
               .text(parseFloat(d.cluster_size).toFixed(2)+','+parseFloat(d.value).toFixed(2));
                  })
          .on("mouseout", function(d) {
              d3.select("#tooltip").remove();
          });

    });

}