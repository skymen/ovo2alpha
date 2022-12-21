"use strict";

{
C3.Behaviors.aekiro_gameobjectskymen.Exps = {
	name(){ return this.name; },
	parent(){ return this.parentName; },
	globalX(){ return this.GetObjectInstance().GetWorldInfo().GetX_old();},
	globalY(){ return this.GetObjectInstance().GetWorldInfo().GetY_old();},
	globalAngle(){ return this.GetObjectInstance().GetWorldInfo().GetAngle_old();}
};
}
