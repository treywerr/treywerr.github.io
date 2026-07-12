
/* ----- Variables and Constants ------- */
const G = 9.8; // acceleration due to gravity
var theta = Math.PI*(3/8); // the launch angle measured in radians
var thetaError = 0.025;
var v = 10; // initial velocity
var vError = .5;

var numSteps = 100;
var stepSize;
var xCoords = [];
var yCoords = [];

/* ------ Projectile Path Methods ------- */

/**
 * Calculates the vertical position of the projectile at a given horizontal position.
 * @param {number} x - The horizontal position of the projectile (meters)
 * @return {number} The vertical position of the projectile.
 */
function projectileHeight(x, theta0, v0) {
    return ( Math.tan(theta0)*x) - ( (G*x*x) / (2*v0*v0*Math.cos(theta0)*Math.cos(theta0)) );
}

/**
 * Calculates where the projectile will land given an initial velocity and launch angle.
 * @return {number} The landing distance of the projectile.
 */
function landingDistance(theta0, v0) {
    return v0*v0*Math.sin(2*theta0)/G;
}

/**
 * Calculates the maximum horizontal distance the projectile can cover.
 * @return {number} The horizontal range of the projectile in meters.
 */
function horizontalRange() {
    return v*v/G;
}

/**
 * Calculates the maximum vertical distance the projectile can cover.
 * @return {number} The vertical range of the projectile in meters.
 */
function verticalRange() {
    return (v*v)/(2*G);
}

/**
 * Calculates the error on the landing position due to uncertainty on initial velocity.
 * @return {number}
 */
function errorFromVelocity() {
    let partial = 2*v*Math.sin(2*theta)/G;
    let error = partial*vError;
    return Math.abs(partial*vError);
}

/**
 * Calculates the error on the landing position due to uncertainty on the launch angle.
 * @return {number}
 */
function errorFromAngle() {
    let partial = 2*v*v*Math.cos(2*theta)/G;
    let error = partial*thetaError;
    return Math.abs(partial*thetaError);
}

/**
 * Calculates the total uncertainty on the landing position.
 * @return {number} the total error on x.
 */
function totalError() {
    let delX_v = errorFromVelocity();
    let delX_theta = errorFromAngle();
    let error = Math.sqrt( (delX_v*delX_v) + (delX_theta*delX_theta) );
    return error;
}


/* -------------- Initial Graph Setup ---------------- */

var projectile;
updateProjectilePath();

var target;
updateTarget();

var tErrorUpperBound, tErrorLowerBound;
var tErrorBoundsVisible = false;
updateThetaErrorBounds();

var vErrorUpperBound, vErrorLowerBound;
var vErrorBoundsVisible = false;
updateVelocityErrorBounds();

