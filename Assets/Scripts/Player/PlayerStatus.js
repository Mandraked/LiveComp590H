#pragma strict

public var maxHealth : float = 100.0;
public var maxOxygen : int = 100;
public var healTime : float = 5.0;

public var chokingDamage : int = 10;
public var passiveOxygenDelta : int = 1;

public var updateTime : float = 2.0;

private var timer : float = 0.0;
private var timerHealth : float = 0.0;
private var health : float;
private var oxygen : int;
private var alive : boolean;
private var choking : boolean;

function Awake() {
	timer = 0.0;
	health = MainScript.playerHealth;
	oxygen = maxOxygen;
	alive = true;
	choking = false;
}

function Update() {
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
	if (timerHealth >= healTime) TakeDamage(-0.1);
}

function TakeDamage(damage : float) {
	if (damage > 0) timerHealth = 0.0;
	health -= damage;
	MainScript.playerHealth -= damage;

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
