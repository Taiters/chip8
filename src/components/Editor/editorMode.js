import * as ace from 'brace';


ace.define('ace/mode/chip8_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function (acequire, exports) {
    const oop = acequire('../lib/oop');
    const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

    const Chip8HighlightRules = function () {

        this.$rules = {
            start: [
                {
                    token: 'entity.name.function',
                    regex: /:\w+/,
                    caseInsensitive: true
                },
                {
                    token: 'support.function',
                    regex: /\b(?:call|jp|cls|ret|se|sne|ld|add|or|and|xor|sub|shr|subn|shl|rnd|draw|skp|sknp)\b/,
                    caseInsensitive: true
                },
                {
                    token: 'support.variable',
                    regex: /\b(?:v(?:[0-9]|[a-f])|st|dt|i)\b/,
                    caseInsensitive: true
                },
                {
                    token: 'constant.numeric',
                    regex: /\b(?:0x[A-F0-9]+|0b[0|1]+|[0-9]+)\b/,
                    caseInsensitive: true
                },
                { 
                    token: 'comment.line.double-slash', 
                    regex: /\/\/.*$/ 
                }
            ],
        };

        this.normalizeRules();
    };

    Chip8HighlightRules.metaData = {
        fileTypes: ['asm'],
        name: 'Assembly x86',
        scopeName: 'source.assembly'
    };


    oop.inherits(Chip8HighlightRules, TextHighlightRules);

    exports.Chip8HighlightRules = Chip8HighlightRules;
});

ace.define('ace/mode/folding/coffee', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/folding/fold_mode', 'ace/range'], function (acequire, exports) {
    'use strict';

    var oop = acequire('../../lib/oop');
    var BaseFoldMode = acequire('./fold_mode').FoldMode;
    var Range = acequire('../../range').Range;

    var FoldMode = exports.FoldMode = function () { };
    oop.inherits(FoldMode, BaseFoldMode);

    (function () {

        this.getFoldWidgetRange = function (session, foldStyle, row) {
            var range = this.indentationBlock(session, row);
            if (range)
                return range;

            var re = /\S/;
            var line = session.getLine(row);
            var startLevel = line.search(re);
            if (startLevel == -1 || line[startLevel] != '#')
                return;

            var startColumn = line.length;
            var maxRow = session.getLength();
            var startRow = row;
            var endRow = row;

            while (++row < maxRow) {
                line = session.getLine(row);
                var level = line.search(re);

                if (level == -1)
                    continue;

                if (line[level] != '#')
                    break;

                endRow = row;
            }

            if (endRow > startRow) {
                var endColumn = session.getLine(endRow).length;
                return new Range(startRow, startColumn, endRow, endColumn);
            }
        };
        this.getFoldWidget = function (session, foldStyle, row) {
            var line = session.getLine(row);
            var indent = line.search(/\S/);
            var next = session.getLine(row + 1);
            var prev = session.getLine(row - 1);
            var prevIndent = prev.search(/\S/);
            var nextIndent = next.search(/\S/);

            if (indent == -1) {
                session.foldWidgets[row - 1] = prevIndent != -1 && prevIndent < nextIndent ? 'start' : '';
                return '';
            }
            if (prevIndent == -1) {
                if (indent == nextIndent && line[indent] == '#' && next[indent] == '#') {
                    session.foldWidgets[row - 1] = '';
                    session.foldWidgets[row + 1] = '';
                    return 'start';
                }
            } else if (prevIndent == indent && line[indent] == '#' && prev[indent] == '#') {
                if (session.getLine(row - 2).search(/\S/) == -1) {
                    session.foldWidgets[row - 1] = 'start';
                    session.foldWidgets[row + 1] = '';
                    return '';
                }
            }

            if (prevIndent != -1 && prevIndent < indent)
                session.foldWidgets[row - 1] = 'start';
            else
                session.foldWidgets[row - 1] = '';

            if (indent < nextIndent)
                return 'start';
            else
                return '';
        };

    }).call(FoldMode.prototype);

});

ace.define('ace/mode/chip8', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/chip8_highlight_rules', 'ace/mode/folding/coffee'], function (acequire, exports) {
    var oop = acequire('../lib/oop');
    var TextMode = acequire('./text').Mode;
    var Chip8HighlightRules = acequire('./chip8_highlight_rules').Chip8HighlightRules;
    var FoldMode = acequire('./folding/coffee').FoldMode;

    var Mode = function () {
        this.HighlightRules = Chip8HighlightRules;
        this.foldingRules = new FoldMode();
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function () {
        this.lineCommentStart = ';';
        this.$id = 'ace/mode/chip8';
    }).call(Mode.prototype);

    exports.Mode = Mode;
});