var data = [
    projectile,
    target
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
        range: [-10, 50],
        autorange: false
    },
    yaxis: {
        range: [0, 25],
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

var propErrV, propErrTheta;
updateErrorGraph();

var errorData = [
    propErrV,
    propErrTheta
];

errorGraph = document.getElementById('errorGraph');
Plotly.newPlot(errorGraph, errorData, errorGraphLayout, {staticPlot: true});

/* ------------Update Graph On Input-------------- */


/* ---------oninput functions---------- */

var velocityMax = 20;
var velocitySlider = document.getElementById('velocitySlider');
velocitySlider.oninput = function() {
    v = velocityMax*(velocitySlider.value/100);
    document.getElementById('velocityValue').innerHTML = "<b>Change the launch velocity</b> Current value: " + v.toFixed(2) + " m/s";
    updateGraph();
}

var velocityErrorMax = 1;
var velocityErrorSlider = document.getElementById('velocityErrorSlider');
velocityErrorSlider.oninput = function() {
    vError = velocityErrorMax*(velocityErrorSlider.value/100);
    document.getElementById('velocityErrorValue').innerHTML = "<b>Change the uncertainty on the launch velocity</b> Current value: " + vError.toFixed(2) + " m/s";
    updateGraph();
}

var angleMax = Math.PI/2;
var angleSlider = document.getElementById('angleSlider');
angleSlider.oninput = function() {
    theta = angleMax*(angleSlider.value/100);
    document.getElementById('thetaValue').innerHTML = "<b>Change the launch angle</b> Current value: " + (theta * (180/Math.PI)).toFixed(2) + "&deg;";
    updateGraph();
}

var angleErrorMax = 0.05;
var angleErrorSlider = document.getElementById('angleErrorSlider');
angleErrorSlider.oninput = function() {
    thetaError = angleErrorMax*(angleErrorSlider.value/100);
    document.getElementById('angleErrorValue').innerHTML = "<b>Change the uncertainty in the launch angle</b> Current value: " + (thetaError * (180/Math.PI)).toFixed(2) + "&deg;";
    updateGraph();
}

var vErrorLines = document.getElementById('vErrorLines');
vErrorLines.oninput = function() {
    vErrorBoundsVisible = vErrorLines.checked;

    updateVelocityErrorBounds();
    refreshGraph();
}

var tErrorLines = document.getElementById('thetaErrorLines');
tErrorLines.oninput = function() {
    tErrorBoundsVisible = tErrorLines.checked;

    updateThetaErrorBounds();
    refreshGraph();
}


/* ---------trace update functions--------- */

/**
 * Updates the path of the projectile.
 */
function updateProjectilePath() {
    stepSize = landingDistance(theta, v)/numSteps;
    xCoords = [];
    yCoords = [];

    for (var i = 0; i <= numSteps; i++) {
        xCoords[i] = i*stepSize;
        yCoords[i] = projectileHeight(xCoords[i], theta, v);
    }

    projectile = {
        x: xCoords,
        y: yCoords,
        mode: 'lines',
        name: 'trajectory'
    };
}

function updateThetaErrorBounds() {
    let stepSizeUpper = landingDistance(theta+thetaError, v)/numSteps;
    let stepSizeLower = landingDistance(theta-thetaError, v)/numSteps;
    let xCoords_upper = [];
    let yCoords_upper = [];
    let xCoords_lower = [];
    let yCoords_lower = [];
    
    for (var i = 0; i <= numSteps; i++) {
        xCoords_upper[i] = i*stepSizeUpper;
        yCoords_upper[i] = projectileHeight(xCoords_upper[i], theta+thetaError, v);
        xCoords_lower[i] = i*stepSizeLower;
        yCoords_lower[i] = projectileHeight(xCoords_lower[i], theta-thetaError, v);
    }

    tErrorUpperBound = {
        x: xCoords_upper,
        y: yCoords_upper,
        mode: 'lines',
        line: {
            dash: 'dash',
            width: 2,
            color: 'rgb(51, 204, 204)'
        },
        visible: tErrorBoundsVisible,
        name: 'angle error'
    };
    tErrorLowerBound = {
        x: xCoords_lower,
        y: yCoords_lower,
        mode: 'lines',
        line: {
            dash: 'dash',
            width: 2,
            color: 'rgb(51, 204, 204)'
        },
        visible: tErrorBoundsVisible,
        showlegend: false
    };
}

function updateVelocityErrorBounds() {
    let stepSizeUpper = landingDistance(theta, v+vError)/numSteps;
    let stepSizeLower = landingDistance(theta, v-vError)/numSteps;
    let xCoords_upper = [];
    let yCoords_upper = [];
    let xCoords_lower = [];
    let yCoords_lower = [];
    
    for (var i = 0; i <= numSteps; i++) {
        xCoords_upper[i] = i*stepSizeUpper;
        yCoords_upper[i] = projectileHeight(xCoords_upper[i], theta, v+vError);
        xCoords_lower[i] = i*stepSizeLower;
        yCoords_lower[i] = projectileHeight(xCoords_lower[i], theta, v-vError);
    }

    vErrorUpperBound = {
        x: xCoords_upper,
        y: yCoords_upper,
        mode: 'lines',
        line: {
            dash: 'dash',
            width: 2,
            color: 'rgb(0, 153, 51)'
        },
        visible: vErrorBoundsVisible,
        name: 'v error'
    };
    vErrorLowerBound = {
        x: xCoords_lower,
        y: yCoords_lower,
        mode: 'lines',
        line: {
            dash: 'dash',
            width: 2,
            color: 'rgb(0, 153, 51)'
        },
        visible: vErrorBoundsVisible,
        showlegend: false
    };
}

/**
 * Updates the landing target for the projectile.
 */
function updateTarget() {
    target = {
        x: [xCoords[100]],
        y: [yCoords[100]],
        line: {
            color: 'rgb(255, 0, 0)'
        },
        error_x: {
            type: 'constant',
            value: totalError(),
            thickness: 6,
            width: 8,
            color: 'red'
        },
        name: 'landing range'
    };
}

/**
 * Updates the traces for the propagated error bar graph.
 */
function updateErrorGraph() {
    propErrV = {
        x: ['proportion of total error'],
        y: [Math.pow(errorFromVelocity()/totalError(),2)],
        text: ['x_v error'],
        textposition: 'auto',
        hoverinfo: 'none',
        type: 'bar',
        marker: {color: 'rgb(0, 153, 51)'}
    };

    propErrTheta = {
        x: ['proportion of total error'],
        y: [Math.pow(errorFromAngle()/totalError(),2)],
        text: ['x_angle error'],
        textposition: 'auto',
        hoverinfo: 'none',
        type: 'bar',
        marker: {color: 'rgb(51, 204, 204)'}
    };
}

/**
 * Updates all elements on the graph to reflect changes caused by user input.
 */
function updateGraph() {
    
    updateProjectilePath();

    updateThetaErrorBounds();
    
    updateVelocityErrorBounds();

    updateTarget();

    updateErrorGraph();
    
    refreshGraph();
}

/**
 * Refreshes the data array and calls Plotly.react to make changes appear on graph.
 * Also refreshes the propagated error graph.
 */
function refreshGraph() {
    data = [
        projectile,
        target,
        vErrorUpperBound,
        vErrorLowerBound,
        tErrorUpperBound,
        tErrorLowerBound
    ];

    Plotly.react(graph, data, layout);

    errorData = [
        propErrV,
        propErrTheta
    ];

    Plotly.react(errorGraph, errorData, errorGraphLayout);
}