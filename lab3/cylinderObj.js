class Cylinder {
    constructor(startId, radius, height, delta, color){
        this.startId = startId;
        this.count = 0;
        this.color = color;

        this.radius = radius;
        this.height = height;
        this.delta = delta;

        this.R = rotate(10, [1, 1, 0]);
        this.S = scalem(0.3, 0.3, 1.0);
        this.T = translate(-0.7, -0.7, 0.0);

        this.calculateCylinder();
    }

/**
     * @return {number}
     */
    X(phi){
        let radius = this.radius;
        return radius * Math.cos(radians(phi));
    }

    /**
     * @return {number}
     */
    Z(phi){
        let radius = this.radius;
        return radius * Math.sin(radians(phi));
    }

    changeColor(color){
        this.color=color;
        for (var i=this.startId; i<this.startId+this.count; i++){
            colors[i]=color;
        }


         var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

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

    calculateCylinder(){
    let delta= this.delta;
    for(let phi = 0; phi < 360; phi += delta){

            vertices.push(vec4(this.X(phi),this.height,this.Z(phi),1));
            colors.push(vec4(0, 1, 0, 1));

            vertices.push(vec4(0,this.height,0,1));
            colors.push(vec4(0, 1, 0, 1));

            vertices.push(vec4(this.X(phi+delta),this.height,this.Z(phi+delta),1));
            colors.push(vec4(0, 1, 0, 1));

            vertices.push(vec4(this.X(phi),0,this.Z(phi),1));
            colors.push(vec4(1, 0, 0, 1));

            vertices.push(vec4(this.X(phi+delta),0,this.Z(phi+delta),1));
            colors.push(vec4(1, 0, 0, 1));

            vertices.push(vec4(this.X(phi+delta),this.height,this.Z(phi+delta),1));
            colors.push(vec4(1, 0, 0, 1));

            vertices.push(vec4(this.X(phi+delta),this.height,this.Z(phi+delta),1));
            colors.push(vec4(1, 0, 0, 1));

            vertices.push(vec4(this.X(phi),this.height,this.Z(phi),1));
            colors.push(vec4(1, 0, 0, 1));

            vertices.push(vec4(this.X(phi),0,this.Z(phi),1));
            colors.push(vec4(1, 0, 0, 1));
   
            vertices.push(vec4(this.X(phi),0,this.Z(phi),1));
            colors.push(vec4(0, 1, 0, 1));

            vertices.push(vec4(0,0,0,1));
            colors.push(vec4(0, 1, 0, 1));

            vertices.push(vec4(this.X(phi+delta),0,this.Z(phi+delta),1));
            colors.push(vec4(0, 1, 0, 1));

            this.count += 12;
        }
       function calculateNormals(p1, p2, p3){
            let u = subtract(p2, p1);
            let v = subtract(p3, p1);

            let n = vec4();
            
            n[0] = (u[1] * v[2]) - (u[2] * v[1]);
            n[1] = (u[2] * v[0]) - (u[0] * v[2]);
            n[2] = (u[0] * v[1]) - (u[1] * v[0]);

            n[3] = 0;

            return n;
        }
        
        var aux = 0;
        for(let i = this.startId; i < this.startId+this.count; i+=3){
            aux = aux + 1;
            let currentNormal;

            currentNormal = calculateNormals(vertices[i], vertices[i+1], vertices[i+2]);
            
            normals[i] = currentNormal;
            normals[i+1] = currentNormal;
            normals[i+2]   = currentNormal;
        }
    }

    draw(){
        gl.uniformMatrix4fv(RLoc, false, flatten(this.R));
        gl.uniformMatrix4fv(SLoc, false, flatten(this.S));
        gl.uniformMatrix4fv(TLoc, false, flatten(this.T));
        gl.drawArrays(gl.TRIANGLES, this.startId, this.count);
    }
}