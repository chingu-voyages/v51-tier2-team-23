# Splitit App - Sketch / proof-of-concept Calculator Feature

In this branch you will find an unfinished sketch of a proof-of-concept calculator utility as discussed by the team on a meeting back to the second week of Sept-2024. The file can be found as a single [index.html under the `sketchcalc` folder of this branch](https://github.com/chingu-voyages/v51-tier2-team-23/tree/sketchcalc/sketchcalc/index.html)

The intention of the sketch was to make a first evaluation of the technical requirements and draw a quick-and-dirty tool that allowed us to identify what was feasible and viable in the time left.

The project was intentionally done in raw HTML-JS as I was not a React developer and there were members of the team without broad technical knowledge when installing packages.

The project was been prepared during the fourth Sprint and was on the way to a cleaner proposal so it could be shown to the rest of the group for further discussion before suddenly having to stop further development due to personal circunstances.

## What the plan was

Our split calculator would have taken all our Participants with data presented on a table format or similar. It could work as follow:
* It could split the contributions either using relative - percentage - split or absolute contribution
* It would have allowed the editing of more than one Participant

A gif of the project can be seen bellow:

![](/resources/img/sketchCalc.gif)

In the example above, you can see that:
1. All split defaults to even split of 10.000 between 4 Participants at loading
2. An edit of the column of absolute contributions for 2 Participants is selected
3. An update is made only for the absolute contribution after change (incomplete work)

> __Observation__: the split was incorrect in the demo but that error is corrected in the last version of this sketch, in the index.html

## How the code looked like

As previously mentioned, the sketch was left as a raw HTML / JS code as it was meant to explore the realization of a more functional project.

Bellow you can see the flow diagram made with PlantUML of the functionalities that we reached to complete before the development of the sketch had to stop:

![](/resources/img/flowdiagJS.svg)

The PlantUML code can be found in one of [the folders of this branch](https://github.com/chingu-voyages/v51-tier2-team-23/tree/sketchcalc/resources/scripts/flowDiagPlantUML).

## What we found

During the exploration we found the following points that were to be discussed with the group before stop developing:

### Some of the workflows were identified

There was still some work on adding good code practices but the patterns that needed to be tackled in order to make the calculator started to emerge from this sketch. Also how to organize the data, the data sources, and the required functionalities.

### Better renaming of the variables and functionalities and better organization should be made

This was disregarded as I was exploring the current setting but the sketch turned confusing because the naming. I was to work on this as first action before presenting the project to my team but unfortunately I had to stop short.

### The source of data should have been come from Participants and/or Group Details

For the sketch of the calculator I hardcoded some data inputs, but I knew the component would require some kind of data coming from outside. The best source would be the @E_Asiedu data from participants or more likely the Group Details including @E_Asiedu Participants data. That source should update the cells (I used a HTML table for convenience but it can be any other kind of solution).

### A better, scalable way to identify cells should have been found

One thing I discovered during my test was that cells will require some kind of unique but easy-to-loop identification to keep track of the correct modification of the cells after editing. One solution, apart of enumerating the columns and the rows, could be to dynamically adding unique identifiers (it could be the name of the participant if unique, or any other id) so the code can be used to update the data accordingly. 

Column identification is fixed; row is likely dynamic. The need to uniquely identify cells is sketched in the current proposal but it will require extensive re-work to make it useful because mine was very experimental and dirty.

### Changes in the splits could have been loaded on a temporary file before the user decided to save the data

The calculator should not save data on the data file until the user is satisfied with the result, so all data is kept on the browser until the person is satisfied, after that the data should be saved on Local Storage or on the @E_Asiedu  data file.

A tentative data container was starting to emerge with the use of a empty object (see `newContr` in the `update` function) that could have been a possible option for a temporary data storage. 

## Where we were heading to

The intention was to explore with the team the feasibility of translating the findings into a cleaner React code and formalize a component that could have been inserted in the full workflow of the app, likely to appear under the Group Details section. The reality is that this proof-of-concept was not discussed by the team as expected. There was another simpler proposal by @Tesfaye that he suggested as he worked on the wireframe. But because we couldn't discuss the feasibility of this sketch and the motivation to go forward either with this proposal, the proposal by @Tesfaye, or any other proposal, the concretization of this sketch as part of the final product vision of the team was not certain.