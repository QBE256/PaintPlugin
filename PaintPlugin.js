/*
  ペイント機能 ver1.1

[概要]
このプラグインを導入するとで画面上にお絵描きができるようになります。

[操作方法]
左クリックを押しっぱなしでマウスカーソルを動かすだけです。
右クリックで消せます。

[制約]
機能の都合上、本来のマウス操作はできなくなります。

[推奨バージョン]
srpg studio ver 1.194以降

[製作者名]
キュウブ

[更新履歴]
ver 1.1 (2020/04/03 12:00)
bug fix

ver 1.0 (2020/04/03)
new entry

[規約]
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。
・クレジット明記無し　OK (明記する場合は"キュウブ"でお願いします)
・再配布、転載　OK (バグなどがあったら修正できる方はご自身で修正版を配布してもらっても構いません)
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。


*/
var MouseDrawControl = {
	_mouseDrawAddressArray: null,
	_timer: 0,
	_canvas: null,

	init: function() {
		this._mouseDrawAddressArray = [];
		this._timer = 0;
		this._canvas = root.getGraphicsManager().getCanvas();
		this._canvas.setFillColor(0x0000ff, 100);
	},

	_addAddress: function(x, y) {

		if (this._mouseDrawAddressArray.length > 1 && 
			this._mouseDrawAddressArray[this._mouseDrawAddressArray.length - 1][0] === x && 
			this._mouseDrawAddressArray[this._mouseDrawAddressArray.length - 1][1] === y) {

			return;
		}

		if (this._mouseDrawAddressArray.length > 500) {
			this._mouseDrawAddressArray.shift();
		}
		this._mouseDrawAddressArray.push([x, y]);
		this._timer = 60 * 2;
	},

	getAddressArray: function() {
		return this._mouseDrawAddressArray;
	},

	_draw: function() {
		var x1,y1,x2,y2;

		this._canvas.setFillColor(0x0000ff, this._timer * 10);
		for (var i = 1; i < this._mouseDrawAddressArray.length; i++) {

			x1 = this._mouseDrawAddressArray[i - 1][0];
			y1 = this._mouseDrawAddressArray[i - 1][1];
			x2 = this._mouseDrawAddressArray[i][0];
			y2 = this._mouseDrawAddressArray[i][1];

			if (x1 === -1 || y1 === -1 || x2 === -1 || y2 === -1) {
				continue;
			}

			this._canvas.drawLine(x1, y1, x2, y2, 5);
		}
	},

	drawAction: function() {
		this._draw();

		//if (root.isInputState(InputType.BTN4)) {
		if (root.isMouseState(MouseType.LEFT)) {
			this._addAddress(root.getMouseX(), root.getMouseY());
		}
		else {
			this._addAddress(-1, -1);
		}

		if (--this._timer <= 0 || root.isMouseAction(MouseType.RIGHT)) {
			this.init();
		}
	}
};

ScriptCall_Draw = function(scene, layerNumber, commandType)
{
	var mouseEnvironmentIndex;

	if (layerNumber === 0) {
		if (scene !== SceneType.REST) {
			MapLayer.drawMapLayer();
		}
	}
	else if (layerNumber === 1) {
		SceneManager.drawSceneManagerCycle(scene);
		root.drawAsyncEventData();
	}
	else {
		EventCommandManager.drawEventCommandManagerCycle(commandType);
	}
	MouseDrawControl.drawAction();
};

ScriptCall_Setup = function()
{
	SetupControl.setup();
	MouseDrawControl.init();
	root.getMetaSession().setDefaultEnvironmentValue(11, 0);
};

(function(){
	// 環境設定からマウス系項目を消してます
	ConfigWindow._configureConfigItem = function(groupArray) {
		groupArray.appendObject(ConfigItem.MusicPlay);
		groupArray.appendObject(ConfigItem.SoundEffect);
		if (DataConfig.getVoiceCategoryName() !== '') {
			groupArray.appendObject(ConfigItem.Voice);
		}
		if (DataConfig.isMotionGraphicsEnabled()) {
			groupArray.appendObject(ConfigItem.RealBattle);
			if (DataConfig.isHighResolution()) {
				groupArray.appendObject(ConfigItem.RealBattleScaling);
			}
		}
		groupArray.appendObject(ConfigItem.AutoCursor);
		groupArray.appendObject(ConfigItem.AutoTurnEnd);
		groupArray.appendObject(ConfigItem.AutoTurnSkip);
		groupArray.appendObject(ConfigItem.EnemyMarking);
		groupArray.appendObject(ConfigItem.MapGrid);
		groupArray.appendObject(ConfigItem.UnitSpeed);
		groupArray.appendObject(ConfigItem.MessageSpeed);
		groupArray.appendObject(ConfigItem.ScrollSpeed);
		groupArray.appendObject(ConfigItem.UnitMenuStatus);
		groupArray.appendObject(ConfigItem.MapUnitHpVisible);
		groupArray.appendObject(ConfigItem.MapUnitSymbol);
		groupArray.appendObject(ConfigItem.DamagePopup);
		if (this._isVisible(CommandLayoutType.MAPCOMMAND, CommandActionType.LOAD)) {
			groupArray.appendObject(ConfigItem.LoadCommand);
		}
		groupArray.appendObject(ConfigItem.SkipControl);
	};

	EnvironmentControl.isMouseOperation = function() {
		return false;
	};

	EnvironmentControl.isMouseCursorTracking = function() {
		return false;
	}

	InputControl.isSelectAction = function() {
		return root.isInputAction(InputType.BTN1);
	}

	InputControl.isCancelAction = function() {
		return root.isInputAction(InputType.BTN2);
	}

	MouseControl.getIndexFromMouse = function(scrollbar) {
		return -1;
	};

	MouseControl.moveAutoMouse = function() {
		return;
	};

	MouseControl.isHovering = function(range) {
		var x = 0 - root.getViewportX();
		var y = 0 - root.getViewportY();
		
		return isRangeIn(x, y, range);
	};

	MouseControl.moveMapMouse = function(mapCursor) {
		return;
	};
})();