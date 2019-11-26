function table() {
    let dispatcher;

    function chart(column, data) {
        let table = d3.select(column)
            .append('table')
            .attr("style", "margin-left: 200px")
            .style("border-collapse", "collapse")
            .style("border", "2px black solid") ;
            
        let thead = table.append('thead');
        let tbody = table.append('tbody');

        let header = thead.append('tr')
            .selectAll('th')
            .data(Object.keys(data[0]))
            .enter()
            .append('th')
            .text((function(column) { 
                return column; }));

        let clicked = false;
        
        let rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr')

            // Hovering highlights the row
            .on("mouseover", function () {
                d3.select(this).classed("mouseover", true)
                    .style("background-color", "light grey")
            })

            // Moving mouse out does not highlight anymore
            .on("mouseout", function () {
                d3.select(this)
                    .classed("mouseover", false)
            })

            //  Selects the row when it is clicked
            .on("mousemove", function () {
                if (clicked) {
                    d3.select(this).classed("selected", true);
                    let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
                    dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
                }
            })

            // If the mouse is clicked and moving down, selects the rows below
            .on("mousedown", function () {
                d3.selectAll('tr').classed("selected", false);
                d3.select(this).classed("selected", true);
                clicked = true;
                let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
                dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
            })

            // If the mouse is clicked and moving up, selects the rows above
            .on("mouseup", function () {
                if (clicked) {
                    clicked = false;
                }
            });

        let values = rows.selectAll("td")
            .data(function(value) {
                return Object.keys(data[0]).map(function (v, i) {
                    return {i: v, value: value[v]};
                });
            })
            .enter()
            .append("td")
            .html(function(v) {
                return v.value;
            });
        return chart;
    }

    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
    };

    // Given selected data from another visualization 
    // select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;

        // Select an element if its datum was selected
        d3.selectAll('tr').classed("selected", d =>  
        selectedData.includes(d));
    };

    return chart;
}