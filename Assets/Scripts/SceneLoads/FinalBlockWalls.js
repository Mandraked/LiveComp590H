#pragma strict

private var positionStartRight = Vector3(326.3, 130.0, 240.0);
private var positionFinalRight = Vector3(326.3, 0, 240.0);

private var positionStartLeft = Vector3(211.3, 130.0, 224.9);
private var positionFinalLeft = Vector3(211.3, 0, 224.9);

function Start () {

}

function Update () {

}

function OnTriggerEnter (other : Collider) {
	if (other.tag == 'Player')
	{
		var wallRight = GameObject.FindWithTag('BlockWallRight');
		var wallLeft = GameObject.FindWithTag('BlockWallLeft');

		wallRight.transform.position = positionFinalRight;
		wallLeft.transform.position = positionFinalLeft;
	}
}