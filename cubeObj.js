class Cube {
    constructor(startId, radius, height, color){
        this.startId = startId;
        this.count = 0;
        this.radius = radius;
        this.height = height;
        this.color = color;
        

        this.R = rotate(30, [1, 0, 1]);
        this.S = scalem(0.3, 0.3, 1.0);
        this.T = translate(-0.6, 0.4, 0.0);

        this.calculateCube();
    }

    changeColor(color){
        this.color=color;
        for (var i=this.startId; i<this.startId+this.count; i++){
            colors[i]=color;
        }
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

    }



calculateCube(){
   
            vertices.push(vec4(this.radius,0,this.radius,1));
            vertices.push(vec4(this.radius,0,-this.radius,1));
            vertices.push(vec4(-this.radius,0,-this.radius,1));
            vertices.push(vec4(-this.radius,0,-this.radius,1));
            vertices.push(vec4(-this.radius,0,this.radius,1));
            vertices.push(vec4(this.radius,0,this.radius,1));
      
            vertices.push(vec4(this.radius,0,this.radius,1));
            vertices.push(vec4(this.radius,0,-this.radius,1));
            vertices.push(vec4(this.radius,this.height,this.radius,1));
            vertices.push(vec4(this.radius,0,-this.radius,1));
            vertices.push(vec4(this.radius,this.height,-this.radius,1));
            vertices.push(vec4(this.radius,this.height,this.radius,1));

            vertices.push(vec4(this.radius,0,this.radius,1));
            vertices.push(vec4(-this.radius,0,this.radius,1));
            vertices.push(vec4(this.radius,this.height,this.radius,1));
            vertices.push(vec4(-this.radius,0,this.radius,1));
            vertices.push(vec4(-this.radius,this.height,this.radius,1));
            vertices.push(vec4(this.radius,this.height,this.radius,1));

            vertices.push(vec4(-this.radius,0,this.radius,1));
            vertices.push(vec4(-this.radius,0,-this.radius,1));
            vertices.push(vec4(-this.radius,this.height,this.radius,1));
            vertices.push(vec4(-this.radius,0,-this.radius,1));
            vertices.push(vec4(-this.radius,this.height,-this.radius,1));
            vertices.push(vec4(-this.radius,this.height,this.radius,1));

            vertices.push(vec4(-this.radius,0,-this.radius,1));
            vertices.push(vec4(this.radius,0,-this.radius,1));
            vertices.push(vec4(-this.radius,this.height,-this.radius,1));
            vertices.push(vec4(this.radius,0,-this.radius,1));
            vertices.push(vec4(-this.radius,this.height,-this.radius,1));
            vertices.push(vec4(this.radius,this.height,-this.radius,1));

            vertices.push(vec4(this.radius,this.height,this.radius,1));
            vertices.push(vec4(this.radius,this.height,-this.radius,1));
            vertices.push(vec4(-this.radius,this.height,-this.radius,1));
            vertices.push(vec4(-this.radius,this.height,-this.radius,1));
            vertices.push(vec4(-this.radius,this.height,this.radius,1));
            vertices.push(vec4(this.radius,this.height,this.radius,1));

              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,1,0,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(0,0,1,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
              colors.push(vec4(1,0,0,1));
            

            this.count += 36;
        
    }

    draw(){
        gl.uniformMatrix4fv(RLoc, false, flatten(this.R));
        gl.uniformMatrix4fv(SLoc, false, flatten(this.S));
        gl.uniformMatrix4fv(TLoc, false, flatten(this.T));
        gl.drawArrays(gl.TRIANGLES, this.startId, this.count);
    }
}
