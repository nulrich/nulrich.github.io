//http://bl.ocks.org/mbostock/5100636
//transform: rotateY(50deg);
//http://codepen.io/henryegloff/pen/vljEt

var margin = {top: 30, left: 30, bottom: 30, right: 30},
width = 350 - margin.left - margin.right,
height = 350 - margin.top - margin.bottom,
radius = Math.min(width, height) / 2,
thickness = 20,
padding = 5,
t = - 1.5 * Math.PI;

var gauges = [{
    light: "#5572C5",
    color: "#a0b1de",
    value: 1,
    label: "Baseball"
},
{
    light: "#FF9806",
    color: "#ffca80",
    value: 0.80,
    label: "Tennis"
},
{
    light: "#D64880",
    color: "#e797b7",
    value: 0.60,
    label: "Basketball"
},
{
    light: "#98D648",
    color: "#c5e797",
    value: 0.40,
    label: "Soccer"
}];

function createText (gauge, position) {
    return chart.append("text")
    .style("fill", "#98ABC5")
    .attr("dy", ".2em")
    .attr("class", "topic")
    .attr("transform", "translate(10, -" + (radius - (position * thickness) - padding - thickness/2 ) + " )")
    .text(gauge.label)
    .on('mouseenter', handleEnter.bind(this, gauge))
    .on('mouseleave', handlerExit.bind(this, gauge));
}

function createArc (position) {
    return d3.svg.arc()
    .outerRadius(radius - (position * thickness) - padding)
    .innerRadius(radius - (++position * thickness))
    .startAngle(0);
}

function createZoomArc (position) {
    return d3.svg.arc()
    .outerRadius(radius - (position * thickness) - padding + 10)
    .innerRadius(radius - (++position * thickness))
    .startAngle(0);
}

function createBackground(gauge, position) {
    return chart.append("path")
    .datum({endAngle: t})
    .style("fill", "#ddd")
    .attr("d", gauge.arc)
    .attr("class", "pointer")
    .on('mouseenter', handleEnter.bind(this, gauge))
    .on('mouseleave', handlerExit.bind(this, gauge));
}

function createForeground(gauge, position) {
    return chart.append("path")
    .datum({endAngle: 0})
    .style("fill", gauge.color)
    .attr("d", gauge.arc)
    .attr("class", "pointer")
    .on('mouseenter', handleEnter.bind(this, gauge))
    .on('mouseleave', handlerExit.bind(this, gauge));
}

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

chart.append("line")
    .style("stroke", "#bbb")
    .attr("x1", radius - (4 * thickness) - padding)
    .attr("y1", 0)
    .attr("x2", radius)
    .attr("y2", 0);

gauges.forEach(function (gauge, i) {
    gauge.text = createText(gauge, i);
    gauge.arc = createArc(i);
    gauge.zoomArc = createZoomArc(i);
    gauge.background = createBackground(gauge, i);
    gauge.foreground = createForeground(gauge, i);
});

// Sample
setTimeout(function() {
    gauges.forEach(function (gauge, i) {
        gauge.foreground.transition()
            .duration(1000)
            .call(arcTween, gauge.value * t, gauge.arc);
    });
}, 500);

function arcTween(transition, newAngle, arc) {
    transition.attrTween("d", function(d) {
        var interpolate = d3.interpolate(0, newAngle);
        return function(t) {
            d.endAngle = interpolate(t);
            return arc(d);
        };
    });
}

function handleEnter (gauge) {
    gauge.text.attr("class", "pointer topic topic-hover");
    gauge.foreground.style('fill', gauge.light);
    gauge.background.style('fill', '#eee');
}

function handlerExit (gauge) {
    gauge.text.attr("class", "pointer topic");
    gauge.foreground.style('fill', gauge.color);
    gauge.background.style('fill', '#ddd');
}
