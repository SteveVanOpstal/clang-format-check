#!/usr/bin/env node
'use strict';

const clangformat = require('clang-format');
const spawn = require('child_process').spawnSync;
const process = require('process');
const os = require('os');
const path = require('path');

let gitCLangFormatBinary = 'git-clang-format';
if (os.platform() === 'win32') {
  gitCLangFormatBinary = 'git-clang-format.cmd';
}

function main() {
  let clangFormatPath;

  try {
    clangFormatPath = path.dirname(require.resolve('clang-format'));
  } catch (e) {
    clangFormatPath = '.';
  }

  const gitClangFormatPath = path.join(clangFormatPath, '../.bin/' + gitCLangFormatBinary);
  const result = spawn(gitClangFormatPath, 
    [
      '--style=file',
      '--binary=' + clangformat.getNativeBinary().replace(/\\/g, '/',)
    ], {encoding: 'utf-8'});

  if (result.error) {
    console.error('Error running git-clang-format:', result.error);
    return 2;
  }

  const clangFormatOutput = result.stdout.trim();
  console.error(result.stderr);
  console.error(result.stdout);
  if (clangFormatOutput.indexOf('no modified files to format') < 0 &&
      clangFormatOutput.indexOf('clang-format did not modify any files') < 0) {
    console.error(clangFormatOutput);
    console.error(`ERROR: please check in the changes made by clang-format`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main();
}
