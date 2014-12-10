#pragma strict

public var texture : Texture2D;

private var barrel : Transform;

public static var hasGun : boolean = true;

function Start () {
	Screen.showCursor = false;
	barrel = transform.Find("astronautglove").Find("CartoonSMG").Find("GoSpawn");
}

function Update () {

}

function OnGUI () {
	if (hasGun && !MainScript.isPause) {
		var gunEndPosition : Vector3 = barrel.position;
		var gunEndDirection : Vector3 =  barrel.transform.forward;
		var gunFireDistance : float = 35;
		var gunHorizonPosition : Vector3 = gunEndPosition + gunEndDirection.normalized * gunFireDistance;
		var targetPos : Vector2 = Camera.main.WorldToScreenPoint(gunHorizonPosition);
		targetPos.y = Screen.height - targetPos.y;
		GUI.DrawTexture(Rect(targetPos.x-15,targetPos.y-15,30,30),texture);
	}
}