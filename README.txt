-------------------------------------------------------------------------------
Covalent Activity Module
Development Guide
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
Requirements
-------------------------------------------------------------------------------

- Apache 2.2.x or greater
- Ant 1.7.0 or greater


-------------------------------------------------------------------------------
Installation/Setup
-------------------------------------------------------------------------------

Be sure you have the correct versions of the requirements above installed
before proceeding.

Copy build-example.properties to build.properties, edit that file, and 
modify the values for your environment.

-------------------------------------------------------------------------------
Building the Project and Deploying Locally
-------------------------------------------------------------------------------

Use the following Ant command to rebuild the project and deploy the project
to your local CengageNOW project:
    ant deploy-local

Use the following Ant command to rebuild a non-minified version of the project
and deploy it to your local CengageNOW project:
    ant deploy-local-concat
    
NOTE: If you use the non-minified version you will need to configure the testpage 
to reference the correct version of the project as it's default configuration 
uses the minified file.

-------------------------------------------------------------------------------
Testing Changes in a Browser
-------------------------------------------------------------------------------

As you develop and make changes within the project you will want to test them
in the browser using different consumer IDs, Covalent hosts, etc.
To do that, you will need to follow these steps:

1. Open the CAM test page in your web browser.  It is located at
    http://jenkins.ilrn-support.com/jenkins/job/TestPages/ws/CAM/index.html

2. For the "Module Host", choose the "localhost" option that references
your CengageNOW project.  Change the other parameters as needed, and press the 
button to load the test page. 

NOTE: You will need to deploy locally each time you make a change in order to 
test it using the steps above. See "Building the Project and Deploying Locally" 
instructions above for information on how to do that.

-------------------------------------------------------------------------------
Publishing Your Changes
-------------------------------------------------------------------------------

After you have made changes, rebuilt the project, and tested them, as described
above, and you are ready to deploy your changes to Covalent servers, you will 
first need to publish them to Nexus.

1. Be sure you don't have any changes in the source code that have not been
tested.

2. Update module.properties with a new version number, and commit that change 
to Subversion, along with your modifications if you haven't already committed 
them.

3. Use the following Ant target to publish to Nexus:
    ant publish

NOTE: If you modified files (including module.properties), running this ant 
target will cause your project to be built again.

-------------------------------------------------------------------------------
Deploying Your Changes to a Covalent Host
-------------------------------------------------------------------------------

Once the new release has been published to Nexus, it can be deployed on any
Covalent host.

Within the CengageNOW project itself, use the following Ant target:
    ant install-module -DmoduleId=cam 
This will fetch the latest version of the module.

-------------------------------------------------------------------------------
Updating Covalent (CNOW) to Use the New Version
-------------------------------------------------------------------------------

Within the CengageNOW project, edit "root/include/covalent/modules.properties", 
and update the version number.  Commit your changes to the project.

-------------------------------------------------------------------------------
Dependencies
-------------------------------------------------------------------------------

TODO: Mention cim and cxd modules
This project requires jQuery 1.5.1 or later be installed on the page where it 
is to be used.
