# fluro-boilerplate-beta
Beta version of a deployable 'Hello World' application

# Getting Started
~~~~
git clone https://github.com/Hyperblaster/fluro-boilerplate-beta myapplicationname
~~~~

Once you have cloned the repository change into the directory and install node packages, install bower components into the 'app' folder
	
~~~~
cd myapplicationname
npm install
cd app
bower install
cd ../

~~~~

# Grunt
Once bower and node packages have been installed start grunt using
~~~~
grunt
~~~~

This will open a new browser window at the development URL and start watching your style.scss file, and all .js, .html and .scss files in the 'build/components' folder, Any changes will automatically trigger SCSS to compile, Javascript to concatenate and HTML to be made into angular templates, this will also live reload your browser window.

Start coding!
