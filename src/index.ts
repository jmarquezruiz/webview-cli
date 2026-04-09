#!/usr/bin/env node

import { main } from './cli';

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});