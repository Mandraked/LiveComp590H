#pragma strict

static var gunLocks = new Array();

function Start () 
{
   // Select the first weapon
   //SelectWeapon(0);
   for (var i=0;i<transform.childCount;i++){
   		transform.GetChild(i).gameObject.SetActive(false);
   		gunLocks.push(true);
   	}
    print('start');
    print(MainScript.activeGun);
    if (MainScript.activeGun != -1) SelectWeapon(MainScript.activeGun);
}
 
function Update () 
{
  if (Input.GetKeyDown("1")) 
  {
    SelectWeapon(0);
  }    
  else if (Input.GetKeyDown("2")) 
  {
    SelectWeapon(1);
  } 
}
 
function SelectWeapon (index : int) 
{
    for (var i=0;i<transform.childCount;i++)
    {
    // Activate the selected weapon
    	if (i == index && gunLocks[index] == false){
    		transform.GetChild(i).gameObject.SetActive(true);
        MainScript.activeGun = index;
    		// Deactivate all other weapons
    	} else {
            transform.GetChild(i).gameObject.SetActive(false);
        }
    }
}

static function UnlockWeapons (index : int)
{
	gunLocks[index] = false;
}

function UnlockWeapon (index : int)
{
  gunLocks[index] = false;
  SelectWeapon(index);
}