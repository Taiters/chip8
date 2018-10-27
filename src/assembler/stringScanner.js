class StringScanner {
    constructor(str) {
        this.str = str
        this.lines = str.split(/\n/);
        this.offset = 0
    }

    getCoords() {
        var line = 0;
        var col = 0;
        var currentOffset = 0;

        while (currentOffset + this.lines[line].length < this.offset) {
            currentOffset += this.lines[line].length + 1;
            line++
        }

        return {
            line: line + 1,
            column: (this.offset - currentOffset) + 1
        };
    }

    eol() {
        return this.next('\n') || this.eof();
    }

    eof() {
        return this.str.length == 0;
    }

    scan(expr) {
        const i = this.str.search(expr);
        if (i != 0)
            return false;

        const match = this.str.match(expr)[0];
        const length = match.length;
        this.str = this.str.slice(length);
        this.offset += length;

        return match;
    }

    next(expr) {
        const i = this.str.search(expr);
        return i == 0;
    }

    skipToNextChar() {
        this.scan(/\s*/);
        while (true) {
            if (!this.scan('//'))
                break;
            this.scan(/.*/);
            this.scan(/\s+/);
        }
    }
}

export default StringScanner;
