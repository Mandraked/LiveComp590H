#pragma strict

public var winScene : String = "win-screen";
public var loseScene : String = "lose-screen";
public var pauseTime : float = 1.0;

private var player : PlayerStatus;
private var hasBoss : boolean;
private var timer : float;
private var levelToLoad : String;
private var gameOver : boolean;

function Awake() {
	print('Scene ' + MainScript.sceneProgression);
	if (MainScript.sceneProgression == 3)
	{
		var wall = GameObject.FindWithTag('BlockWall');
		var wallN = GameObject.FindWithTag('BlockWallNarrator');

		if (wall != null && wallN != null)
		{
			wall.SetActive(false);
			wallN.SetActive(false);
		}

	}
	if (MainScript.sceneProgression != 6)
	{
		var bosses = GameObject.FindGameObjectsWithTag('Boss');
		for (var boss : GameObject in bosses)
		{
			boss.SetActive(false);
		}
	}
	
	player = GameObject.FindWithTag("Player").GetComponent(PlayerStatus);
	hasBoss = !BossIsDestroyed();
	gameOver = false;
}

function Start() {
}

function Update() {
	if (!gameOver) {
		if (!player.IsAlive()) {
			levelToLoad = loseScene;
			timer = 0.0;
			gameOver = true;
			MainScript.ResetGame();
		}
		if (hasBoss && BossIsDestroyed()) {
			levelToLoad = winScene;
			timer = 0.0;
			gameOver = true;
			MainScript.ResetGame();
		}
	} else {
		timer += Time.deltaTime;

		if (timer >= pauseTime) {
			Application.LoadLevel(levelToLoad);
		}
	}

	var obj : GameObject;

	switch(MainScript.sceneProgression)
	{
		case 4: 
			obj = GameObject.FindWithTag('NarratorDoor');
			if (obj != null)
			{
				var script = obj.GetComponent(NarratorMain);
				print('here 4');
				if (script.IsDone()) LoadScene.talkedToBoss = true;
			}
			break;
		case 5: 
			break;
		case 6:
			obj = GameObject.FindWithTag('NarratorBoss');
			if (obj != null)
			{
				print('here 5');
				var script2 = obj.GetComponent(NarratorMain);
				if (script2.IsDone()) Sight.SetHostile(true);
			}
			break;
	}
	
}

function BossIsDestroyed() {
	return GameObject.FindWithTag("Boss") == null;
}