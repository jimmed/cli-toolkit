# CLI Toolkit

> Note: This project is a work in progress, and all information here is subject to change. Nothing provided within this repository is ready for production use!

## TL;DR Goals

Easy, declarative setup of a CLI tool which supports:

- Multiple named commands
- Global arguments
- Argument/command validation
- Interactive prompts to fill missing values
- Beautiful user experiences
- Buttery-smooth developer experiences
- Elegant task management + composition

## Proposed API

This is a toy example that shows how you might implement a commonly known API, such as Yarn's.

```js
// index.js
import { createCli } from "package-name-tbd";

const myCliApplication = createCli({
  name: "yarn",
  defaultCommand: "install",
  commands: [
    {
      id: "add",
      args: [
        {
          id: "package-specifier",
          type: "string",
          position: 0,
          required: true
        },
        {
          id: "dev",
          type: "boolean",
          default: false,
          alias: "d",
          conflicts: ["peer", "optional"]
        },
        {
          id: "peer",
          type: "boolean",
          default: false,
          alias: "p",
          conflicts: ["dev", "optional"]
        }
        // etc.
      ],
      validate({ packageSpecifier, dev, peer }) {
        const { package, scope, version } = parsePackageSpecifier(
          packageSpecifier
        );
        if (!package) throw new Error("A package must be specified!");
      },
      task: "installPackage"
    }
    // etc.
  ],
  tasks: [
    {
      id: "installPackage",
      async run({ packageSpecifier, dev, peer }, { childTask }) {
        const dependencies = await childTask(
          "resolveDependencies",
          packageSpecifier
        );
        await Promise.all(
          dependencies.map(dependency =>
            childTask("installPackage", dependency)
          )
        );
        await childTask("linkDependencies", dependencies);
      }
    }
  ]
});

myCliApplication.run();
```

## The General Idea

> Note: These are stream-of-consciousness specifications, so they may not be organised or even make sense.

### Interactive Prompts

- When used from a TTY (i.e. a human user), as much as possible, interactive prompts will be use to gain any missing (or invalid) information from the user.
- Interactive prompts will not be shown if used from without a TTY (i.e. from a script), or if the user explicitly disables this via some mechanism. When not interactive, where possible, errors should be thrown for missing (or invalid) arguments.

### Developer Experience

- It should be possible (and easy) to modularise commands
- Should conform to good 'zero-config' principles; where possible use sane defaults, but allow overriding of functionality without hassle.
- As much as possible, the developer should be able to specify command behaviours in a declarative fashion. Where possible, imperative overrides should be permitted.
- Use a familiar, feature-rich arg parser (maybe yargs or meow)

### Tasks

- Tasks are a unit of work, which when executed emit events. These events are used to build a store of current application state, with detailed information on task progress.
- Tasks (can) have:
  - A type
  - Argument validation
  - Run method which accepts a progress dispatch/emit method of some sort
  - Undo method that performs the inverse of task (as gracefully as possible)
  - A set of child tasks, and logic about how they may be executed (parallel, sequential, race, batched, etc.)
  - A means of calculating task progress. This could/should be based on the child task progress
- Tasks should be able to add new child tasks during their execution
- Unsure whether to include task cancellation yet; it conflates logic somewhat.
- Tasks should not have to manually emit their start, success and fail events, only progress and adding tasks etc.
- If a task fails, it should attempt to execute its undo method. If this undo method errors, this should be treated as a warning, not a fatal error.
- If any of the children of a task fail, the task itself should fail, only after its children execute their undo methods.
- If a task is side-effect free, then it does not need to specify an undo method. Its child tasks will be automatically tracked, and undone in the event of a failure. This means that tasks behave almost as transactions (although there is no locking planned!).
