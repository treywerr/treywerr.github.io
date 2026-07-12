/* ----- Variables ------- */
var x = 5;
var xError = 1;
var m = 2;
var mError = 1;
var b = 2;
var bError = 0.5;

var numSteps = 1000;
var stepSize = 10/numSteps;
var xCoords = [];
var yCoords = [];
for (let i = 0; i < numSteps; i++) {
    xCoords[i] = i*stepSize;
}

var ranges = [[-20,1500],[-20,500],[-10,20],[-0.5,1]];
var rangeIndex = 1;

/* ------ Trace and Error Methods ------- */

/**
 * Calculates y = mx^b
 * @param {number} x - the x coordinate to calculate from
 * @return {number} The y coordinate of the point.
 */
function powerLaw(x) {
    return m*Math.pow(x, b);
}

/**
 * Calculates the error on y from variable m
 * @return {number}
 */
function errorFromM() {
    let partial = Math.pow(x, b);
    return Math.abs(partial*mError);
}

/**
 * Calculates the error on y from x.
 * @return {number}
 */
function errorFromX() {
    let partial = b*m*Math.pow(x, b-1);
    return Math.abs(partial*xError);
}

/**
 * Calculates the error on y from variable b.
 * @return {number}
 */
function errorFromB() {
    let partial = m*Math.pow(x, b)*Math.log(Math.abs(x));
    return Math.abs(partial*bError);
}

/**
 * Calculates the total error on y.
 * @return {number}
 */
function totalError() {
    let del_x = errorFromX();
    let del_m = errorFromM();
    let del_b = errorFromB();
    return Math.sqrt(del_x*del_x + del_m*del_m + del_b*del_b);
}


/* -------------- Initial Graph Setup ---------------- */

var trace0;
updateTrace0();

var currentY; // Stores the current y coordinate of the measurement point. Updates value in updateTrace1()
var trace1;
updateTrace1();

var mErrorLinesVisible = false;
var mUpperBound, mLowerBound;
updateMErrorLines();

var bErrorLinesVisible = false;
var bUpperBound, bLowerBound;
updateBErrorLines();

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

var y_bErrorLinesVisible = false;
var y_bUpperBound, y_bLowerBound;
updateY_bErrorLines();

var data = [
    trace0,
    trace1
];

var layout;
updateLayout();

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

var propErrX, propErrM, propErrB;
updateErrorGraph();

var errorData = [propErrX, propErrM, propErrB];

errorGraph = document.getElementById('errorGraph');
Plotly.newPlot(errorGraph, errorData, errorGraphLayout, {staticPlot: true});

/* ------------Update Graph On Input-------------- */


/* ---------oninput functions---------- */

var largeScale = document.getElementById('large');
largeScale.oninput = function() {
    rangeIndex = 0;
    updateLayout();

    refreshGraph();
}

var mediumScale = document.getElementById('medium');
mediumScale.oninput = function() {
    rangeIndex = 1;
    updateLayout();

    refreshGraph();
}

var smallScale = document.getElementById('small');
smallScale.oninput = function() {
    rangeIndex = 2;
    updateLayout();

    refreshGraph();
}

var tinyScale = document.getElementById('tiny');
tinyScale.oninput = function() {
    rangeIndex = 3;
    updateLayout();

    refreshGraph();
}

function updateLayout() {
    layout = {
        showlegend: true,
        legend: {
            x: 0,
            xanchor: 'left',
            y: 1,
            bgcolor: 'rgba(0,0,0,0)'
        },
        margin: {
            l: 30,
            r: 20,
            t: 20,
            b: 20
        },
        xaxis: {
            range: [0, 10],
            autorange: false
        },
        yaxis: {
            range: ranges[rangeIndex],
            autorange: false
        }
    };
}

var xSlider = document.getElementById('xSlider');
xSlider.oninput = function() {
    x = 10*(xSlider.value/1000);

    updateTrace1();
    updateYErrorLines();
    updateXErrorLines();
    updateY_xErrorLines();
    updateY_mErrorLines();
    updateY_bErrorLines();
    updateErrorGraph();

    refreshGraph();
}

