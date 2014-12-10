#pragma strict

// Public constants
public var text : String[];
public var timeBetweenText : float = 5.0;
public var guiFont : Font;
public var scriptClip : AudioClip;
public var textBackgroundTexture : Texture2D;
public var sceneProgression : int = 3;
public var retriggerable : boolean = false;

// Timing
private var timer : float = 0.0;
private var index : int = 0;
private var display : boolean = false;
private var triggered : boolean = false;
private var done : boolean = false;

// Text
private var textStyle : GUIStyle;

// Sound
private var scriptAudio : AudioSource;

// References
private var player : GameObject;
private var narrators : NarratorMain[];

function Awake() {
	player = GameObject.FindGameObjectWithTag(Constants.PLAYER);
	narrators = GameObject.FindObjectsOfType(NarratorMain);

	textStyle = GUIStyle();
	textStyle.alignment = TextAnchor.LowerCenter;
	textStyle.richText = true;
	textStyle.font = guiFont;
	textStyle.fontSize = 24;
	textStyle.normal.background = textBackgroundTexture;

	scriptAudio = player.AddComponent(AudioSource);
    scriptAudio.clip = scriptClip;
    scriptAudio.loop = false;
    scriptAudio.playOnAwake = false;
    scriptAudio.volume = 0.8;
    scriptAudio.dopplerLevel = 0.0;
}

function Update() {
	timer += Time.deltaTime;
	if (display && timer >= timeBetweenText) {
		index++;
		timer = 0.0;
		if (index >= text.length) {
			display = false;
			done = true;
		} else {
			scriptAudio.Play();
		}
	}
}

function OnGUI() {
	if (display) {
        var textContent : GUIContent = GUIContent("<color=white>" + text[index] + "</color>");
    	GUI.Label(new Rect(40, Screen.height - 80, Screen.width - 80, 40), textContent, textStyle);
	}
}

function OnTriggerEnter(other : Collider) {
	if ((retriggerable || !triggered) && other.gameObject == player && (MainScript.sceneProgression == sceneProgression || sceneProgression == 0)) {
		triggered = true;
		scriptAudio.Play();
		timer = 0.0;

		for (var narrator : NarratorMain in narrators) {
			narrator.Silence();
		}
		display = true;
	}
}

function Silence() {
	display = false;
}

function IsDone() {
	return done;
}