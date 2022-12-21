"use strict";

{
C3.Behaviors.aekiro_gameobjectskymen.Cnds = {
	IsName(name){ return name == this.name; },
	IsParentName(name){return name == this.parentName; },
	OnCloned(){ return false; }
};

}
