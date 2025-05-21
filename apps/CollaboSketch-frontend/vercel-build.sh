#!/bin/bash

cd ../.. # go to monorepo root
corepack enable
corepack prepare pnpm@9.0.0 --activate
pnpm install
pnpm turbo run build --filter=CollaboSketch-frontend...
