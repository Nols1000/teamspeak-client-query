# Contributing to Teamspeak Client Query API

Used [https://github.com/atom/atom/blob/master/CONTRIBUTING.md](https://github.com/atom/atom/blob/master/CONTRIBUTING.md) as template.

The following is a set of guidelines for contributing to my javascript projects.
These are just guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents
- [How Can I Contribute?](#how-can-i-contribute)
  - [Before Reporting A Bug](#before-reporting-a-bug)
  - [Reporting Bugs](#reporting-bugs)
  - [Pull Requests](#pull-requests)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Styleguide](#javascript-styleguide)
  - [Documentation Styleguide](#documentation-styleguide)

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report).

#### Before Reporting A Bug

- **To you run one or more instances of Teamspeak3 Client?**
- If your answer is 'No', please start your Teamspeak 3 Client.
- **Do you have a program using port 25639 or the custom port you configured?**
- If your answer is 'Yes', please stop the program using port 25639 or configure the Teamspeak 3 Client Query to use another one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue on the repository and provide the following information.

Explain the problem and include additional details to help maintainers reproduce the problem:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible. For example, start by explaining how you started the Teamspeak 3 Client, e.g. which server you connected to.
- **List all settings you changed** in your Teamspeak 3 Client configuration. For example, list all plugins you installed or if you run something on a custom port.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Please supply a error message if the API crashed.**
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Provide more context by answering these questions:

- **Did the problem start happening recently** (e.g. after updating to a new version) or was this always a problem?
- If the problem started happening recently, **can you reproduce the problem in an older version?** What's the most recent version in which the problem doesn't happen? You can download older versions of the API from [the releases page](https://github.com/Nols1000/teamspeak-client-query/releases).
- **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.

Include details about your configuration and environment:

- **Which version of the API are you using?**
- **Which version of the Teamspeak Client Query are you using?**
- **What's the name and version of the OS you're using**?

### Pull Requests

* Follow the [JavaScript](#javascript-styleguide).
* Document new code based on the
  [Documentation Styleguide](#documentation-styleguide)
* End files with a newline.
* Place requires in the following order:
    * Built in Node Modules (such as `path`)
    * Modules from other sources.
    * Local Modules (using relative paths)
* [Avoid platform-dependent code](http://flight-manual.atom.io/hacking-atom/sections/cross-platform-compatibility/)

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally
- When only changing documentation, include `[ci skip]` in the commit description
- Consider starting the commit message with an applicable emoji:
    - :memo: `:memo:` when writing docs
    - :penguin: `:penguin:` when fixing something on Linux
    - :apple: `:apple:` when fixing something on macOS
    - :checkered_flag: `:checkered_flag:` when fixing something on Windows
    - :bug: `:bug:` when fixing a bug
    - :white_check_mark: `:white_check_mark:` when adding tests

### JavaScript Styleguide

All JavaScript should adhere to [JavaScript Standard Style](http://standardjs.com/).

### Documentation Styleguide

- Use [JSDoc](https://github.com/jsdoc3/jsdoc).
- Reference methods and classes in JSDoc with the `{}` notation:
    - Reference classes with `{ClassName}`
    - Reference instance methods with `{ClassName::methodName}`
    - Reference class methods with `{ClassName.methodName}`

#### Example

```JavaScript
/**
 * Example Class
 * @author John Doe <john.doe@example.com>
 */
class Example {

    /**
     * Creates an Example
     */
    constructor() {
        // Do something here
    }

    /**
     * Do something
     * @param parameters {Parameters} Parameters
     * @return {Object} null
     */
    method(parameters) {
        return null;
    }
}
```