var xErrorSlider = document.getElementById('xErrorSlider');
xErrorSlider.oninput = function() {
    xError = 2*(xErrorSlider.value/100);
    document.getElementById('xErrorValue').innerHTML = "<b>Change the uncertainty on x</b> Current value: " + xError.toFixed(2);

    updateTrace1();
    updateYErrorLines();
    updateXErrorLines();
    updateY_xErrorLines();
    updateErrorGraph();

    refreshGraph();
}

var mSlider = document.getElementById('mSlider');
mSlider.oninput = function() {
    m = 4*(mSlider.value/100);
    document.getElementById('mValue').innerHTML = "<b>Change the value of the coefficient m</b> Current value: " + m.toFixed(2);

    updateTrace0();
    updateTrace1();
    updateMErrorLines();
    updateBErrorLines();
    updateYErrorLines();
    updateY_xErrorLines();
    updateY_mErrorLines();
    updateY_bErrorLines();
    updateErrorGraph();

    refreshGraph();
}

var mErrorSlider = document.getElementById('mErrorSlider');
mErrorSlider.oninput = function() {
    mError = 2*(mErrorSlider.value/100);
    document.getElementById('mErrorValue').innerHTML = "<b>Change the uncertainty on the coefficient m</b> Current value: " + mError.toFixed(2);

    updateTrace1();
    updateMErrorLines();
    updateYErrorLines();
    updateY_mErrorLines();
    updateErrorGraph();

    refreshGraph();
}

var bSlider = document.getElementById('bSlider');
bSlider.oninput = function() {
    b = 4*(bSlider.value/200) - 2;
    document.getElementById('bValue').innerHTML = "<b>Change the exponent b</b> Current value: " + b.toFixed(2);

    updateTrace0();
    updateTrace1();
    updateMErrorLines();
    updateBErrorLines();
    updateYErrorLines();
    updateY_xErrorLines();
    updateY_mErrorLines();
    updateY_bErrorLines();
    updateErrorGraph();

    refreshGraph();
}

var bErrorSlider = document.getElementById('bErrorSlider');
bErrorSlider.oninput = function() {
    bError = bErrorSlider.value/100;
    document.getElementById('bErrorValue').innerHTML = "<b>Change the uncertainty on the exponent b</b> Current value: " + bError.toFixed(2);

    updateTrace1();
    updateBErrorLines();
    updateYErrorLines();
    updateY_bErrorLines();
    updateErrorGraph();

    refreshGraph();
}

var mErrorLines = document.getElementById('mErrorLines');
mErrorLines.oninput = function() {
    mErrorLinesVisible = mErrorLines.checked;

    updateMErrorLines();
    refreshGraph();
}

