# Splitit App - Sketch / proof-of-concept Calculator Feature

In this branch you will find an unfinished sketch of a proof-of-concept calculator utility as discussed by the team on a meeting back to the second week of Sept-2024. The file can be found as a single [index.html with a JS and CSS files under the `sketchcalc` folder of this branch](https://github.com/chingu-voyages/v51-tier2-team-23/tree/sketchcalc/sketchcalc/index.html)

The intention of the sketch was to make a first evaluation of the technical requirements and draw a quick-and-dirty tool that allowed us to identify what was feasible and viable in the time left.

The project was intentionally done in raw HTML-JS as I was not a React developer and there were members of the team without broad technical knowledge when installing packages.

This development began during the fourth Sprint and was on the way to a cleaner proposal so it could be shown to the rest of the group for further discussion before suddenly having to stop further development due to personal circunstances.

## What the plan was

Our split calculator would have taken all our Participants with data presented on a table format or similar. It could work as follow:
* It could split the contributions either using relative - percentage - split or absolute contribution
* It would have allowed the editing of more than one Participant

A gif of the project can be seen bellow:

![](/resources/img/sketchCalc.gif)

In the example above, you can see that:
1. All split defaults to even split of 10000 between 4 Participants at loading
2. An edit of the column of absolute contributions for 2 Participants is selected
3. An update is made only for the absolute contribution after change

## How the code looked like

As previously mentioned, the sketch was left as a raw HTML / JS code as it was meant to explore the realization of a more functional project.

A much simple explanation of each of the functionalities in a form of tasks could have been:

### `populateFunc` function

Always default to:

> take the total allotment (a global hardcoded value), count the number of "participants" and split the contributions evenly between them (absolute as well as percentages).

### `editBtnFunc` function

> Make editable the cells of the table based on the user's selection of a column (in this sketch only available for the absolute contributions column), and the "participants".

### `updateBtnFunc` function

> Once the user has inputed new (absolute) contributions for the selected "participants", update their contribution and split evenly the remaining contribution between the non-edited "participants".


## What we found

During the exploration we found the following points that were to be discussed with the group before stop developing:

### Some of the workflows were identified

There was still some work on adding good code practices but the patterns that needed to be tackled in order to make the calculator started to emerge from this sketch. Also how to organize the data, the data sources, and the required functionalities.

### The project was left as JS

The choice of JS over TS was originally made to make a quick prototype. When I resumed the development I was not in conditions to work on TS and left the project as JS.

### The source of data should have come from Participants and/or Group Details

For the sketch of the calculator I hardcoded some data inputs, but I knew the component would require some kind of data coming from outside. The best source would be the @E_Asiedu data from participants or more likely the Group Details including @E_Asiedu Participants data. That source should update the cells (I used a HTML table for convenience but it can be any other kind of solution).

### A better, scalable way to identify cells had to be found

There are many ways to trace the cells in the table. It is about to find an optimal solution. Currently the identification is enough but not ideal. It requires more research. 

### Changes in the splits could have been loaded on a temporary file before the user decided to save the data

The calculator should not save data on the data file until the user is satisfied with the result, so all data is kept on the browser until the person is satisfied, after that the data should be saved on Local Storage or on the @E_Asiedu  data file.

A tentative data container was starting to emerge with the use of a empty object (see `newContr` in the `update` function) that could have been a possible option for a temporary data storage. 

## Where we were heading to

The intention was to explore with the team the feasibility of translating the findings into a cleaner React code and formalize a component that could have been inserted in the full workflow of the app, likely to appear under the Group Details section.

The reality is that this proof-of-concept was not discussed by the team as expected. This sketch was still an alternative to a simpler one proposed by @Tesfaye in his wireframe and the idea was to decide which route to follow after comparing the alternatives. But because we couldn't discuss the feasibility of this sketch and the motivation to go forward either with this proposal, the proposal by @Tesfaye, or any other proposal, the concretization of this sketch as part of the final product vision of the team was not certain.