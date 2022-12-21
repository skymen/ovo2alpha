/*****=== MODULE: TIMEOUT AND INTERVALS ====**********/
/*****Author: skymen                        **********/
/*****Description: Exports two functions:   **********/
/*****  interval: works like setInterval    **********/
/*****  timeout: works like setTimeout      **********/
/*****                                      **********/
/*****Both count time in seconds instead of **********/
/*****milliseconds and respect time scale   **********/
/*****                                      **********/
/*****======================================**********/

(function () {
    // Init and get runtime
    runOnStartup(async runtime =>
    {
        // Code to run on the loading screen.
        // Note layouts, objects etc. are not yet available.

        runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
    });

    function OnBeforeProjectStart(runtime)
    {
        // Code to run just before 'On start of layout' on
        // the first layout. Loading has finished and initial
        // instances are created and available to use here.

        runtime.addEventListener("tick", () => Tick(runtime));
        runtime.getAllLayouts().forEach(layout => {
            layout.addEventListener("beforelayoutstart", () => StartOfLayout(layout, runtime))
        });
    }

    // Init local vars
    let timeouts = [];
    let curTime = 0;

    // Export functions to global scope
    globalThis.timeout = (callback, duration, isInterval = false) => {
        timeouts.push({
            callback,
            duration,
            current: duration,
            isInterval
        });
    }

    globalThis.interval = (callback, duration) => {
        globalThis.timeout(callback, duration, true);
    }


    // Local functions for more processing
    function StartOfLayout(layout, runtime) {
        timeouts = [];
    }

    function Tick(runtime)
    {
        let dt = runtime.gameTime - curTime;
        curTime = runtime.gameTime
        for(let i = 0; i < timeouts.length; i++) {
            let cur = timeouts[i];
            cur.current -= dt;
            if (cur.current <= 0) {
                cur.callback()
                if (cur.isInterval) {
                    cur.current = cur.duration;
                } else {
                    timeouts.splice(i, 1);
                    i--;
                }
            }
        }
    }
})()