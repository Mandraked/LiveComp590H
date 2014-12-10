#pragma strict

public var buttonHoverTexture : Texture2D;
public var buttonNormalTexture : Texture2D;
public var guiFont : Font;
public var sidePadding : float = 0.3;
public var topPadding : float = 0.6;
public var bottomPadding : float = 0.1;
public var numberOfButtons : int = 2;
public var buttonPercent : float = 1.0;
public var loadTime : float = 1.0;
public var status : String = "You have died...";
public var menuScene : String = "title-screen";
public var clickClip : AudioClip;
public var backgroundClip : AudioClip;

private var timer : float;
private var loading : boolean;
private var buttonStyle : GUIStyle;
private var statusStyle : GUIStyle;
private var width : int;
private var height : int;
private var workingWidth : int;
private var workingHeight : int;
private var clickAudio : AudioSource;
private var backgroundAudio : AudioSource;

function Awake() {
	Screen.showCursor = true;
	
	timer = 0.0;
	loading = false;

    clickAudio = gameObject.AddComponent(AudioSource);
    clickAudio.clip = clickClip;
    clickAudio.loop = false;
    clickAudio.playOnAwake = false;
    clickAudio.volume = 0.8;
    clickAudio.dopplerLevel = 0.0;

    backgroundAudio = gameObject.AddComponent(AudioSource);
    backgroundAudio.clip = backgroundClip;
    backgroundAudio.loop = true;
    backgroundAudio.playOnAwake = false;
    backgroundAudio.volume = 0.6;
    backgroundAudio.dopplerLevel = 0.0;

	buttonStyle = GUIStyle();
	buttonStyle.stretchWidth = true;
	buttonStyle.stretchHeight = true;
	buttonStyle.hover.background = buttonHoverTexture;
	buttonStyle.normal.background = buttonNormalTexture;
	buttonStyle.alignment = TextAnchor.MiddleCenter;
	buttonStyle.richText = true;
	buttonStyle.font = guiFont;
	buttonStyle.fontSize = 40;

	statusStyle = GUIStyle();
	statusStyle.alignment = TextAnchor.MiddleCenter;
	statusStyle.richText = true;
	statusStyle.font = guiFont;
	statusStyle.fontSize = 72;
}

function Start () {
	backgroundAudio.Play();
}

function Update () {
	timer += Time.deltaTime;

	if (timer >= loadTime) {
		if (loading) {
			Application.LoadLevel(menuScene);
		}
	} 

	width = Screen.width;
	workingWidth = width * (1 - 2 * sidePadding);
	height = Screen.height;
	workingHeight = height * (1 - topPadding - bottomPadding);
}

function OnGUI() {
	var statusContent : GUIContent = GUIContent("<color=white>" + status + "</color>");
	GUI.Label(new Rect(0, 0, Screen.width, Screen.height * topPadding), statusContent, statusStyle);

	var menuText = "<color=white>Menu</color>";

	if (GUI.Button(
			new Rect(
				sidePadding * width,
				topPadding * height + (workingHeight / numberOfButtons) * 0,
				workingWidth,
				(workingHeight / numberOfButtons) * buttonPercent
			),
			menuText,
			buttonStyle)
		) {
		if (!loading) {
			clickAudio.Play();
			timer = 0.0;
			loading = true;
		}
	}
}
