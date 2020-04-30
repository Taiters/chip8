import TokenStream from './tokenStream';
import tokenize from './tokenizer';
import { TokenTypes } from './tokens';
import { UnexpectedTokenException } from './exceptions';


function expect(tokens, ...expectedTypes) {
    const token = tokens.next();
    if (!expectedTypes.includes(token.type))
        throw new UnexpectedTokenException(token, tokens.context(), expectedTypes);
    
    return token;
}

function parseArgs(tokens) {
    const args = [];
    let continueArgs = true;

    while(continueArgs && tokens.hasNext() && tokens.peek() !== TokenTypes.EOL) {
        tokens.skip(TokenTypes.WS);
        const nextToken = expect(tokens,
            TokenTypes.REGISTER,
            TokenTypes.HEX,
            TokenTypes.DEC,
            TokenTypes.BIN,
        );

        args.push(nextToken.value);

        tokens.skip(TokenTypes.WS);
        if (!tokens.hasNext())
            break;

        if (tokens.peek().type !== TokenTypes.COMMA)
            continueArgs = false;
        else
            tokens.next();
    }

    return args;
}

function parseCommand(instructionToken, tokens) {
    tokens.skip(TokenTypes.WS, TokenTypes.COMMENT);
    const command = {
        command: instructionToken.value,
        args: tokens.peek().type === TokenTypes.EOL ? [] : parseArgs(tokens)
    };
    tokens.skip(TokenTypes.WS, TokenTypes.COMMENT);
    expect(tokens, TokenTypes.EOL);

    return command;
}

function parseProgram(tokens) {
    const program = {
        commands: [],
    };

    tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);
    while (tokens.hasNext()) {
        const nextToken = expect(tokens, TokenTypes.INSTRUCTION);

        switch (nextToken.type) {
            case TokenTypes.INSTRUCTION:
                program.commands.push(parseCommand(nextToken, tokens));
                break;
            default:
                throw `Unhandled token type in parseProgram: ${nextToken.type}`;
        }

        tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);
    }

    return program;
}

function parse(str) {
    const tokens = new TokenStream(tokenize(str));

    return parseProgram(tokens);
}


export default parse;