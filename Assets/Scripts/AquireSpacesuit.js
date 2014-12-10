#pragma strict

var glove : GameObject;
var spacesuit: GameObject;
//var script : GunSelection;

function Start () {
	PlayerGUI.wearingSpaceSuit = false;
	glove.gameObject.SetActive(false);
	spacesuit.gameObject.SetActive(true);
}

function OnTriggerEnter () {
	PlayerGUI.wearingSpaceSuit = true;
	glove.gameObject.SetActive(true);
	spacesuit.gameObject.SetActive(false);
}

function Update () {

}