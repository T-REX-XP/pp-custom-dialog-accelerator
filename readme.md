# Custom Dialog Accelerator

## Motivation
How many times have I been confronted with such a basic provision, creating custom dialogues on the project.

Of course, we can implement it with the help of ProCode: `React + FluetUI` opens up the desires of even the most demanding developers and business analysts

### What about LowCode??

With the advent of custom pages, as well as an API that allows you to display them in dialog mode, this functionality has become almost possible to implement using a LowCode approach.

A single item to open a page in dialog mode all requires writing JS code.

The main idea for me is to cover the full cycle of dialog creation using LowCode, which has the ability to delegate such a task to Citizen Developer.

LowCode already implemented:
- Create ribbon buttons for a model-driven application.
- Creation of dialogue and its logic

ProCode:
- Call generated pages in dialog mode, this API is not available with LowCode

So I created a small solution that allows Citizen Developer to accomplish this task.

## Meet the Custom Dialog Accelerator.

What is that:
- A set of basic scripts
- Dynamic configuration system
- Reference dialog design
- Best Practices Recomendation

So, for the citizen developer, the complete cycle looks like this:
1. Create a dialog by copying an existing one or from scratch.
1. Create button
1. [new] Add configuration for dialog
1. Call a ready-made function that displays a dialog according to the configured configuration.
1. Done!!!

For now, this is a very simple solution. Functionality is not so much.

The configuration supports the following parameters:
- Redefine the dialog title
- Set the dialog size in percentage
- Update list/form after closed dialog.

In my scripts, I pass a link to the first selected entry from the list, or a link to the entry if the button is on the panel.


## How to use:

Downlaod and install the package
