#!/usr/bin/env bash
set -x

yarn global add create-react-app
create-react-app test-sdk-frontend-import-bundler
cd test-sdk-frontend-import-bundler
sed -i.old "1s;^;import { Conflux } from '../../'" src/App.js
yarn build