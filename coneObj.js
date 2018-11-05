class Cone {
    constructor(startId, radius, height, delta, color){
        this.startId = startId;
        this.count = 0;
        this.color= color;

        this.radius = radius;
        this.height = height;
        this.delta = delta;

        this.R = rotate(40, [1, 0, 1]);
        this.S = scalem(0.3, 0.3, 1.0);
        this.T = translate(0.8, 0.6, 0.0);

        this.calculateCone();
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

    calculateCone(){
        let delta = this.delta;
        
        for(let phi = 0; phi < 360; phi += delta){
             
            vertices.push(vec4( 0, this.height, 0, 1));
            colors.push(vec4(0, 1, 0, 1));

            vertices.push(vec4( this.X(phi), 0, this.Z(phi), 1));
            colors.push(vec4(0, 1, 0, 1));

            vertices.push(vec4( this.X(phi+delta), 0, this.Z(phi+delta), 1));
            colors.push(vec4(0, 1, 0, 1));

            vertices.push(vec4( this.X(phi), 0, this.Z(phi), 1));
            colors.push(vec4(0, 1, 1, 1));

            vertices.push(vec4( this.X(phi+delta), 0, this.Z(phi+delta), 1));
            colors.push(vec4(0, 1, 1, 1));

            vertices.push(vec4( 0, 0, 0, 1));
            colors.push(vec4(0, 1, 1, 1));

            this.count += 6;
        }
    }

    draw(){
        gl.uniformMatrix4fv(RLoc, false, flatten(this.R));
        gl.uniformMatrix4fv(SLoc, false, flatten(this.S));
        gl.uniformMatrix4fv(TLoc, false, flatten(this.T));
        gl.drawArrays(gl.LINES, this.startId, this.count);
    }
}