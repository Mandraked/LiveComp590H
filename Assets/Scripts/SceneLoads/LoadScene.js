#pragma strict

static var scene = "";
static var talkedToBoss = false;
var spaceSuit : GameObject;
var alphaFadeValue = 1;
var blackTexture : Texture;

function Start () 
{

}

function OnTriggerEnter(other : Collider)
{
	if (other.tag == 'Player')
	{
		print(MainScript.currentScene);
		switch (MainScript.currentScene)
		{
			case 1:
				if (scene == 'Scene2' && MainScript.allowScene2) 
				{
					PlayerGUI.wearingSpaceSuit = true;
					Camera.main.enabled = false;
					Application.LoadLevel(scene);
				}
				else if (scene == 'Scene3' && MainScript.allowScene3) 
				{
					MainScript.currPos = GameObject.FindGameObjectWithTag('Player').transform.position;
					MainScript.sceneProgression++;
					MainScript.killCount = 0;
					PlayerGUI.wearingSpaceSuit = true;
					Camera.main.enabled = false;
					Application.LoadLevel(scene);
				}
				else if (scene == 'Scene4' && MainScript.allowScene4) 
				{
					MainScript.currPos = GameObject.FindGameObjectWithTag('Player').transform.position;
					MainScript.sceneProgression++;
					PlayerGUI.wearingSpaceSuit = true;
					Camera.main.enabled = false;
					Application.LoadLevel(scene);
				}
				break;
			case 2:
				if (spaceSuit != null)
				{
					if (spaceSuit.active) return;
					else 
					{
						MainScript.currPos = GameObject.FindGameObjectWithTag('Player').transform.position;
						PlayerGUI.wearingSpaceSuit = true;
						Camera.main.enabled = false;
						Application.LoadLevel('Scene1');
					}
				}
				break;
			case 3:
				print(MainScript.checkKills());
				print(MainScript.killCount + ' ' + MainScript.requiredKills);
				if (MainScript.checkKills())
				{
					MainScript.killCount = 0;
					PlayerGUI.wearingSpaceSuit = true;
					Camera.main.enabled = false;
					MainScript.allowScene3 = false;
					MainScript.allowScene4 = true;
					Application.LoadLevel('Scene1');
				}
				break;
			case 4:
				if (MainScript.checkKills2()) talkedToBoss = true;
				print(MainScript.checkKills2() + ' ' + talkedToBoss);
				if (!talkedToBoss) break;
				talkedToBoss = false;
				MainScript.bossKillCount = 0;
				//if (MainScript.sceneProgression == 6) break;
				PlayerGUI.wearingSpaceSuit = true;
				Camera.main.enabled = false;
				MainScript.allowScene4 = false;
				MainScript.allowScene3 = true;
				Application.LoadLevel('Scene1');
				break;
		}

		for (var i=0;i<2; i++)
	  	{
		    if (MainScript.guns[i] && GunSelection.gunLocks[i])
		    {
		    	GunSelection.UnlockWeapons(i);
		    }
	  	}
	}
}

function Update () 
{
	
}

