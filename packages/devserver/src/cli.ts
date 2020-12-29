import { startServer } from './server';


const runFilesHelper = require(process.env.BAZEL_NODE_RUNFILES_HELPER);
const moduleDir = runFilesHelper.resolve('npm')
const rootDir = runFilesHelper.resolve('tbd/packages/preact-test-app/src')

startServer({
  moduleDirs: [moduleDir],
  rootDir,
})
