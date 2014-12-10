#pragma strict

private var particles : ParticleSystem;
private var timer : float = 0.0;
private var overrideDuration : float = 0.8;
private var overriden : boolean;
private var paused : boolean;

function Awake() {
	particles = GetComponent(ParticleSystem);
	overriden = false;
	paused = false;
	particles.startColor = Constants.GREEN;
}

function Update() {
	if (!paused) {
		timer += Time.deltaTime;

		if (overriden && timer >= overrideDuration) {
			StopOverrideEmission();
		}
	}
}

function RequestColor(requestColor : Color) {
	particles.startColor = requestColor;
}

function RequestStop() {
	paused = true;
	particles.enableEmission = false;
}

function RequestStart() {
	paused = false;
	particles.enableEmission = true;
}

function OverrideEmission() {
	timer = 0.0;
	overriden = true;
	particles.enableEmission = false;
}

function StopOverrideEmission() {
	overriden = false;
	particles.enableEmission = true;
}