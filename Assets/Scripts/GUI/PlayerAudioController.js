#pragma strict

public var machineGunShootClip : AudioClip;
public var handGunShootClip : AudioClip;
public var hurtClip : AudioClip;
public var deathClip : AudioClip;
public var breathingClip : AudioClip;
public var footstepOutsideClip : AudioClip;
public var footstepInsideClip : AudioClip;
public var warningClip : AudioClip;
public var rechargeClip : AudioClip;
public var emptyGunClip : AudioClip;
public var gunPickupClip : AudioClip;
public var lowHealthClip : AudioClip;
public var backgroundClip : AudioClip;

private var machineGunShootAudio : AudioSource;
private var handGunShootAudio : AudioSource;
private var hurtAudio : AudioSource;
private var deathAudio : AudioSource;
private var breathingAudio : AudioSource;
private var footstepOutsideAudio : AudioSource;
private var footstepInsideAudio : AudioSource;
private var warningAudio : AudioSource;
private var rechargeAudio : AudioSource;
private var emptyGunAudio : AudioSource;
private var gunPickupAudio : AudioSource;
private var lowHealthAudio : AudioSource;
private var backgroundAudio : AudioSource;

var qSamples: int = 1024;  // array size
var refValue: float = 0.1; // RMS value for 0 dB
var threshold = 0.02;      // minimum amplitude to extract pitch
var rmsValue: float;   // sound level - RMS
var dbValue: float;    // sound level - dB
var pitchValue: float; // sound pitch - Hz
 
private var samples: float[]; // audio samples
private var spectrum: float[]; // audio spectrum
private var fSample: float;
private var sources: Array = new Array();

function Awake() {
    machineGunShootAudio = gameObject.AddComponent(AudioSource);
    machineGunShootAudio.clip = machineGunShootClip;
    machineGunShootAudio.loop = false;
    machineGunShootAudio.playOnAwake = false;
    machineGunShootAudio.volume = 0.8;
    machineGunShootAudio.dopplerLevel = 0.0;
    sources.Push(machineGunShootAudio);

    handGunShootAudio = gameObject.AddComponent(AudioSource);
    handGunShootAudio.clip = handGunShootClip;
    handGunShootAudio.loop = false;
    handGunShootAudio.playOnAwake = false;
    handGunShootAudio.volume = 0.8;
    handGunShootAudio.dopplerLevel = 0.0;
	sources.Push(handGunShootAudio);

    hurtAudio = gameObject.AddComponent(AudioSource);
    hurtAudio.clip = hurtClip;
    hurtAudio.loop = false;
    hurtAudio.playOnAwake = false;
    hurtAudio.volume = 0.8;
    hurtAudio.dopplerLevel = 0.0;
    sources.Push(hurtAudio);

    deathAudio = gameObject.AddComponent(AudioSource);
    deathAudio.clip = deathClip;
    deathAudio.loop = false;
    deathAudio.playOnAwake = false;
    deathAudio.volume = 0.8;
    deathAudio.dopplerLevel = 0.0;
    sources.Push(deathAudio);
    
    breathingAudio = gameObject.AddComponent(AudioSource);
    breathingAudio.clip = breathingClip;
    breathingAudio.loop = false;
    breathingAudio.playOnAwake = false;
    breathingAudio.volume = 0.8;
    breathingAudio.dopplerLevel = 0.0;
    sources.Push(breathingAudio);

    footstepOutsideAudio = gameObject.AddComponent(AudioSource);
    footstepOutsideAudio.clip = footstepOutsideClip;
    footstepOutsideAudio.loop = false;
    footstepOutsideAudio.playOnAwake = false;
    footstepOutsideAudio.volume = 0.8;
    footstepOutsideAudio.dopplerLevel = 0.0;
    sources.Push(footstepOutsideAudio);
    
    footstepInsideAudio = gameObject.AddComponent(AudioSource);
    footstepInsideAudio.clip = footstepInsideClip;
    footstepInsideAudio.loop = false;
    footstepInsideAudio.playOnAwake = false;
    footstepInsideAudio.volume = 0.8;
    footstepInsideAudio.dopplerLevel = 0.0;
    sources.Push(footstepInsideAudio);

    warningAudio = gameObject.AddComponent(AudioSource);
    warningAudio.clip = warningClip;
    warningAudio.loop = false;
    warningAudio.playOnAwake = false;
    warningAudio.volume = 0.8;
    warningAudio.dopplerLevel = 0.0;
    sources.Push(warningAudio);
    
    rechargeAudio = gameObject.AddComponent(AudioSource);
    rechargeAudio.clip = rechargeClip;
    rechargeAudio.loop = false;
    rechargeAudio.playOnAwake = false;
    rechargeAudio.volume = 0.8;
    rechargeAudio.dopplerLevel = 0.0;
    sources.Push(rechargeAudio);

    emptyGunAudio = gameObject.AddComponent(AudioSource);
    emptyGunAudio.clip = emptyGunClip;
    emptyGunAudio.loop = false;
    emptyGunAudio.playOnAwake = false;
    emptyGunAudio.volume = 0.8;
    emptyGunAudio.dopplerLevel = 0.0;
    sources.Push(emptyGunAudio);

    gunPickupAudio = gameObject.AddComponent(AudioSource);
    gunPickupAudio.clip = gunPickupClip;
    gunPickupAudio.loop = false;
    gunPickupAudio.playOnAwake = false;
    gunPickupAudio.volume = 0.8;
    gunPickupAudio.dopplerLevel = 0.0;
    sources.Push(gunPickupAudio);
    
    lowHealthAudio = gameObject.AddComponent(AudioSource);
    lowHealthAudio.clip = lowHealthClip;
    lowHealthAudio.loop = false;
    lowHealthAudio.playOnAwake = false;
    lowHealthAudio.volume = 0.8;
    lowHealthAudio.dopplerLevel = 0.0;
    sources.Push(lowHealthAudio);
    
    backgroundAudio = gameObject.AddComponent(AudioSource);
    backgroundAudio.clip = backgroundClip;
    backgroundAudio.loop = true;
    backgroundAudio.volume = 2.0;
    backgroundAudio.dopplerLevel = 0.0;
    sources.Push(backgroundAudio);
    backgroundAudio.Play();
    
    samples = new float[qSamples];
    spectrum = new float[qSamples];
    fSample = AudioSettings.outputSampleRate;
}

