# NodeJS test

This a test assignment I've done for a coding academy. Although I failed to deliver it on time, I still went on and completed it.
The test is a simple, unanimated fighting game built with React and utilizes class components.

![Screenshot of the fight](/assets/screenshot.jpeg)

# Features

In order to play, a user is required to create an account or log in to an existing one.
Upon login, players can pick pre-defined fighter characters or create new ones with the desired specs.
The app also logs player moves and saves the log in the database upon the end of the fight.

# What I did

Backend:

- Authentication endpoints
- User endpoints
- Fighter endpoints
- Fight log endpoints
- Validation (for POST and PUT requests) and error handling

Frontend:

- Fight sequence (listening for key presses and releases, logging of moves, updating players' health bars, etc.)
- Modal window

# Rules and controls

Players hit each other with the **A** (left player) and **J** (right player) keys.

Players can block strikes by pressing the **D** and **L** keys, respectively. If the force of the block is greater than the force of the attack, the attack will be dodged.
None of the fighters can strike while in a block.

Fighters can also deliver critical strikes that cannot be blocked. In order to deliver such a strike, you need to press 3 corresponding keys at the same time - **Q, W, E** for the left player and **U, I, O** for the right player.
A power strike ability has a cooldown of 10 seconds.

## Installation and running

Run commands

```
cd client
npm install
npm run build
cd ..
npm install
npm start
```

Then open [http://localhost:3080](http://localhost:3080)
