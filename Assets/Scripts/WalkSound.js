#pragma strict

var walkingSound : AudioSource;
var shootingSound : AudioSource;

function Start () {
	var aSources = GetComponents(AudioSource);
	walkingSound = aSources[0];
	shootingSound = aSources[1];
}

function Update () {
	if (Input.GetKeyDown("w"))
	{
		walkingSound.Play();
	}
	if (Input.GetKeyUp("w"))
	{
		walkingSound.Stop();
	}
	if (Input.GetKeyDown("space"))
	{
		walkingSound.Stop();
	}
	if (Input.GetKeyUp("space"))
	{
		walkingSound.Play();
	}
	if (Input.GetButtonDown("Fire1"))
	{
		shootingSound.Play();
	}
}

@script RequireComponent(AudioSource)