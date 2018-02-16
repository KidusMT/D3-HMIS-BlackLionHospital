$(document).ready(function () {
    //build tree
    function BuildVerticaLTree(treeData, treeContainerDom) {
        var margin = { top: 60, right: 10, bottom: 0, left: 10 };
        var width = 1340 - margin.right - margin.left;//width of the svg canvas
        var height = 1250 - margin.top - margin.bottom;//height of the svg canvas
        //Time it takes for the animation to happen
        var i = 0, duration = 750;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) { return [d.x, d.y]; });
        var svg = d3.select(treeContainerDom).append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate (" + margin.left + "," + margin.top + ")");
        root = treeData;

        update(root);
        function update(source) {
            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);
            // Normalize for fixed-depth.
            nodes.forEach(function (d) { d.y = d.depth * 70; });
            // Declare the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function (d) { return d.id || (d.id = ++i); });
            // Enter the nodes.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                }).on("click", nodeclick);
            nodeEnter.append("rect")
                .attr("width", 120)
                .attr("height", 20)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("stroke", function (d) { return d.children || d._children ? "steelblue" : "#2591a1"; })
                .style("fill", function (d) { return d.children || d._children ? "lightteal" : "#2591a1"; });
            //.attr("r", 10)
            //.style("fill", "#fff");
            nodeEnter.append("text")
                .attr("y", function (d) { return d.children || d._children ? 1 : 1; })//d.childern->for children, d._children-> for grandchildren
                .attr("x", function (d) { return d.children || d._children ? 60 : 60; })//d.childern->for children, d._children-> for grandchildren
                .attr("dy", "1em")
                .attr("text-anchor", "middle")
                .text(function (d) { return d.name; })
                .style("fill-opacity", 1e-6);
            // Transition nodes to their new position.
            //horizontal tree
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) { return "translate(" + (d.x - 60) + "," + d.y + ")"; });
            nodeUpdate.select("rect")
                .attr("width", 120)
                .attr("height", 20)
                .style("fill", function (d) { return d._children ? "lightteal" : "#2591a1"; });
            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
                .remove();
            nodeExit.select("rect")
                .attr("r", 1e-6);
            nodeExit.select("text")
                .style("fill-opacity", 1e-6);
            // Update the links…
            // Declare the links…
            var link = svg.selectAll("path.link")
                .data(links, function (d) { return d.target.id; });
            // Enter the links.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });
                });
            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // Toggle children on click.
        function nodeclick(d) {
            $("#title").replaceWith('<h1 id="title">' + d.full_name + "</h1>");
            $("#info").replaceWith('<p id="info">' + d.description[0].info + "</p>");
            $("#contact_name").replaceWith('<p id="contact_name">Name: ' + d.description[0].contact_name + "</p>");
            $("#phone").replaceWith('<p id="phone">Phone: ' + d.description[0].phone + "</p>");

            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                if (d.parent.children) {
                    d.parent.children.forEach(function (d) {
                        if (d.children != null) {
                            d._children = d.children
                            d.children = null;
                        }
                    });
                }
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }

    treeData = data;
    BuildVerticaLTree(treeData, "#tree");
});