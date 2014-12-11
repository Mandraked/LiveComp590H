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
	//print('Scene ' + MainScript.sceneProgression);
	if (MainScript.sceneProgression == 3)
	{
		var wall = GameObject.FindWithTag('BlockWallMain');
		var wallN = GameObject.FindWithTag('BlockWallNarrator');

		if (wall != null && wallN != null)
		{
			wall.SetActive(false);
			wallN.SetActive(false);
		}

	}
	// if (MainScript.sceneProgression == 4)
	// {
	// 	var nObj = GameObject.FindWithTag('BlockWall');
	// 	if (nObj != null)
	// 	{
	// 		nObj.SetActive(false);
	// 	}
	// }

	if (MainScript.sceneProgression != 6)
	{
		var bosses = GameObject.FindGameObjectsWithTag('Boss');
		for (var boss : GameObject in bosses)
		{
			boss.SetActive(false);
		}
		var wallL = GameObject.FindWithTag('BlockWallLeft');
		var wallR = GameObject.FindWithTag('BlockWallRight');
		if (wallL != null) wallL.SetActive(false);
		if (wallR != null) wallR.SetActive(false);
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
		case 2:
			obj = GameObject.FindWithTag('BlockWall');
			if (obj != null)
			{
				var script3 = obj.GetComponent(NarratorMain);
				if (script3 != null)
				{
					if (script3.IsDone()) MainScript.sceneProgression = 4;
				}
			}
		case 4: 
			obj = GameObject.FindWithTag('NarratorDoor');
			//print(obj);
			if (obj != null)
			{
				var script = obj.GetComponent(NarratorMain);
				//print('here 4');
				if (script.IsDone()) LoadScene.talkedToBoss = true;
				if (script.IsDone() && GunMouseController.hasGun) MainScript.sceneProgression = 2;
			}
			break;
		case 5: 
			//print('5');
			if (MainScript.guns[1]) MainScript.sceneProgression = 7;
			break;
		case 6:
			obj = GameObject.FindWithTag('NarratorBoss');
			if (obj != null)
			{
				//print('here 5');
				var script2 = obj.GetComponent(NarratorMain);
				if (script2.IsDone()) Sight.SetHostile(true);
			}
			break;
		case 7:
			//print('7');
			obj = GameObject.FindWithTag('BlockWall');
			if (obj != null)
			{
				var script4 = obj.GetComponent(NarratorMain);
				if (script4 != null)
				{
					//print('idk ' + script4.IsDone());
					if (script4.IsDone()) MainScript.sceneProgression = 5;
				}
			}
	}
	
}

function BossIsDestroyed() {
	return GameObject.FindWithTag("Boss") == null;
}