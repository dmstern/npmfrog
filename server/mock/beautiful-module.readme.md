# Beautiful Module

## Install or update node.js/npm

:angry:
:rage:
:triumph:
:sleepy:
:yum:
:mask:
:sunglasses:
:dizzy_face:
:imp:
:smiling_imp:
:neutral_face:
:no_mouth:
:innocent:
:alien:
:yellow_heart:
:blue_heart:
:purple_heart:

```bash
node -v
```

```bash
npm -v
4.4.7
```

Although _npm_ does comes with Node.js, it’s a good idea to know how to update npm, since it needs to be updated more often than Node.js:

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

Update or install new dependencies **node_modules** via _package.json_ in the front-end folder locally via:

```bash
npm update
```

Start up the development and static browser-sync server by running:

```bash
npm start
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

**For example**: running full build of the prototype:

```bash
npm run grunt -- fullbuild
```

## <a name="pm2"></a> Process Manager pm2

## Literature

- BEM [Block Element Modifier](http://getbem.com/introduction/)
- Creating A Living Style Guide: A Case Study [Atomic Design Pattern with BEM](https://www.smashingmagazine.com/2016/05/creating-a-living-style-guide-case-study/)

Documentation as of 2017-11-17
