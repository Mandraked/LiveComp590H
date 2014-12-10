#pragma strict

static var isTesting : boolean = false;

static var currentScene : int = 2;
static var activeGun : int = -1;
static var playerHealth : int = 100;
static var guns = Array();
guns.Push(false);
guns.Push(false);

static var allowScene2 : boolean = false;
static var allowScene3 : boolean = false;
static var allowScene4 : boolean = false;

static var currPos = Vector3(0,0,0);

static var gameProgression : int = 3;
static var sceneProgression : int = 3;

static var killCount : int = 0;
static var bossKillCount : int = 0;
static var requiredKills : int = 6;
static var requiredKills2 : int = 8;
static var requiredBossKills : int = 3;

static var isPause : boolean = false;

function Start () {

}

function Awake() {
	DontDestroyOnLoad (transform.gameObject);
}

function Update () {
	
}

static function ResetGame () {
	currentScene = 2;
	activeGun = -1;
	playerHealth = 100;
	guns = Array();
	guns.Push(false);
	guns.Push(false);

	allowScene2 = false;
	allowScene3 = false;
	allowScene4 = false;

	currPos = Vector3(0,0,0);

	gameProgression = 3;
	sceneProgression = 3;
	killCount = 0;
	bossKillCount = 0;

	PlayerGUI.wearingSpaceSuit = false;
	Sight.SetHostile(false);
	LoadScene.talkedToBoss = false;
	GunMouseController.hasGun = false;
}

static function Victory () {
	print('You win');
	ResetGame();
	yield WaitForSeconds(3);
	Application.LoadLevel('win-screen');
}

static function GameOver () {
	print('You lose');
	ResetGame();
	yield WaitForSeconds(3);
	Application.LoadLevel('lose-screen');
}

static function checkKills () {
	return killCount == requiredKills;
}

static function checkKills2 () {
	print(killCount + ' ' + requiredKills2);
	return killCount == requiredKills2;
}

static function checkKillsBoss () {
	return bossKillCount >= requiredBossKills;
}