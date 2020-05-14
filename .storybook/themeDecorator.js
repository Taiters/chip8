import React from "react"
import { ThemeProvider } from 'react-jss';

import theme from '../src/theme';

const ThemeDecorator = storyFn => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
)

export default ThemeDecorator