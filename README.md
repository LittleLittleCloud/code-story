# README

## What is Code Story

Code Story is an extension specially written for VSCode. By using this extension, you can easily trace your code statistic, like how many lines of code you have written in the last week, or which programming language do you write most in the last month, etc... Moreover, you can save the data on the cloud so as to sync it and never lose it!

(kindly remind that due to this extension hasn't been finished yet, some of its functions hasn't been implement yet. Please wait and see)

## About the privacy

We don't save any bit of your code information. Basically your data will be saved on local machine.

## About authorization

In the latest version, code-story uses **google drive api** to do synchronize, so give code-story access to google api is required if you want to use **code-story: Upload**, **code-story: Download and Merge**  and **code-story: Sync**. To authorize code-story, simply copy the link from prompt and paste that to a browser, then you will get a secret token, copy that to the input box and click enter to finish authorization. 

## Useful commands

Open the Command Palette (Command+Shift+P on macOS and Ctrl+Shift+P on Windows/Linux) and type in one of the following commands:

- **code-story: Show report**:  Show the line # of codes you have written.
- **code-story: total sum of written code**: Show the line # of codes you written in the past `N` days with a well-designed UI where `N` is the number user puts in.
- **code-story: sum of written code in the past N days**: Show the histgram of # of codes written in the past `N` days where `N` is the number user puts in.
- **code-story: sum of different programmming language in the past N days**: Show a pie chart of the # of different languages written in the past `N` days where `N` is the number user puts in.
- **code-story: Upload**: Upload your local record to google drive, authorization may be required. If just want to synchronize the code record, use **code-story: Sync**

- **code-story: Download and Merge**: Download the remote record and merge (update) the record with local one. authorization may be required.

- **code-story: Sync**: a combination of **code-story: Download and Merge** and **code-story: Upload**, authorization may be required.

You can turn on the recording process by clicking the **code-story :  stop recording** at status bar or turn on the process by clicking it again


## Release Notes

### 0.9.0

Add basic support for recording total # lines of code

### 0.9.5

Support synchronize through google drive

### 0.9.9
Add some new commands
- `code-story: total sum of written code`, 
- `code-story: sum of written code in the past N days`,
- `code-story: sum of different programmming language in the past N days`





### Next Step

- Add metaReport to allow you generate your own-style report using only one command.
- Improve the explanation and command name so as to make them easier to understood.

## About author

- name: BigMiao
- Github: LittleLittleCloud
- Email: bigmiao.zhang@gmail.com
