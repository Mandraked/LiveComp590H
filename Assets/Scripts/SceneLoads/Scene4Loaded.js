#pragma strict

function Start () {
	LoadScene.talkedToBoss = false;
	Screen.showCursor = false;
	print('switching to 4 from ' + MainScript.currentScene);
	MainScript.currentScene = 4;
	//Camera.main.enabled = true;
}

function Update () {

}