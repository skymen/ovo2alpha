function loadCourse(id)
{
	return globalThis.g_runtime.assets.fetchJson(globalThis.courses[id]).then(json => {
		globalThis.currentCourse = json;
	});
}

function loadChapter(id)
{
	globalThis.currentChapter = globalThis.currentCourse.chapters[id];
}

function loadLevel(id)
{
	globalThis.currentLevel = globalThis.currentChapter.levels[id];
}

function createCurLevel()
{
	globalThis.currentLevel.objects.forEach(object => {
		let inst = globalThis.g_runtime.objects[object.name].createInstance(0, object.x, object.y);
		inst = {
			...inst,
			...object,
			instVars: {
				...inst.instVars,
				...object.instVars
			}
		}
	})
}