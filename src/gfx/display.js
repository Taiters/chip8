class Display {
    constructor(fg, bg) {
        this.fg = fg;
        this.bg = bg;
    }

    attachCanvas(canvasElement) {
        this.canvasElement = canvasElement;
        this.ctx = this.canvasElement.getContext('2d');
        this.width = this.canvasElement.width;
        this.height = this.canvasElement.height;
        this.cellWidth = this.width / 64;
        this.cellHeight = this.height / 32;
    }

    clear() {
        this.ctx.fillStyle = this.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    clearCell(x, y) {
        this.renderCell(x, y, this.bg);
    }

    fillCell(x, y) {
        this.renderCell(x, y, this.fg);
    }

    renderCell(x, y, color) {
        if (x < 0 | 64 <= x)
            throw 'x coordinate is out of bounds';
        if (y < 0 | 32 <= y)
            throw 'y coordinate is out of bounds';

        const x0 = x * this.cellWidth;
        const y0 = y * this.cellHeight;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x0, y0, this.cellWidth, this.cellHeight);
    }
}

export default Display;
