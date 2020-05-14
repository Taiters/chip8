import jss from 'jss';
import theme from 'chip8/theme';


ace.define("ace/theme/chip8",["require","exports","module","ace/lib/dom"], function(acequire, exports, module) {
    const css = jss.createStyleSheet({
        '@global': {
            '.ace-chip8': {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,

                '& .ace_comment': {
                    fontStyle: 'italic',
                    color: '#928375',
                },
            },
        }
    });

    exports.isDark = true;
    exports.cssClass = "ace-chip8";
    exports.cssText = css.toString();
    // exports.cssText = ".ace-chip8 .ace_gutter-active-line {\
    // background-color: #3C3836;\
    // }\
    // .ace-chip8 {\
    // color: #EBDAB4;\
    // background-color: #1D2021;\
    // }\
    // .ace-chip8 .ace_invisible {\
    // color: #504945;\
    // }\
    // .ace-chip8 .ace_marker-layer .ace_selection {\
    // background: rgba(179, 101, 57, 0.75)\
    // }\
    // .ace-chip8.ace_multiselect .ace_selection.ace_start {\
    // box-shadow: 0 0 3px 0px #002240;\
    // }\
    // .ace-chip8 .ace_keyword {\
    // color: #8ec07c;\
    // }\
    // .ace-chip8 .ace_comment {\
    // font-style: italic;\
    // color: #928375;\
    // }\
    // .ace-chip8 .ace-statement {\
    // color: red;\
    // }\
    // .ace-chip8 .ace_variable {\
    // color: #84A598;\
    // }\
    // .ace-chip8 .ace_variable.ace_language {\
    // color: #D2879B;\
    // }\
    // .ace-chip8 .ace_constant {\
    // color: #C2859A;\
    // }\
    // .ace-chip8 .ace_constant.ace_language {\
    // color: #C2859A;\
    // }\
    // .ace-chip8 .ace_constant.ace_numeric {\
    // color: #C2859A;\
    // }\
    // .ace-chip8 .ace_string {\
    // color: #B8BA37;\
    // }\
    // .ace-chip8 .ace_support {\
    // color: #F9BC41;\
    // }\
    // .ace-chip8 .ace_support.ace_function {\
    // color: #F84B3C;\
    // }\
    // .ace-chip8 .ace_storage {\
    // color: #8FBF7F;\
    // }\
    // .ace-chip8 .ace_keyword.ace_operator {\
    // color: #EBDAB4;\
    // }\
    // .ace-chip8 .ace_punctuation.ace_operator {\
    // color: yellow;\
    // }\
    // .ace-chip8 .ace_marker-layer .ace_active-line {\
    // background: #3C3836;\
    // }\
    // .ace-chip8 .ace_marker-layer .ace_selected-word {\
    // border-radius: 4px;\
    // border: 8px solid #3f475d;\
    // }\
    // .ace-chip8 .ace_print-margin {\
    // width: 5px;\
    // background: #3C3836;\
    // }\
    // .ace-chip8 .ace_indent-guide {\
    // background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNQUFD4z6Crq/sfAAuYAuYl+7lfAAAAAElFTkSuQmCC\") right repeat-y;\
    // }";

    var dom = acequire("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);

});
