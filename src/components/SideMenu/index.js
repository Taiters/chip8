import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List'; // eslint-disable-line no-unused-vars
import ListItem from '@material-ui/core/ListItem'; // eslint-disable-line no-unused-vars
import ListItemText from '@material-ui/core/ListItemText'; // eslint-disable-line no-unused-vars

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

function SimpleList(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <List component="nav">
                <ListItem button>
                    <ListItemText primary="Emulator" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="ASM Editor" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Image Editor" />
                </ListItem>
            </List>
        </div>
    );
}

SimpleList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleList);