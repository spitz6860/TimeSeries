System Usage App Version 0.1 04/01/2015


Description
-------------------------

This is the source code for a simple web application that shows timeseries usage data for different 

computer system components in line charts. The backend is an api written in GO while the front 

end uses angular.js.  


Set Up Notes
-------------------------

This app uses Gorilla, a golang web toolkit I'm using to handle api routing. You can find some basic 

information here: http://www.gorillatoolkit.org/pkg/mux. 


To install Gorilla, run the command "$ go get github.com/gorilla/mux" in your GO workspace directory.


I've also included all the front end dependacies in the directories, so no further work should be

required to make the app work.


To run the app, simply run the command "$ go run main.go" in the timeseries directory. You should be

able to go to http://localhost:8080/ to view the app. If you wish to change the port number, simple edit

it in line 71 of main.go and then rerun the program.

