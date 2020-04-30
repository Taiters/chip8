class TokenStream {
    constructor(tokens) {
        this.offset = 0;
        this.tokens = tokens;
    }

    skip(...typesToSkip) {
        while (this.hasNext()) {
            if (!typesToSkip.includes(this.peek().type))
                break;
            
            this.next();
        }
    }

    next() {
        const nextToken = this.tokens[this.offset];
        this.offset++;

        return nextToken;
    }

    peek() {
        return this.tokens[this.offset];
    }

    hasNext() {
        return this.offset < this.tokens.length;
    }

    context() {
        return this.tokens
            .slice(Math.max(0, this.offset - 2), this.offset + 2)
            .map((t) => t.raw)
            .join('');
    }
}


export default TokenStream;