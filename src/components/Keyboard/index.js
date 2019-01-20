import { connect } from 'react-redux';
import { pressKey, releaseKey } from 'chip8/app/cpu/actions.js';
import Keyboard from './component.js';


const mapStateToProps = (state) => ({
    keys: state.cpu.keys
});

const mapDispatchToProps = (dispatch) => ({
    onKeyPress: (id) => dispatch(pressKey(id)),
    onKeyRelease: (id) => dispatch(releaseKey(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Keyboard);