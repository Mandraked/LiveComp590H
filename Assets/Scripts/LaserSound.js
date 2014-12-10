#pragma strict

function Start () {

}

var shootingSound : AudioClip;
audio.clip = shootingSound;

function Update () {
	if (Input.GetButtonDown("Fire1"))
	{
		audio.Play();
	}
}

@script RequireComponent(AudioSource)