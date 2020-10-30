#!/usr/bin/env bash
set -x

# install cra
yarn global add create-react-app

# create a exmaple project
create-react-app test-sdk-frontend-import-bundler

cd test-sdk-frontend-import-bundler

# prepend import { Conflux } from '../../'; to cra's default App.js
sed -i.old -e '1 i\
import { Conflux } from "../../"\;' src/App.js
sed -i.old -e '1 i\
// eslint-disable-next-line no-unused-vars' src/App.js
yarn build
