
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
		/*this.eventManager.on("childrenAdded",function(){
			console.log("onChildrenAdded " + self.GetObjectInstance().GetUID());
		});*/
		
		
		this.userName = this.name?this.name:null;
		this.isInit = false;
		this.areChildrenRegistred = false;
		this.children = [];
		this.parent = null;
		this.local = {
			x : this.wi.GetX(),
			y : this.wi.GetY(),
			angle: this.wi.GetAngle(),
			_sinA: Math.sin(this.wi.GetAngle()),
			_cosA: Math.cos(this.wi.GetAngle())
		};
		this.overrideBuiltin = true;
		this.updateHierarchy = true;
		
		this.overrideWorldInfo();
		
		aekiro_goskyManager.init(this.GetRuntime(),this.GetBehaviorType().GetBehavior());
		if(aekiro_goskyManager.haltNext)return;
		aekiro_goskyManager.addGO(this.inst);
		this.prev = {
			x : this.wi.GetX(),
			y : this.wi.GetY(),
			angle : this.wi.GetAngle(),
			width: this.wi.GetWidth(),
			height: this.wi.GetHeight()
		};
		
		//console.log(this.GetBehaviorType().GetBehavior().GetInstances());
		
		//console.log(this);


		console.log("constructor gameobject");

	}


	PostCreate(){
		//console.log("PostCreate gameobject");
	}
	
	overrideWorldInfo(){
		/*if(this.worldInfoOverride){
		console.log("already ovverded");
		return;
		}
		this.worldInfoOverride = true;*/
		
		var inst = this.GetObjectInstance();
		var wi = inst.GetWorldInfo();
		
		wi.SetX_old = wi.SetX;
		wi.SetX = function (x,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			var y = this.GetY("g");
			if(!space){ //local
				aekiro_gameobjectskymen.local.x = x;
				x = aekiro_gameobjectskymen.localToGlobal_x();
				y = aekiro_gameobjectskymen.localToGlobal_y();
			}
			this.SetXY_old(x,y);
			aekiro_gameobjectskymen.children_update();
		};
		
		wi.SetY_old = wi.SetY;
		wi.SetY = function (y,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			var x = this.GetX("g");
			if(!space){//local
				aekiro_gameobjectskymen.local.y = y;
				x = aekiro_gameobjectskymen.localToGlobal_x();
				y = aekiro_gameobjectskymen.localToGlobal_y();	
			}
			this.SetXY_old(x,y);
			aekiro_gameobjectskymen.children_update();
		};
		
		wi.SetXY_old = wi.SetXY;
		wi.SetXY = function (x,y,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;

			if(!space){ //local
				aekiro_gameobjectskymen.local.x = x;
				aekiro_gameobjectskymen.local.y = y;
				x = aekiro_gameobjectskymen.localToGlobal_x();
				y = aekiro_gameobjectskymen.localToGlobal_y();
			}
			this.SetXY_old(x,y);
			aekiro_gameobjectskymen.children_update();
			//console.log("az");
		};
		
		
		wi.OffsetX_old = wi.OffsetX;
		wi.OffsetX = function (_x,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			var x = this.GetX("g");
			var y = this.GetY("g");
			if(!space){ //local
				aekiro_gameobjectskymen.local.x += _x;
				x = aekiro_gameobjectskymen.localToGlobal_x();
				y = aekiro_gameobjectskymen.localToGlobal_y();
			}else{
				x += _x;
			}
			this.SetXY_old(x,y);
			aekiro_gameobjectskymen.children_update();
			
		};
		
		wi.OffsetY_old = wi.OffsetY;
		wi.OffsetY = function (_y,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			var x = this.GetX("g");
			var y = this.GetY("g");
			if(!space){ //local
				aekiro_gameobjectskymen.local.y += _y;
				x = aekiro_gameobjectskymen.localToGlobal_x();
				y = aekiro_gameobjectskymen.localToGlobal_y();
			}else{
				y += _y;
			}
			this.SetXY_old(x,y);
			aekiro_gameobjectskymen.children_update();
			
		};
		
		wi.OffsetXY_old = wi.OffsetXY;
		wi.OffsetXY = function (_x,_y,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			var x = this.GetX("g");
			var y = this.GetY("g");
			if(!space){ //local
				aekiro_gameobjectskymen.local.x += _x;
				aekiro_gameobjectskymen.local.y += _y;
				x = aekiro_gameobjectskymen.localToGlobal_x();
				y = aekiro_gameobjectskymen.localToGlobal_y();
			}else{
				x += _x;
				y += _y;
			}
			this.SetXY_old(x,y);
			aekiro_gameobjectskymen.children_update();
		};
		
		
		wi.SetAngle_old = wi.SetAngle;
		wi.SetAngle = function (angle,space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;

			if(!space){ //local
				aekiro_gameobjectskymen.local.angle = angle;
				aekiro_gameobjectskymen.local._sinA = Math.sin(angle);
				aekiro_gameobjectskymen.local._cosA = Math.cos(angle);
				angle = aekiro_gameobjectskymen.localToGlobal_angle();
			}
			this.SetAngle_old(angle);
			aekiro_gameobjectskymen.children_update();
			//console.log("az");
		};
		
		
		wi.GetX_old = wi.GetX;
		wi.GetX = function (space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(space == undefined){
				return aekiro_gameobjectskymen.local.x;
			}
			return this.GetX_old();
		};
		
		wi.GetY_old = wi.GetY;
		wi.GetY = function (space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(space == undefined){
				return aekiro_gameobjectskymen.local.y;
			}
			return this.GetY_old();
		};
		
		wi.GetAngle_old = wi.GetAngle;
		wi.GetAngle = function (space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(!space){
				return aekiro_gameobjectskymen.local.angle;
			}
			return this.GetAngle_old();
		};
		
		
		wi.GetCosAngle_old = wi.GetCosAngle;
		wi.GetCosAngle = function (space){
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(!space){
				return aekiro_gameobjectskymen.local._cosA;
			}
			return this.GetCosAngle_old();
		};
		
		
		wi.GetSinAngle_old = wi.GetSinAngle;
		wi.GetSinAngle = function (space){
			//console.log("eee");
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(!space){
				return aekiro_gameobjectskymen.local._sinA;
			}
			return this.GetSinAngle_old();
		};
		
		wi.SetWidth_old = wi.SetWidth;
		wi.SetWidth = function (v,onlyNode){
			if(onlyNode)this.SetWidth_old(v);
			
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			
			if(!aekiro_gameobjectskymen.areChildrenRegistred)
				aekiro_gameobjectskymen.children_register();

			v = v==0?0.1:v;
			var f = v/this.GetWidth();

			this.SetWidth_old(v);
			var h = aekiro_gameobjectskymen.children;
			for (var i = 0, l= h.length; i < l; i++) {
				wi = h[i].GetWorldInfo();
				wi.SetWidth(wi.GetWidth()*f);
				wi.SetX(wi.GetX()*f);
				wi.SetBboxChanged();
			}
		};
		
		wi.SetHeight_old = wi.SetHeight;
		wi.SetHeight = function (v,onlyNode){
			if(onlyNode)this.SetHeight_old(v);
			
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			
			if(!aekiro_gameobjectskymen.areChildrenRegistred)
				aekiro_gameobjectskymen.children_register();

			v = v==0?0.1:v;
			var f = v/this.GetHeight();

			this.SetHeight_old(v);
			var h = aekiro_gameobjectskymen.children;
			for (var i = 0, l= h.length; i < l; i++) {
				wi = h[i].GetWorldInfo();
				wi.SetHeight(wi.GetHeight()*f);
				wi.SetY(wi.GetY()*f);
				wi.SetBboxChanged();
			}
		};

		wi.SetSize_old = wi.SetSize;
		wi.SetSize = function (w,h,onlyNode){
			if(onlyNode)this.SetSize_old(w,h);
			
			var inst = this.GetInstance();
			var aekiro_gameobjectskymen = inst.GetUnsavedDataMap().aekiro_gameobjectskymen;
			
			if(!aekiro_gameobjectskymen.areChildrenRegistred)
				aekiro_gameobjectskymen.children_register();

			w = w==0?0.1:w;
			h = h==0?0.1:h;
			var fw = h/this.GetHeight();
			var fh = w/this.GetWidth();

			this.SetSize_old(w,h);
			var c = aekiro_gameobjectskymen.children;
			for (var i = 0, l= c.length; i < l; i++) {
				wi = c[i].GetWorldInfo();
				wi.SetSize(wi.GetWidth()*fw,wi.GetHeight()*fh);
				wi.SetX(wi.GetX()*fw);
				wi.SetY(wi.GetY()*fh);
				wi.SetBboxChanged();
			}
		};
		
	}
	
	//**********************************************
	children_register(){
		if(this.areChildrenRegistred)
			return;

		//Finding all the children
		var gos = aekiro_goskyManager.gos;
		var go,aekiro_gameobjectskymen;
		var self = this;
		if(this.userName){
			Object.keys(gos).forEach(function(key) {
				go = gos[key];
				aekiro_gameobjectskymen = go.GetUnsavedDataMap().aekiro_gameobjectskymen;
				if(aekiro_gameobjectskymen.parentName == self.name){
					self.children_add(go);
					//aekiro_gameobjectskymen.children_register();
				}
			});
		}
		
		if(this.parentSameLayer){
			this.children_addFromLayer(this.GetWorldInfo().GetLayer());
		}

		this.areChildrenRegistred = true;
	
		//the onCreated trigger is executed before the children_register; so when a modif is applied to the parent on the trigger, the chidlren dont get updated
		this.children_update();
		//console.log(this.name);
		//console.log("children registered");
	}
	
	children_update(){
		if(!this.children.length)
			return;
		
		var inst,wi;
		
		for (var i = 0, l= this.children.length; i < l; i++) {
			inst = this.children[i];
			wi = inst.GetWorldInfo();

			//updating the child's global coordinates when the parent global coordinates changes.
			wi.SetXY(wi.GetX(),wi.GetY());
			wi.SetAngle(wi.GetAngle());
			wi.SetBboxChanged();
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
	
	
	//**********************************************

	removeFromParent(){
		//var parent = this.parent_get();
		var parent = this.parent;
		var inst = this.GetObjectInstance();
		if(parent){
			var aekiro_gameobjectskymen = parent.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen)
				aekiro_gameobjectskymen.children_remove(inst);
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
			x: node.GetWorldInfo().GetX(),
			y: node.GetWorldInfo().GetY(),
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
	}


	Release(){
		super.Release();
	}
	
	Release2(){
		console.log("destroy");
		
		//console.log(this.GetRuntime().GetLayoutManager().IsPendingChangeMainLayout());
		
		var goManager = aekiro_goskyManager;
		goManager.removeGO(this.name);
		//remove from its parent's children list
		this.removeFromParent();
		
		var runtime = this.GetRuntime();
		for (var i = 0, l= this.children.length; i < l; i++) {
			runtime.DestroyInstance(this.children[i]);
		}
		
		this.children.length = 0;
		
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
		return this.globalToLocal2(inst,wip.GetX("g"),wip.GetY("g"),wip.GetAngle("g"));
	}
	globalToLocal2(inst,p_x,p_y,p_angle){
		var res = {};
		var wi = inst.GetWorldInfo();
		res.x = (wi.GetX("g")-p_x)*Math.cos(p_angle) + (wi.GetY("g")-p_y)*Math.sin(p_angle);
		res.y = -(wi.GetX("g")-p_x)*Math.sin(p_angle) + (wi.GetY("g")-p_y)*Math.cos(p_angle);
		res.angle = wi.GetAngle("g") - p_angle;
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
			
			var wp = parent.GetWorldInfo();
			var x = wp.GetX("g") + this.local.x*Math.cos(wp.GetAngle("g")) - this.local.y*Math.sin(wp.GetAngle("g"));
			return x;
		}else{
			return this.local.x;
		}
	}

	localToGlobal_y(){
		var parent = this.parent_get();
		if(parent){
			var wp = parent.GetWorldInfo();
			var y = wp.GetY("g") + this.local.x*Math.sin(wp.GetAngle("g")) + this.local.y*Math.cos(wp.GetAngle("g"));
			return y;
		}else{
			return this.local.y;
		}
	}
	
	localToGlobal_angle(){
		var parent = this.parent_get();
		if(parent){
			var wp = parent.GetWorldInfo();
			var angle = wp.GetAngle("g") + this.local.angle;
			return angle;
		}else{
			return this.local.angle;
		}
	}
	
	

	};


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
		/*this.runtime.GetMainRunningLayout()._iLayout.addEventListener("beforelayoutstart",function(){
			console.log("aekiro_goskyManager: beforelayoutstart");
			_self.register();
		});*/
		
		
		
		this.runtime.Dispatcher().addEventListener("instancedestroy", function(e){
			var go = e.instance.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(go){
				go.Release2();
			}
		});
		
		
		
		
		/*this.runtime.Dispatcher().addEventListener("beforelayoutchange",function(){
			console.log("aekiro_goskyManager: beforelayoutchange");
			_self.clean2();
		});*/
		
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
		for(key in this.gos){
			go = this.gos[key];
			aekiro_gameobjectskymen = go.GetUnsavedDataMap().aekiro_gameobjectskymen;
			if(aekiro_gameobjectskymen.parentName && this.gos[aekiro_gameobjectskymen.parentName]){
				this.gos[aekiro_gameobjectskymen.parentName].GetUnsavedDataMap().aekiro_gameobjectskymen.children_add(go);
			}
			if(aekiro_gameobjectskymen.parentSameLayer){
				aekiro_gameobjectskymen.children_addFromLayer(aekiro_gameobjectskymen.GetWorldInfo().GetLayer());
			}
		}
		for(key in this.gos){
			this.gos[key].GetUnsavedDataMap().aekiro_gameobjectskymen.children_update();
		}
		
		this.eventManager.emit("childrenRegistred");
	}

}

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
		console.log(this.GetObjectInstance().GetPlugin().constructor.Acts);
		//console.log(this.GetRuntime());
		
		var inst = this.GetObjectInstance();
		var wi = inst.GetWorldInfo();
		//console.log(wi);
		//console.log(this.GetObjectInstance().GetSdkInstance().CallAction);
		return;
		
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
		//this.applyActionToHierarchy(this._SetEffect,v);
		this.SetBlendMode(v);
		
	},
	SetWidth(v){
		this.wi.SetWidth(v,true);
		this.wi.SetBboxChanged();
	},
	SetHeight(v){
		this.wi.SetHeight(v,true);
		this.wi.SetBboxChanged();
	}
	
	
};

C3.Behaviors.aekiro_gameobjectskymen.Cnds = {
	IsName(name){ return name == this.name; },
	IsParentName(name){return name == this.parentName; },
	//IsParentType(type){return BelongsToObjectClass(type) },
	OnCloned(){ return false; }
};

C3.Behaviors.aekiro_gameobjectskymen.Exps = {
	name(){ return this.name; },
	parent(){ return this.parentName; },
	globalX(){ return this.GetObjectInstance().GetWorldInfo().GetX_old();},
	globalY(){ return this.GetObjectInstance().GetWorldInfo().GetY_old();},
	globalAngle(){ return this.GetObjectInstance().GetWorldInfo().GetAngle_old();}
};

/*
runOnStartup(async runtime =>
{		
	await runtime.assets.loadScripts("http://127.0.0.1:8080/js/test.js");
	console.log("script loaded");
});*/