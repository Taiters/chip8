import * as ace from 'brace';

import { TokenTypes } from 'chip8/app/asm/constants';
import { getToken } from 'chip8/app/asm/tokens';


ace.define('ace/mode/chip8_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function (acequire, exports) {
    const oop = acequire('../lib/oop');
    const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

    const getRegex = (...types) => types.map((t) => getToken(t).match.source).join('|');
    const withBoundary = (str) => `\\b(?:${str})\\b`;

    const Chip8HighlightRules = function () {
        this.$rules = {
            start: [
                {
                    token: 'support.function',
                    regex: withBoundary(getRegex(TokenTypes.MNEMONIC)),
                    caseInsensitive: true
                },
                {
                    token: 'support.variable',
                    regex: withBoundary(getRegex(
                        TokenTypes.REGISTER,
                        TokenTypes.I,
                        TokenTypes.K,
                        TokenTypes.F,
                        TokenTypes.DELAY_TIMER,
                        TokenTypes.SOUND_TIMER,
                    )),
                    caseInsensitive: true
                },
                {
                    token: 'constant.numeric',
                    regex: withBoundary(getRegex(
                        TokenTypes.HEX,
                        TokenTypes.BIN,
                        TokenTypes.DEC
                    )),
                    caseInsensitive: true
                },
                {
                    token: 'variable.parameter',
                    regex: getRegex(
                        TokenTypes.SECTION_IDENTIFIER, 
                        TokenTypes.SECTION_DEFINITION
                    ),
                    caseInsensitive: true,
                },
                { 
                    token: 'comment.line.double-slash', 
                    regex: getRegex(TokenTypes.COMMENT),
                }
            ],
        };

        this.normalizeRules();
    };

    oop.inherits(Chip8HighlightRules, TextHighlightRules);

    exports.Chip8HighlightRules = Chip8HighlightRules;
});

ace.define('ace/mode/chip8', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/chip8_highlight_rules', 'ace/mode/folding/coffee'], function (acequire, exports) {
    var oop = acequire('../lib/oop');
    var TextMode = acequire('./text').Mode;
    var Chip8HighlightRules = acequire('./chip8_highlight_rules').Chip8HighlightRules;

    var Mode = function () {
        this.HighlightRules = Chip8HighlightRules;
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function () {
        this.lineCommentStart = ';';
        this.$id = 'ace/mode/chip8';
    }).call(Mode.prototype);

    exports.Mode = Mode;
});
