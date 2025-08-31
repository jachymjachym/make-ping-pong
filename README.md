# Make pingpong

[Play here](https://make-ping-pong.surge.sh/)

I approached the game the way that you play both sides of the field
at the same time and you get point for each hit on both bats. I was also thinking about multiplayer approach, but my approach seems to be easier in this case and I could test better just playing by myself.

I also created a leaderboard functionality, where I use just localstorage, so the results are relevant only on your browser.
I considered also using firebase store, but eventually went with localstorage to just mock the saving of data somewhere.

Ball speed on `y` axis when bouncing off the bat is increased or decreased randomly for some unpredictablity factor in the game, to make it more difficult.

Also every 10 points the ball gets faster on `x` axis to increase difficulty overtime.

For bats movement use `up` and `down` arrow keys.

## Process

This task was a bit more difficult for me than I expected to be honest. I tried to use chatGPT as little as possible, but sometimes I just didn't resist. I definitely generated the reset.css and asked for help in some calculations and ball physics. I also wasn't sure about the exact implementation of animation frames and helped myself with AI for faster iteration. Otherwise I tried to rely on google, mozzila MDN and got first inspiration [here](https://github.com/adityakmr7/javascript-projects/blob/master/ping-pong-yt/script.js).

I used references to avoid re-rendering on every position change of animated elements.

I paid attention to the code testability (partly), but first iterations were kind of punk and I intended to fix it as much as possible, but I got a bit overwhelmed and running out of time, so I am pretty much aware that my implementation is far from perfect :D

Anyways, I can see some improvements that could be done. For instance extract the animation functionality and controls. I would also implement some `onResize` handlers, to update object positions when the screen is resized to achieve more robust responsivity.

Unfortunately, I wasn't able to come up with solution on the ball traces. My idea was basically to clone ball element multiple times and map it with some delay, but thats where I stopped.

## Additional ideas

- Adding obstacles to the field for more difficult levels
- playing against computer

## Thanks to the end

I think this all in my mind at the moment. The task was really fun and I really enjoyed working on that. I'll be looking forward to your feedback. Thanks for giving me such a cool task, I really appreciate that.

Additionaly I would like to add some bonus stuff. [Check it out](https://standing-direction.surge.sh/). Clicking on the left mesh will do a little magic. It was just for fun as I wanted to explore the three.js, so please don't laugh :D
