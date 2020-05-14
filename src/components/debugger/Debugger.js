import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { createUseStyles } from 'react-jss';

import Registers from './Registers';
import Memory from './Memory';
import Keyboard from './Keyboard';


const useStyles = createUseStyles({
    tabs: {
        '-webkit-tap-highlight-color': 'transparent',
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
    },
    selectedTab: {
        background: '#ebdab4',
        color: '#26261F',
    },
    list: {
        backgroundColor: '#5b5545',
        margin: [[0, 0, 10]],
        padding: 0,
    },
    panel: {
        display: 'none',
    },
    selectedPanel: {
        display: 'block',
    },
});

const views = [
    {
        title: 'REG',
        component: Registers,
    },
    {
        title: 'MEM',
        component: Memory,
    },
    {
        title: 'KEY',
        component: Keyboard,
    }
];

export default function Debugger() {
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
            React.createElement(view.component, {})
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