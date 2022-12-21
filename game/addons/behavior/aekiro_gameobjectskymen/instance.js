"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.aekiro_gameobjectskymen;

	BEHAVIOR_CLASS.Instance = class aekiro_gameobjectskymenInstance extends SDK.IBehaviorInstanceBase
	{
		constructor(sdkBehType, behInst)
		{
			super(sdkBehType, behInst);
		}
		Release()
		{
		}
		OnCreate()
		{
		}
		OnPropertyChanged(id, value)
		{
		}
		LoadC2Property(name, valueString)
		{
			return false;       // not handled
		}
	};
}
