"use strict";
{
C3.Behaviors.aekiro_gameobjectskymen.Instance = class MyBehaviorInstance extends C3.SDKBehaviorInstanceBase {
	constructor(behInst, properties)
	{
		super(behInst);

		//properties
		if (properties){
			this.name = properties[0];
			this.parentName = properties[1];
			this.parentSameLayer = properties[2];
		}

		//********************
		var self = this;
		this.GetObjectInstance().GetUnsavedDataMap().aekiro_gameobjectskymen = this;
		this.inst = this.GetObjectInstance();
		this.wi = this.GetWorldInfo();
		this.acts = this.GetObjectInstance().GetPlugin().constructor.Acts;

	
		this.eventManager = new EventManagerSky(this.inst);
		this.goManager = aekiro_goskyManager;
		/*this.eventManager.on("childrenAdded",function(){
			console.log("onChildrenAdded " + self.GetObjectInstance().GetUID());
		});*/
		
		this.userName = this.name?this.name:null;
		this.areChildrenRegistred = false;
		this.children = [];
		this.parent = null;
		this.local = {
			x : this.wi.GetX("g"),
			y : this.wi.GetY("g"),
			angle: this.wi.GetAngle("g"),
			_sinA: Math.sin(this.wi.GetAngle("g")),
			_cosA: Math.cos(this.wi.GetAngle("g"))
		};
		this.overrideBuiltin = true;
		this.updateHierarchy = true;
		
		
		
		this.overrideWorldInfo();
		this.goManager.init(this.GetRuntime(),this.GetBehaviorType().GetBehavior());
		//if(this.goManager.haltNext)return;
		this.goManager.addGO(this.inst);
		
		this.prev = {
			x : this.wi.GetX("g"),
			y : this.wi.GetY("g"),
			angle : this.wi.GetAngle("g"),
			width: this.wi.GetWidth(),
			height: this.wi.GetHeight()
		};
		
		//console.log(this.GetBehaviorType().GetBehavior().GetInstances());
		//console.log(this);

		this._StartTicking()
		console.log("constructor gameobject");
	}


	PostCreate(){
		//console.log("PostCreate gameobject");
	}
	
	overrideWorldInfo(){
		if(this.isWorldInfoOverrided)return;
		this.isWorldInfoOverrided = true;
		
		var inst = this.GetObjectInstance();
		var wi = inst.GetWorldInfo();
		
		wi.SetX_old = wi.SetX;
		wi.SetX = function (x,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent){
				var y = this.GetY();
				if(space){ //local
					aekiro_gameobjectskymen.local.x = x;
					x = aekiro_gameobjectskymen.localToGlobal_x();
					y = aekiro_gameobjectskymen.localToGlobal_y();
				}
				this.SetXY_old(x,y);
			}else{
				this.SetX_old(x);
			}
			aekiro_gameobjectskymen.children_update();
		};
		
		wi.SetY_old = wi.SetY;
		wi.SetY = function (y,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent){
				var x = this.GetX();
				if(space){//local
					aekiro_gameobjectskymen.local.y = y;
					x = aekiro_gameobjectskymen.localToGlobal_x();
					y = aekiro_gameobjectskymen.localToGlobal_y();	
				}
				this.SetXY_old(x,y);
			}else{
				this.SetY_old(y);
			}
			aekiro_gameobjectskymen.children_update();
		};
		
		wi.SetXY_old = wi.SetXY;
		wi.SetXY = function (x,y,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent){
				if(space){ //local
					aekiro_gameobjectskymen.local.x = x;
					aekiro_gameobjectskymen.local.y = y;
					x = aekiro_gameobjectskymen.localToGlobal_x();
					y = aekiro_gameobjectskymen.localToGlobal_y();
				}
				this.SetXY_old(x,y);
			}else{
				this.SetXY_old(x,y);
			}

			aekiro_gameobjectskymen.children_update();
			//console.log("az");
		};
		
		wi.OffsetX_old = wi.OffsetX;
		wi.OffsetX = function (_x,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent){
				var x = this.GetX();
				var y = this.GetY();
				if(space){ //local
					aekiro_gameobjectskymen.local.x += _x;
					x = aekiro_gameobjectskymen.localToGlobal_x();
					y = aekiro_gameobjectskymen.localToGlobal_y();
				}else{
					x += _x;
				}
				this.SetXY_old(x,y);
			}else{
				this.OffsetX_old(_x);
			}

			aekiro_gameobjectskymen.children_update();
			
		};
		
		wi.OffsetY_old = wi.OffsetY;
		wi.OffsetY = function (_y,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			
			if(aekiro_gameobjectskymen.parent){
				var x = this.GetX();
				var y = this.GetY();
				if(space){ //local
					aekiro_gameobjectskymen.local.y += _y;
					x = aekiro_gameobjectskymen.localToGlobal_x();
					y = aekiro_gameobjectskymen.localToGlobal_y();
				}else{
					y += _y;
				}
				this.SetXY_old(x,y);
			}else{
				this.OffsetY_old(_y);
			}

			aekiro_gameobjectskymen.children_update();
			
		};
		
		wi.OffsetXY_old = wi.OffsetXY;
		wi.OffsetXY = function (_x,_y,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			
			if(aekiro_gameobjectskymen.parent){
				var x = this.GetX();
				var y = this.GetY();
				if(space){ //local
					aekiro_gameobjectskymen.local.x += _x;
					aekiro_gameobjectskymen.local.y += _y;
					x = aekiro_gameobjectskymen.localToGlobal_x();
					y = aekiro_gameobjectskymen.localToGlobal_y();
				}else{
					x += _x;
					y += _y;
				}
				this.SetXY_old(x,y);
			}else{
				this.OffsetXY_old(_x,_y);
			}

			aekiro_gameobjectskymen.children_update();
		};
		
		wi.SetAngle_old = wi.SetAngle;
		wi.SetAngle = function (angle,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent){
				if(space){ //local
					aekiro_gameobjectskymen.local.angle = angle;
					aekiro_gameobjectskymen.local._sinA = Math.sin(angle);
					aekiro_gameobjectskymen.local._cosA = Math.cos(angle);
					angle = aekiro_gameobjectskymen.localToGlobal_angle();
				}
				this.SetAngle_old(angle);
			}else{
				this.SetAngle_old(angle);
			}

			aekiro_gameobjectskymen.children_update();
			//console.log("az");
		};
		
		wi.GetX_old = wi.GetX;
		wi.GetX = function (space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent && space !== undefined){
				return aekiro_gameobjectskymen.local.x;
			}
			return this.GetX_old();
		};
		
		wi.GetY_old = wi.GetY;
		wi.GetY = function (space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent && space !== undefined){
				return aekiro_gameobjectskymen.local.y;
			}
			return this.GetY_old();
		};
		
		wi.GetAngle_old = wi.GetAngle;
		wi.GetAngle = function (space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent && space){
				return aekiro_gameobjectskymen.local.angle;
			}
			return this.GetAngle_old();
		};
		
		wi.GetCosAngle_old = wi.GetCosAngle;
		wi.GetCosAngle = function (space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent && space){
				return aekiro_gameobjectskymen.local._cosA;
			}
			return this.GetCosAngle_old();
		};
		
		wi.GetSinAngle_old = wi.GetSinAngle;
		wi.GetSinAngle = function (space){
			//console.log("eee");
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parent && space){
				return aekiro_gameobjectskymen.local._sinA;
			}
			return this.GetSinAngle_old();
		};
		
		wi.SetWidth_old = wi.SetWidth;
		wi.SetWidth = function (v,onlyNode){
			if(onlyNode)this.SetWidth_old(v);
			
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			
			/*if(!aekiro_gameobjectskymen.areChildrenRegistred)
				aekiro_gameobjectskymen.children_register();*/

			v = v==0?0.1:v;
			var f = v/this.GetWidth();

			this.SetWidth_old(v);
			var h = aekiro_gameobjectskymen.children;
			for (var i = 0, l= h.length; i < l; i++) {
				wi = h[i].GetWorldInfo();
				wi.SetWidth(wi.GetWidth()*f);
				wi.SetX(wi.GetX("g")*f, "g");
				wi.SetBboxChanged();
			}
		};
		
		wi.SetHeight_old = wi.SetHeight;
		wi.SetHeight = function (v,onlyNode){
			if(onlyNode)this.SetHeight_old(v);
			
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			
			/*if(!aekiro_gameobjectskymen.areChildrenRegistred)
				aekiro_gameobjectskymen.children_register();*/

			v = v==0?0.1:v;
			var f = v/this.GetHeight();

			this.SetHeight_old(v);
			var h = aekiro_gameobjectskymen.children;
			for (var i = 0, l= h.length; i < l; i++) {
				wi = h[i].GetWorldInfo();
				wi.SetHeight(wi.GetHeight()*f);
				wi.SetY(wi.GetY("g")*f, "g");
				wi.SetBboxChanged();
			}
		};

		wi.SetSize_old = wi.SetSize;
		wi.SetSize = function (w,h,onlyNode){
			if(onlyNode)this.SetSize_old(w,h);
			
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			
			/*if(!aekiro_gameobjectskymen.areChildrenRegistred)
				aekiro_gameobjectskymen.children_register();*/

			w = w==0?0.1:w;
			h = h==0?0.1:h;
			var fw = h/this.GetHeight();
			var fh = w/this.GetWidth();

			this.SetSize_old(w,h);
			var c = aekiro_gameobjectskymen.children;
			for (var i = 0, l= c.length; i < l; i++) {
				wi = c[i].GetWorldInfo();
				wi.SetSize(wi.GetWidth()*fw,wi.GetHeight()*fh);
				wi.SetX(wi.GetX("g")*fw, "g");
				wi.SetY(wi.GetY("g")*fh, "g");
				wi.SetBboxChanged();
			}
		};
		
	}
	
	//**********************************************
	
	children_update(){
		if(!this.children.length)
			return;
		
		var inst,wi;
		
		for (var i = 0, l= this.children.length; i < l; i++) {
			inst = this.children[i];
			wi = inst.GetWorldInfo();
			if (!inst.prevFrame) {
				inst.prevFrame = {
					x: wi.GetX(),
					y: wi.GetY(),
					angle: wi.GetAngle()
				}
			}
			//updating the child's global coordinates when the parent global coordinates changes.
			wi.SetXY(wi.GetX("g") + wi.GetX() - inst.prevFrame.x, wi.GetY("g") + wi.GetY() - inst.prevFrame.y, "g");
			wi.SetAngle(wi.GetAngle("g") + wi.GetAngle() - inst.prevFrame.angle, "g");
			wi.SetBboxChanged();
			inst.prevFrame = {
				x: wi.GetX(),
				y: wi.GetY(),
				angle: wi.GetAngle()
			}
		}
	}

	children_add(inst){
		var name,aekiro_gameobjectskymen;
		if (typeof inst === 'string'){ //add by child name
			name = inst;
			inst = null;
		}else{
			aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(!aekiro_gameobjectskymen){
				console.error("Aekiro GameObject: You're adding a child (uid=%s) without a gameobject behavior on it.",inst.GetUID());
				return;
			}
			name = aekiro_gameobjectskymen.name;
		}

		//check if gameobject is correctly registred in the gomanager
		inst = aekiro_goskyManager.gos[name];
		
		if(inst == this.GetObjectInstance()){ //can't add itself
			return;
		}
		
		if(!inst){
			console.error("Aekiro GameObject: Object of name : %s not found !",name);
			return;
		}
		if(name == this.parentName){
			console.error("Aekiro GameObject: Cannot add %s as a child of %s, because %s is its parent !",name,this.name,name);
			return;
		}
		if(this.children.indexOf(inst) > -1){
			console.error("Aekiro GameObject: Object %s already have a child named %s !",this.name,name);
			return;
		}

		aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
		aekiro_gameobjectskymen.removeFromParent(); //if inst is already a child of another parent then remove it from its parent.
		aekiro_gameobjectskymen.parentName = this.name;
		aekiro_gameobjectskymen.parent = this.GetObjectInstance();

		var res = this.globalToLocal(inst,this.GetObjectInstance());		
		aekiro_gameobjectskymen.local.x = res.x;
		aekiro_gameobjectskymen.local.y = res.y
		aekiro_gameobjectskymen.local.angle = res.angle;
		this.children.push(inst);
		
		this.eventManager.emit("childrenAdded",inst);
	}
	
	children_addFromLayer (layer){
		var insts = layer._instances;
		var myInst = this.GetObjectInstance();
		var inst,aekiro_gameobjectskymen;
		for (var i = 0, l = insts.length; i < l; i++) {
			inst = insts[i];
			aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(inst != myInst && aekiro_gameobjectskymen && aekiro_gameobjectskymen.parentName==""){
				this.children_add(inst);
			}
		}
	}
	
	children_addFromType (type){
		var insts = type.GetCurrentSol().GetInstances();
		for (var i = 0, l = insts.length; i < l; i++) {
			this.children_add(insts[i]);
		}		
	}
	
	children_remove(inst){
		var index = -1;
		if (typeof inst === 'string'){ //remove by child name
			for (var i = 0, l= this.children.length; i < l; i++) {
				if(this.children[i].GetUnsavedDataMap().aekiro_gameobjectskymen.name==inst){
					index = i;
					break;
				}
			}
		}else{
			index = this.children.indexOf(inst);
		}

		if(index!=-1){
			var aekiro_gameobjectskymen = this.children[index].GetUnsavedDataMap().aekiro_gameobjectskymen;
			aekiro_gameobjectskymen.parentName = "";
			aekiro_gameobjectskymen.parent = null;
			this.children.splice(index, 1);
			
		}
	}
	
	children_removeFromType (type){
		var insts = type.GetCurrentSol().GetInstances();
		for (var i = 0, l = insts.length; i < l; i++) {
			this.children_remove(insts[i]);
		}		
	}
	
	removeAllChildren(){
		if(!this.children.length)
			return;
		
		var aekiro_gameobjectskymen;
		for (var i = 0, l= this.children.length; i < l; i++) {
			aekiro_gameobjectskymen = this.children[i].GetUnsavedDataMap().aekiro_gameobjectskymen;
			aekiro_gameobjectskymen.parentName = "";
			aekiro_gameobjectskymen.parent = null;
		}
		this.children.length = 0;
	}
	
	//**********************************************

	removeFromParent(){
		//var parent = this.parent_get();
		var parent = this.parent;
		var inst = this.GetObjectInstance();
		if(parent){
			var aekiro_gameobjectskymen = parent.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen){
				aekiro_gameobjectskymen.children_remove(inst);
			}
				
		}
	}
	
	destroyHierarchy(){
		var runtime = this.GetRuntime();
		
		runtime.DestroyInstance(this.GetObjectInstance());
		for (var i = 0, l= this.children.length; i < l; i++) {
			this.children[i].GetUnsavedDataMap().aekiro_gameobjectskymen.destroyHierarchy()
		}
		this.children.length = 0;
	}
	
	parent_get(){
		if(!this.parent && this.parentName && this.name){
			this.parent = aekiro_goskyManager.gos[this.parentName];	
		}
		return this.parent;
	}
	
	getTemplate(node){
		if(!node){
			node = this._inst;
		}
		
		var template = {
			type: node.GetObjectClass(),
			x: node.GetWorldInfo().GetX("g"),
			y: node.GetWorldInfo().GetY("g"),
			zindex:node.GetWorldInfo().GetZIndex()+node.GetWorldInfo().GetLayer().GetIndex()*100,
			json:JSON.stringify(node.SaveToJson(!0)),
			children:[]
		};
		

		var children = node.GetUnsavedDataMap().aekiro_gameobjectskymen.children;
		for (var i = 0, l= children.length; i < l; i++) {
			template.children.push(this.getTemplate(children[i]));
		}

		return template;
	}

	hierarchyToArray(node,ar){
		if(!node){
			node = this.GetObjectInstance();
		}

		if(!ar){
			ar = [];
		}

		ar.push(node);

		var children = node.GetUnsavedDataMap().aekiro_gameobjectskymen.children;
		for (var i = 0, l= children.length; i < l; i++) {
			this.hierarchyToArray(children[i],ar);
		}

		return ar;
	}

	updateZindex(){
		var children = this.hierarchyToArray();
		
		children.sort(function(a, b) {
			return a.GetUnsavedDataMap().zindex - b.GetUnsavedDataMap().zindex;
		});
		//console.log(children);

		var layer = children[0].GetWorldInfo().GetLayer();
		//layer.moveInstanceAdjacent(children[0], children[children.length-1], true);
		for (var i = 1, l= children.length; i < l; i++) {
			layer.MoveInstanceAdjacent(children[i], children[i-1], true);
		}
		this.GetRuntime().UpdateRender();
	}



	Tick(){
		this.children_update()
	}

	Release2(){
		this.goManager.removeGO(this.name);
		this.removeFromParent();
		
		//this is necesserary when a parent have global children that still keep a reference to the parent.
		//when changing layout this reference need to be deleted
		for (var i = 0, l= this.children.length; i < l; i++) {
			this.children_remove(this.children[i]);
		}
		
		super.Release();
	}
	
	SaveToJson(){
		return {
		};
	}

	LoadFromJson(o){
	}

	GetDebuggerProperties(){		
		var children = [];
		for (var i = 0,l=this.children.length; i < l; i++) {
			children.push(this.children[i].GetUnsavedDataMap().aekiro_gameobjectskymen.name);
		}
		var children_str = JSON.stringify(children,null,"\t");

		var objects = [];
		Object.keys(aekiro_goskyManager.gos).forEach(function(key) {
			objects.push(key);
		});
		var objects_str = JSON.stringify(objects,null,"\t");

		return [{
			title: "aekiro_gameobjectskymen",
			properties: [
				{name: "name", value: this.name},
				{name: "parentName", value: this.parentName},
				{name: "children", value: children_str},
				{name: "local_x", value: this.local.x},
				{name: "local_y",value: this.local.y},
				{name: "local_angle",value: this.local.angle},
				{name: "gameobjects", value: objects_str}
			]
		}];
	}
	
	//**********************************************
	
	applyActionToHierarchy(action,v){
		this.GetObjectInstance().GetSdkInstance().CallAction(action,v);
		var h = this.children;
	    for (var i = 0, l= h.length; i < l; i++) {
			h[i].GetUnsavedDataMap().aekiro_gameobjectskymen.applyActionToHierarchy(action,v);
		}
	}
	
	SetBlendMode(bm){
		this.wi.SetBlendMode(bm);
		var h = this.children;
	    for (var i = 0, l= h.length; i < l; i++) {
			h[i].GetWorldInfo().SetBlendMode(bm);
		}
		
	}
	//**********************************************		
	//transform global coordinates of inst to local coordinates in parent space
	globalToLocal(inst,parent_inst){
		var wip = parent_inst.GetWorldInfo();
		return this.globalToLocal2(inst,wip.GetX(),wip.GetY(),wip.GetAngle());
	}
	
	globalToLocal2(inst,p_x,p_y,p_angle){
		var res = {};
		var wi = inst.GetWorldInfo();
		res.x = (wi.GetX()-p_x)*Math.cos(p_angle) + (wi.GetY()-p_y)*Math.sin(p_angle);
		res.y = -(wi.GetX()-p_x)*Math.sin(p_angle) + (wi.GetY()-p_y)*Math.cos(p_angle);
		res.angle = wi.GetAngle() - p_angle;
		return res;
	}

	//transform local coordinates of inst in parent space to global coordinates
	localToGlobal(inst,p_x,p_y,p_angle){
		var res = {};
		var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
		res.x = p_x + aekiro_gameobjectskymen.local.x*Math.cos(p_angle) - aekiro_gameobjectskymen.local.y*Math.sin(p_angle);
		res.y = p_y + aekiro_gameobjectskymen.local.x*Math.sin(p_angle) + aekiro_gameobjectskymen.local.y*Math.cos(p_angle);
		res.angle = p_angle + aekiro_gameobjectskymen.local.angle;
		return res;
	}

	localToGlobal_x(){
		var parent = this.parent_get();
		if(parent){
			//console.log(this.GetObjectInstance().GetUID());
			var wp = parent.GetWorldInfo();
			var x = wp.GetX() + this.local.x*Math.cos(wp.GetAngle()) - this.local.y*Math.sin(wp.GetAngle());
			return x;
		}else{
			return this.local.x;
		}
	}

	localToGlobal_y(){
		var parent = this.parent_get();
		if(parent){
			var wp = parent.GetWorldInfo();
			var y = wp.GetY() + this.local.x*Math.sin(wp.GetAngle()) + this.local.y*Math.cos(wp.GetAngle());
			return y;
		}else{
			return this.local.y;
		}
	}
	
	localToGlobal_angle(){
		var parent = this.parent_get();
		if(parent){
			var wp = parent.GetWorldInfo();
			var angle = wp.GetAngle() + this.local.angle;
			return angle;
		}else{
			return this.local.angle;
		}
	}
	
	};





}