var bErrorLines = document.getElementById('bErrorLines');
bErrorLines.oninput = function() {
    bErrorLinesVisible = bErrorLines.checked;

    updateBErrorLines();
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

var y_bErrorLines = document.getElementById('y_bErrorLines');
y_bErrorLines.oninput = function() {
    y_bErrorLinesVisible = y_bErrorLines.checked;

    updateY_bErrorLines();
    refreshGraph();
}

/* ---------trace update functions--------- */

function updateTrace0() {
    yCoords = [];

    for (let i = 0; i <= numSteps; i++) {
        yCoords[i] = powerLaw(xCoords[i]);
    }

    trace0 = {
        x: xCoords,
        y: yCoords,
        mode: 'lines',
        name: 'y = mx^b'
    };
}

function updateTrace1() {
    currentY = powerLaw(x);
    trace1 = {
        x: [x],
        y: [currentY],
        mode: 'scatter',
        error_y: {
            type: 'constant',
            value: totalError()
        },
        error_x: {
            type: 'constant',
            value: xError
        }
    };
}

function updateMErrorLines() {
    let yCoordsUp = [];
    let yCoordsLow = [];

    for (let i = 0; i <= numSteps; i++) {
        yCoordsUp[i] = (m+mError)*Math.pow(xCoords[i], b);
        yCoordsLow[i] = (m-mError)*Math.pow(xCoords[i], b);
    }

    mUpperBound = {
        x: xCoords,
        y: yCoordsUp,
        mode: 'lines',
        line: {
            width: 2,
            color: 'rgb(51, 204, 204)',
            dash: 'dash'
        },
        visible: mErrorLinesVisible,
        name: 'm error'
    };

    mLowerBound = {
        x: xCoords,
        y: yCoordsLow,
        mode: 'lines',
        line: {
            width: 2,
            color: 'rgb(51, 204, 204)',
            dash: 'dash'
        },
        visible: mErrorLinesVisible,
        name: 'm error',
        showlegend: false
    };
}

function updateBErrorLines() {
    let yCoordsUp = [];
    let yCoordsLow = [];

    for (let i = 0; i <= numSteps; i++) {
        yCoordsUp[i] = m*Math.pow(xCoords[i], b+bError);
        yCoordsLow[i] = m*Math.pow(xCoords[i], b-bError);
    }

    bUpperBound = {
        x: xCoords,
        y: yCoordsUp,
        mode: 'lines',
        line: {
            width: 2,
            color: 'rgb(255, 0, 0)',
            dash: 'dash'
        },
        visible: bErrorLinesVisible,
        name: 'b error'
    };

    bLowerBound = {
        x: xCoords,
        y: yCoordsLow,
        mode: 'lines',
        line: {
            width: 2,
            color: 'rgb(255, 0, 0)',
            dash: 'dash'
        },
        visible: bErrorLinesVisible,
        name: 'b error',
        showlegend: false
    };
}

function updateYErrorLines() {
    let err = totalError();
    yUpperBound = {
        x: [0, 10],
        y: [currentY+err, currentY+err],
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
        y: [currentY-err, currentY-err],
        mode: 'lines',
        line: {
            dash: 'dashdot',
            width: 4,
            color: 'rgb(0, 153, 51)'
        },
        visible: yErrorLinesVisible,
        showlegend: false
    }
}

function updateXErrorLines() {
    
    leftBound = {
        x: [x-xError, x-xError],
        y: ranges[0], // Set to largest range to cover whole graph vertically
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
        x: [x+xError, x+xError],
        y: ranges[0],
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
    let y_xError = errorFromX();
    y_xUpperBound = {
        x: [0, 10],
        y: [currentY+y_xError, currentY+y_xError],
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
        y: [currentY-y_xError, currentY-y_xError],
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
    let y_mError = errorFromM();
    y_mUpperBound = {
        x: [0, 10],
        y: [currentY+y_mError, currentY+y_mError],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(51, 204, 204)'
        },
        visible: y_mErrorLinesVisible,
        name: 'y_m error'
    };

    y_mLowerBound = {
        x: [0, 10],
        y: [currentY-y_mError, currentY-y_mError],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(51, 204, 204)'
        },
        visible: y_mErrorLinesVisible,
        showlegend: false
    };
}

function updateY_bErrorLines() {
    let y_bError = errorFromB();
    y_bUpperBound = {
        x: [0, 10],
        y: [currentY+y_bError, currentY+y_bError],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        visible: y_bErrorLinesVisible,
        name: 'y_b error'
    };

    y_bLowerBound = {
        x: [0, 10],
        y: [currentY-y_bError, currentY-y_bError],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        visible: y_bErrorLinesVisible,
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

    propErrM = {
        x: ['proportion of total error'],
        y: [Math.pow(errorFromM()/totalError(), 2)],
        text: ['y_m error'],
        textposition: 'auto',
        hoverinfo: 'none',
        type: 'bar',
        marker: {color: 'rgb(51, 204, 204)'}
    };

    propErrB = {
        x: ['proportion of total error'],
        y: [errorFromB()/totalError()],
        text: ['y_b error'],
        textposition: 'auto',
        hoverinfo: 'none',
        type: 'bar',
        marker: {color: 'rgb(255, 0, 0)'}
    };
}

function refreshGraph() {
    data = [
        trace0,
        trace1,
        leftBound,
        rightBound,
        mUpperBound,
        mLowerBound,
        bUpperBound,
        bLowerBound,
        yUpperBound,
        yLowerBound,
        y_xUpperBound,
        y_xLowerBound,
        y_mUpperBound,
        y_mLowerBound,
        y_bUpperBound,
        y_bLowerBound
    ];

    Plotly.react(graph, data, layout);

    errorData = [propErrX, propErrM, propErrB];

    Plotly.react(errorGraph, errorData, errorGraphLayout);
}