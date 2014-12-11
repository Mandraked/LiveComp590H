#pragma strict

function Start () {

}

function OnTriggerEnter (other : Collider) {
	//print('collide1');
	if (other.tag == 'Player')
	{
		//print('player');
		//MainScript.allowScene2 = false;
		MainScript.allowScene3 = true;
		MainScript.allowScene4 = true;
		print('trigger ' + MainScript.sceneProgression);
		if (MainScript.sceneProgression == 2) MainScript.sceneProgression = 4;
		if (MainScript.sceneProgression == 7) MainScript.sceneProgression = 5;

		switch (MainScript.sceneProgression)
		{
			case 3:
				print('3.1');
				LoadScene.scene = 'Scene4';
				Sight.SetHostile(false);
				break;
			case 4:
				print('4');
				LoadScene.scene = 'Scene3';
				Sight.SetHostile(true);
				break;
			case 5:
				print('3.2');
				LoadScene.scene = 'Scene4';
				Sight.SetHostile(false);
				break;
		}
		//print('trigger');
		//print(MainScript.sceneProgression);
	}
}

function Update () {
	// if (MainScript.checkKillsBoss()) MainScript.Victory();
	// print(MainScript.bossKillCount + ' ' + MainScript.requiredBossKills);
}