function Update() {
	pitchValue = -100000;
	for(var source : AudioSource in sources){
		AnalyzeSound(source);
	}
}

function PlayMachineGunShoot() {
    machineGunShootAudio.Play();
}

function PlayHandGunShoot() {
    handGunShootAudio.Play();
}

function PlayHurt() {
	if(hurtAudio.isPlaying==false){
    	hurtAudio.Play();
	}
}

function PlayDeath() {
    if(deathAudio.isPlaying==false){
    	deathAudio.Play();
	}
}

function PlayBreathing() {
	if(breathingAudio.isPlaying==false){
		breathingAudio.Play();
	}
}

function PlayFootstepOutside() {
	if(footstepOutsideAudio.isPlaying==false){
    	footstepOutsideAudio.Play();
	}
}

function PlayFootstepInside() {
	if(footstepInsideAudio.isPlaying==false){
    	footstepInsideAudio.Play();
    }
}

function PlayWarning() {
	if(warningAudio.isPlaying==false){
    	warningAudio.Play();
	}
}

function PlayRecharge() {
    rechargeAudio.Play();
}

function PlayEmptyGun() {
	emptyGunAudio.Play();
}

function PlayGunPickup() {
	gunPickupAudio.Play();
}

function PlayLowHealth() {
	if(lowHealthAudio.isPlaying==false){
		lowHealthAudio.Play();
	}
}

function AnalyzeSound(aud:AudioSource){
     aud.GetOutputData(samples, 0); // fill array with samples
     //GetComponent(AudioListener).GetOutputData(samples, 0);
     var i: int;
     var sum: float = 0;
     for (i=0; i < qSamples; i++){
         sum += samples[i]*samples[i]; // sum squared samples
     }
     rmsValue = Mathf.Sqrt(sum/qSamples); // rms = square root of average
     dbValue = 20*Mathf.Log10(rmsValue/refValue); // calculate dB
     if (dbValue < -160) dbValue = -160; // clamp it to -160dB min
     // get sound spectrum
     aud.GetSpectrumData(spectrum, 0, FFTWindow.BlackmanHarris);
     var maxV: float = 0;
     var maxN: int = 0;
     for (i=0; i < qSamples; i++){ // find max 
         if (spectrum[i] > maxV && spectrum[i] > threshold){
             maxV = spectrum[i];
             maxN = i; // maxN is the index of max
         }
     }
     var freqN: float = maxN; // pass the index to a float variable
     if (maxN > 0 && maxN < qSamples-1){ // interpolate index using neighbours
         var dL = spectrum[maxN-1]/spectrum[maxN];
         var dR = spectrum[maxN+1]/spectrum[maxN];
         freqN += 0.5*(dR*dR - dL*dL);
     }
     pitchValue = Mathf.Max(pitchValue, freqN*(fSample/2)/qSamples); // convert index to frequency
 }
 
 function GetCurrentSample () {
	return Mathf.Abs(pitchValue);
}