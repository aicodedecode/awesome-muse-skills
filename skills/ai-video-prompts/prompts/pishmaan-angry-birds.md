Create a fully functional Angry Birds game in a single HTML file using pure CSS and JavaScript, without external libraries. It must include:
PHYSICS: Constant gravity; blocks must have mass, move, fall, and collide with each other when hit by a bird. Use a simple rigid body system. Blocks accumulate damage based on the speed of impact and break progressively (3 visual states: intact, damaged, destroyed).
BIRDS: At least 3 types — red (normal), yellow (accelerates when clicked in flight), blue (splits into 3 when clicked). They are launched one at a time from a slingshot with mouse drag. Show the tails of the remaining birds.
TARGETS: At least 4 pigs with their own HP. They are damaged by direct impact or by blocks falling on them. They must display damage expressions.
LEVEL: The stage must be wider than the screen (minimum 1600px) with horizontal scrolling that follows the bird in flight.
UI: Real-time scoring, stars at the end (1-3 based on points), reset button, victory and defeat screens.
VISUAL: Background with sky, clouds, textured ground, animated slingshot with elastic cords, predictive dotted trajectory.
The turn changes automatically when the bird stops or goes off-screen. The level ends when there are no pigs left (victory) or the birds run out (defeat).
