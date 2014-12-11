#pragma strict

function Start () {
	Screen.showCursor = false;
	print('switching to 2 from ' + MainScript.currentScene);
	MainScript.currentScene = 2;
	//Camera.main.enabled = true;
}

function Update () {

}