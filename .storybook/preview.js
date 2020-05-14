import { configure, addDecorator } from "@storybook/react"
import themeDecorator from "./themeDecorator"

import { bootstrapJss } from '../src/bootstrap';


addDecorator(themeDecorator);
bootstrapJss();