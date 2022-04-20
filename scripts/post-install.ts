const ProjectRootDir = require("app-root-dir");
const { join } = require("path");
const { execSync } = require("child_process");

async function main() {
  const externals = join(
    ProjectRootDir.get(),
    "external/decentralised-scd-registry"
  );
  process.chdir(externals);
  console.log(execSync(`npm i`).toString());
  console.log(execSync(`npm run compile`).toString());
}

main()
  .then(() => console.log("Finished!"))
  .catch((err) => console.log(err));
