#pragma strict

public var buttonNormalTexture : Texture2D;
public var buttonHoverTexture : Texture2D;
public var windowTexture : Texture2D;
public var guiFont : Font;
public var width : int = 400;
public var height : int = 300;
public var spacing : int = 20;

private var MainMenu : Rect;
private var windowStyle : GUIStyle;
private var buttonStyle : GUIStyle;
private var mouseLook : MouseLook;

function Start () {
	windowStyle = GUIStyle();
	windowStyle.stretchWidth = true;
	windowStyle.stretchHeight = true;
	windowStyle.normal.background = windowTexture;
	windowStyle.richText = true;
	windowStyle.font = guiFont;
	windowStyle.fontSize = 20;

	buttonStyle = GUIStyle();
	buttonStyle.stretchWidth = true;
	buttonStyle.stretchHeight = true;
	buttonStyle.hover.background = buttonHoverTexture;
	buttonStyle.normal.background = buttonNormalTexture;
	buttonStyle.alignment = TextAnchor.MiddleCenter;
	buttonStyle.richText = true;
	buttonStyle.font = guiFont;
	buttonStyle.fontSize = 20;

	mouseLook = GameObject.FindWithTag("Player").GetComponent(MouseLook);

	MainMenu = Rect(Screen.width/2 - width/2, Screen.height/2 - height/2, width, height);
	//print(width + ' ' + height);
	//print(Screen.width + ' ' + Screen.height);
}

function Update () {
	// print('scene ' + MainScript.currentScene);
	// print('progress ' + MainScript.sceneProgression);
	//print('work');
	if (Input.GetKeyDown(KeyCode.Escape) && Application.loadedLevelName != 'title-screen' && Application.loadedLevelName != 'win-screen' && Application.loadedLevelName != 'lose-screen')
	{
		MainScript.isPause = !MainScript.isPause;
		Screen.showCursor = !Screen.showCursor;
		mouseLook.enabled = !mouseLook.enabled;
		if (MainScript.isPause) Time.timeScale = 0;
		else Time.timeScale = 1;
	}
}

function OnGUI () {
	if (MainScript.isPause) GUI.Window(0, MainMenu, TheMainMenu, '', windowStyle);
}

function TheMainMenu () {
	if (GUILayout.Button("<color=white>Main Menu</color>", buttonStyle)) {
		MainScript.isPause = !MainScript.isPause;
		MainScript.ResetGame();
		Time.timeScale = 1;
		Application.LoadLevel("title-screen");
	}
	GUILayout.Space(spacing);
	if (GUILayout.Button("<color=white>Restart</color>", buttonStyle)) {
		MainScript.isPause = !MainScript.isPause;
		MainScript.ResetGame();
		Time.timeScale = 1;
		Application.LoadLevel('Scene2');
	}
	GUILayout.Space(spacing);
	if (GUILayout.Button("<color=white>Quit</color>", buttonStyle)) {
		MainScript.isPause = !MainScript.isPause;
		Time.timeScale = 1;
		Application.Quit();
	}
}