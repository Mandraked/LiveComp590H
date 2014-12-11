#pragma strict

var Gun : GameObject;
var upDown:float; 
var speed:int = 2; 
var hightDiv:int = 150; 
var t:float;
var keyboardShortcut = 0;
public var showOnNarrator : boolean = false;

private var allowShow : boolean = true;
private var maincamera : GameObject;
private var audioC : PlayerAudioController;
private var begun : boolean = false;

function Start () {
	if (showOnNarrator) allowShow = false;
	if (allowShow) Begin();
}

function Begin () {
	Gun = Instantiate(Gun, transform.position, transform.rotation);
   	maincamera = GameObject.FindGameObjectWithTag("MainCamera");
	audioC = maincamera.GetComponent(PlayerAudioController);
	begun = true;
}

function Update () {
	//print('update');
	//print(allowShow);
	if (showOnNarrator)
	{
		if (MainScript.sceneProgression == 4 || MainScript.sceneProgression == 2)
		{
			var obj = GameObject.FindWithTag('NarratorDoor');
			if (obj != null) 
			{
				var script = obj.GetComponent(NarratorMain);
				if (script.IsDone()) allowShow = true;
			}
		}
		else if (MainScript.sceneProgression == 5 || MainScript.sceneProgression == 7)
		{
			print('GunHoldColumn: checkingKills');
			if (MainScript.checkKills()) allowShow = true;
		}
	}

	if (allowShow && !begun) Begin();

	if(Gun.activeSelf && allowShow){
		print('notActive');
		if (MainScript.currentScene != 2)
		{
			if (!GunSelection.gunLocks[keyboardShortcut-1]) Gun.SetActive(false);
		}
		Gun.transform.Translate(Vector3.up * upDown); 
		t += speed *(Time.deltaTime); 
		upDown = (Mathf.Sin(t))/hightDiv;
	}
}

function OnTriggerEnter (other : Collider) {
	if(other.gameObject.tag == "Player" && allowShow){
		print('picked up');
		audioC.PlayGunPickup();
		GunMouseController.hasGun = true;
		GameObject.Find("astronautglove").SendMessage("UnlockWeapon", keyboardShortcut-1);
		Gun.SetActive(false);
		MainScript.guns[keyboardShortcut-1] = true;
		var nObj = GameObject.FindWithTag('BlockWall');
		if (nObj != null)
		{
			print('true');
			nObj.SetActive(true);
		}
		Destroy(gameObject);
	}
}