// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  d3.json("data/texas.json").then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    // Create a line chart given x and y attributes, labels, offsets; 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our svg in; and the data to use.
    let lcYearPoverty = linechart()
      .x(d => d.year)
      .xLabel("YEAR")
      .y(d => d.poverty)
      .yLabel("POVERTY RATE")
      .yLabelOffset(40)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#linechart", data);

    // Create a scatterplot given x and y attributes, labels, offsets; 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our svg in; and the data to use.
    let spUnemployMurder = scatterplot()
      .x(d => d.unemployment)
      .xLabel("UNEMPLOYMENT RATE")
      .y(d => d.murder)
      .yLabel("MURDER RATE IN STATE PER 100000")
      .yLabelOffset(150)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#scatterplot", data);

    let infoTable = table()
        .selectionDispatcher(d3.dispatch(dispatchString))
        ("#table", data);

    // When the line chart selection is updated via brushing, 
    // tell the scatterplot and table to update it's selection (linking)
    lcYearPoverty.selectionDispatcher().on(dispatchString + '.a', spUnemployMurder.updateSelection);
    lcYearPoverty.selectionDispatcher().on(dispatchString + '.b', infoTable.updateSelection);

    // When the scatterplot selection is updated via brushing, 
    // tell the line chart and table to update it's selection (linking)
    spUnemployMurder.selectionDispatcher().on(dispatchString + '.c', lcYearPoverty.updateSelection);
    spUnemployMurder.selectionDispatcher().on(dispatchString + '.d', infoTable.updateSelection);

    // When the table selection is updated via brushing, 
    // tell the line chart and scatterplot to update it's selection (linking)
    infoTable.selectionDispatcher().on(dispatchString + '.e', lcYearPoverty.updateSelection);
    infoTable.selectionDispatcher().on(dispatchString + '.f', spUnemployMurder.updateSelection);
  });

})());