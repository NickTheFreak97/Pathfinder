# A guide to Pathfinder's usage

You'll here find a description of what Pathfinder is, how to get it on your PC and how to use its basic functionalities

## Installation

Pathfinder was entirely created using React and its create-react-app boilerplate with typescript template. Therefore, if you have NodeJS installed on your computer you can clone this project in a folder, navigate to it from a terminal session and run the follwing command:

`npm install`

This will install all the required dependencies, and once the process is finished you can run `npm start` to start the project. The application will run at the following location by default: [localhost:3000](https://localhost:3000). Navigate to it through a web browser and get started!

## How to use

The application is a single-page web app. There are two main sections to it: the side toolbar and the canva. 

### How to use the toolbar
#### Hand-create polygons

Starting from the top, the first tool in the toolbar is a polygon draw tool (rectangle icon). When this is selected, you can input polygons using one of two ways: you can either click on the canva to add a new vertex at the click location, or you can input individual vertices coordinates through the input fields that appear below the toolbar and pressing the '+' button. The two input methods can be combined inside the same polygon, as you can change it as you go. A polygon is considered to be closed as soon as a new input vertex is close enough to an existing one of the same polygon. 

#### Delete

With this tool you can remove existing polygons if you're unsatisfied of how it looks, but you can also cancel the selected starting or destination point. The result of this action is irreversible and cannot be undone. If a solution is currently being displayed, doing so will invalidate it, meaning you won't be able to visualize the solution, frontier, expanded and visibility map anymore, although the log will still be available on the top section, above the canva. 

#### Selection

This tool is thought to give the user the maximum possible flexibility. When using this tool you'll be able to click on a polygon to select it, drag it, move it to a different location, scale it, skew it, and even rotate it. Doing so could potentially make two or more polygons overlap, in which case the overlapping shapes will be highlighted in red. If two any polygons overlap you won't be able to run the selected algorithm. Also, as well as the 'delete' function, moving a polygon from its current position when a solution is being displayed will invalidate it and you won't be able to see the frontier, explored and visibility map anymore. This tool can be used when the starting or destination point match one of the vertices' polygon, too. 

####
