---
title: "Multi-threading with nodejs"
date: 2023-10-20T16:49:20+09:00
draft: false
tags: ["node"]
featured_image: "/images/node.png"
---


## Overview 
1. What is Multithreading
2. How does Node.js handle asynchronous operations.
3. How to use Node's `worker-threads` module to create and manage threads.


### History

Computers are becoming more powerful thanks to GPUs and multi-cre CPUs, and modern applications leverage **threads(independent execution units in a process)** to maximize application performance

However, **JavaScript is a synchronous, blocking, single-threaded language**. It was initially created to run on browsers, allowing for much of modern web page interactions, form validations, animations, and so on. Running operations on a single thread can block the synchronous execution flow and result in bottlenecks.

Ryan Dahl made Node.js to avoid using threads:

- *"Thread-based networking is relatively inefficient and very difficult to use. Furthermore, users of Node.js are free from worries of dead-locking the process, since there are no locks." - Ryan Dahl, creator of Node.js*

- *"Almost no function in Node.js directly performs I/O, so the process never blocks except when the I/O is performed using synchronous methods of the Node.js standard library. Because nothing blocks, scalable systems are very reasonable to develop in Node.js.*

-----

### What is Multithreading?

**Multithreading** is a program execution model that allows multiple threads to be created within a process. The threads execute independently but concurrently share process resources.


#### Single thread vs Multithreading

We need to understand both single thread and multithread processes to know their differences.

Assume that there are four tasks that a process needs to perform.

A single thread process would execute the tasks one by one as the image below. Each execution needs to wait for the preceding operation to start executing.
{{< figure src="/images/single_thread.png" width="600px">}}

However in a multithreaded process, the tasks can run concurrently in different threads as the image below. 
{{< figure src="/images/multi_thread.png" width="600px">}}

#### Is Node.js Single Threaded?

Depends. If you use Node.js, you will probably be using more than a single thread. 

When Node.js encounters operations that can prevent other operations from running (ex: reading data from a database, file operations), it delegates them to a separate pool of threads managed by a C library known as `libuv`. 

**Node.js is single-threaded at its base, but it can run some operations in parallel**. We cannot create threads that share the same 'context' though.


### Running Parallel Child Processes

We spin up a child process using Node's `child_process` module. The spun-up child processes or subprocesses can communicate through a messaging system. They run separately, allowing you to divide and run your application script from different processes.

A `child_process`provides four different ways to create a child:

```javascript
1.   spawn()
2.   exec()
3.   execFile()
4.   fork()
```


**A Quick demo using the `fork()` method.**

The `fork()` method allows you to create a child process that's connected to the main process currently running your code. It accepts the following three parameters:
- a module path `string` for a JS file to execute on the child process (required)
- an `array` of `string`s to pass as the child processes' arguments
- The options `object` to pass to the child process

```javascript
fork("sub.js", ["arguments"], { cwd: process.cwd() });
```

Let's create the `main.js` file, import the `child_process` module, and create a child process from a fork.

```javascript
// main.js
const child_proc = require("child_process");

console.log("running main.js");
const sub = child_proc.fork("./sub.js");

// sending message to subprocess
sub.send({ from: "parent" });

// listening to message from subprocess
sub.on("message", (message) => {
  console.log("PARENT got message from " + message.from);
  sub.disconnect();
});

```

Then we'll create a subprocess file — `sub.js` — in the same directory as `main.js`:
```javascript
// sub.js
console.log("sub.js is running");

setTimeout(() => {
  // subprocess sending message to parent
  process.send({ from: "client" });
}, 2000);

// subprocess listening to message from parent
process.on("message", (message) => {
  console.log("SUBPROCESS got message from " + message.from);
});
```


Run `main.js`, which will print this in your terminal:

```bash
running main.js
sub.js is running
SUBPROCESS got message from parent
PARENT got message from client
```

What we've done is called **multiprocessing**. As the name implies, it's different from multithreading because we are creating more processes.

In **multithreading**, a single process can have multiple code segments (threads) that run currently within the process.

In **multiprocessing**, the creation of a process is slow and resource-specific. In **multithreading**, however, it's economical to create a thread.




#### What are Worker Threads?

Worker threads can run CPU-intensive JavaScript operations without blocking the event loop from running. 
Unlike `child_process`, `worker_threads` can share memory by transferring ArrayBuffer instances or sharing `SharedArrayBuffer` instances.

#### How to Use Worker Threads in Node.js 

`worker_threads` became available in Node.js 10.5.0. Before this version, you couldn't access the module unless you ran the Node.js program using the `--experimental-worker` flag.


```bash
$ node app.js --experimental-worker
```


Keep in mind this word of wisdom from the Node.js documentation
*"Workers (threads) are useful for performing CPU-intensive JavaScript operations. They do not help much with I/O-intensive work. The Node.js built-in asynchronous I/O operations are more efficient than Workers can be."*

-----
Let’s create a simple example where we have a main file, make a worker thread from another file, and give the thread some data.

First,  create the main file, `main.js`.

```javascript
const { Worker } = require("worker_threads");

function doSomethingCPUIntensive(name) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./sub.js", { workerData: { name } });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`stopped with exit code ${code}`));
      }
    });
  });
}

(async () => {
  try {
    const result = await doSomethingCPUIntensive("John");
    console.log("Parent: ", result);
  } catch (err) {
    console.log(err);
  }
})();
```
We create a worker by passing in the path to a file as the first argument and data as the second argument (the data passed is a clone, so we cannot refer to it from the worker thread).

Then we can listen to a series of events from the worker and act accordingly. For instance, if the worker thread is stopped, we can derive the `exit code`.


Next, we create a worker thread module script which, in our case, will be called `sub.js`:


```javascript
// sub.js
const { workerData, parentPort } = require("worker_threads");

// you can do intensive synchronous stuff here
function theCPUIntensiveTask(name) {
  return `Hello World ${name}`;
}

const intensiveResult = theCPUIntensiveTask(workerData.name);

parentPort.postMessage({ intensiveResult });
```


`workerData` receives data that's passed when the worker is created, and `parentPort` provides a method to return the result of `theCPUIntensiveTask`.

The worker thread is a great tool to run CPU-intensive operations, and can get much more complex than in the simple example above.

If you are running a Node.js version older than Node.js 11.7, use the `--experimental-worker` flag.



```bash
$ node --experimental-worker main.js
```

Running the script prints:
```bash
Parent:  { intensiveResult: 'Hello World John' }
```

### Conclusion

Even though Node doesn’t traditionally support multithreading, worker threads provide a nice workaround (without the potential errors of race conditions common in threads).

-------------------
Acknowledgement
[link 1](https://blog.appsignal.com/2022/07/20/an-introduction-to-multithreading-in-nodejs.html)
[link 2](https://blog.appsignal.com/2023/07/05/multithreading-with-worker-threads-in-nodejs.html)