# Make pingpong

[Play here](https://make-ping-pong.surge.sh/)

I approached the game the way that you play both sides of the field
at the same time and you get point for each hit on both bats. I was also thinking about multiplayer approach, but my approach seems to be easier in this case and I could test better just playing by myself.

I also created a leaderboard functionality, where I use just localstorage, so the results are relevant only on your browser.
I considered also using firebase store, but eventually I went with localstorage to just mock the saving of data somewhere.

For bats movement use `up` and `down` arrow keys.
