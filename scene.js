var gl;

var RLoc;
var SLoc;
var TLoc;

var vertices = [];
var colors = [];
var program;

var sphere;
var cone;
var cylinder;
var cube;

var objMenu;
var objects={};
var keyOfLastCreatedObj;

function colorChange(){
    var selectedColor = colorMenu.selectedIndex;
    var rgb;

    switch (selectedColor){
        case 0:
        rgb=vec4(1,0,0,1);
        break;

        case 1:
        rgb=vec4(0,1,0,1);
        break;

        case 2:
        rgb=vec4(0,0,1,1);
        break;
    }
    var key = objMenu.options[objMenu.selectedIndex].value;
    objects[key].changeColor(rgb);

}

function addNewObject(){
    var id = document.getElementById("objId").value;
    var selectedType= document.getElementById("objType");
    var type=selectedType[selectedType.selectedIndex].value;
    switch (type){
        case "sphere": 
        objects[id]=new Sphere(objects[keyOfLastCreatedObj].startId+objects[keyOfLastCreatedObj].count, 0.5, 20, [Math.random(),Math.random(),Math.random(),1]);
        break;
        case "cone": 
        objects[id]=new Cone(objects[keyOfLastCreatedObj].startId+objects[keyOfLastCreatedObj].count, 0.5, 0.5, 10, [Math.random(),Math.random(),Math.random(),1]);
        break;
        case "cylinder":    
        objects[id]=new Cylinder(objects[keyOfLastCreatedObj].startId+objects[keyOfLastCreatedObj].count, 0.7,0.7, 20, [Math.random(),Math.random(),Math.random(),1]);
        break; 
        case "cube":    
        objects[id]=new Cube(objects[keyOfLastCreatedObj].startId+objects[keyOfLastCreatedObj].count, 0.5,0.5, [Math.random(),Math.random(),Math.random(),1]);
        break; 

    }

    // add the option at the end of drop down list
    var x = document.getElementById("objMenu");
    var option = document.createElement("option");
    option.text = id;
    x.add(option);

    //load data into GPU
    var verticesId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorsId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor); 
    
    //draw the new object
    objects[id].draw();
    keyOfLastCreatedObj=id;
}
        
 

window.onload = function init(){
    var canvas = document.getElementById("canvas_id");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('webgl');
    }
    if(!gl){
        alert('Your browser does not support WebGL');
    }
    
    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    //
    gl.enable(gl.DEPTH_TEST);


    // Prepare shaiders
    program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    // Prepare objects
    objects["sphere"] = new Sphere(0, 0.5, 10, [1,0,1,1] );
    objects["cone"] = new Cone(objects["sphere"].startId+objects["sphere"].count, 0.5, 1, 10, [0,1,1,1]);
    objects["cylinder"] = new Cylinder(objects["cone"].startId+objects["cone"].count, 0.5, 0.5, 20, [1,0,0,1]);
    objects["cube"] = new Cube(objects["cylinder"].startId+objects["cylinder"].count, 0.6, 0.6, [1,1,0,1]);
    keyOfLastCreatedObj="cube";

    //Load data into GPU
    var verticesId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorsId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    RLoc = gl.getUniformLocation(program, "R");
    SLoc = gl.getUniformLocation(program, "S");
    TLoc = gl.getUniformLocation(program, "T");


    var TLR = document.getElementById("TLR");
    var TUD = document.getElementById("TUD");
    var TFB = document.getElementById("TFB");

    var SX = document.getElementById("SX");
    var SY = document.getElementById("SY");
    var SZ = document.getElementById("SZ");

    var RX = document.getElementById("RX");
    var RY = document.getElementById("RY");
    var RZ = document.getElementById("RZ");
    var R = mat4();

    objMenu = document.getElementById("objMenu");
    var visibleChkB = document.getElementById("visibleChkB");
    var colorMenu= document.getElementById("colorMenu")

    // get and transmit data

    var render = function(){
        gl.clear(gl.COLOR_BUFFER_BIT);

        if(+SX.value == 0) SX.value = "0.5";
        if(+SY.value == 0) SY.value = "0.5";
        if(+SZ.value == 0) SZ.value = "0.5";

        R = mult(rotateZ(+RZ.value), rotateY(+RY.value));
        R = mult(R, rotateX(+RX.value));

        var key = objMenu.options[objMenu.selectedIndex].value;
        
                objects[key].T = translate(+TLR.value, +TUD.value, +TFB.value);
                if(visibleChkB.checked == true){
                    objects[key].S = scalem(+SX.value, +SY.value, +SZ.value);
                } else {
                    objects[key].S = scalem(0.0, 0.0, 0.0);
                }
                objects[key].R = R;   

      for (var key in objects){
        objects[key].draw();
      }
        window.requestAnimFrame(render);
    };

    render();
};