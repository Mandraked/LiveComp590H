var Bullet : GameObject; 

var rechargeTime : float = 30.0;

private var maincamera : GameObject;
private var timer : float = rechargeTime;
private var audioC : PlayerAudioController;
   
function Start () {
	maincamera = GameObject.FindGameObjectWithTag("MainCamera");
  audioC = maincamera.GetComponent(PlayerAudioController);
}

// Fire a bullet 
function Fire () {
  timer = 0.0;
  // Create a new bullet pointing in the same direction as the gun 
  var newBullet : GameObject = Instantiate(Bullet, transform.position, transform.rotation); 
  if(Bullet.name=="Laser Bullet"){
    Bullet.tag = 'LaserBullet';
  		audioC.PlayHandGunShoot();
  } else if (Bullet.name=="CubeBullet"){
    Bullet.tag = 'CubeBullet';
  		audioC.PlayMachineGunShoot();
  }
} 

function Update () {
  timer += Time.deltaTime;
  if(timer >= rechargeTime && gameObject.activeInHierarchy){
  		// Fire if the left mouse button is clicked 
  		if (Input.GetButtonDown("Fire1")) {
     		Fire();
     		audioC.PlayRecharge();
  		}
  } else if(timer < rechargeTime){
  		if (Input.GetButtonDown("Fire1")) {
  			audioC.PlayEmptyGun();
  		}
  }
}

function getChargePercent () {
	var charge : float;
	charge = timer/rechargeTime;
	if(charge>1){
		charge = 1;
	}
	return charge;
}