# Batch Daemon Ideas

## Current Memory Requirements

### Initiator
```
[home ~/]> mem batches/hwgw-initiator.js 

This script requires 8.60GB of RAM to run for 1 thread(s)

  2.00GB | getServer (fn)

  1.60GB | baseCost (misc)

  1.00GB | run (fn)

  1.00GB | weakenAnalyze (fn)

  1.00GB | growthAnalyze (fn)

  1.00GB | growthAnalyzeSecurity (fn)

500.00MB | getPlayer (fn)

200.00MB | scan (fn)

 50.00MB | sqlinject (fn)

 50.00MB | httpworm (fn)

 50.00MB | relaysmtp (fn)

 50.00MB | ftpcrack (fn)

 50.00MB | brutessh (fn)

 50.00MB | nuke (fn)
```

### Orchestrator

```
[home ~/]> mem batches/hwgw-orchestrator.js 

This script requires 6.65GB of RAM to run for 1 thread(s)

  1.60GB | baseCost (misc)

  1.00GB | run (fn)

  1.00GB | hackAnalyzeSecurity (fn)

  1.00GB | weakenAnalyze (fn)

  1.00GB | growthAnalyze (fn)

  1.00GB | growthAnalyzeSecurity (fn)

  50.00MB | getServerUsedRam (fn)
```

## Scripts

The goal behond separating this process into various scripts for each part of the process is to have as few scripts running at a time as possible. Always keep in mind that any new script incurs an extra 1.6GB, so I don't want to run too many at once either. There should be four scripts: researcher, daemon, initiator, orchestrator. The researcher and daemon are the only ones that need to call `run`. The others should only be concerned with executing their batch portion and then ending.

- Runner
- Researcher
- Initiator
- Orchestrator
- Worker

### Runner

**NOTE**: Instead of calling `run`, when necessary to run scripts on `home` call execute instead with `home` as the target

This is the only script that should have `run`. It's largely a helper to the orcehstrator that will listen to anything command that requires executing a new script for the next process. Given that this will require 1.6 gigs as well as the extra ram for `run` it's posisble that this could be combined with the orcehstrator. It depends on how big the orchestrator gets.

Instead of telling the individual nodes to start up their own scripts, this one can call `execute` on each

### Researcher Script

- Gather all server info and player info
- Stringify each and pass into initiator script along with player informaion

### Initiator Script

- Input:
    - Player info
    - Server stats
        - Including `home` and all `pservs`

### Orchestrator

- Input
    - Batch stats
        - There's no need to recalculate

### Worker

This will need to be able to listen to incoming requests as well as run potentially multiple batch scripts. This will likely mean two separate scripts on each worker

### Message Broker

- Listen on one (some?) port, write to another
- One port per topic as well as a sign on.
- When new listener signs on, report that port
- All messages sent to broker. It then is in charge of actually sending it to the respective listeners.
- **TODO**: When processing a received message, if the corresponding topic does not exist, log an error and move on
- Should there be a global topic for all outgoing messages?
- Each subscriber must acknowledge each message
    - This means subscribers can only `peek` the incoming data
    - These messages can be sent to the subscriber topic with the type `ack`
    - Once all listeners have ack'd the message, then the message broker will `read` the top data to pop it off the queue
    - Ack message:
        ```typescript
        body: string // the ack'd message's ID
        ```
- Messages:
    - id
    - source: string
    - headers: [string, string] :: name -> value
        - topic (event name)
        - type
            - command
            - event
            - ack
    - body: Event Type

### Decorators

- Event Listener
    - Topic name: string
- Command Requester
    - Command topic
- Command Listener
    - Listens to topic: string
    - Produces to topic: string

During setup:
- For each event listener:
    - Subscribe to that topic
- For each command requester:
    - Register to the command topic
- For each command listener:
    - Subscribe to the command topic
    - Register to the writing topic

### Models

#### Batch Stats

```typescript
// overall variable:
batchStats: Map<string, BatchStats>

hostname: string
weakenStrength: number = 0.05
```

## CQRS Details

### Events

- Initialization info retrieved
- Batch stats refreshed

#### InitializationInfoRetrieved

Publisher: `researcher`

```typescript
player: Player
home: Server
allServers: Server[]
totalRamPool: number
```

### Commands

- Register new subscriber
- Register new publisher
- Gather initialization info
- Request batch
- Report batch complete
- Update batch stats for target

#### NewSubscriber

```typescript
name: string
topic: string
```

#### NewPublisher

```typescript
name: string
topic: string
```

#### BatchRequested

```typescript
target: string

```

## Ram Available

- Populate at beginning
- Every time batch starts, remove the total needed for the batch as well as the amount each bot will use from it's entry in the pool
- When a batch ends, add that back to the total and pool

### Variables

```typescript
totalRamAvailable: number
ramPool: Map<string, number>
```

### Batch Object

```typescript
id: string // This would be the target hostname
target: Server
totalRamRequired: number
nodes: Map<string, number> // [node hostname] -> [ram used by node]
```

## Flow

- Get player details
- Get server details
- Store those details in memory
- Calc ram pool

## Ensure TODO these

- ~~Since the plan right now is to kill the orchestrators after 100 runs, I'll need to figure out a way for the daemon to know when they've exited. I believe `run` has an option to provide a callback to know when it's done, or it's possible that I could use the pid, or I could possibly use ports to "event" script endings~~
- I need to rethink this based on how the actual batch stats rework pans out
- Rewrite the calculatios for a new batch stats design: 
    - Given that most servers have the same "performance stats" (i.e. number of cores), the only thing that changes is the player stats. This means that if the stats are calculated for each target at the start, most won't change. The only ones that will change are the ones related to the player
- Disable all logs in each script and make sure to print everything
- Make sure to include a port threshold in the startup script
- Ensure that every script that is called returns an actual PID - not 0. If 0 is returned, throw an alert, but continue the process.
- Potentially two lists:
    - Worker nodes - must have ram > what's necessary for script to run
    - Potential targets - must have max $ greater than 100k
        - These nodes would not be targets
            - CSEC
            - avmnite-02h
            - run4theh111z
            - I.I.I.I
            - .
            - The-Cave
            - darkweb

## Pending Thoughts

- Should I enforce single ~~publisher~~ responsibility?
    - I'm thinking this would be a nice to have to implement later on if I actually decide to make this event-sourced 
    - This would mean:
        - Event topics: 1 writer
        - Command topics: 1 consumer
