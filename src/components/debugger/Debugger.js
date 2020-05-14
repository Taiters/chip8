import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { createUseStyles } from 'react-jss';

import Registers from './Registers';
import Memory from './Memory';


const useStyles = createUseStyles({
    tabs: {
        '-webkit-tap-highlight-color': 'transparent',
        height: '100%',
    },
    tab: {
        display: 'inline-block',
        border: [[1, 'solid', 'transparent']],
        borderBottom: 'none',
        bottom: -1,
        position: 'relative',
        listStyle: 'none',
        padding: [[8, 16]],
        cursor: 'pointer',
        fontSize: '1em',
        height: 22,
        lineHeight: '22px',
    },
    selectedTab: {
        background: '#ebdab4',
        color: '#26261F',
    },
    list: {
        backgroundColor: '#5b5545',
        margin: 0,
        padding: 0,
        height: 40
    },
    panel: {
        display: 'none',
        height: 'calc(100% - 40px)',
    },
    selectedPanel: {
        display: 'block',
    },
});

const views = [
    {
        title: 'REGISTERS',
        component: Registers,
    },
    {
        title: 'MEMORY',
        component: Memory,
    },
];

export default function Debugger(props) {
    const classes = useStyles();
    const tabStyles = {
        className: classes.tab,
        selectedClassName: classes.selectedTab,
    };
    const panelStyles = {
        className: classes.panel,
        selectedClassName: classes.selectedPanel,
    };

    const tabs = [];
    const panels = [];
    for (const view of views) {
        tabs.push(<Tab {...tabStyles} key={view.title}>{view.title}</Tab>);
        panels.push(<TabPanel {...panelStyles} key={view.title}>{
            React.createElement(view.component, props)
        }</TabPanel>);

    }

    return (
        <Tabs className={classes.tabs}>
            <TabList className={classes.list}>
                {tabs}
            </TabList>
            {panels}
        </Tabs>
    );
}