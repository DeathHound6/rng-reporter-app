# RNG Reporter App
A GUI app made in Node.Js for Pokemon RNG Report searching

Note: This app should run on all Major OSes, and can be built for the following architectures:
- Windows (arm64, x86, x86_64)
- MacOS (arm64, x86_64)
- Linux (arm64, armv7l, x86, x86_64, mips64el)

## Building
1) Ensure you are in a command line and located in the current folder
2) Run `npm install`
- This will install all required dependencies
    - If you are not using linux, this will crash (as there is a dependency for debian linux, which has preinstall checks to ensure you are on the correct OS). If this happens for you there are 2 ways around this:
        - If you are using Windows, you can use WSL (Windows Subsystem for Linux)
        - Install all other dependencies manually
    - If the application crashes when you try to run it, stating that electron (or electron-packager) is not a command, you will need to install these globally with admin permissions
        - On Windows, open command prompt or powershell with Administrator, then run `npm install -g <package name>`
        - On Linux, open the terminal and run `sudo npm install -g <package name>`
3) Run `npm run build-{os}` or `node build-{os}.js`, replacing `{os}` with the os you want to build for
- The build will take a little while as it builds it for all CPU architectures
- You must have Node and NPM installed for this to work
    - This app was created using NPM v8.5.5 and Node v17.8.0
- Available `{os}` values are as follows
    - windows
    - mac
    - debian