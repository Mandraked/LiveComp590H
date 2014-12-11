#pragma strict

public var maxHealth : float = 100.0;
public var maxOxygen : int = 100;
public var healTime : float = 5.0;
public var tickTime : float = 0.1;
public var healAmount : int = 1;

public var chokingDamage : int = 10;
public var passiveOxygenDelta : int = 1;

public var updateTime : float = 2.0;

private var timer : float = 0.0;
private var tickTimer : float = 0.0;
private var timerHealth : float = 0.0;
private var health : float;
private var oxygen : int;
private var alive : boolean;
private var choking : boolean;

function Awake() {
	timer = 0.0;
	tickTimer = 0.0;
	health = MainScript.playerHealth;
	//print('awake ' + health);
	oxygen = maxOxygen;
	alive = true;
	choking = false;

	MainScript.checkTesting();
}

function Update() {
	tickTimer += Time.deltaTime;
	timerHealth += Time.deltaTime;
	timer += Time.deltaTime;
	if (timer >= updateTime) {
		timer = 0.0;
		if (GameObject.FindGameObjectWithTag("PlanetSurface") != null) {
			TakeOxygen(passiveOxygenDelta);
		} else {
			TakeOxygen(-passiveOxygenDelta);
		}

		if (choking) {
			TakeDamage(chokingDamage);
		}
	}
	if (timerHealth >= healTime && tickTimer > tickTime && health < 100.0) TakeDamage(-healAmount);
}

function TakeDamage(damage : float) {
	print('taking damage: ' + damage);
	if (damage > 0) timerHealth = 0.0;
	tickTimer = 0.0;
	health -= damage;
	MainScript.playerHealth -= damage;
	if (MainScript.playerHealth > 100) MainScript.playerHealth = 100;
	print('main health: ' + MainScript.playerHealth);

	if (health < 0) {
		health = 0;
	}

	if (health > maxHealth) {
		health = maxHealth;
	}

	if (health == 0) {
		alive = false;
		MainScript.GameOver();
	}
}

function TakeOxygen(damage : int) {
	choking = false;

	oxygen -= damage;

	if (oxygen < 0) {
		oxygen = 0;
	}

	if (oxygen > maxOxygen) {
		oxygen = maxOxygen;
	}

	if (oxygen == 0) {
		choking = true;
	}
}

function GetHealth() {
	return health;
}

function GetOxygen() {
	return oxygen;
}

function IsAlive() {
	return alive;
}

function IsChoking() {
	return choking;
}
