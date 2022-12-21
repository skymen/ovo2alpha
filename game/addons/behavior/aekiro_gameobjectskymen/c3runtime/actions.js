"use strict";

{
C3.Behaviors.aekiro_gameobjectskymen.Acts = {
	Clone(layer,x,y,name,parentName){
		var template = this.getTemplate();
		var inst = aekiro_goskyManager.clone(template,name,parentName,layer,x,y);
		inst.GetUnsavedDataMap().aekiro_gameobjectskymen.updateZindex();
		//this.cloneUID = inst.uid;
	}
	,
	AddChildrenFromLayer(layer){
		this.children_addFromLayer(layer);
	},
	AddChildrenFromType(type){
		this.children_addFromType(type);
	}
	,
	AddChildByName(name){
		this.children_add(name);
	},
	RemoveChildByName(name){
		this.children_remove(name);	
	},
	RemoveChildByType(type){
		this.children_removeFromType(type);
	},
	RemoveFromParent(){
		this.removeFromParent();
	},
	RemoveAllchildren(){
		this.removeAllChildren();
	},
	SetGlobalX(x){
	},
	
	SetOpacity(v){
		this.applyActionToHierarchy(this.acts.SetOpacity,v);
	},
	
	SetVisible(v){
		this.applyActionToHierarchy(this.acts.SetVisible,v);
	},
	
	SetColor(v){		
		this.applyActionToHierarchy(this.acts.SetDefaultColor,v);
	},
	
	SetMirrored(v){		
		this.applyActionToHierarchy(this.acts.SetMirrored,v);
	},
	
	SetFlipped(v){		
		this.applyActionToHierarchy(this.acts.SetFlipped,v);
	},
	MoveToLayer(v){
		this.applyActionToHierarchy(this.acts.MoveToLayer,v);
	},
	SetZElevation(v){
		this.applyActionToHierarchy(this.acts.SetZElevation,v);
	},
	SetEffect(v){
		this.SetBlendMode(v);
		
	},
	SetWidth(v){
		this.wi.SetWidth(v,true);
		this.wi.SetBboxChanged();
	},
	SetHeight(v){
		this.wi.SetHeight(v,true);
		this.wi.SetBboxChanged();
	},
	Destroy(){
		this.destroyHierarchy();
	}
};
}	
