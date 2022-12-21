"use strict";

{
	C3.Behaviors.aekiro_gameobjectskymen = class MyBehavior extends C3.SDKBehaviorBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}

class EventManagerSky {
	constructor(inst){
		this.map = {};
		this.inst = inst;
	}
	on (eventName,callback,options) {
		if(!this.map[eventName]){
			this.map[eventName] = [];
		}
		
		var once = false;
		if(options){
			once = options.once;
		}
		
		var listener = {"callback":callback,"once":once, "eventName": eventName}
		this.map[eventName].push(listener);
		
		return listener;
	}

	emit (eventName,options) {
		options = options || {};
		var listeners = this.map[eventName];
		var listener;
		if(listeners){
			for (var i = 0, l=listeners.length; i < l; i++) {
				listener = listeners[i];
				listener["callback"](options.args);
				if(listener["once"]){
					this.removeListener(listener);
					
					l=listeners.length;
					i--;
				}
			}
			
		}
		
		
		if(options.propagate == undefined) options.propagate = true;
		if(options.bubble == undefined) options.bubble = true;
		
		var options2 = Object.assign({}, options);
		options2.propagate = false;
		//bubble the event up the hierarchy
		if(options.bubble === true && this.inst){
			var go = this.inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(go.parent){
				go.parent.GetUnsavedDataMap().aekiro_gameobjectskymen.eventManager.emit(eventName,options2);
			}	
		}
		
		options2 = Object.assign({}, options);
		options2.bubble = false;
		//propagate the event down the hierarchy 
		
		if(options.propagate === true && this.inst){
			var go = this.inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			var children = go.children;
			for (var i = 0, l=children.length; i < l; i++) {
				children[i].GetUnsavedDataMap().aekiro_gameobjectskymen.eventManager.emit(eventName,options);
			}
		}
	}

	removeListener(listener) {
		var listeners = this.map[listener["eventName"]];
		var index = listeners.indexOf(listener);
		listeners.splice(index, 1);
	}
}


