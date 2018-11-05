class Sphere {
    constructor(startId, radius, delta, color){
        this.startId = 0;
        this.count = 0;
        this.color= color;
    
        this.radius = 1;
        this.delta = 10;
    
        this.R = rotate(30, [0, 1, 1]);
        this.S = scalem(0.5, 0.5, 1.0);
        this.T = translate(0.7, -0.6, 0.0);;

        this.calculateSphere();
    }

    /**
     * @return {number}
     */
    X(theta, phi){
        let radius = this.radius;
        return radius * Math.sin(radians(theta)) * Math.cos(radians(phi));
    }

    /**
     * @return {number}
     */
    Y(theta, phi){
        let radius = this.radius;
        return radius * Math.sin(radians(theta)) * Math.sin(radians(phi));
    }

    /**
     * @return {number}
     */
    Z(theta){
        let radius = this.radius;
        return radius * Math.cos(radians(theta));
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
    calculateSphere(){
        let delta = this.delta;

        for(let theta = 0; theta < 180; theta += delta){
            for (let phi = 0; phi < 360; phi += delta){
                vertices.push(vec4( this.X(theta, phi), this.Y(theta, phi), this.Z(theta), 1));
                colors.push(vec4(1, 0, 1, 1));

                vertices.push(vec4( this.X(theta+delta, phi), this.Y(theta+delta, phi), this.Z(theta+delta), 1));
                colors.push(vec4(1, 0, 1, 1));

                vertices.push(vec4( this.X(theta, phi+delta), this.Y(theta, phi+delta), this.Z(theta), 1));
                colors.push(vec4(1, 0, 1, 1));


                vertices.push(vec4( this.X(theta+delta, phi), this.Y(theta+delta, phi), this.Z(theta+delta), 1));
                colors.push(vec4(0, 1, 0, 1));

                vertices.push(vec4( this.X(theta, phi+delta), this.Y(theta, phi+delta), this.Z(theta), 1));
                colors.push(vec4(0, 1, 0, 1));

                vertices.push(vec4( this.X(theta+delta, phi+delta), this.Y(theta+delta, phi+delta), this.Z(theta+delta), 1));
                colors.push(vec4(0, 1, 0, 1));

                this.count += 6;
            }
        }
    }

    draw(){
        gl.uniformMatrix4fv(RLoc, false, flatten(this.R));
        gl.uniformMatrix4fv(SLoc, false, flatten(this.S));
        gl.uniformMatrix4fv(TLoc, false, flatten(this.T));
        gl.drawArrays(gl.LINES, this.startId, this.count);
    }
}