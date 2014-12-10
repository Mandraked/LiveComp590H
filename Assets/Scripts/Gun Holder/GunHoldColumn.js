#pragma strict

var Gun : GameObject;
var upDown:float; 
var speed:int = 2; 
var hightDiv:int = 150; 
var t:float;
var keyboardShortcut = 0;

private var maincamera : GameObject;
private var audioC : PlayerAudioController;

function Start () {
	Gun = Instantiate(Gun, transform.position, transform.rotation);
   	maincamera = GameObject.FindGameObjectWithTag("MainCamera");
	audioC = maincamera.GetComponent(PlayerAudioController);
}

function Update () {
	if(Gun.activeSelf){
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
	if(other.gameObject.tag == "Player"){
		audioC.PlayGunPickup();
		GunMouseController.hasGun = true;
		GameObject.Find("astronautglove").SendMessage("UnlockWeapon", keyboardShortcut-1);
		Gun.SetActive(false);
		MainScript.guns[keyboardShortcut-1] = true;
		Destroy(gameObject);
	}
}