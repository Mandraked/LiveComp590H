#pragma strict

function Start () {
	Sight.SetHostile(true);
	print('switching to 3 from ' + MainScript.currentScene);
	Screen.showCursor = false;
	MainScript.currentScene = 3;
	//Camera.main.enabled = true;
}

function Update () {

}