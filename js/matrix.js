//http://bl.ocks.org/mbostock/5100636
//transform: rotateY(50deg);o
//http://codepen.io/henryegloff/pen/vljEt

var margin = {top: 30, left: 30, bottom: 30, right: 30},
width = 250 - margin.left - margin.right,
height = 250 - margin.top - margin.bottom,
radius = Math.min(width, height) / 2,
t = 2 * Math.PI;

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 30)
    .startAngle(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Middle label
var label = chart.append("text")
    .attr("class", "label")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("fill", "#98ABC5")
    .text(0);

// Background arc
var background = chart.append("path")
    .datum({endAngle: t})
    .style("fill", "#ddd")
    .attr("d", arc);

// Foreground arc
var foreground = chart.append("path")
    .datum({endAngle: 0})
    .style("fill", "#98ABC5")
    .attr("d", arc);

setTimeout(function() {

    foreground.transition()
    .duration(1000)
    .call(arcTween, 0.127 * t);

    label.transition()
    .duration(1000)
    .tween("text", function() {
      var interpolate = d3.interpolate(this.textContent, 12.7);
      return function(t) {
        this.textContent =
            t === 1 ?
            Math.round(interpolate(t) * 10) / 10
            :
            Math.round(interpolate(t) - 0.5);
      };
    });

}, 500);

function arcTween(transition, newAngle) {
    transition.attrTween("d", function(d) {
        var interpolate = d3.interpolate(0, newAngle);
        return function(t) {
            d.endAngle = interpolate(t);
            return arc(d);
        };
    });
}

