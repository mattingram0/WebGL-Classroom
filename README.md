# WebGL-Classroom
A Proof-of-Concept WebGL Classroom Model

## Prerequisites
If you decide to download and run this program yourself *locally* in-browser (without using a web server such as Apache or Node.js/Express), then you may run into Cross-Origin errors when trying to load the textures. A temporary fix for this is to allow Cross-Origin requests by starting Chrome (or the browser of your choice) with the correct command-line arguments. On Mac OS, this can be done by issuing the following command in terminal,
**after** quiting all open instances of Chrome:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files --allow-file-access --allow-cross-origin-auth-prompt
```

To add command line flags to Chrome in other OSs, please see this [guide](https://www.chromium.org/for-testers/command-line-flags). If the above does not work, you can instead try adding the --disable-web-security argument. Please note that adding these arguments may leave your browser vulnerable to malicious attackers, so please revert back to using Chrome normally once you are finished. 

## Installation
Click 'Clone or download' above and then 'Download ZIP', or alternatively run the following command from the command line:

```
git clone https://github.com/mattingram0/WebGL-Classroom.git
```

## Running
Once downloaded (and extracted), simply load the assignment.html file in a web browser, and follow the on-screen instructions to navigate around the 3D room.
