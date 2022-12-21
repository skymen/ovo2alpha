function assignButtonsCode(runtime) {
	globalThis.moveArea = runtime.callFunction.bind(globalThis.g_runtime, "MoveArea")
	globalThis.getButton = (id) => {
		return runtime.objects.ButtonTrigger.getAllInstances().find(x=>x.instVars.ID === id);
	}
}
//fn