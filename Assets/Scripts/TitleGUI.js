﻿#pragma strict

public var buttonHoverTexture : Texture2D;
public var buttonNormalTexture : Texture2D;
public var guiFont : Font;
public var sidePadding : float = 0.2;
public var topPadding : float = 0.4;
public var bottomPadding : float = 0.2;
public var numberOfButtons : int = 2;
public var buttonPercent : float = 0.8;
public var loadTime : float = 1.0;
public var title : String = "Alien Game";
public var firstScene : String = "test-scene-1";
public var clickClip : AudioClip;
public var backgroundClip : AudioClip;

private var timer : float;
private var quitting : boolean;
private var loading : boolean;
private var buttonStyle : GUIStyle;
private var titleStyle : GUIStyle;
private var width : int;
private var height : int;
private var workingWidth : int;
private var workingHeight : int;
private var clickAudio : AudioSource;
private var backgroundAudio : AudioSource;

function Awake() {
	Screen.showCursor = true;

	timer = 0.0;
	quitting = false;
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

	titleStyle = GUIStyle();
	titleStyle.alignment = TextAnchor.MiddleCenter;
	titleStyle.richText = true;
	titleStyle.font = guiFont;
	titleStyle.fontSize = 72;
}

function Start () {
	backgroundAudio.Play();
}

function Update () {
	timer += Time.deltaTime;

	if (timer >= loadTime) {
		if (quitting) {
			Application.Quit();
		}
		if (loading) {
			Screen.showCursor = false;
			MainScript.ResetGame();
			Application.LoadLevel(firstScene);
		}
	} 

	width = Screen.width / 2;
	workingWidth = width * (1 - 2 * sidePadding);
	height = Screen.height;
	workingHeight = height * (1 - topPadding - bottomPadding);
}

function OnGUI() {
	var titleContent : GUIContent = GUIContent("<color=white>" + title + "</color>");
	GUI.Label(new Rect(0, 0, Screen.width, Screen.height * topPadding), titleContent, titleStyle);

	var playText = "<color=white>Play</color>";
	var quitText = "<color=white>Quit</color>";

	if (GUI.Button(
			new Rect(
				sidePadding * width,
				topPadding * height + (workingHeight / numberOfButtons) * 0,
				workingWidth,
				(workingHeight / numberOfButtons) * buttonPercent
			),
			playText,
			buttonStyle)
		) {
		if (!loading && !quitting) {
			clickAudio.Play();
			timer = 0.0;
			loading = true;
		}
	}
	
	if (GUI.Button(
			new Rect(
				sidePadding * width,
				topPadding * height + (workingHeight / numberOfButtons) * 1,
				workingWidth,
				(workingHeight / numberOfButtons) * buttonPercent
			),
			quitText,
			buttonStyle)
		) {
		if (!loading && !quitting) {
			clickAudio.Play();
			timer = 0.0;
			quitting = true;
		}
	}
}
