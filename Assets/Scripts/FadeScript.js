#pragma strict

public var fadeSpeed : float = 1.5f;

private var sceneStarting : boolean = true;

function Awake () {
		guiTexture.pixelInset = new Rect(0f, 0f, Screen.width, Screen.height);
		print('awake');
}

function Start () {

}

function Update () {
	if (sceneStarting) StartScene();
	//print('update');
}

function FadeToClear ()
{
	guiTexture.color = Color.Lerp(guiTexture.color, Color.clear, fadeSpeed * Time.deltaTime);
	print('fadeClear');
}

function FadeToBlack ()
{
	guiTexture.color = Color.Lerp(guiTexture.color, Color.black, fadeSpeed*Time.deltaTime);
	print('fadeBlack');
}

function StartScene ()
{
	print('sStart');

	FadeToClear();

	if (guiTexture.color.a <= 0.05f)
	{
		guiTexture.color = Color.clear;
		guiTexture.enabled = false;
		sceneStarting = false;
	}
}

public function EndScene ()
{
	print('End');

	guiTexture.enabled = true;
	FadeToBlack();

	if (guiTexture.color.a >= 0.95f) Application.LoadLevel(0);
}