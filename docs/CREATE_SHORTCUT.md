# Creating Shortcut to trigger Github Workflow on Iphone

## Pre-Requisites

1. Install the Github App and login

## Directions

1. Open the Shortcuts app on your iPhone.
2. Tap the + icon in the top right corner of the screen.
3. Tap Add Action.
4. Search for Github Workflow Dispatch
5. Fill in the required fields, using the workflow file name for the workflow id.
6. In the inputs section, select Choose every time, then pre-fill it with the following JSON:

```JSON
{
  "media_type": "",
  "media_title": "",
  "graded": ""
}
```

7. Tap Done.
8. Enter a name for your shortcut and tap Add to Home Screen.
9. Now, here is the workflow dispatch to a GitHub Actions workflow you requested: