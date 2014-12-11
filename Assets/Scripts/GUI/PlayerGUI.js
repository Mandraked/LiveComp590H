#pragma strict

var healthBarLength : float;
var oxygenBarLength : float;
static var wearingSpaceSuit : boolean;
private var audioBarLength : float;
private var handGunChargeBarLength : float;
private var machineGunChargeBarLength : float;

private var player : GameObject;
private var playerStatus : PlayerStatus;
private var maxHealth;
private var maxOxygen;
private var maxAudio : float;
private var curHealth : float;
private var curOxygen : float;
private var curAudio : float;
private var curHandGunCharge : float;
private var curMachineGunCharge : float;
private var maxBarWidth : float;
private var glove : Transform;
private var handGun : Gun;
private var machineGun : Gun;

public var foregroundTexture : Texture2D;
public var backgroundTexture : Texture2D;
public var guiFont : Font;

private var foregroundStyle : GUIStyle;
private var backgroundStyle : GUIStyle;
private var textStyle : GUIStyle;

private var audioC : PlayerAudioController;

function Awake () {
	player = GameObject.FindGameObjectWithTag("Player");
	//print(GameObject.FindGameObjectsWithTag("Player"));
	
	playerStatus = player.GetComponent(PlayerStatus);
}

function Start () {
	if (MainScript.currentScene == 2)	wearingSpaceSuit = false;
	else wearingSpaceSuit = true;

	audioC = GetComponent(PlayerAudioController);

	glove = transform.Find("astronautglove");
	maxBarWidth = Screen.width/2;
	healthBarLength = maxBarWidth;
	oxygenBarLength = maxBarWidth;
	handGunChargeBarLength = maxBarWidth;
	machineGunChargeBarLength = maxBarWidth;
	audioBarLength = 0;
	//print(playerStatus);
	maxHealth = playerStatus.maxHealth;
	maxOxygen = playerStatus.maxOxygen;
	maxAudio = 200;
	curHealth = playerStatus.GetHealth();
	curOxygen = playerStatus.GetOxygen();
	curAudio = audioC.GetCurrentSample();
	curHandGunCharge = 0.0;
	curMachineGunCharge = 0.0;
	
	foregroundStyle = GUIStyle();
	foregroundStyle.stretchWidth = true;
	foregroundStyle.stretchHeight = true;
	foregroundStyle.normal.background = foregroundTexture;
	backgroundStyle = GUIStyle();
	backgroundStyle.stretchWidth = true;
	backgroundStyle.stretchHeight = true;
	backgroundStyle.normal.background = backgroundTexture;
	textStyle = GUIStyle();
	textStyle.alignment = TextAnchor.MiddleCenter;
	textStyle.richText = true;
	textStyle.font = guiFont;
}

function Update () {
	healthBarLengthUpdate();
	oxygenBarLengthUpdate();
	handGunChargeBarLengthUpdtate();
	machineGunChargeBarLengthUpdtate();
	audioBarLengthUpdate();
	footsteps();
}

function OnGUI() {
	if(wearingSpaceSuit || MainScript.currentScene == 1){
		//Health
		//print('curhealth ' + curHealth);
		var healthText : GUIContent = GUIContent("<color=white>Health: "+parseInt(curHealth)+"/"+maxHealth+"</color>");
		if(curHealth > 0){
			GUI.Label(new Rect(10, 10, healthBarLength, 25), GUIContent.none, foregroundStyle);
		}
		GUI.Label(new Rect(10+healthBarLength, 10, maxBarWidth-healthBarLength, 25), GUIContent.none, backgroundStyle);
		GUI.Label(new Rect(10, 10, maxBarWidth, 25), healthText, textStyle);
		
		//Oxygen
		var oxygenText : GUIContent = GUIContent("<color=white>Oxygen: "+parseInt(curOxygen) + "/" + maxOxygen+"</color>");
		if(curOxygen > 0){
			GUI.Label(new Rect(10, 40, oxygenBarLength, 25), GUIContent.none, foregroundStyle);
		}
		GUI.Label(new Rect(10+oxygenBarLength, 40, maxBarWidth-oxygenBarLength, 25), GUIContent.none, backgroundStyle);
		GUI.Label(new Rect(10, 40, maxBarWidth, 25), oxygenText, textStyle);
		
		//Audio
		GUI.Label(new Rect(Screen.width-35, 10, 25, maxAudio), GUIContent.none, backgroundStyle);
		GUI.Label(new Rect(Screen.width-35, maxAudio-audioBarLength+10, 25, Mathf.Lerp(5,audioBarLength, Time.time)), GUIContent.none, foregroundStyle);
		
		//Handgun Charge
		var handgunChild = glove.transform.Find("GUN_OBJ");
		if(handgunChild.gameObject.activeInHierarchy){
			var handgunChargeText : GUIContent = GUIContent("<color=white>Charge: "+parseInt(curHandGunCharge*100) + "/100</color>");
			var hgChargeVal = curHandGunCharge*maxBarWidth;
			GUI.Label(new Rect(10, 70, hgChargeVal, 25), GUIContent.none, foregroundStyle);
			GUI.Label(new Rect(10+hgChargeVal, 70, handGunChargeBarLength-hgChargeVal, 25), GUIContent.none, backgroundStyle);
			GUI.Label(new Rect(10, 70, handGunChargeBarLength, 25), handgunChargeText, textStyle);
		}
		
		//Machine Gun Charge
		var machinegunChild = glove.transform.Find("CartoonSMG");
		if(machinegunChild.gameObject.activeInHierarchy) {
			var machinegunChargeText : GUIContent = GUIContent("<color=white>Charge: "+parseInt(curMachineGunCharge*100) + "/100</color>");
			var mgChargeVal = curMachineGunCharge*maxBarWidth;
			GUI.Label(new Rect(10, 70, mgChargeVal, 25), GUIContent.none, foregroundStyle);
			GUI.Label(new Rect(10+mgChargeVal, 70, machineGunChargeBarLength-mgChargeVal, 25), GUIContent.none, backgroundStyle);
			GUI.Label(new Rect(10, 70, machineGunChargeBarLength, 25), machinegunChargeText, textStyle);
			
		}
	}
}

function healthBarLengthUpdate(){
	playerShot();
	curHealth = playerStatus.GetHealth();
	var a : float = maxHealth;
	healthBarLength = maxBarWidth * (curHealth/a);
	lowHealth();
	isDead();
}

function oxygenBarLengthUpdate(){
	curOxygen = playerStatus.GetOxygen();
	var a : float = maxOxygen;
	oxygenBarLength = maxBarWidth * (curOxygen/a);
	lowOxygen();
	breathing();
}

function audioBarLengthUpdate(){
	curAudio = audioC.GetCurrentSample();
	var previousLength : float = audioBarLength;
	audioBarLength = (maxAudio/100)*curAudio;
	if(audioBarLength<=0){
		audioBarLength = Mathf.Lerp(previousLength, 5, Time.time);
	}
	if(audioBarLength>maxAudio){
		audioBarLength = maxAudio;
	}
}

function handGunChargeBarLengthUpdtate(){
	var child = glove.transform.Find("GUN_OBJ");
	if(child.gameObject.activeInHierarchy){
		handGun = child.transform.Find("GoSpawn").GetComponent(Gun);
		if(handGun!=null){
			//print("Gun Charge Percent: "+handGun.getChargePercent());
			curHandGunCharge = handGun.getChargePercent();
		}
	} else {
		child.Find("GoSpawn").GetComponent(Gun).Update();
	}
}

function machineGunChargeBarLengthUpdtate(){
	var child = glove.transform.Find("CartoonSMG");
	if(child.gameObject.activeInHierarchy){
		machineGun = child.transform.Find("GoSpawn").GetComponent(Gun);
		if(machineGun!=null){
			//print("Gun Charge Percent: "+handGun.getChargePercent());
			curMachineGunCharge = machineGun.getChargePercent();
		}
	} else {
		child.Find("GoSpawn").GetComponent(Gun).Update();
	}
}

function isDead(){
	if(playerStatus.IsAlive()==false){
		audioC.PlayDeath();
	}
}

function lowHealth(){
	var a : float = maxHealth;
	if(curHealth<=(a/4)){
		audioC.PlayLowHealth();
	}
}

function lowOxygen(){
	var a : float = maxOxygen;
	if(curOxygen<=(a/10)){
		audioC.PlayWarning();
	}
}

function playerShot(){
	var healthDiff = curHealth-playerStatus.GetHealth();
	if(healthDiff>4){
		audioC.PlayHurt();
	}
}

function breathing(){
	if(curOxygen>1){
		audioC.PlayBreathing();
	}
}

function footsteps(){
	if (Input.GetKey ("up")||Input.GetKey ("down")||Input.GetKey (KeyCode.LeftArrow)||Input.GetKey (KeyCode.RightArrow)
		|| Input.GetKey("w") || Input.GetKey("a") || Input.GetKey("s") || Input.GetKey("d")){
		if(GameObject.FindGameObjectWithTag("PlanetSurface") != null){
			audioC.PlayFootstepOutside();
		} else {
			audioC.PlayFootstepInside();
		}
	}
}