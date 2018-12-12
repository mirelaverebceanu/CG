var gl;

var RLoc;
var SLoc;
var TLoc;

var vertices = [];
var colors = [];
var program;
var normals = [];

var sphere;
var cone;
var cylinder;
var cube;

var objMenu;
var objects={};
var keyOfLastCreatedObj;

var near = 0.3;
var far = 3.0;
// var radius = 4.0;
var theta  = 0.0;
var phi    = 0.0;
// var dr = 5.0 * Math.PI/180.0;
var eyez =2;
var eyey =-1;
var eyex =-1;
var  fovy = 50.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = -1.0;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, -1.0, 0.0);

var lightLocation;
var lightAmbientLocation;
var lightDiffuseLocation;
var lightSpecularLocation;

var lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );


var materialAmbient = vec4( 0.05, 0.0, 0.0, 1.0 );
var materialDiffuse = vec4( 0.05, 0.4, 0.4, 1.0 );
var materialSpecular = vec4( 0.1, 0.04, 0.05, 1.0 );
var materialShininess = 0.78125;


var ambientColor, diffuseColor, specularColor;



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

function materialChange(){
    var selectedMaterial = materialMenu.selectedIndex;

    switch(selectedMaterial){
        case 0:
         materialAmbient = vec4( 0.05, 0.0, 0.0, 1.0 );
         materialDiffuse = vec4( 0.05, 0.4, 0.4, 1.0 );
         materialSpecular = vec4( 0.1, 0.04, 0.05, 1.0 );
         materialShininess = 0.78125;
        
        break;

        case 1:
         materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
         materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
         materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
         materialShininess = 20.0;
         
        break;

         case 2:
         materialAmbient = vec4( 0.25, 0.25, 0.25, 1.0 );
         materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0 );
         materialSpecular = vec4( 0.774597, 0.774597,   0.774597, 1.0 );
         materialShininess = 0.6;

        break;

    }
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

    var normalsId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalsId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
    

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

    // aspect =  canvas.width/canvas.height;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //
    gl.enable(gl.DEPTH_TEST);




    // Prepare shaders
    //  Load shaders and initialize attribute buffers

    program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    eye = vec3(eyex , eyey, eyez);

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

   

    // Prepare objects
    objects["sphere"] = new Sphere(0, 0.7, 4, [1,0,1,1] );
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

    var normalsId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalsId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    lightPositionLocation=gl.getUniformLocation(program,"lightPosition");
    lightAmbientLocation=gl.getUniformLocation(program,"ambientProduct");
    lightDiffuseLocation=gl.getUniformLocation(program,"diffuseProduct");
    lightSpecularLocation=gl.getUniformLocation(program,"specularProduct");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );


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

    // gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
    //    false, flatten(projection));

    objMenu = document.getElementById("objMenu");
    var visibleChkB = document.getElementById("visibleChkB");
    var colorMenu= document.getElementById("colorMenu")
    var materialMeniu = document.getElementById("materialMenu")

    // sliders for viewing parameters

    // document.getElementById("zFarSlider").onchange = function(event) {
    //     far = event.target.value;
    // };
    // document.getElementById("zNearSlider").onchange = function(event) {
    //     near = event.target.value;
    // };
    // document.getElementById("radiusSlider").onchange = function(event) {
    //    radius = event.target.value;
    // };
    // document.getElementById("thetaSlider").onchange = function(event) {
    //     theta = event.target.value* Math.PI/180.0;
    // };
    // document.getElementById("phiSlider").onchange = function(event) {
    //     phi = event.target.value* Math.PI/180.0;
    // };
    // document.getElementById("aspectSlider").onchange = function(event) {
    //     aspect = event.target.value;
    // };
    // document.getElementById("fovSlider").onchange = function(event) {
    //     fovy = event.target.value;
    // };
    document.getElementById("eyexSlider").oninput = function(event) {
        eye[0] = +(event.target.value);
        modelViewMatrix = lookAt(eye, at , up);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
      };
      document.getElementById("eyeySlider").oninput = function(event) {
        eye[1] = +(event.target.value);
        modelViewMatrix = lookAt(eye, at , up);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        };
      document.getElementById("eyezSlider").oninput = function(event) {
        eye[2] = +(event.target.value);
        modelViewMatrix = lookAt(eye, at , up);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        };
    //
      document.getElementById("LpX").oninput = function(event) {
      //  LpX = event.target.value;
      lightPosition = vec4(+(event.target.value), lightPosition[1], lightPosition[2], 1.0);
      gl.uniform4fv(lightPositionLocation, flatten(lightPosition));
    };
    document.getElementById("LpY").oninput = function(event) {
        //  LpX = event.target.value;
        lightPosition = vec4(lightPosition[0], +(event.target.value), lightPosition[2], 1.0);
        gl.uniform4fv(lightPositionLocation, flatten(lightPosition));
      };
    document.getElementById("LpZ").oninput = function(event) {
        //  LpX = event.target.value;
        lightPosition = vec4(lightPosition[0], lightPosition[1], +(event.target.value), 1.0);
        gl.uniform4fv(lightPositionLocation, flatten(lightPosition));
      };
    //



    // get and transmit data

    var render = function(){
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        

    normalMatrix = [
            vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
            vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
            vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
        ];

        

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    gl.uniform4fv(lightPositionLocation, flatten(lightPosition));
    gl.uniform4fv(lightAmbientLocation, flatten(lightAmbient));
    gl.uniform4fv(lightDiffuseLocation, flatten(lightDiffuse));
    gl.uniform4fv(lightSpecularLocation, flatten(lightSpecular));

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );

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