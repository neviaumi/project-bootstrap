#!/bin/sh

set -ex
npm run lint
npx tsc
npm run test:ci