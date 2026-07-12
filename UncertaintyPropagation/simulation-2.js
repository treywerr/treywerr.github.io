
/* ----- Variables and Constants ------- */
var x = 5; // Position of the point
var xError = 1; // The uncertainty on x
var m = 1; // Slope of the line
var mError = .5; // The uncertainty on the slope

/* ----- Error Propagation Methods ------- */

/**
 * Calculates the error on y due to uncertainty on the slope.
 * @param {number} x - the value of x.
 * @param {number} mError - the uncertainty on the slope.
 * @return {number} The uncertainty on y from the slope.
 */
function errorFromSlope() {
    return Math.abs(x*mError);
}

/**
 * Calculates the error on y due to uncertainty on x.
 * @param {number} m - the value of the slope.
 * @param {number} xError - the uncertainty on x.
 * @return {number} The uncertainty on y from x.
 */
function errorFromX() {
    return Math.abs(m*xError);
}

/**
 * Calculates the total error on y by propagation through the equation y=mx.
 * @param {number} x - the value of x.
 * @param {number} m - the value of the slope.
 * @param {number} xError - the uncertainty on x.
 * @param {number} mError - the uncertainty on the slope.
 * @return {number} The total uncertainty on y.
 */
function totalError() {
    let yError_x = errorFromX();
    let yError_m = errorFromSlope();
    return Math.sqrt(yError_x*yError_x + yError_m*yError_m);
}

/* ----------------Initial Graph Setup---------------- */

var trace0;
updateTrace0();

var trace1;
updateTrace1();

var mErrorLinesVisible = false;
var slopeUpperBound, slopeLowerBound;
updateSlopeErrorLines();

var yErrorLinesVisible = false;
var yUpperBound, yLowerBound;
updateYErrorLines();

var xErrorLinesVisible = false;
var leftBound, rightBound;
updateXErrorLines();

var y_xErrorLinesVisible = false;
var y_xUpperBound, y_xLowerBound;
updateY_xErrorLines();

var y_mErrorLinesVisible = false;
var y_mUpperBound, y_mLowerBound;
updateY_mErrorLines();

var data = [
    trace0,
    trace1
];

var layout = {
    showlegend: true,
    legend: {
        x: 0,
        xanchor: 'left',
        y: 1,
        bgcolor: 'rgba(0,0,0,0)'
    },
    margin: {
        l: 20,
        r: 20,
        t: 20,
        b: 20
    },
    xaxis: {
        range: [0, 10],
        autorange: false
    },
    yaxis: {
        range: [0, 10],
        autorange: false
    }
};

graph = document.getElementById('graph');
Plotly.newPlot(graph, data, layout, {staticPlot: true});

var errorGraphLayout = {
    margin: {
        l: 20,
        r: 20,
        t: 0,
        b: 20
    },
    barmode: 'stack',
    showlegend: false,
    yaxis: {visible: false}
};

var propErrX, propErrSlope;
updateErrorGraph();

var errorData = [
    propErrX,
    propErrSlope
];

errorGraph = document.getElementById('errorGraph');
Plotly.newPlot(errorGraph, errorData, errorGraphLayout, {staticPlot: true});

/* ------------Update Graph On Input-------------- */


/* ---------oninput functions----------*/

var xSlider = document.getElementById('xSlider');
xSlider.oninput = function() {
    x = xSlider.value/10;

    updateTrace1();
    updateYErrorLines();
    updateXErrorLines();
    updateY_xErrorLines();
    updateY_mErrorLines();
    updateErrorGraph();
    
    refreshGraph();
}

var xErrorMax = 2;
var xErrorSlider = document.getElementById('xErrorSlider');
xErrorSlider.oninput = function() {
    xError = xErrorMax*(xErrorSlider.value/100);
    document.getElementById('xErrorValue').innerHTML = "<b>Change the uncertainty on x</b> Current value: " + xError.toFixed(2);

    updateTrace1();
    updateYErrorLines();
    updateXErrorLines();
    updateY_xErrorLines();
    updateErrorGraph();
    
    refreshGraph();
}

var slopeMax = 2;
var slopeSlider = document.getElementById('mSlider');
slopeSlider.oninput = function() {
    m = slopeMax*(slopeSlider.value/100);

    updateTrace0();
    updateTrace1();
    updateSlopeErrorLines();
    updateYErrorLines();
    updateY_xErrorLines();
    updateY_mErrorLines();
    updateErrorGraph();
    
    refreshGraph();
}

var slopeErrorMax = 1;
var mErrorSlider = document.getElementById('mErrorSlider');
mErrorSlider.oninput = function() {
    mError = slopeErrorMax*(mErrorSlider.value/100);
    document.getElementById('mErrorValue').innerHTML = "<b>Change the uncertainty on the slope</b> Current value: " + mError.toFixed(2);

    updateTrace1();
    updateSlopeErrorLines();
    updateYErrorLines();
    updateY_mErrorLines();
    updateErrorGraph();
    
    refreshGraph();
}

var mErrorLines = document.getElementById('mErrorLines');
mErrorLines.oninput = function() {
    mErrorLinesVisible = mErrorLines.checked;
    updateSlopeErrorLines();
    refreshGraph();
}

var yErrorLines = document.getElementById('yErrorLines');
yErrorLines.oninput = function() {
    yErrorLinesVisible = yErrorLines.checked;
    updateYErrorLines();
    refreshGraph();
}