var aekiro_goskyManager = {
	gos : {},
	haltNext:false,
	isRegistering:false,
	eventManager: new EventManagerSky(),
	lastLayout:0,
	
	init : function(runtime,beh){
		if(this.runtime)return;
		this.runtime = runtime;
		var _self = this;		
		
		//this is used instead of Release(), because Release() comes after beforelayoutstart and clears everything that was setup.
		this.runtime.Dispatcher().addEventListener("instancedestroy", function(e){
			//if(!runtime.GetLayoutManager().IsEndingLayout())return;
			
			var go = e.instance.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(go){
				go.Release2();
			}
		});
		
		var layouts = this.runtime.GetLayoutManager().GetAllLayouts();
		for (var i = 0, l= layouts.length; i < l; i++) {
			layouts[i]._iLayout.addEventListener("beforelayoutstart",function(){
				console.log("aekiro_goskyManager: beforelayoutstart");
				//console.log(_self.gos);
				_self.register();
			});
		}
		
	},

	clean : function(){
		var key;
		for(key in this.gos){
			if(this.gos[key].IsDestroyed()){
				console.log("az");
				this.removeGO(key);
			}
		}
	},
	
	clean2 : function(){
		var key;
		for(key in this.gos){
			if(!this.gos[key].GetObjectClass().IsGlobal()){
				this.removeGO(key);
				//remove from its parent's children list
				//this.removeFromParent();

				/*var runtime = this.GetRuntime();
				for (var i = 0, l= this.children.length; i < l; i++) {
					runtime.DestroyInstance(this.children[i]);
				}
				this.children.length = 0;*/
			}
		}
	},
	
	addGO : function(inst){
		if(this.haltNext)return;
		if(!inst)return;
		
		var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;

		if(!aekiro_gameobjectskymen.name){
			aekiro_gameobjectskymen.name = "o"+inst.GetUID();
		}
		/*if(!name){
			console.error("Aekiro Hierarchy: object of uid=%s has no name !",inst.uid);
			return;
		}*/
		var name = aekiro_gameobjectskymen.name;
		if(this.gos.hasOwnProperty(name)){
			console.error("Aekiro Hierarchy: GameObject already exist with name: %s !",name);
			return;
		}

		this.gos[name] = inst;
	},

	removeGO : function(name){
		delete this.gos[name];
	},

	createInstance : function (objectClass,layer,x,y){
		var inst = this.runtime.CreateInstance(objectClass,layer,x,y);
		const b = this.runtime.GetEventSheetManager();
		b.BlockFlushingInstances(!0);
		//inst._TriggerOnCreated();
		b.BlockFlushingInstances(!1),
		//if(!doNotChangeCurrentSelection){
		objectClass.GetCurrentSol().SetSinglePicked(inst);
		return inst;
	},
	
	clone : function (template,name,parent,layer, x, y){
		if(this.gos[name]){
			console.error("Aekiro GameObject: GameObject already exist with name: %s !",name);
			return;
		}
		
		if (typeof parent === 'string'){
			parent = this.gos[parent];	
		}
		
		//the x,y are global and clone expect locals, so transform xy into locals in parent space
		if(parent){
			var wp = parent.GetWorldInfo();
			var res = this.globalToLocal3(x,y,0,wp.GetX("g"),wp.GetY("g"),wp.GetAngle("g"));
			x = res.x;
			y = res.y;
		}
		
		var inst = this._clone(template,name,parent,layer,x,y);
		
		inst.GetUnsavedDataMap().aekiro_gameobjectskymen.children_update();
		
		return inst;
	},
	
	_clone : function (t_node,name,parent,layer, x, y){
		
		//haltNext is used to skip some functions executed on the instance creation
		this.haltNext = true;
		var inst = this.createInstance(t_node.type, layer);
		this.haltNext = false;

		var b;
        try {
            b = JSON.parse(t_node.json);
        } catch (a) {
            return void console.error("Failed to load from JSON string: ", a);
        }
		inst.LoadFromJson(b,!0);
		
		var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
		inst.GetUnsavedDataMap().zindex = t_node.zindex;
		inst.GetSdkInstance().CallAction(aekiro_gameobjectskymen.acts.MoveToLayer,layer);

		
		aekiro_gameobjectskymen.name = "";
		if(name)aekiro_gameobjectskymen.name = name;
		aekiro_gameobjectskymen.onCreateInit();
		
		if(parent){
			parent.GetUnsavedDataMap().aekiro_gameobjectskymen.children_add(inst);
		}
		
		var wi = inst.GetWorldInfo();
		wi.SetX(x);
		wi.SetY(y);
		wi.SetBboxChanged();
		
		//we put the trigger after the json state is applied, so that any modif happening in the eventsheet onCreated wont be overrided by the LoadFromJsonString
		inst._TriggerOnCreated();
		
		
		var child;
		for (var i = 0, l= t_node.children.length; i < l; i++) {
			child = t_node.children[i];
			this._clone(child,null,inst, layer, child.x, child.y);
		}

		
		
		
		return inst;
	},
	
	globalToLocal3: function(x,y,a,p_x,p_y,p_angle){
		var res = {};
		res.x = (x-p_x)*Math.cos(p_angle) + (y-p_y)*Math.sin(p_angle);
		res.y = -(x-p_x)*Math.sin(p_angle) + (y-p_y)*Math.cos(p_angle);
		res.angle = a - p_angle;
		return res;
	},
	
	register:function(){
		/*if(this.isRegistering)return;	
		this.isRegistering = true;*/
		//console.log(this.gos);
		var key, go, aekiro_gameobjectskymen;
		var parentSameLayer = {};
		for(key in this.gos){
			go = this.gos[key];
			aekiro_gameobjectskymen = go.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parentName && this.gos[aekiro_gameobjectskymen.parentName]){
				this.gos[aekiro_gameobjectskymen.parentName].GetUnsavedDataMap().aekiro_gameobjectskymen.children_add(go);
			}
			if(aekiro_gameobjectskymen.parentSameLayer){
				parentSameLayer[key] = go;
			}
		}
		
		for(key in parentSameLayer){
			go = parentSameLayer[key];
			aekiro_gameobjectskymen = go.GetUnsavedDataMap().aekiro_gameobjectskymen;
			aekiro_gameobjectskymen.children_addFromLayer(aekiro_gameobjectskymen.GetWorldInfo().GetLayer());
		}
		
		//the onCreated trigger is executed before the children_register; so when a modif is applied to the parent on the trigger, the chidlren dont get updated
		for(key in this.gos){
			this.gos[key].GetUnsavedDataMap().aekiro_gameobjectskymen.children_update();
		}
		
		console.log("childrenRegistred");
		this.eventManager.emit("childrenRegistred");
	}

}
