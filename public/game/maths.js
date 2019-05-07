class Point {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
}

class mat3 {
    constructor() {
        this.matrix = [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
        ]
    }

    multiply(m) {
        let output = new mat3();
        output.matrix = [
            this.matrix[mat3.M00] * m.matrix[mat3.M00] + this.matrix[mat3.M10] * m.matrix[mat3.M01] + this.matrix[mat3.M20] * m.matrix[mat3.M02],
            this.matrix[mat3.M01] * m.matrix[mat3.M00] + this.matrix[mat3.M11] * m.matrix[mat3.M01] + this.matrix[mat3.M21] * m.matrix[mat3.M02],
            this.matrix[mat3.M02] * m.matrix[mat3.M00] + this.matrix[mat3.M12] * m.matrix[mat3.M01] + this.matrix[mat3.M22] * m.matrix[mat3.M02],

            this.matrix[mat3.M00] * m.matrix[mat3.M10] + this.matrix[mat3.M10] * m.matrix[mat3.M11] + this.matrix[mat3.M20] * m.matrix[mat3.M12],
            this.matrix[mat3.M01] * m.matrix[mat3.M10] + this.matrix[mat3.M11] * m.matrix[mat3.M11] + this.matrix[mat3.M21] * m.matrix[mat3.M12],
            this.matrix[mat3.M02] * m.matrix[mat3.M10] + this.matrix[mat3.M12] * m.matrix[mat3.M11] + this.matrix[mat3.M22] * m.matrix[mat3.M12],

            this.matrix[mat3.M00] * m.matrix[mat3.M20] + this.matrix[mat3.M10] * m.matrix[mat3.M21] + this.matrix[mat3.M20] * m.matrix[mat3.M22],
            this.matrix[mat3.M01] * m.matrix[mat3.M20] + this.matrix[mat3.M11] * m.matrix[mat3.M21] + this.matrix[mat3.M21] * m.matrix[mat3.M22],
            this.matrix[mat3.M02] * m.matrix[mat3.M20] + this.matrix[mat3.M12] * m.matrix[mat3.M21] + this.matrix[mat3.M22] * m.matrix[mat3.M22]
        ];
        return output;
    }

    transition(x, y) {
        let output = new mat3();
        output.matrix = [
            this.matrix[mat3.M00],
            this.matrix[mat3.M01],
            this.matrix[mat3.M02],

            this.matrix[mat3.M10],
            this.matrix[mat3.M11],
            this.matrix[mat3.M12],

            x * this.matrix[mat3.M00] + y * this.matrix[mat3.M10] + this.matrix[mat3.M20],
            x * this.matrix[mat3.M01] + y * this.matrix[mat3.M11] + this.matrix[mat3.M21],
            x * this.matrix[mat3.M02] + y * this.matrix[mat3.M12] + this.matrix[mat3.M22],
        ];
        return output;
    }

    scale(x, y) {
        let output = new mat3();
        output.matrix = [
            x * this.matrix[mat3.M00],
            x * this.matrix[mat3.M01],
            x * this.matrix[mat3.M02],

            y * this.matrix[mat3.M10],
            y * this.matrix[mat3.M11],
            y * this.matrix[mat3.M12],

            this.matrix[mat3.M20],
            this.matrix[mat3.M21],
            this.matrix[mat3.M22],
        ];
        return output
    }

    getFloatArray() {
        return new Float32Array(this.matrix);
    }
}

mat3.M00 = 0;
mat3.M01 = 1;
mat3.M02 = 2;
mat3.M10 = 3;
mat3.M11 = 4;
mat3.M12 = 5;
mat3.M20 = 6;
mat3.M21 = 7;
mat3.M22 = 8;