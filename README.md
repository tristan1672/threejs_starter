# threejs_starter - simple_backend_example branch

A threejs-starter project with a simple nestjs backend and a rabbitMQ message broker that listens
and publishes events from frontend interactions

This branch is part of a proof of concept implementation that shows inter-project communication.
This project serves as a input interface in a 4-part communication line. It serves as an input entry
point into the project. Events in the threejs sandbox interface are published through the attached 
rabbitMQ broker to the rest of the projects. Main events that are published are shape changes and
color changes.

Inter-project communication POC
frontend edge device: https://github.com/tristan1672/sveltekit-starter - running locally

backend conduit server: https://github.com/tristan1672/PERN-Docker-Project/tree/rabbitMQ-to-threeJS_project

event input interface: https://github.com/tristan1672/threejs_starter/tree/simple_backend_example

Description:
-threejs frontend that renders basic geometry with phong shaded materials
-basic lil gui that allows for controlling shape changes and color changes
-shape changed with drop down box in gui panel
-color changed by typing in HEX color code in gui panel
-raycast object dragging and augmented controls

Controls:
-Basic orbital controls : scroll wheel to zoom in and out, left click onto world to rotate, right click onto world for axis movement
-Augmented flying controls : W A S D for forward backward left right movement
-Picking and Dragging : Left click/Scrollwheel click hold on object allows object position dragging, Right click hold on object allows object rotational dragging

Known Bugs:
-After creating new object through panel, clicking object does not focus panel updates to selected object. Panel will only modify latest created object.
