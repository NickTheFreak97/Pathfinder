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

#### Start point

This tool lets you select a starting point, to be used as initial state in the search problem. A starting point can match a vertex of some polygon in the scene or can be picked in the void space. You're not allowed to pick a starting point inside a polygon, and failing to comply will highlight the polygon red and prevent you from running any solving algorithm. A choice of the starting point can be undone through the 'delete' tool, but this will invalidate any previously existing solution.

#### Destination point

This tool is the analogus of the 'start point' tool for the selection of a destination point to serve as a goal for the search problem. Everything stated for the previous tool applies to this one, too. You won't be able to run an algorithm if you haven't previously selected both a start and a destination point.

#### Run algorithm

This tool is the core of the application. It is composed of several sections that we're going to discuss here. The first component is the algorithm selection dropdown menu. With this component you can choose which algorithm to run from a predefined list, including `BFS`, `DFS`, `Iterative Deepening`, `Uniform Cost` and `A*`. Be aware that the first three of them won't guarantee you to find the shortest path between the two given points, but BFS and ID will find the shallowest path to the goal, i.e. the one requiring the minimum amount of 'jumps'. 

<b>Note:</b> Currently the 'Breadth first' option is bugged and you can't select it before switching to a new algorithm before. The issue is being investigated with low priority. 


When you're all set up and you want to try this amazing tool, you can press the `Find path` button and this will trigger the execution. On run, the visibility map will be recalculated if anything changed from the last run or no visibility map already exists. After that, the execution of the algorithm will be triggered and on completion a complete log will be presented as a table on the top of the canva. You can also copy the log as CSV using the `copy` action button on the extreme right column. 

<b>Note:</b> As of now `create-react-app` doesn't support [web workers](https://it.wikipedia.org/wiki/Web_worker) and therefore all the code will be run on the main thread. For a sufficiently large number of polygons or vertices in the scene (or both) the computation gets quite expensive especially for the visibility map generation. During testing the biggest amount of time elapsed from click to successful result generation was around 10 minutes with 100ish polygons and around 20 vertices at most each (ran on a Macbook Air M1 2020). Inconveniently, this might lead the browser to assume the page is just blocked and will ask you wether or not to quit; it is your choice, but please allow the application some more time if you generated a very large scene.

Keep in mind that if any convex polygon, any point inside a polygon or two any polygons overlapping are detected, this button will be disabled and the problematic polygon highlighted red. Please make sure your scene conforms with the specified properties are satisfied. 

You can also opt in for computing the Effective Branching Factor. If this option is selected, after the execution of the algorithm took place the EBF will be estimated using Newton's algorithm and displayed on the results table. 

##### Random scene generator
The application allows the user to generate a random scene with the desired specifications. When you click on the `Randomize` button you'll be greeted with a dialog that will allow you to provide parameters to the random scene generation algorithm. Such parameters are the following:
<ol>
  <li>
    <b>Polygon number:</b> The desired amount of polygons to generate. Be aware that basing on the provided value for the remaining parameters it might not     be possible to generate the specified amount of polygons, in which case the algorithm will generate as many of it as possible. Minimum value allowed       for this parameter is 2.
  </li>
  <li>
    <b>Maximum vertices:</b> The maximum amount of vertices each polygon could possibly have. The random scene generation algorithm will generate for each    polygon a random number of vertices between 3 and the specified value with uniform probability. It isn't guaranteed a priori that at least one polygon      with this many of vertices will exist, and if you want to force it you can opt-in for <code>Force maximum vertices</code>. As a polygon needs to have at    least three vertices, the minimum value for this parameter is 3.
  </li>
  <li>
    <b>Minimum circumcenters distance:</b> The random scene generation algorithm, to guarantee that two any generated polygons will be disjoint, will           generate random circles that will enclose the polygons. This parameter allows you to specify the minimum distance between the center of such circles.       Keep in mind that a smaller value will allow you to pack more polygons in the scene, but if the specified amount of polygons to generate is low, this       will likeky lead to generate small polygons that will not be in the way between the starting and destination point and will therefore have little           impact on the performance of the algorithm. If unsure what value to use, leave it as default, i.e. 21.
  </li>
</ol>

#### Visibility and opacity controls

Under the `Run algorithm` tool, below the `Randomization` button you can find a `Visibiliy` accordion (dropdown) that allows you to opt-in or opt-out (depending on the default value) for the visualization on canva of some properties of the specific algorithm run. This includes the `Explored` list, the `Frontier` and the solution itself, that are the most interesting under an algorithmc comprehention perspective, but also includes other elements that were initially implemented for debugging purposesm such as a `visibility map` representing the vertices visible from every point in the scene, an `hitbox` set, that includes all the AABB tree nodes (green) and leaves (red/orange depending on hit/not hit) used for broad collision detection phase, and `random circles`, that (only) if a random scenario was generated, will show the outer (gray) and inner (orange) generated encompassing circles for each random polygon. 

Each of the aforementioned controls has two customization features: you can individually hide/show one of them altogether, or regulate their opacity through a slider (this section might slip below the viewport bottom line, scroll bottom if you can't see it). 

### Solution

Once an algorithm was executed, a report of interesting statistics is created and displayed through a table view right above the canva itself. The report includes the executed `algorithm name` just in case you're feeling heedless, the `number or polygons` in the scene, the `average & maximum vertices` count, but most importantly useful informations to evaluate the algorithm's performance. This includes the `run time` (in milliseconds), `memory` usage (in Bytes), the `depth` of the found solutions in number of steps from the starting point, the `branching factor` of the specific instance of the problem, defined as the maximum amount of vertices visible from a single point, the `cost` of the solutions, that measures the distance in px from the start and destination point along the solution path, the `Effective Branching Factor` if you opted in for it, and the sizes expressed in number of nodes or both the `frontier` and the `explored` data structures.