var xErrorLines = document.getElementById('xErrorLines');
xErrorLines.oninput = function() {
    xErrorLinesVisible = xErrorLines.checked;
    updateXErrorLines();
    refreshGraph();
}

var y_xErrorLines = document.getElementById('y_xErrorLines');
y_xErrorLines.oninput = function() {
    y_xErrorLinesVisible = y_xErrorLines.checked;
    updateY_xErrorLines();
    refreshGraph();
}

var y_mErrorLines = document.getElementById('y_mErrorLines');
y_mErrorLines.oninput = function() {
    y_mErrorLinesVisible = y_mErrorLines.checked;
    updateY_mErrorLines();
    refreshGraph();
}


/* ---------trace update functions--------- */

/**
 * Updates trace0 to reflect changes in stored variables.
 * Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateTrace0() {
    trace0 = {
        x: [0, 10],
        y: [0, m*10],
        mode: 'lines',
        showlegend: false
    };
}

/**
 * Updates trace1 to reflect changes in stored variables.
 * @post Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateTrace1() {
    trace1 = {
        x: [x],
        y: [m*x],
        error_y: {
            type: 'constant',
            value: totalError()
        },
        error_x: {
            type: 'constant',
            value: xError
        },
        type: 'scatter',
        showlegend: false
    };
}

/**
 * Updates the slope error line traces to reflect changes in stored variables.
 * @post Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateSlopeErrorLines() {
    slopeUpperBound = {
        x: [0, 10],
        y: [0, (m+mError)*10],
        mode: 'lines',
        line: {
            dash: 'dash',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        name: 'm error',
        visible: mErrorLinesVisible
    };

    slopeLowerBound = {
        x: [0, 10],
        y: [0, (m-mError)*10],
        mode: 'lines',
        line: {
            dash: 'dash',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        showlegend: false,
        visible: mErrorLinesVisible
    };
}

function updateYErrorLines() {
    let err = totalError();
    yUpperBound = {
        x: [0, 10],
        y: [m*x + err, m*x + err],
        mode: 'lines',
        line: {
            dash: 'dashdot',
            width: 4,
            color: 'rgb(0, 153, 51)'
        },
        visible: yErrorLinesVisible,
        name: 'y error'
    };

    yLowerBound = {
        x: [0, 10],
        y: [m*x - err, m*x - err],
        mode: 'lines',
        line: {
            dash: 'dashdot',
            width: 4,
            color: 'rgb(0, 153, 51)'
        },
        visible: yErrorLinesVisible,
        showlegend: false
    };
}

function updateXErrorLines() {
    leftBound = {
        x: [x - xError, x - xError],
        y: [0, 10],
        mode: 'lines',
        line: {
            dash: 'dash',
            width: 2,
            color: 'rgb(0, 0, 225)'
        },
        visible: xErrorLinesVisible,
        name: 'x error'
    };

    rightBound = {
        x: [x + xError, x + xError],
        y: [0, 10],
        mode: 'lines',
        line: {
            dash: 'dash',
            width: 2,
            color: 'rgb(0, 0, 225)'
        },
        visible: xErrorLinesVisible,
        showlegend: false
    };
}

function updateY_xErrorLines() {
    let errY_x = errorFromX();
    y_xUpperBound = {
        x: [0, 10],
        y: [m*x + errY_x, m*x + errY_x],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(0, 0, 225)'
        },
        visible: y_xErrorLinesVisible,
        name: 'y_x error'
    };

    y_xLowerBound = {
        x: [0, 10],
        y: [m*x - errY_x, m*x - errY_x],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(0, 0, 225)'
        },
        visible: y_xErrorLinesVisible,
        showlegend: false
    };
}

function updateY_mErrorLines() {
    let errY_m = errorFromSlope();
    y_mUpperBound = {
        x: [0, 10],
        y: [m*x + errY_m, m*x + errY_m],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        visible: y_mErrorLinesVisible,
        name: 'y_m error'
    };

    y_mLowerBound = {
        x: [0, 10],
        y: [m*x - errY_m, m*x - errY_m],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        visible: y_mErrorLinesVisible,
        showlegend: false
    };
}

/**
 * Updates the traces for the propagated error bar graph.
 */
function updateErrorGraph() {
    propErrX = {
        x: ['proportion of total error'],
        y: [Math.pow(errorFromX()/totalError(), 2)],
        text: ['y_x error'],
        textposition: 'auto',
        hoverinfo: 'none',
        type: 'bar',
        marker: {color: 'rgb(0, 0, 225)'}
    };

    propErrSlope = {
        x: ['proportion of total error'],
        y: [Math.pow(errorFromSlope()/totalError(),2)],
        text: ['y_m error'],
        textposition: 'auto',
        hoverinfo: 'none',
        type: 'bar',
        marker: {color: 'rgb(255, 0, 0)'}
    };
}

/**
 * Refreshes the data array and calls Plotly.react to make changes appear on graph.
 * Also refreshes the propagated error bar graph.
 */
function refreshGraph() {
    data = [
        trace0,
        trace1,
        leftBound,
        rightBound,
        slopeUpperBound,
        slopeLowerBound,
        yUpperBound,
        yLowerBound,
        y_xUpperBound,
        y_xLowerBound,
        y_mUpperBound,
        y_mLowerBound
    ];

    Plotly.react(graph, data, layout);

    errorData = [
        propErrX,
        propErrSlope
    ];

    Plotly.react(errorGraph, errorData, errorGraphLayout);
}