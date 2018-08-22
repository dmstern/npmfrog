# BBK Prototyp

## Direct Links:
* [Installation](#install)
* [Taskrunner (npm/grunt)](#taskrunner)
* [Process Manager (pm2)](#pm2)
* [Contribution](https://gitlab.init.de/BBk/prototyp/blob/develop/CONTRIBUTING.md)

## Fractal
Official Documentation: [http://fractal.build/guide](http://fractal.build/guide)


## And here comes the awesome javascript

```js
var variable = "Beispieltext";
alert(typeof variable); // ergibt "string" (die Funktion "alert" gibt den ihr übergebenen Parameter in einem Fenster aus)

variable = new String("Beispieltext");
alert(typeof variable); // ergibt "object"

```

## Install Front-end Tools (for Windows)
### Install or update node.js/npm
If not installed yet. Install node globally. The version in use in this project is *v6.9.2*, please visit [https://nodejs.org/](https://nodejs.org/). (Windows users might have to restart their machine to enable npm-commands) You can quick check if node.js is installedby typing *node -v* or *node --version* to your command line (cmd):
```bash
node -v
```

Node includes the npm package ecosystem, with access to hundreds of thousands of packages. You can now install any package for your project. Available packages see here:  [https://www.npmjs.com/](https://www.npmjs.com/). As usual you can check whether npm has been installed:
```bash
npm -v
4.4.7
```

Although *npm* does comes with Node.js, it’s a good idea to know how to update npm, since it needs to be updated more often than Node.js:
```bash
npm install npm -g
```

## <a name="intall"></a>Installation
Run this command for a complete installation of all `dependencies` :
```bash
npm i
```

Initialize workspace and `git-hooks`
```bash
npm run workspace
```
Git-Hooks are used for linter tasks.

### Update dependencies
Update or install new dependencies **node_modules** via *package.json* in the front-end folder locally via:
```bash
npm update
```

Start up the development and static browser-sync server by running:
```bash
npm start
```

The fractal server is configured for port **3003**, and the static browser-sync server to port **9000**.
After running `npm start` both servers are available on `localhost`: 
* **Fractal**: [http://localhost:3003/](http://localhost:3003/)
* **Browser-Sync**: [http://localhost:9000/](http://localhost:9000/)

Build a static prototype by running:
```bash
npm run staticbuild
```

## <a name="taskrunner"></a>Taskrunner
You can use `npm` to run `grunt` tasks:
```bash
npm run grunt -- [taskname]
```

You can install **Grunt** globally via Bash / cmd:
```bash
npm i -g grunt-cli
```

To see all available tasks run the default `grunt` task:
```bash
npm run grunt
Running "info" task
>> ===========================================
>> |                                         |
>> | TASKS:                                  |
>> | --------------------------------------- |
>> |                                         |
>> | info: shows this info                   |
>> |                                         |
>> | start: starts or restarts fractal and   |
>> |        static bs-server                 |
>> |                                         |
>> | stop: stops fractal and static server   |
>> |                                         |
>> | lint: runs eslint and sasslint tasks    |
>> |                                         |
>> | build: runs buildjs                     |
>> |             buildcss                    |
>> |             buildassets tasks           |
>> |                                         |
>> | fullbuild: runs build                   |
>> |                 fractal build           |
>> |                                         |
>> |            generates full static        |
>> |            prototype                    |
>> |                                         |
>> | buildcss: runs css build tasks          |
>> |                                         |
>> | buildjs: runs js build tasks            |
>> |                                         |
>> | buildassets: runs assets copy task      |
>> |                                         |
>> | watch: starts watcher for all files     |
>> |                                         |
>> | watchcss: starts watcher for css files  |
>> |                                         |
>> | watchjs: starts watcher for js files    |
>> |                                         |
>> ===========================================

Done.
```

**For example**: running full build of the prototype:
```bash
npm run grunt -- fullbuild
```

## <a name="pm2"></a> Process Manager pm2

All `pm2` tasks can be ran with npm:
```bash
npm run pm2 -- [command]
```

Show all running processes (server):
```bash
npm run pm2 -- l
```

Start or restart default fractal server:
```bash
npm run pm2 -- start BBK
```

Show server logs:
```bash
npm run pm2 -- logs BBK
```
This is a following command. To stop following logs use `ctrl + c` twice.

Show monitoring tool:
```bash
npm run pm2 -- monit
```

All logs can be found here in the `%basedir%/logs` .

## Literature
- BEM [Block Element Modifier](http://getbem.com/introduction/)
- Creating A Living Style Guide: A Case Study [Atomic Design Pattern with BEM](https://www.smashingmagazine.com/2016/05/creating-a-living-style-guide-case-study/)


Documentation as of 2017-11-17
