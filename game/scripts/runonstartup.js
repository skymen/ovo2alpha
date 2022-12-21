
// Put any global functions etc. here

runOnStartup(async runtime =>
{
	// Code to run on the loading screen
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
	globalThis.g_runtime = runtime;
	assignButtonsCode(runtime);
});

function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout'
	// on the first layout. Initial instances are created
	// and available to use here.
	runtime.assets.fetchJson("Courses.json").then(json => {
		globalThis.courses = json;
		//TODO remove later when menus are done.
		loadCourse(0).then(()=>{
			console.log("course loaded");
			loadChapter(0);
			loadLevel(0);
			//runtime.goToLayout("Level");
		});
	});
	runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime)
{
	// Code to run every tick
}
